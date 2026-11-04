import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4321';
const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const artifacts = resolve('artifacts');
const cacheRoot = resolve('.cache');
const profile = join(cacheRoot, `browser-qa-${Date.now()}`);
await mkdir(profile, { recursive: true });
await mkdir(artifacts, { recursive: true });
const chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let spawnError;
chrome.on('error', (error) => { spawnError = error; });

let websocket;
const pending = new Map();
let commandId = 0;
const runtimeErrors = [];
const report = { origin, viewports: [], checks: [], screenshots: [], runtimeErrors };
const send = (method, params = {}) => new Promise((resolveCommand, rejectCommand) => {
  const id = ++commandId;
  const timeout = setTimeout(() => { pending.delete(id); rejectCommand(new Error(`CDP timeout: ${method}`)); }, 20000);
  pending.set(id, { resolve: (value) => { clearTimeout(timeout); resolveCommand(value); }, reject: (error) => { clearTimeout(timeout); rejectCommand(error); } });
  websocket.send(JSON.stringify({ id, method, params }));
});
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression: `eval(${JSON.stringify(expression)})`, awaitPromise: true, returnByValue: true, userGesture: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result?.value;
}
async function until(expression, message, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try { if (await evaluate(expression)) return; } catch {}
    await delay(100);
  }
  throw new Error(message);
}
async function navigate(path, expectedPath) {
  await send('Page.navigate', { url: new URL(path, origin).href });
  await delay(120);
  await until(`document.readyState === 'complete' && !!document.querySelector('main')${expectedPath ? ` && location.pathname === ${JSON.stringify(expectedPath)}` : ''}`, `Page did not become ready: ${path}`);
  await evaluate('document.fonts.ready.then(() => true)');
}
async function check(name, action) {
  try { const detail = await action(); report.checks.push({ name, passed: true, ...(detail ? { detail } : {}) }); console.log(`PASS ${name}`); }
  catch (error) { report.checks.push({ name, passed: false, error: error.message }); console.error(`FAIL ${name}: ${error.message}`); }
}
async function viewport(width, height) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 });
  await delay(100);
}

try {
  let port;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (spawnError) throw spawnError;
    try { port = Number((await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); if (port) break; } catch {}
    await delay(100);
  }
  assert.ok(port, 'Chrome did not start its debugging endpoint.');
  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
  const target = targets.find((item) => item.type === 'page');
  assert.ok(target?.webSocketDebuggerUrl, 'Chrome page target unavailable.');
  websocket = new WebSocket(target.webSocketDebuggerUrl);
  websocket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (message.id && pending.has(message.id)) {
      const command = pending.get(message.id); pending.delete(message.id);
      if (message.error) command.reject(new Error(message.error.message)); else command.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  });
  await new Promise((resolveSocket, rejectSocket) => { websocket.addEventListener('open', resolveSocket, { once: true }); websocket.addEventListener('error', rejectSocket, { once: true }); });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  const catalogResponse = await fetch(`${origin}/api/catalog.json`);
  assert.ok(catalogResponse.ok, `Catalog returned HTTP ${catalogResponse.status}.`);
  const catalog = await catalogResponse.json();

  for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1440, 1100]]) {
    await check(`No horizontal overflow at ${width}px`, async () => {
      await viewport(width, height);
      await navigate('/', '/');
      await until('Array.from(document.images).every(image => image.complete)', 'Images did not finish loading.');
      const result = await evaluate(`({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, offenders: Array.from(document.querySelectorAll('body *')).filter(el => { const rect=el.getBoundingClientRect();return rect.width>0 && (rect.right>innerWidth+1 || rect.left < -1) && getComputedStyle(el).position!=='fixed'; }).slice(0,8).map(el=>({tag:el.tagName,class:el.className,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right})) })`);
      report.viewports.push(result);
      assert.ok(result.scrollWidth <= result.width + 1, JSON.stringify(result));
      if (width === 390 || width === 1440) {
        const filename = width === 390 ? 'mobile.png' : 'desktop.png';
        const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        await writeFile(join(artifacts, filename), Buffer.from(screenshot.data, 'base64'));
        report.screenshots.push(`artifacts/${filename}`);
      }
      return `${result.scrollWidth}px document at ${result.width}px viewport`;
    });
  }

  await check('Mobile navigation opens, closes and supports Escape', async () => {
    await viewport(390, 844); await navigate('/', '/');
    await evaluate(`document.querySelector('.menu-toggle').click()`);
    assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'true');
    assert.ok(await evaluate(`document.querySelector('#main-navigation').getBoundingClientRect().height > 20`));
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'false');
  });

  await check('FAQ disclosure opens with native semantics', async () => {
    await navigate('/', '/');
    await evaluate(`document.querySelector('.faq-items details summary').click()`);
    assert.equal(await evaluate(`document.querySelector('.faq-items details').open`), true);
  });

  await check('Invalid place selection shows a useful error', async () => {
    await navigate('/', '/');
    await evaluate(`document.querySelector('#location-input').value='zz unknown place';document.querySelector('#industry-input').value='';document.querySelector('#intent-form').requestSubmit()`);
    await until(`document.querySelector('#intent-status').textContent.includes('Choose a listed location')`, 'Invalid selection error was not shown.');
    assert.equal(await evaluate('location.pathname'), '/');
  });

  await check('Empty intent submission goes to the contact form', async () => {
    await navigate('/', '/');
    await evaluate(`document.querySelector('#location-input').value='';document.querySelector('#industry-input').value='';document.querySelector('.intent-submit').click()`);
    await until(`location.hash==='#contact' && document.activeElement?.name==='name'`, 'Empty submission did not go to the contact form.');
    assert.equal(await evaluate('location.pathname'), '/');
  });

  await check('Intent submission opens the tailored page at a prefilled contact form', async () => {
    await navigate('/', '/');
    await evaluate(`document.querySelector('#location-input').value='Thrissur';document.querySelector('#industry-input').value='restaurant';document.querySelector('.intent-submit').click()`);
    await until(`location.pathname==='/locations/thrissur/' && location.hash==='#contact' && document.querySelector('#contact-form textarea').value.includes('restaurants in Thrissur')`, 'Tailored contact form was not reached or prefilled.');
  });

  await check('Service page renders static content and links to its location page', async () => {
    await navigate('/services/meta-ads/irinjalakuda/', '/services/meta-ads/irinjalakuda/');
    assert.ok((await evaluate(`document.querySelector('h1').textContent`)).includes('Meta ads agency in Irinjalakuda'));
    assert.ok((await evaluate(`document.querySelector('link[rel=canonical]').href`)).endsWith('/services/meta-ads/irinjalakuda/'));
    await evaluate(`document.querySelector('a[href="/locations/irinjalakuda/"]').click()`);
    await until(`location.pathname==='/locations/irinjalakuda/' && document.querySelector('[data-location-name]')?.textContent.includes('Irinjalakuda')`, 'Service page did not link to the tailored location page.');
  });

  await check('Guide and About pages render without horizontal overflow on mobile', async () => {
    await viewport(360, 800);
    for (const path of ['/guides/meta-ads-vs-google-ads/', '/about/', '/guides/']) {
      await navigate(path, path);
      assert.equal(await evaluate(`document.querySelectorAll('h1').length`), 1, `One h1 expected on ${path}`);
      assert.ok(await evaluate(`document.documentElement.scrollWidth <= innerWidth + 1`), `Horizontal overflow on ${path}`);
    }
    await viewport(1440, 900);
  });

  await check('Valid location selection navigates to static tailored page', async () => {
    await navigate('/', '/');
    await evaluate(`document.querySelector('#location-input').value='Kalamassery';document.querySelector('#industry-input').value='';document.querySelector('#intent-form').requestSubmit()`);
    await until(`location.pathname==='/locations/kalamassery/' && location.hash==='#contact' && document.querySelector('[data-location-name]')?.textContent.includes('Kalamassery')`, 'Location selection did not reach tailored page.');
  });

  await check('Known location and industry use their static combination URL', async () => {
    await navigate('/?location=kochi&industry=restaurants', '/locations/kochi/restaurants/');
    assert.ok((await evaluate(`document.querySelector('[data-industry-heading]').textContent`)).toLowerCase().includes('restaurant'));
    assert.ok((await evaluate(`document.querySelector('link[rel=canonical]').href`)).endsWith('/locations/kochi/restaurants/'));
  });

  await check('Non-generated combination personalizes base location and preserves its canonical', async () => {
    const pair = catalog.places.map((place) => ({ place, industry: catalog.industries.find((industry) => !catalog.combinations.some((combo) => combo.place === place.slug && combo.industry === industry.slug)) })).find((pair) => pair.industry);
    assert.ok(pair, 'No non-generated combination available for this test.');
    await navigate(`/?location=${encodeURIComponent(pair.place.slug)}&industry=${encodeURIComponent(pair.industry.slug)}`, `/locations/${pair.place.slug}/`);
    await until(`document.querySelector('[data-industry-heading]')?.textContent.toLowerCase().includes(${JSON.stringify(pair.industry.name.toLowerCase())})`, 'Industry personalization did not apply.');
    assert.ok((await evaluate(`document.querySelector('link[rel=canonical]').href`)).endsWith(`/locations/${pair.place.slug}/`));
    assert.equal(await evaluate('new URL(location.href).searchParams.get("industry")'), pair.industry.slug);
  });

  await check('Explicit keyword parameter resolves a known place', async () => {
    await navigate('/?q=digital%20marketing%20agency%20in%20Kalamassery', '/locations/kalamassery/');
  });

  await check('Home hero keeps Kerala without an entry place or IP location', async () => {
    await navigate('/', '/');
    await evaluate(`sessionStorage.clear()`);
    await navigate('/', '/');
    await delay(1500);
    assert.ok((await evaluate(`document.querySelector('[data-location-name]').textContent`)).startsWith('Kerala'));
  });

  await check('Home hero reuses the place of the page the visitor entered on', async () => {
    await evaluate(`sessionStorage.clear()`);
    await navigate('/services/meta-ads/irinjalakuda/', '/services/meta-ads/irinjalakuda/');
    await navigate('/', '/');
    await until(`document.querySelector('[data-location-name]').textContent.startsWith('Irinjalakuda')`, 'Entry place was not used in the home hero.');
    assert.ok((await evaluate(`document.querySelector('link[rel=canonical]').href`)).endsWith('/'), 'Home canonical must not change.');
    await evaluate(`sessionStorage.clear()`);
  });

  await check('Unknown parameters retain generic Kerala content', async () => {
    await navigate('/?location=zz-invalid&industry=zz-invalid', '/');
    assert.ok((await evaluate(`document.querySelector('[data-location-name]').textContent`)).includes('Kerala'));
  });

  await check('Directory searches all sourced locations', async () => {
    await navigate('/locations/', '/locations/');
    await evaluate(`const input=document.querySelector('#global-place-search');input.value='Kalamassery';input.dispatchEvent(new Event('input',{bubbles:true}))`);
    await until(`document.querySelector('#global-place-results')?.textContent.includes('Kalamassery')`, 'Global directory search returned no expected result.');
    assert.ok(await evaluate(`document.querySelector('#global-place-results a[href="/locations/kalamassery/"]') !== null`));
  });

  await check('District directory filter hides unmatched places', async () => {
    await navigate('/locations/', '/locations/');
    const href = await evaluate(`document.querySelector('.directory-grid a').getAttribute('href')`);
    await navigate(href, href);
    await evaluate(`const input=document.querySelector('#place-search');input.value='zzzz-no-such-place';input.dispatchEvent(new Event('input',{bubbles:true}))`);
    assert.equal(await evaluate(`document.querySelectorAll('[data-place-name]:not([hidden])').length`), 0);
    await evaluate(`const input=document.querySelector('#place-search');input.value='';input.dispatchEvent(new Event('input',{bubbles:true}))`);
    assert.ok(await evaluate(`document.querySelectorAll('[data-place-name]:not([hidden])').length > 0`));
  });

  await check('Enquiry prepares WhatsApp message without sending anything', async () => {
    await navigate('/', '/');
    await evaluate(`window.__qaWhatsAppHref='';document.addEventListener('click', event => {const link=event.target.closest?.('a');if(link && new URL(link.href).hostname==='wa.me'){event.preventDefault();event.stopImmediatePropagation();window.__qaWhatsAppHref=link.href;}},true);const form=document.querySelector('#contact-form');form.elements.name.value='QA Visitor';form.elements.business.value='QA Studio';form.elements.email.value='qa@example.invalid';form.elements.phone.value='+91 9000000000';form.elements.message.value='Browser QA enquiry only; not sent.';form.requestSubmit();`);
    const href = await evaluate('window.__qaWhatsAppHref');
    const url = new URL(href);
    assert.equal(url.hostname, 'wa.me'); assert.equal(url.pathname, '/918301981869');
    const text = url.searchParams.get('text');
    assert.ok(text.includes('QA Visitor') && text.includes('QA Studio') && text.includes('qa@example.invalid') && text.includes('not sent'));
    assert.ok((await evaluate(`document.querySelector('#contact-status').textContent`)).includes('Review'));
    return 'Outbound click intercepted; no enquiry sent.';
  });
  await check('No browser runtime errors', async () => assert.deepEqual(runtimeErrors, []));
} catch (error) {
  report.checks.push({ name: 'Browser harness', passed: false, error: error.stack || error.message });
  console.error(error.stack || error.message);
} finally {
  await writeFile(join(artifacts, 'browser-qa.json'), JSON.stringify(report, null, 2));
  if (websocket?.readyState === WebSocket.OPEN) { try { await send('Browser.close'); } catch {} websocket.close(); }
  if (chrome.exitCode === null) chrome.kill();
  await delay(300);
  if (profile.startsWith(cacheRoot + sep) && profile.includes('browser-qa-')) await rm(profile, { recursive: true, force: true }).catch(() => {});
}
const failures = report.checks.filter((check) => !check.passed);
console.log(`Browser QA: ${report.checks.length - failures.length}/${report.checks.length} checks passed; report artifacts/browser-qa.json.`);
if (failures.length) process.exitCode = 1;
