import { SITE, getStructuredData } from './site.mjs';

// Each service lists the names people search for it by (alsoCalled), so one page answers every phrasing.
// Templates take the place name (p) and its district (d).
export const services = [
  {
    slug: 'meta-ads', name: 'Meta ads', title: 'Meta ads agency', short: 'Facebook & Instagram ads',
    ml: 'ഫേസ്ബുക്ക്, ഇൻസ്റ്റഗ്രാം പരസ്യങ്ങൾ',
    alsoCalled: ['Facebook ads', 'Instagram ads', 'Facebook and Instagram advertising', 'Meta advertising', 'Instagram promotion', 'Facebook marketing', 'paid social'],
    lead: (p, d) => `Facebook and Instagram ads planned, designed and managed for businesses in ${p}, ${d}. We target the people around ${p} who are most likely to call, message or visit, and report on the enquiries each campaign brings in.`,
    includes: ['Campaign plan built around enquiries, calls, WhatsApp messages or store visits', 'Audience targeting by location radius, interests and lookalikes', 'Ad creatives: static posts, carousels, reels and stories', 'Lead forms and WhatsApp click-to-chat campaigns', 'Meta Pixel and Conversions API setup for accurate tracking', 'Retargeting for people who visited your page or profile', 'Weekly optimisation and a monthly report in plain language'],
    steps: ['Review your offer, page, past ads and the customers you want around the area', 'Set up tracking, build audiences and produce the first set of ad creatives', 'Launch, test creatives and audiences, then move budget to what produces enquiries'],
    cost: 'Meta ads have two costs: the ad budget you pay Meta directly, and our management fee. Budgets can start small with a daily limit you control. The fee depends on the number of campaigns and how many creatives you need each month.',
    industries: ['restaurants', 'real-estate', 'jewellery', 'fashion', 'beauty-salons', 'education', 'healthcare', 'gyms'],
    faqs: (p) => [
      { question: `How much does it cost to run Meta ads in ${p}?`, answer: `There are two parts: the ad budget paid directly to Meta and our management fee. Many local businesses in ${p} start with a modest daily budget and increase it once a campaign proves it brings enquiries. We recommend a starting budget after reviewing your goals.` },
      { question: 'Are Meta ads the same as Facebook ads and Instagram ads?', answer: 'Yes. Meta owns Facebook, Instagram, Messenger and WhatsApp. One Meta ads campaign can show on Facebook, Instagram or both, so you do not need separate agencies for Facebook ads and Instagram ads.' },
      { question: `Can you get leads for my business in ${p} through Facebook and Instagram?`, answer: `Yes. We use lead forms, WhatsApp click-to-chat and call campaigns targeted around ${p}, and track every lead back to the ad that produced it. No agency can honestly guarantee a number of leads, so we agree targets and review them together.` },
      { question: 'Do you also create the ad posters and reels?', answer: 'Yes. Our team writes the copy and designs the static ads, carousels and short reels used in your campaigns, in English, Malayalam or both.' },
      { question: 'Is Meta ads or Google Ads better for my business?', answer: 'Google Ads reaches people already searching for what you sell. Meta ads reach people who are not searching yet but match your customer profile. Many businesses use both; we recommend a split after looking at your offer and budget.' },
    ],
  },
  {
    slug: 'google-ads', name: 'Google Ads', title: 'Google Ads agency', short: 'Search, Maps & YouTube ads',
    ml: 'ഗൂഗിൾ പരസ്യങ്ങൾ',
    alsoCalled: ['Google AdWords', 'PPC', 'pay per click advertising', 'search engine marketing (SEM)', 'Google search ads', 'YouTube ads', 'Performance Max'],
    lead: (p, d) => `Google Ads campaigns for businesses in ${p}, ${d}: appear at the top of Google search and Maps when people nearby search for what you offer, and pay only when they click.`,
    includes: ['Keyword research for the searches people in your area actually make', 'Search campaigns with tightly written ads and sitelinks', 'Location targeting and call ads for local enquiries', 'Performance Max, Maps and YouTube campaigns where they fit', 'Conversion tracking for calls, forms and WhatsApp clicks with Google Tag Manager', 'Negative keyword management to stop wasted spend', 'Monthly report showing cost per enquiry'],
    steps: ['Audit your existing account or plan a new one around your best-selling services', 'Set up conversion tracking and landing pages so every click can be measured', 'Launch, prune poor keywords weekly and shift budget to campaigns with the lowest cost per enquiry'],
    cost: 'Google Ads is pay-per-click: you set a daily budget paid to Google, plus our management fee. Click prices vary by industry and competition, so we estimate them during keyword research before you commit.',
    industries: ['healthcare', 'dental-clinics', 'real-estate', 'study-abroad', 'travel-agencies', 'legal-services', 'repair-services', 'packers-movers'],
    faqs: (p) => [
      { question: `How much does Google Ads cost in ${p}?`, answer: `You pay Google per click, within a daily budget you control, plus our management fee. Click prices depend on how many advertisers compete for your keywords in and around ${p}. We share an estimate after keyword research.` },
      { question: 'What is the difference between Google Ads, AdWords and PPC?', answer: 'Google AdWords is the old name for Google Ads. PPC (pay per click) and SEM (search engine marketing) are general terms for paid search advertising, of which Google Ads is the main platform.' },
      { question: `Can my business show on top of Google in ${p} immediately?`, answer: 'Google Ads can place your business in the sponsored results within days of approval. Unpaid positions come from SEO and take longer. Many businesses run both.' },
      { question: 'Do you set up call and WhatsApp tracking?', answer: 'Yes. We track calls, form submissions and WhatsApp clicks as conversions so you can see the cost of each enquiry, not just clicks.' },
      { question: 'Can you take over my existing Google Ads account?', answer: 'Yes. We start with an audit of your current campaigns, keywords and tracking, fix what is wasting budget, and keep your account history in your ownership.' },
    ],
  },
  {
    slug: 'social-media-marketing', name: 'Social media marketing', title: 'Social media marketing agency', short: 'Instagram, Facebook & YouTube',
    ml: 'സോഷ്യൽ മീഡിയ മാർക്കറ്റിംഗ്',
    alsoCalled: ['SMM', 'social media management', 'Instagram marketing', 'social media handling', 'Instagram page management', 'social media promotion', 'content marketing'],
    lead: (p, d) => `Social media marketing and page management for businesses in ${p}, ${d}. We plan, create and post content for your Instagram, Facebook and YouTube, and grow an audience that becomes customers.`,
    includes: ['Monthly content calendar planned around your offers and local events', 'Post, carousel and reel design in your brand style', 'Captions and hashtags in English and Malayalam', 'Scheduling and posting on Instagram, Facebook, YouTube and LinkedIn', 'Google Business Profile posts', 'Comment and message monitoring guidelines', 'Monthly insights report with what to do next'],
    steps: ['Review your profiles, competitors and customers, and agree a voice and content themes', 'Shoot or gather photos and videos, then produce the first month of posts for approval', 'Publish, learn from what performs and boost the best posts with a small ad budget'],
    cost: 'Social media management is usually a monthly retainer based on the number of platforms, posts and reels per month, and whether we shoot on location. Boosting posts is a separate ad budget.',
    industries: ['restaurants', 'cafes', 'fashion', 'boutiques', 'beauty-salons', 'gyms', 'resorts', 'education'],
    faqs: (p) => [
      { question: `How much do social media marketing agencies charge in ${p}?`, answer: 'Most charge a monthly retainer based on platforms, the number of posts and reels, and any on-location shoots. We send a clear scope with deliverables before you agree.' },
      { question: 'Can you handle my Instagram page completely?', answer: 'Yes. We plan the content, design posts and reels, write captions, schedule them and report monthly. You approve content before it goes live.' },
      { question: `Do you come to ${p} for photo and video shoots?`, answer: `Yes, shoots can be planned on location in ${p}. Our office is in Kalamassery, so we schedule visits in advance and batch content for the month.` },
      { question: 'Will social media marketing bring sales, or only likes?', answer: 'Organic posting builds trust and recognition; sales usually come when it is combined with clear offers, enquiry options and some paid promotion. We track messages and enquiries, not just likes.' },
      { question: 'Do you post in Malayalam?', answer: 'Yes. Captions and on-screen text can be in Malayalam, English or both, depending on your customers.' },
    ],
  },
  {
    slug: 'creative-agency', name: 'Creative', title: 'Creative agency', short: 'Campaign ideas & ad design',
    ml: 'ക്രിയേറ്റീവ് പരസ്യ ഡിസൈൻ',
    alsoCalled: ['advertising agency', 'ad agency', 'creative studio', 'ad creatives', 'poster design', 'graphic design', 'campaign design'],
    lead: (p, d) => `A creative and advertising agency for businesses in ${p}, ${d}: campaign ideas, ad creatives, posters and copy that make people stop scrolling and remember your name.`,
    includes: ['Campaign concepts for launches, offers and festival seasons like Onam, Vishu and Christmas', 'Social media and digital ad creatives in every format', 'Posters, flyers, hoardings and print ads', 'Copywriting and taglines in English and Malayalam', 'Packaging and menu design', 'Creative direction for photo and video shoots', 'Brand-consistent templates your team can reuse'],
    steps: ['Brief: what you sell, who it is for and the single thing people should remember', 'Explore concepts and share two or three directions for feedback', 'Produce final artwork in every size you need, ready for print and digital'],
    cost: 'Creative work is priced per project or as a monthly retainer for ongoing campaigns. The scope depends on the number of concepts, formats and revision rounds.',
    industries: ['jewellery', 'fashion', 'real-estate', 'restaurants', 'event-management', 'education', 'automotive', 'resorts'],
    faqs: (p) => [
      { question: `What does a creative agency in ${p} do?`, answer: 'A creative agency turns your business goal into ideas and finished designs: campaign concepts, ad creatives, posters, copy and video direction. We also connect that creative to the channels where it will run.' },
      { question: 'Are you an advertising agency or a digital marketing agency?', answer: 'Both. We create the campaign and the artwork, then run it on digital channels like Meta, Google and YouTube, or deliver print-ready files for hoardings and newspapers.' },
      { question: 'Can you design festival offer campaigns?', answer: 'Yes. We plan seasonal campaigns for Onam, Vishu, Christmas, Eid and wedding season early, so creatives and ads are ready before the rush.' },
      { question: 'How many revisions are included?', answer: 'Each proposal states the number of concepts and revision rounds, so expectations are clear before work starts.' },
      { question: 'Do you only work with big brands?', answer: `No. We work with local shops, clinics and startups in ${p} as well as larger businesses, and scope the work to fit your budget.` },
    ],
  },
  {
    slug: 'seo', name: 'SEO', title: 'SEO agency', short: 'Local SEO & answer engines',
    ml: 'ഗൂഗിൾ സെർച്ചിൽ മുന്നിലെത്താൻ എസ്ഇഒ',
    alsoCalled: ['search engine optimization', 'local SEO', 'Google Maps ranking', 'Google Business Profile optimization', 'answer engine optimization (AEO)', 'SEO company', 'SEO services'],
    lead: (p, d) => `SEO for businesses in ${p}, ${d}: help customers find you on Google search, Google Maps and AI answers when they look for what you offer nearby.`,
    includes: ['Technical SEO audit: speed, indexing, mobile and structured data', 'Google Business Profile optimisation for Maps visibility', 'Keyword research for local and service searches', 'Service and location pages written to answer real questions', 'Answer engine optimisation (AEO) for AI search and voice assistants', 'Citations and review-request process', 'Monthly report from Google Search Console and Analytics'],
    steps: ['Audit your website, Google Business Profile and how you appear for key searches', 'Fix technical issues and publish or improve the pages that match what people search', 'Build local signals and reviews, measure progress in Search Console and keep improving'],
    cost: 'SEO is usually a monthly engagement because results build over months. The scope depends on the size of your website, how competitive your searches are and how much content is needed.',
    industries: ['healthcare', 'dental-clinics', 'legal-services', 'interior-design', 'builders', 'study-abroad', 'ayurveda', 'hotels'],
    faqs: (p) => [
      { question: `How long does SEO take for a business in ${p}?`, answer: 'Technical fixes and Google Business Profile improvements can show results within weeks; ranking for competitive searches usually takes several months of steady work.' },
      { question: `How do I get my business on top of Google Maps in ${p}?`, answer: 'Complete and verify your Google Business Profile, choose accurate categories, add photos and services, collect genuine reviews, and keep your name, address and phone consistent everywhere. We handle all of this as part of local SEO.' },
      { question: 'Can you guarantee first position on Google?', answer: 'No. Google decides its rankings, and no honest agency can guarantee a position. We focus on measurable improvements in visibility, clicks and enquiries.' },
      { question: 'What is AEO?', answer: 'Answer engine optimisation makes your business information clear enough for AI assistants and search features to quote, using well-structured answers, accurate details and structured data.' },
      { question: 'Do I need a new website for SEO?', answer: 'Not always. We start with an audit; many sites only need technical fixes and better content. If the site cannot be fixed economically, we will say so.' },
    ],
  },
  {
    slug: 'branding', name: 'Branding', title: 'Branding agency', short: 'Logo & brand identity',
    ml: 'ബ്രാൻഡിംഗ്, ലോഗോ ഡിസൈൻ',
    alsoCalled: ['brand identity design', 'logo design', 'brand strategy', 'rebranding', 'branding company', 'visual identity'],
    lead: (p, d) => `Branding and logo design for businesses in ${p}, ${d}: a clear position, a name people remember, and an identity that looks right on a signboard, an Instagram post and a WhatsApp profile.`,
    includes: ['Brand positioning and messaging', 'Naming and tagline development', 'Logo design with variations for every use', 'Colour palette, typography and visual style', 'Brand guidelines document', 'Stationery, signage and social media templates', 'Rebranding for established businesses'],
    steps: ['Workshop to understand your business, customers and competitors', 'Present logo and identity directions, then refine the chosen one', 'Deliver final files, guidelines and ready-to-use templates'],
    cost: 'Branding is priced per project. A logo alone costs less than a full identity with naming, guidelines and templates; we propose a scope after the first conversation.',
    industries: ['cafes', 'bakeries', 'fashion', 'boutiques', 'builders', 'software', 'beauty-salons', 'restaurants'],
    faqs: (p) => [
      { question: `How much does logo design cost in ${p}?`, answer: 'It depends on scope: a logo alone, or a complete identity with colours, typography, guidelines and templates. We send a fixed project quote after understanding your needs.' },
      { question: 'What is the difference between a logo and branding?', answer: 'A logo is one mark. Branding covers how your business is positioned, how it speaks and how it looks everywhere, so customers recognise and trust it.' },
      { question: 'How long does a branding project take?', answer: 'A logo project typically takes a few weeks; a full identity with guidelines takes longer. The timeline is agreed in the proposal.' },
      { question: 'Can you rebrand an existing business?', answer: 'Yes. We keep the recognition you have earned where it helps and modernise what holds you back, then plan the switch across signage, packaging and online profiles.' },
      { question: 'Will I own the logo files?', answer: 'Yes. On completion you receive the final source and export files and full ownership of the approved design.' },
    ],
  },
  {
    slug: 'video-production', name: 'Video production', title: 'Video production & reels', short: 'Reels, ad films & shoots',
    ml: 'റീൽസ്, പരസ്യ വീഡിയോ നിർമ്മാണം',
    alsoCalled: ['reels creation', 'reels editing', 'ad film making', 'corporate video', 'product video', 'video editing', 'YouTube video production'],
    lead: (p, d) => `Reels, ad films and business videos for brands in ${p}, ${d}: planned, shot and edited for the way people actually watch on Instagram, YouTube and WhatsApp.`,
    includes: ['Concept, script and shot list', 'On-location shoots with lighting and audio', 'Instagram reels and YouTube shorts', 'Ad films for Meta and YouTube campaigns', 'Product, food and property videos', 'Editing, subtitles and motion graphics', 'Versions sized for every platform'],
    steps: ['Plan the idea, script and shot list around one clear message', 'Shoot on location, batching several videos in one day where possible', 'Edit, add subtitles and deliver versions for each platform'],
    cost: 'Video is priced per shoot day and per finished video, depending on crew, locations and editing complexity. Monthly reel packages are available for regular content.',
    industries: ['restaurants', 'real-estate', 'resorts', 'fashion', 'jewellery', 'education', 'healthcare', 'automotive'],
    faqs: (p) => [
      { question: `Do you shoot reels on location in ${p}?`, answer: `Yes. We plan shoot days in ${p} in advance and batch several reels in one visit to keep costs down.` },
      { question: 'How much does a reel or ad film cost?', answer: 'Cost depends on shoot days, crew, locations and editing. A batch of simple reels costs much less than a scripted ad film; we quote after understanding the idea.' },
      { question: 'Can you edit videos we shoot ourselves?', answer: 'Yes. Send your raw footage and we edit, add subtitles and music, and format it for each platform.' },
      { question: 'Do you make videos in Malayalam?', answer: 'Yes. Scripts, voice-overs and subtitles can be in Malayalam, English or both.' },
      { question: 'Can these videos be used in ads?', answer: 'Yes. We plan videos so they work as organic posts and as Meta or YouTube ads, with the right lengths and aspect ratios.' },
    ],
  },
  {
    slug: 'website-design', name: 'Website design', title: 'Website design company', short: 'Fast websites that convert',
    ml: 'വെബ്സൈറ്റ് ഡിസൈൻ',
    alsoCalled: ['website development', 'web design', 'landing page design', 'ecommerce website', 'business website', 'website redesign'],
    lead: (p, d) => `Website design and development for businesses in ${p}, ${d}: fast, mobile-first websites and landing pages that turn visitors from search and ads into calls and enquiries.`,
    includes: ['Site structure planned around what customers ask before buying', 'Mobile-first design in your brand style', 'Fast, accessible development', 'SEO foundations: titles, structured data and sitemaps', 'WhatsApp, call and form enquiry options with tracking', 'Landing pages for Google and Meta ad campaigns', 'Ecommerce and catalogue websites'],
    steps: ['Agree goals, pages and content, and map the journey from first visit to enquiry', 'Design key pages for approval, then build and connect tracking', 'Test on real phones, launch, submit to Google and hand over'],
    cost: 'Websites are priced per project based on the number of pages, features and content writing. Hosting and domain renewals are separate yearly costs.',
    industries: ['healthcare', 'hotels', 'resorts', 'education', 'builders', 'manufacturing', 'ecommerce', 'legal-services'],
    faqs: (p) => [
      { question: `How much does a website cost for a business in ${p}?`, answer: 'It depends on the number of pages, features such as booking or ecommerce, and whether we write the content. We quote a fixed project price after agreeing the scope.' },
      { question: 'How long does it take to build a website?', answer: 'A focused business website usually takes a few weeks from approved content; larger or ecommerce sites take longer. The timeline is set in the proposal.' },
      { question: 'Will my website show on Google?', answer: 'We build every site with SEO foundations and submit it to Google Search Console. Ranking for competitive searches needs ongoing SEO, which we can also provide.' },
      { question: 'Can you redesign my existing website?', answer: 'Yes. We review what works today, keep your search history safe with proper redirects, and rebuild the site to be faster and clearer.' },
      { question: 'Do you build landing pages for ads?', answer: 'Yes. Dedicated landing pages usually lower the cost per enquiry for Google and Meta campaigns compared with sending ads to a home page.' },
    ],
  },
];
export const servicesBySlug = new Map(services.map((service) => [service.slug, service]));

// Established alternate names people type, in addition to the aliases in places.json.
const spellings = {
  thrissur: ['Trichur'], 'thrissur-district': ['Trichur'], kochi: ['Cochin'], 'aluva-ernakulam': ['Alwaye'],
  'kodungallur-thrissur': ['Cranganore', 'Kodungalloor'], guruvayur: ['Guruvayoor'], 'north-paravur': ['Paravur', 'Parur'],
  chalakudy: ['Chalakkudy'], irinjalakuda: ['Irinjalakkuda'], thrippunithura: ['Tripunithura'], angamaly: ['Angamali'],
  wadakkancherry: ['Wadakkanchery'], 'kunnamkulam-thrissur': ['Kunnamkulam town'], edappally: ['Edapally'], vyttila: ['Vytilla'],
};
export const placeAlternates = (place) => [...new Set([...(place.aliases || []).filter((alias) => !/[ഀ-ൿ]/.test(alias)), ...(spellings[place.slug] || [])])].filter((name) => name !== place.name);
export const placeMalayalam = (place) => (place.aliases || []).find((alias) => /[ഀ-ൿ]/.test(alias));
export const placeLabel = (place) => place.type === 'district' ? `${place.name} district` : place.name;

export function servicePath(service, place) {
  return place ? `/services/${service.slug}/${place.slug}/` : service ? `/services/${service.slug}/` : '/services/';
}

export function getServiceMeta(service, place) {
  const area = place ? placeLabel(place) : 'Thrissur & Ernakulam';
  const alternates = place ? placeAlternates(place) : [];
  return {
    title: `${service.title} in ${area} — ${service.short} | AdSquirrel`,
    description: `${service.title} for businesses in ${area}${alternates.length ? ` (${alternates[0]})` : ''}, Kerala. ${service.alsoCalled.slice(0, 3).join(', ')} and more, from AdSquirrel in Kalamassery.`,
    canonical: `${SITE.url}${servicePath(service, place)}`,
  };
}

export function getServiceFaqs(service, place) {
  const area = place ? placeLabel(place) : 'Thrissur and Ernakulam';
  return [
    ...service.faqs(area),
    { question: `Do you have an office in ${area}?`, answer: `Our office is at ${SITE.address}. We work with businesses in ${area} through remote collaboration and planned visits; this page describes a service area, not a branch office.` },
  ];
}

export function getServiceStructuredData(service, place) {
  const path = servicePath(service, place);
  const meta = getServiceMeta(service, place);
  const base = getStructuredData({ path, title: meta.title, description: meta.description });
  const graph = base['@graph'].filter((item) => item['@type'] !== 'Service');
  const organizationId = `${SITE.url}/#organization`;
  graph.push({ '@type': 'Service', name: `${service.title}${place ? ` in ${placeLabel(place)}` : ''}`, serviceType: service.name, alternateName: service.alsoCalled, description: service.lead(place ? placeLabel(place) : 'Thrissur and Ernakulam', place?.district || 'Kerala'), provider: { '@id': organizationId }, areaServed: place ? { '@type': place.type === 'district' ? 'AdministrativeArea' : 'Place', name: place.name, alternateName: placeAlternates(place), containedInPlace: { '@type': 'AdministrativeArea', name: `${place.district} district, Kerala` } } : [{ '@type': 'AdministrativeArea', name: 'Thrissur district' }, { '@type': 'AdministrativeArea', name: 'Ernakulam district' }], url: meta.canonical });
  graph.push({ '@type': 'FAQPage', mainEntity: getServiceFaqs(service, place).map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  const crumbs = [{ name: 'Home', item: `${SITE.url}/` }, { name: 'Services', item: `${SITE.url}/services/` }, { name: service.title, item: `${SITE.url}${servicePath(service)}` }];
  if (place) crumbs.push({ name: placeLabel(place), item: meta.canonical });
  graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, ...crumb })) });
  return { '@context': 'https://schema.org', '@graph': graph };
}
