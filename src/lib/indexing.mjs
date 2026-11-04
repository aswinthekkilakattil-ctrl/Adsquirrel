// Decides which place pages are offered to search engines. Every place still renders for visitors.
// Duplicate names in a district point their canonical at the preferred record; the rest of the
// excluded pages are served noindex,follow. Both are left out of the sitemap. The rules target what
// search engines treat as low value: tiny settlements, housing colonies, mile markers, landmark or
// institution names and duplicate names within one district.
const indexedTypes = new Set(['district', 'taluk', 'city', 'town', 'census-town', 'suburb', 'village', 'quarter', 'locality']);
const genericName = /\b(colony|colonies|veedu|veed|harijan|laksham\w*|lakshyam?|settlement|quarters|flats?|apartments?|tharavad|tribal|micha ?bhoomi|cent|sc|st|no)\b|^\d|\b\d+(st|nd|rd|th)?\s*(mile|km)\b|\bmile\b/i;
const landmarkName = /^(check ?post|bridge|(college|high ?school|school|hospital|church|temple|mosque|masjid|market|bus ?stand|stadium|railway station|panchayat|village office|post office|library|vayanasala|reading room|bank|police station)( junction| jn\.?| road| stop)?)$/i;
// Small OSM areas named after an institution rather than a settlement.
const institutionName = /\b(hospital|board|office|bank|school|college|church|temple|masjid|mosque|bridge|stadium|station|depot|factory|company|ltd|keltron|kseb|bus stand|estate)\b/i;
const smallTypes = new Set(['locality', 'quarter', 'neighbourhood']);
// District pages are titled "<name> district", so they never compete with the town of the same name.
const tier = { city: 0, town: 1, 'census-town': 2, suburb: 3, village: 4, taluk: 5, quarter: 6, locality: 7, neighbourhood: 8, hamlet: 9, 'isolated-dwelling': 10, farm: 10, 'city-block': 10, colony: 10 };
const official = (place) => /lgdirectory/.test(place.source || '') ? 0 : 1;
const nameKey = (place) => `${place.district}|${place.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
const better = (a, b) => tier[a.type] < tier[b.type] || (tier[a.type] === tier[b.type] && official(a) < official(b));

// "official" (default): every settlement in the government Local Government Directory, plus cities,
// towns, census towns and suburbs. "extended" also indexes community-mapped villages, localities and
// quarters; their pages share most of their wording, so enable it only after adding local content.
const urbanTypes = new Set(['city', 'town', 'census-town', 'suburb', 'taluk']);
const indexTier = (import.meta.env?.PLACE_INDEX_TIER || process.env.PLACE_INDEX_TIER || 'official') === 'extended' ? 'extended' : 'official';

export function isQualityPlace(place, tier = indexTier) {
  if (place.type === 'district') return true;
  const eligible = tier === 'extended' ? indexedTypes.has(place.type) || (place.type === 'neighbourhood' && official(place) === 0) : urbanTypes.has(place.type) || official(place) === 0;
  return eligible && !genericName.test(place.name) && !landmarkName.test(place.name.trim()) && !(smallTypes.has(place.type) && institutionName.test(place.name));
}

// `promoted`: slugs with their own local content. Unique content is what makes a page worth indexing,
// so these are indexed at any tier (if their name passes the extended rules) and win duplicate names.
export function classifyPlaces(places, promoted = new Set()) {
  const preferred = new Map();
  const isPromoted = (place) => promoted.has(place.slug) && isQualityPlace(place, 'extended');
  for (const place of places) {
    if (place.type === 'district' || !(isQualityPlace(place) || isPromoted(place))) continue;
    const current = preferred.get(nameKey(place));
    if (!current || (isPromoted(place) && !isPromoted(current)) || (isPromoted(place) === isPromoted(current) && better(place, current))) preferred.set(nameKey(place), place);
  }
  const indexable = new Set(places.filter((place) => place.type === 'district').map((place) => place.slug));
  for (const place of preferred.values()) indexable.add(place.slug);
  const canonicalOf = new Map();
  for (const place of places) {
    if (indexable.has(place.slug) || place.type === 'district') continue;
    const target = preferred.get(nameKey(place));
    if (target && target.slug !== place.slug) canonicalOf.set(place.slug, target.slug);
  }
  return { indexable, canonicalOf };
}
