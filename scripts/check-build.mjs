import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { places, industries, combinations, districts, sitemapPaths, sitemapEntries, isIndexablePlace, placeIndexing } from '../src/lib/catalog.mjs';
import { SITE, getFaqs } from '../src/lib/site.mjs';
import { localNotes } from '../src/lib/local.mjs';

const root = resolve('dist');
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const fileFor = (path) => join(root, path.replace(/^\//, ''), path.endsWith('/') ? 'index.html' : '');
const exists = async (path) => { try { return (await stat(path)).isFile(); } catch { return false; } };
const unescape = (text) => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');

assert.equal(districts.length, 14, 'The Kerala directory must contain all 14 districts.');
assert.equal(new Set(places.map(({ slug }) => slug)).size, places.length, 'Place slugs must be unique.');
assert.equal(new Set(industries.map(({ slug }) => slug)).size, industries.length, 'Industry slugs must be unique.');
for (const place of places) {
  assert.ok(place.name && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(place.slug), `Invalid place record: ${place.name}`);
  assert.ok(districts.some((district) => district.name === place.district), `Unknown district for ${place.name}: ${place.district}`);
}
check(new Set(sitemapPaths).size === sitemapPaths.length, 'Sitemap contains duplicate paths.');
check(sitemapEntries.every(({ lastmod }) => /^\d{4}-\d{2}-\d{2}$/.test(lastmod || '')), 'Every sitemap entry needs a YYYY-MM-DD lastmod.');
const excludedPlaces = places.filter((place) => !isIndexablePlace(place));
const sitemapSet = new Set(sitemapPaths);
check(excludedPlaces.every((place) => !sitemapSet.has(`/locations/${place.slug}/`)), 'Non-indexable places must not be in the sitemap.');
for (const place of excludedPlaces.filter((_, index) => index % 97 === 0)) {
  const html = await readFile(fileFor(`/locations/${place.slug}/`), 'utf8').catch(() => '');
  const { noindex, canonicalPath } = placeIndexing(place);
  if (noindex) check(/name="robots"[^>]*content="noindex/i.test(html), `Excluded place should be noindex: ${place.slug}`);
  else check(html.includes(`rel="canonical" href="${SITE.url}${canonicalPath}"`), `Duplicate place should canonicalize to ${canonicalPath}: ${place.slug}`);
}
check(await exists(join(root, 'logo.png')), 'logo.png referenced by structured data is missing.');
// Town pages with local content must exist, use known industries and stay genuinely different from each other.
const indexableSlugs = new Set(places.filter(isIndexablePlace).map(({ slug }) => slug));
const industrySlugs = new Set(industries.map(({ slug }) => slug));
for (const [slug, note] of Object.entries(localNotes)) {
  check(indexableSlugs.has(slug), `Local note for unknown or non-indexable place: ${slug}`);
  for (const industry of note.industries) check(industrySlugs.has(industry), `Unknown industry in local note for ${slug}: ${industry}`);
  check(['description', 'about', 'economy', 'marketing'].every((field) => note[field]) && note.seasons.length >= 3 && note.faqs.length >= 3, `Incomplete local note: ${slug}`);
  check(note.description.length <= 170, `Local description too long for search results (${note.description.length} chars): ${slug}`);
}
const MAX_SIMILARITY = 0.6;
const mainText = (html) => unescape(html.replace(/<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>|<section class="contact-section[\s\S]*?<\/section>|<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')).toLowerCase().split(/\s+/).filter(Boolean);
const shingles = (words) => new Set(words.slice(0, -4).map((_, index) => words.slice(index, index + 5).join(' ')));
const localPages = await Promise.all(Object.keys(localNotes).map(async (slug) => ({ slug, set: shingles(mainText(await readFile(fileFor(`/locations/${slug}/`), 'utf8').catch(() => ''))) })));
let mostSimilar = { score: 0 };
for (let a = 0; a < localPages.length; a++) for (let b = a + 1; b < localPages.length; b++) {
  const [x, y] = [localPages[a].set, localPages[b].set];
  let shared = 0; for (const item of x) if (y.has(item)) shared++;
  const score = shared / (x.size + y.size - shared || 1);
  if (score > mostSimilar.score) mostSimilar = { score, pair: `${localPages[a].slug} / ${localPages[b].slug}` };
}
check(mostSimilar.score <= MAX_SIMILARITY, `Town pages too similar (${Math.round(mostSimilar.score * 100)}%, limit ${MAX_SIMILARITY * 100}%): ${mostSimilar.pair}`);
const vercel = JSON.parse(await readFile('vercel.json', 'utf8'));
check(vercel.headers.some((rule) => rule.source.startsWith('/api/') && rule.headers.some((header) => header.key === 'X-Robots-Tag' && /noindex/.test(header.value))), 'API responses must send X-Robots-Tag: noindex.');

const linkTargets = new Set();
let totalBytes = 0;
for (const path of sitemapPaths) {
  let html;
  try { html = await readFile(fileFor(path), 'utf8'); }
  catch { errors.push(`Missing static page: ${path}`); continue; }
  totalBytes += Buffer.byteLength(html);
  check((html.match(/<h1\b/gi) || []).length === 1, `Expected one h1: ${path}`);
  check(/<title>[^<]+<\/title>/.test(html), `Missing server-rendered title: ${path}`);
  check(/<meta\b(?=[^>]*name="description")(?=[^>]*content="[^"]+")/i.test(html), `Missing description: ${path}`);
  const canonical = html.match(/<link\b(?=[^>]*rel="canonical")[^>]*href="([^"]+)"/i)?.[1];
  check(canonical === `${SITE.url}${path}`, `Wrong canonical: ${path} => ${canonical}`);
  check(!/name="robots"[^>]*content="noindex/i.test(html), `Indexable sitemap page is noindex: ${path}`);
  check(!/"(?:aggregateRating|reviewRating)"\s*:/.test(html), `Unsupported rating structured data: ${path}`);
  const scripts = Array.from(html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi));
  for (const [, json] of scripts) {
    try {
      const schema = JSON.parse(json);
      const graph = schema['@graph'] || [schema];
      const business = graph.find((item) => item['@type'] === 'ProfessionalService');
      if (business) check(business.address?.postalCode === '683503' && business.address?.addressLocality === 'Kalamassery', `Inconsistent office address: ${path}`);
      const faqs = graph.find((item) => item['@type'] === 'FAQPage');
      if (faqs) for (const item of faqs.mainEntity) check(html.includes(item.name.replaceAll('&', '&amp;')) || unescape(html).includes(item.name), `FAQ schema question not visible: ${path}: ${item.name}`);
    } catch (error) { errors.push(`Invalid JSON-LD at ${path}: ${error.message}`); }
  }
  for (const [, raw] of html.matchAll(/(?:href|src)="(\/[^"\s]*)"/g)) {
    const target = unescape(raw).split(/[?#]/)[0];
    if (target && !target.startsWith('//')) linkTargets.add(target);
  }
}

for (const target of linkTargets) {
  check(await exists(fileFor(target)) || await exists(join(root, target.replace(/^\//, ''), 'index.html')), `Broken internal target: ${target}`);
}
const catalog = JSON.parse(await readFile(join(root, 'api/catalog.json'), 'utf8'));
check(catalog.places.length === places.length, 'Catalog location count differs from the rendered routes.');
check(catalog.industries.length === industries.length, 'Catalog industry count differs from the rendered routes.');
check(catalog.combinations.length === combinations.length, 'Catalog combination count differs from the rendered routes.');
const fullDatabase = JSON.parse(await readFile(join(root, 'api/places.json'), 'utf8'));
check(fullDatabase.records.length === places.length, 'Downloadable place database must include every derived record.');
check(fullDatabase.license === 'https://opendatacommons.org/licenses/odbl/1-0/' && fullDatabase.attribution.includes('OpenStreetMap'), 'Derived place database must retain license and attribution.');

const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
const chunks = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), ([, location]) => new URL(location).pathname);
const urls = [];
for (const chunk of chunks) {
  const xml = await readFile(join(root, chunk.replace(/^\//, '')), 'utf8');
  const entries = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), ([, location]) => unescape(location));
  check(entries.length <= 50000, `Sitemap chunk too large: ${chunk}`);
  check(Buffer.byteLength(xml) < 50 * 1024 * 1024, `Sitemap exceeds 50MB: ${chunk}`);
  urls.push(...entries);
}
check(urls.length === sitemapPaths.length, 'Sitemap URL count does not match generated pages.');
check(new Set(urls).size === urls.length, 'Duplicate sitemap URLs.');
check(urls.every((url) => url.startsWith(`${SITE.url}/`) && !url.includes('?')), 'Sitemap URLs must use canonical origin without query parameters.');
const robots = await readFile(join(root, 'robots.txt'), 'utf8');
check(robots.includes(`Sitemap: ${SITE.url}/sitemap.xml`), 'robots.txt must reference the correct sitemap.');
const notFound = await readFile(join(root, '404.html'), 'utf8').catch(() => readFile(join(root, '404/index.html'), 'utf8'));
check(/noindex/.test(notFound), '404 page must be noindex.');

if (errors.length) { console.error(errors.slice(0, 40).join('\n')); console.error(`${errors.length} build checks failed.`); process.exitCode = 1; }
else console.log(`Verified ${sitemapPaths.length.toLocaleString()} indexable pages (${(places.length - excludedPlaces.length).toLocaleString()} of ${places.length.toLocaleString()} places indexable, ${industries.length} industries, ${combinations.length} combinations), ${Object.keys(localNotes).length} town pages with local content (most similar pair ${Math.round(mostSimilar.score * 100)}%: ${mostSimilar.pair}), ${chunks.length} sitemap chunks, ${linkTargets.size.toLocaleString()} link targets; ${(totalBytes / 1024 / 1024).toFixed(1)} MB HTML. Canonicals, metadata, JSON-LD, office details and crawler files pass.`);
