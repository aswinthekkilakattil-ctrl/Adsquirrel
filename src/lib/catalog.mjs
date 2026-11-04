import placesData from '../data/places.json' with { type: 'json' };
import industryData from '../data/industries.json' with { type: 'json' };
import { services, servicePath } from './services.mjs';
import { guides, guidePath } from './guides.mjs';
import { classifyPlaces } from './indexing.mjs';
import { CONTENT_UPDATED } from './site.mjs';
import { localNotes } from './local.mjs';

export const places = placesData;
export const industries = industryData;
export const districts = places.filter((place) => place.type === 'district');
export const placesBySlug = new Map(places.map((place) => [place.slug, place]));
export const industriesBySlug = new Map(industries.map((industry) => [industry.slug, industry]));
const { indexable: indexablePlaceSlugs, canonicalOf } = classifyPlaces(places, new Set(Object.keys(localNotes)));
export const isIndexablePlace = (place) => indexablePlaceSlugs.has(place.slug);
export const indexablePlaces = places.filter(isIndexablePlace);
// Robots and canonical settings for a location page that is not offered to search engines.
export function placeIndexing(place) {
  if (isIndexablePlace(place)) return { noindex: false };
  const target = canonicalOf.get(place.slug);
  return target ? { noindex: false, canonicalPath: `/locations/${target}/` } : { noindex: true };
}

const fullCombinations = String(import.meta.env?.GENERATE_ALL_COMBINATIONS || process.env.GENERATE_ALL_COMBINATIONS) === 'true';
const maximum = Number(import.meta.env?.MAX_COMBINATION_PAGES || process.env.MAX_COMBINATION_PAGES || 50000);
const selectedPlaces = places.filter((place) => place.type === 'district' || ['kochi', 'kalamassery'].includes(place.slug));
const preferredCategories = ['restaurants', 'hotels', 'healthcare', 'real-estate', 'education', 'retail'];
const selectedIndustries = preferredCategories.map((slug) => industriesBySlug.get(slug)).filter(Boolean);
if (!selectedIndustries.length) selectedIndustries.push(...industries.slice(0, 6));
const combinationCount = fullCombinations ? places.length * industries.length : selectedPlaces.length * selectedIndustries.length;
if (!Number.isSafeInteger(maximum) || maximum < 0) throw new Error('MAX_COMBINATION_PAGES must be a nonnegative safe integer.');
if (combinationCount > maximum) throw new Error(`Requested ${combinationCount.toLocaleString()} combination pages; MAX_COMBINATION_PAGES=${maximum}. Review the cost and content, then raise the explicit budget to proceed.`);
export const combinations = (fullCombinations ? places : selectedPlaces).flatMap((place) => (fullCombinations ? industries : selectedIndustries).map((industry) => ({ place, industry })));
export const combinationKeys = new Set(combinations.map(({ place, industry }) => `${place.slug}/${industry.slug}`));
export const directoryPaths = districts.flatMap((district) => Array.from({ length: Math.max(1, Math.ceil(places.filter((place) => place.district === district.name && place.slug !== district.slug).length / 200)) }, (_, index) => `/locations/district/${district.slug}/${index + 1}/`));

// Service pages cover the districts, cities, towns and suburbs of Thrissur and Ernakulam.
const serviceDistricts = ['Thrissur', 'Ernakulam'];
const serviceTypes = ['district', 'city', 'town', 'suburb'];
export const servicePlaces = indexablePlaces.filter((place) => serviceDistricts.includes(place.district) && (serviceTypes.includes(place.type) || place.slug === 'thrissur'));
export const servicePlaceSlugs = new Set(servicePlaces.map((place) => place.slug));
export const servicePagePaths = [servicePath(), ...services.flatMap((service) => [servicePath(service), ...servicePlaces.map((place) => servicePath(service, place))])];
const office = placesBySlug.get('kalamassery');
export const officePosition = { latitude: office.latitude, longitude: office.longitude };
const hasPosition = (place) => Number.isFinite(place?.latitude) && Number.isFinite(place?.longitude);
export function distanceKm(from, to) {
  if (!hasPosition(from) || !hasPosition(to)) return undefined;
  const radians = (degrees) => degrees * Math.PI / 180;
  const a = Math.sin(radians(to.latitude - from.latitude) / 2) ** 2 + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.sin(radians(to.longitude - from.longitude) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}
export const officeDistanceKm = (place) => distanceKm(office, place);
export function getNearbyServicePlaces(place, limit = 8) {
  const candidates = servicePlaces.filter((candidate) => candidate.slug !== place.slug && candidate.type !== 'district');
  if (!hasPosition(place)) return candidates.filter((candidate) => candidate.district === place.district).slice(0, limit);
  return candidates.filter(hasPosition).sort((a, b) => distanceKm(place, a) - distanceKm(place, b)).slice(0, limit);
}

const indexableByDistrict = Map.groupBy(indexablePlaces.filter((place) => place.type !== 'district'), (place) => place.district);
// Nearest indexable places by distance; without coordinates, the alphabetical neighbours in the same taluk or district.
export function getRelatedPlaces(place, limit = 6) {
  const pool = (indexableByDistrict.get(place.district) || []).filter((candidate) => candidate.slug !== place.slug);
  if (hasPosition(place)) {
    const located = pool.filter(hasPosition).map((candidate) => ({ candidate, km: distanceKm(place, candidate) })).sort((a, b) => a.km - b.km);
    if (located.length) return located.slice(0, limit).map(({ candidate }) => candidate);
  }
  const local = place.taluk ? pool.filter((candidate) => candidate.taluk === place.taluk) : [];
  const list = (local.length >= limit ? local : pool).toSorted((a, b) => a.name.localeCompare(b.name));
  const start = Math.max(0, list.findIndex((candidate) => candidate.name.localeCompare(place.name) > 0) - Math.floor(limit / 2));
  return list.slice(start, start + limit).concat(list.slice(0, Math.max(0, start + limit - list.length))).slice(0, limit);
}

const placeLastmod = (place) => [CONTENT_UPDATED.locations, place.sourceSnapshot].filter(Boolean).sort().at(-1);
export const sitemapEntries = [
  ...['/', '/about/', '/locations/', '/industries/', '/data-sources/', '/privacy/'].map((path) => ({ path, lastmod: CONTENT_UPDATED.site })),
  ...servicePagePaths.map((path) => ({ path, lastmod: CONTENT_UPDATED.services })),
  { path: guidePath(), lastmod: guides.map((guide) => guide.dateModified).sort().at(-1) },
  ...guides.map((guide) => ({ path: guidePath(guide), lastmod: guide.dateModified })),
  ...directoryPaths.map((path) => ({ path, lastmod: CONTENT_UPDATED.locations })),
  ...indexablePlaces.map((place) => ({ path: `/locations/${place.slug}/`, lastmod: placeLastmod(place) })),
  ...industries.map((industry) => ({ path: `/industries/${industry.slug}/`, lastmod: CONTENT_UPDATED.locations })),
  ...combinations.map(({ place, industry }) => ({ path: `/locations/${place.slug}/${industry.slug}/`, lastmod: placeLastmod(place) })),
];
export const sitemapPaths = sitemapEntries.map(({ path }) => path);
