import { localNotes } from './local.mjs';

const configuredOrigin = import.meta.env?.SITE_URL || process.env.SITE_URL || 'https://www.adsquirrel.in';
export const SITE = {
  name: 'AdSquirrel',
  legalName: 'Nexston Corporations Pvt Ltd',
  url: configuredOrigin.replace(/\/$/, ''),
  email: 'support@nexston.in',
  phone: '+91 9846730362',
  whatsapp: '918301981869',
  address: '1st Floor, Kinfra Hi-Tech Park, Kalamassery, Kerala – 683503',
  instagram: 'https://www.instagram.com/ad.squirrel',
  workspace: 'Kerala Startup Mission campus, Kinfra Hi-Tech Park, Kalamassery',
  // Office position (Kalamassery) and the public map listing.
  geo: { latitude: 10.0521676, longitude: 76.3199033 },
  map: 'https://www.google.com/maps/search/?api=1&query=Kinfra+Hi-Tech+Park+Kalamassery+Kerala+683503',
  languages: ['English', 'Malayalam'],
  // Fill these in when available; empty values are left out of the structured data and the About page.
  foundingDate: '',
  founders: [],
  openingHours: [],
  profiles: [],
};

// Date the page templates last changed in a way that matters to readers. Update when content changes;
// sitemaps report these as <lastmod>, and search engines ignore lastmod values that change without reason.
export const CONTENT_UPDATED = { site: '2026-11-04', locations: '2026-11-04', services: '2026-11-04' };

export const services = [
  { id: 'seo', number: '01', name: 'SEO & answer engine optimization', title: 'SEO & AEO', description: 'Technical foundations, helpful content and clear answers that make your business easier to discover in search and AI-assisted answers.', items: ['Technical SEO', 'Local search', 'Answer-led content'] },
  { id: 'performance', number: '02', name: 'Performance marketing', title: 'Performance marketing', description: 'Google and Meta campaigns shaped around qualified enquiries, with conversion tracking and a clear view of where your budget goes.', items: ['Google Ads', 'Meta Ads', 'Conversion tracking'] },
  { id: 'social', number: '03', name: 'Social media & content', title: 'Social media & content', description: 'A consistent brand voice, thoughtful content and campaigns that give your audience a reason to pay attention.', items: ['Social strategy', 'Content production', 'Community'] },
  { id: 'brand', number: '04', name: 'Brand strategy & design', title: 'Brand strategy & design', description: 'Positioning, identity and creative direction that help your business stand for something people can remember.', items: ['Positioning', 'Visual identity', 'Campaign creative'] },
  { id: 'web', number: '05', name: 'Websites & digital experiences', title: 'Websites & experiences', description: 'Fast, accessible websites with clear journeys from first impression to a meaningful conversation.', items: ['Website design', 'Development', 'Conversion design'] },
  { id: 'video', number: '06', name: 'Video & creative production', title: 'Video & creative', description: 'Product stories, short-form films and campaign assets designed for the way people actually watch and discover.', items: ['Short-form video', 'Product stories', 'Ad creative'] },
];

export function pagePath({ place, industry } = {}) {
  if (place && industry) return `/locations/${place.slug}/${industry.slug}/`;
  if (place) return `/locations/${place.slug}/`;
  if (industry) return `/industries/${industry.slug}/`;
  return '/';
}

export function getPageMeta({ place, industry, path } = {}) {
  const title = place && industry
    ? `Digital marketing for ${industry.name} in ${place.name} | AdSquirrel`
    : place ? `Digital marketing agency in ${place.name}, Kerala | AdSquirrel`
    : industry ? `Digital marketing for ${industry.name} businesses | AdSquirrel`
    : 'AdSquirrel — Digital marketing agency in Kerala';
  const localDescription = place && !industry ? localNotes[place.slug]?.description : undefined;
  const description = localDescription || (industry
    ?`${industry.description} AdSquirrel supports ${industry.name.toLowerCase()} businesses${place ? ` in ${place.name}` : ' across Kerala'} with SEO, paid advertising, content and websites.`
    : `Digital marketing for businesses in ${place?.name || 'Kerala'}. Discover SEO, AEO, performance marketing, branding and websites from AdSquirrel, based in Kalamassery.`);
  return { title, description, canonical: `${SITE.url}${path || pagePath({ place, industry })}` };
}

export function getFaqs({ place, industry } = {}) {
  const local = place && !industry ? localNotes[place.slug]?.faqs || [] : [];
  const general = [
    { question: `What does AdSquirrel do${place ? ` for businesses in ${place.name}` : ''}?`, answer: `AdSquirrel helps ${industry ? `${industry.name.toLowerCase()} businesses` : 'businesses'}${place ? ` in ${place.name}` : ' across Kerala'} with search engine optimization, answer engine optimization, paid advertising, social media, branding, websites and video production. We start with your goals and recommend the channels that fit.` },
    { question: 'Where is your office?', answer: 'Our office is at 1st Floor, Kinfra Hi-Tech Park, Kalamassery, Kerala – 683503. We work with businesses across Kerala through remote collaboration and planned meetings. Service-area pages do not indicate additional branch offices.' },
    { question: industry ? `How do you approach marketing for ${industry.name.toLowerCase()}?` : 'How do you decide which marketing services we need?', answer: industry ? `${industry.audience} We review your offer, customer journey and existing marketing, then agree on a practical plan and measurable goals before launching campaigns.` : 'We review your audience, offer, website and current marketing, then agree on priorities, deliverables and success measures. A clear brief comes before a channel recommendation.' },
    { question: 'Can you guarantee first place on Google or an AI recommendation?', answer: 'No. Search engines and AI systems control their own results. We focus on sound technical foundations, useful content, accurate business information and measurable improvements, without promising a particular ranking or citation.' },
    { question: 'How much does digital marketing cost?', answer: 'The scope depends on your objectives, channels, content needs and advertising budget. Send us a short brief and we will discuss deliverables and a tailored proposal. Advertising spend and agency fees are explained separately.' },
  ];
  // Towns with local content lead with their own questions and keep only the office and ranking answers.
  return local.length ? [...local, general[1], general[3]] : general;
}

export function getOrganization() {
  const organization = {
    '@type': 'ProfessionalService', '@id': `${SITE.url}/#organization`, name: SITE.name, legalName: SITE.legalName, alternateName: ['Ad Squirrel', 'AdSquirrel Digital Marketing'],
    description: 'AdSquirrel is a digital marketing team working from the Kerala Startup Mission campus at Kinfra Hi-Tech Park, Kalamassery, providing SEO, answer engine optimisation, Meta ads, Google Ads, social media, branding, websites and video for businesses across Kerala.',
    url: `${SITE.url}/`, logo: { '@type': 'ImageObject', '@id': `${SITE.url}/#logo`, url: `${SITE.url}/logo.png`, width: 512, height: 512 }, image: `${SITE.url}/og-image.png`,
    email: SITE.email, telephone: SITE.phone, hasMap: SITE.map, sameAs: [SITE.instagram, ...SITE.profiles],
    address: { '@type': 'PostalAddress', streetAddress: '1st Floor, Kinfra Hi-Tech Park', addressLocality: 'Kalamassery', addressRegion: 'Kerala', postalCode: '683503', addressCountry: 'IN' },
    geo: { '@type': 'GeoCoordinates', ...SITE.geo },
    areaServed: [{ '@type': 'State', name: 'Kerala' }, { '@type': 'AdministrativeArea', name: 'Ernakulam district' }, { '@type': 'AdministrativeArea', name: 'Thrissur district' }],
    parentOrganization: { '@type': 'Organization', name: SITE.legalName },
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: SITE.phone, email: SITE.email, areaServed: 'IN', availableLanguage: SITE.languages },
    knowsLanguage: SITE.languages,
    knowsAbout: ['Search engine optimization', 'Answer engine optimization', 'Local SEO', 'Google Ads', 'Meta ads', 'Facebook advertising', 'Instagram marketing', 'Social media marketing', 'Branding', 'Website design', 'Video production', 'Conversion tracking'],
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Digital marketing services', itemListElement: services.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service.name, description: service.description } })) },
  };
  if (SITE.foundingDate) organization.foundingDate = SITE.foundingDate;
  if (SITE.founders.length) organization.founder = SITE.founders.map(({ name, role, profile }) => ({ '@type': 'Person', name, jobTitle: role, ...(profile ? { sameAs: [profile] } : {}) }));
  if (SITE.openingHours.length) organization.openingHoursSpecification = SITE.openingHours.map(({ days, opens, closes }) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens, closes }));
  return organization;
}

export function getStructuredData({ place, industry, path, title, description } = {}) {
  const meta = getPageMeta({ place, industry, path });
  if (title) meta.title = title;
  if (description) meta.description = description;
  const organizationId = `${SITE.url}/#organization`;
  const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` }];
  if (place) {
    crumbs.push({ '@type': 'ListItem', position: 2, name: 'Locations', item: `${SITE.url}/locations/` });
    crumbs.push({ '@type': 'ListItem', position: 3, name: place.name, item: `${SITE.url}/locations/${place.slug}/` });
    if (industry) crumbs.push({ '@type': 'ListItem', position: 4, name: industry.name, item: meta.canonical });
  } else if (industry) {
    crumbs.push({ '@type': 'ListItem', position: 2, name: 'Industries', item: `${SITE.url}/industries/` });
    crumbs.push({ '@type': 'ListItem', position: 3, name: industry.name, item: meta.canonical });
  }
  const graph = [
    getOrganization(),
    { '@type': 'WebSite', '@id': `${SITE.url}/#website`, name: SITE.name, url: `${SITE.url}/`, publisher: { '@id': organizationId } },
    { '@type': 'WebPage', '@id': `${meta.canonical}#webpage`, url: meta.canonical, name: meta.title, description: meta.description, isPartOf: { '@id': `${SITE.url}/#website` }, about: { '@id': organizationId }, inLanguage: 'en-IN' },
    { '@type': 'Service', name: industry ? `Digital marketing for ${industry.name}` : 'Digital marketing', serviceType: 'Digital marketing, SEO, AEO, performance marketing and branding', provider: { '@id': organizationId }, areaServed: { '@type': place?.type === 'district' ? 'AdministrativeArea' : place ? 'Place' : 'State', name: place?.name || 'Kerala' }, url: meta.canonical },
  ];
  if (!path || path === '/' || place || industry) graph.push({ '@type': 'FAQPage', mainEntity: getFaqs({ place, industry }).map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  if (crumbs.length > 1) graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs });
  return { '@context': 'https://schema.org', '@graph': graph };
}
