import { SITE } from '../../lib/site.mjs';
import { sitemapEntries } from '../../lib/catalog.mjs';
export const prerender = true;
const PAGE_SIZE = 10000;
type Entry = { path: string; lastmod?: string };
const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[character]!));
export function getStaticPaths() {
  return Array.from({ length: Math.ceil(sitemapEntries.length / PAGE_SIZE) }, (_, index) => ({ params: { page: String(index + 1) }, props: { entries: sitemapEntries.slice(index * PAGE_SIZE, (index + 1) * PAGE_SIZE) } }));
}
export function GET({ props }: { props: { entries: Entry[] } }) {
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${props.entries.map(({ path, lastmod }) => `<url><loc>${escapeXml(`${SITE.url}${path}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
