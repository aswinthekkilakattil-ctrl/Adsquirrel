type Place = {name:string;slug:string;district:string;type?:string;aliases?:string[];latitude?:number;longitude?:number};
type Industry = {name:string;slug:string;description:string;audience:string;services:string[]};
type Catalog = {places:Place[];industries:Industry[];combinations:{place:string;industry:string}[];allCombinations?:boolean};
const menu = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('#main-navigation');
function closeMenu(){menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation');if(nav)nav.dataset.open='false';}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');if(nav)nav.dataset.open=String(open)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();if(document.activeElement && nav?.contains(document.activeElement))menu?.focus()}});
const form=document.querySelector<HTMLFormElement>('#intent-form');
const locationInput=document.querySelector<HTMLInputElement>('#location-input');
const industryInput=document.querySelector<HTMLInputElement>('#industry-input');
const intentStatus=document.querySelector<HTMLElement>('#intent-status');
let catalogPromise:Promise<Catalog>|undefined;
function getCatalog(){
  if(!catalogPromise)catalogPromise=fetch('/api/catalog.json').then(r=>{if(!r.ok)throw new Error('Directory unavailable');return r.json()}).catch(error=>{catalogPromise=undefined;throw error});
  return catalogPromise;
}
const normalize=(value:string)=>value.trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ');
const label=(place:Place)=>place.type==='district'?`${place.name} district`:`${place.name}, ${place.district}`;
function findPlace(catalog:Catalog,value:string){const key=normalize(value);return catalog.places.find(p=>normalize(p.slug)===key||normalize(label(p))===key)||catalog.places.find(p=>normalize(p.name)===key||p.aliases?.some(a=>normalize(a)===key))}
// Exact name first, then forgiving matches: singular/plural, word prefix ("jewel"), then any part of the name.
const singular=(value:string)=>value.split(' ').map(word=>word.replace(/(ies)$/,'y').replace(/(ses|xes|ches|shes)$/,m=>m.slice(0,-2)).replace(/s$/,'')).join(' ');
function findIndustry(catalog:Catalog,value:string){const key=normalize(value);if(!key)return undefined;const names=(i:Industry)=>[normalize(i.slug),normalize(i.name)];
  return catalog.industries.find(i=>names(i).includes(key))
    ||catalog.industries.find(i=>names(i).some(n=>singular(n)===singular(key)))
    ||(key.length>=3?catalog.industries.find(i=>names(i).some(n=>n.split(' ').some(word=>word.startsWith(key)||singular(word).startsWith(singular(key))))):undefined)
    ||(key.length>=4?catalog.industries.find(i=>names(i).some(n=>n.includes(key))):undefined)}
let populated=false;
function fillLocationSuggestions(catalog:Catalog){const locations=document.querySelector<HTMLDataListElement>('#location-options');if(!locations)return;const term=normalize(locationInput?.value||'');const matches=term?catalog.places.filter(p=>normalize(label(p)).includes(term)||p.aliases?.some(a=>normalize(a).includes(term))):catalog.places.filter(p=>['kochi','kalamassery','thiruvananthapuram','kozhikode','thrissur','kollam','kannur'].includes(p.slug));const fragment=document.createDocumentFragment();matches.slice(0,60).forEach(p=>{const option=document.createElement('option');option.value=label(p);fragment.append(option)});locations.replaceChildren(fragment);}
async function populate(){
  try{const catalog=await getCatalog();fillLocationSuggestions(catalog);if(populated)return catalog;
    const categories=document.querySelector<HTMLDataListElement>('#industry-options');
    const industryFragment=document.createDocumentFragment();catalog.industries.forEach(i=>{const option=document.createElement('option');option.value=i.name;industryFragment.append(option)});categories?.append(industryFragment);populated=true;return catalog;
  }catch{if(intentStatus)intentStatus.textContent='The directory could not load. Please try again, or browse our locations below.';return undefined}
}
locationInput?.addEventListener('focus',populate,{once:true});industryInput?.addEventListener('focus',populate,{once:true});
locationInput?.addEventListener('input',()=>{getCatalog().then(fillLocationSuggestions).catch(()=>{})});
function destination(catalog:Catalog,place?:Place,industry?:Industry){
  if(place && industry){const exists=catalog.allCombinations || catalog.combinations.some(c=>c.place===place.slug&&c.industry===industry.slug);return exists?`/locations/${place.slug}/${industry.slug}/`:`/locations/${place.slug}/?industry=${encodeURIComponent(industry.slug)}`}
  return place?`/locations/${place.slug}/`:industry?`/industries/${industry.slug}/`:'/';
}
form?.addEventListener('submit',async event=>{event.preventDefault();const lv=locationInput?.value.trim()||'';const iv=industryInput?.value.trim()||'';if(!lv&&!iv){goToContact();return;}const catalog=await populate();if(!catalog)return;const place=lv?findPlace(catalog,lv):undefined;const industry=iv?findIndustry(catalog,iv):undefined;if((lv&&!place)||(iv&&!industry)){if(intentStatus)intentStatus.textContent=lv&&!place?'Choose a listed location from the suggestions. You can also explore the location directory.':'Choose a listed industry from the suggestions.';return;}
  // Land on the tailored page's contact form, with the enquiry started for the visitor.
  try{sessionStorage.setItem(INTENT_KEY,`I’m interested in marketing${industry?` for ${industry.name.toLowerCase()}`:''}${place?` in ${label(place)}`:''}.`)}catch{}
  const next=new URL(destination(catalog,place,industry),window.location.origin);
  if(next.pathname===window.location.pathname&&next.search===window.location.search){goToContact();return;}
  next.hash='contact';window.location.assign(next.href)});
const INTENT_KEY='adsquirrel-intent';
function goToContact(){
  const contact=document.querySelector<HTMLElement>('#contact');if(!contact){window.location.assign('/#contact');return;}
  prefillEnquiry();history.replaceState(null,'','#contact');contact.scrollIntoView({behavior:'smooth',block:'start'});
  contact.querySelector<HTMLInputElement>('input[name="name"]')?.focus({preventScroll:true});
}
function prefillEnquiry(){
  try{const text=sessionStorage.getItem(INTENT_KEY);const message=document.querySelector<HTMLTextAreaElement>('#contact-form textarea[name="message"]');if(text&&message&&!message.value)message.value=text;sessionStorage.removeItem(INTENT_KEY)}catch{}
}
if(window.location.hash==='#contact')prefillEnquiry();
async function applyIntent(){
  const query=new URLSearchParams(window.location.search);if(!query.has('location')&&!query.has('industry')&&!query.has('q'))return;
  try{const catalog=await getCatalog();let place=query.has('location')?findPlace(catalog,query.get('location')||''):catalog.places.find(p=>p.slug===document.body.dataset.place);let industry=query.has('industry')?findIndustry(catalog,query.get('industry')||''):catalog.industries.find(i=>i.slug===document.body.dataset.industry);
    const keyword=normalize(query.get('q')||'');if(keyword){const phrase=` ${keyword} `;if(!place)place=[...catalog.places].sort((a,b)=>b.name.length-a.name.length).find(p=>[p.name,...(p.aliases||[])].some(name=>phrase.includes(` ${normalize(name)} `)));if(!industry)industry=[...catalog.industries].sort((a,b)=>b.name.length-a.name.length).find(i=>phrase.includes(` ${normalize(i.name)} `));}
    const next=destination(catalog,place,industry);const nextURL=new URL(next,window.location.origin);
    if((place||industry)&&nextURL.pathname!==window.location.pathname){window.location.replace(next);return}
    if(industry){const heading=document.querySelector('[data-industry-heading]');const description=document.querySelector('[data-industry-description]');if(heading)heading.textContent=`Digital marketing for ${industry.name.toLowerCase()} businesses.`;if(description)description.textContent=industry.description;if(industryInput)industryInput.value=industry.name;if(intentStatus)intentStatus.textContent=`Showing marketing for ${industry.name.toLowerCase()}${place?` in ${place.name}`:''}.`;}
    if(place&&locationInput)locationInput.value=label(place);
  }catch{if(intentStatus)intentStatus.textContent='Personalization is temporarily unavailable. You can still explore our services.';}
}
applyIntent();
// The place of the page a visitor entered on (e.g. from a search result for Irinjalakuda) is kept for the
// visit and takes priority over the IP location on the home page.
const ENTRY_PLACE_KEY='adsquirrel-entry-place';
try{const entryPlace=document.body.dataset.heroPlace;if(entryPlace&&!sessionStorage.getItem(ENTRY_PLACE_KEY))sessionStorage.setItem(ENTRY_PLACE_KEY,entryPlace)}catch{}
async function visitorPlace(){
  try{const entry=sessionStorage.getItem(ENTRY_PLACE_KEY);if(entry)return [entry]}catch{}
  const geo=await fetch('/geo.json',{cache:'no-store'}).then(r=>r.ok?r.json():undefined) as {country?:string;region?:string;city?:string}|undefined;
  if(geo?.country!=='IN'||geo.region!=='KL'||!geo.city)return undefined;
  const names=await fetch('/api/hero-places.json').then(r=>r.ok?r.json():{}) as Record<string,string[]>;
  return names[geo.city.toLowerCase().replace(/[^a-z0-9]/g,'')];
}
// Home page only: show the visitor's place in the hero — the entry page's place first, otherwise their
// Kerala town from the approximate IP location Vercel provides. Visitors outside Kerala, unknown cities
// and crawlers keep "Kerala". The swap is skipped if it would wrap the headline, so it never shifts the page.
async function localizeHero(){
  const query=new URLSearchParams(window.location.search);
  if(window.location.pathname!=='/'||document.body.dataset.place||['location','industry','q'].some(key=>query.has(key)))return;
  const target=document.querySelector<HTMLElement>('[data-location-name]');const text=target?.firstChild;if(!target||text?.nodeType!==Node.TEXT_NODE)return;
  try{
    const options=await visitorPlace();if(!options?.length)return;
    const heading=target.closest('h1');const before=heading?.getBoundingClientRect().height;const original=text.textContent;
    // Use the first name that fits on the headline's existing lines.
    for(const name of options){text.textContent=name;if(!heading||before===undefined||heading.getBoundingClientRect().height<=before+1){target.dataset.localized=name;return;}}
    text.textContent=original;
  }catch{}
}
localizeHero();
// Analytics events for enquiries; a no-op when analytics is not configured.
const track=(name:string,params:Record<string,string>)=>{const gtag=(window as unknown as {gtag?:(...args:unknown[])=>void}).gtag;gtag?.('event',name,{...params,page_path:location.pathname})};
document.addEventListener('click',event=>{const link=(event.target as Element|null)?.closest?.('a[href^="tel:"],a[href^="mailto:"],a[href*="wa.me/"]') as HTMLAnchorElement|null;if(link)track('generate_lead',{method:link.dataset.lead||(link.protocol==='tel:'?'phone':link.protocol==='mailto:'?'email':'whatsapp')})});
document.querySelector<HTMLFormElement>('#contact-form')?.addEventListener('submit',event=>{
  event.preventDefault();const contactForm=event.currentTarget as HTMLFormElement;if(!contactForm.reportValidity())return;
  const values=new FormData(contactForm);const text=[`Hello AdSquirrel, I’m ${String(values.get('name')||'').trim()}.`,`Business: ${String(values.get('business')||'').trim()}`,`Email: ${String(values.get('email')||'').trim()}`,values.get('phone')?`Phone: ${String(values.get('phone')).trim()}`:'',`\n${String(values.get('message')||'').trim()}`].filter(Boolean).join('\n');
  const link=document.createElement('a');link.href=`https://wa.me/918301981869?text=${encodeURIComponent(text)}`;link.target='_blank';link.rel='noopener noreferrer';link.dataset.lead='whatsapp_form';document.body.append(link);link.click();link.remove();const status=document.querySelector<HTMLElement>('#contact-status');if(status)status.textContent='Your WhatsApp enquiry is ready. Review the message and send it in WhatsApp. If it did not open, email support@nexston.in.';
});
