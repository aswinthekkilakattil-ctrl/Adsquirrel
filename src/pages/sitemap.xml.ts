import { SITE } from '../lib/site.mjs';
import { sitemapEntries } from '../lib/catalog.mjs';
export const prerender = true;
const PAGE_SIZE = 10000;
export function GET() {
  const count = Math.ceil(sitemapEntries.length / PAGE_SIZE);
  const chunkLastmod = (index: number) => sitemapEntries.slice(index * PAGE_SIZE, (index + 1) * PAGE_SIZE).map(({ lastmod }) => lastmod).filter(Boolean).sort().at(-1);
  const body = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Array.from({ length: count }, (_, index) => `<sitemap><loc>${SITE.url}/sitemaps/${index + 1}.xml</loc>${chunkLastmod(index) ? `<lastmod>${chunkLastmod(index)}</lastmod>` : ''}</sitemap>`).join('')}</sitemapindex>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
