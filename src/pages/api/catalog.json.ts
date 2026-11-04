import { places, industries, combinations } from '../../lib/catalog.mjs';
export const prerender = true;
export function GET() {
  return new Response(JSON.stringify({
    places: places.map(({ name, slug, district, type, aliases, latitude, longitude }) => ({ name, slug, district, type, ...(aliases?.length ? { aliases } : {}), ...(typeof latitude === 'number' && typeof longitude === 'number' ? { latitude, longitude } : {}) })),
    industries: industries.map(({ name, slug, description, audience, services }) => ({ name, slug, description, audience, services })),
    combinations: combinations.map(({ place, industry }) => ({ place: place.slug, industry: industry.slug })),
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
