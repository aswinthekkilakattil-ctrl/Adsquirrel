import taxonomy from '../../data/nic-taxonomy.json';
export const prerender = true;
export function GET() {
  return new Response(JSON.stringify(taxonomy), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
