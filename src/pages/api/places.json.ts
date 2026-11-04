import places from '../../data/places.json';
export const prerender = true;
export function GET() {
  return new Response(JSON.stringify({
    attribution: 'Contains information derived from the Local Government Directory (GODL-India) and © OpenStreetMap contributors (Open Database License).',
    license: 'https://opendatacommons.org/licenses/odbl/1-0/',
    sources: '/api/coverage.json',
    notes: '/data-sources/',
    records: places,
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Link': '<https://opendatacommons.org/licenses/odbl/1-0/>; rel="license"' } });
}
