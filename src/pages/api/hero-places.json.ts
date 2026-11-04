import { indexablePlaces } from '../../lib/catalog.mjs';
import { placeAlternates } from '../../lib/services.mjs';
export const prerender = true;
// Small lookup for the home page hero: names an IP location service may report, mapped to the names we
// can display, official name first, then shorter alternates (Thiruvananthapuram → Trivandrum) for when
// the official name would wrap the headline. Only settlements large enough to be reported as a city are included.
const types = ['city', 'town', 'census-town', 'suburb', 'district'];
const priority = (type: string) => types.indexOf(type);
export function GET() {
  const names: Record<string, string[]> = {};
  const ranked = indexablePlaces.filter((place) => types.includes(place.type)).sort((a, b) => priority(a.type) - priority(b.type));
  const key = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const place of ranked) {
    const shorter = placeAlternates(place).filter((name) => name.length < place.name.length && !/\s/.test(name)).sort((a, b) => a.length - b.length);
    for (const name of [place.name, ...placeAlternates(place)]) if (key(name) && !names[key(name)]) names[key(name)] = [place.name, ...shorter];
  }
  return new Response(JSON.stringify(names), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
