import { SITE } from '../lib/site.mjs';
export const prerender = true;
export function GET() {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /cpanel\nSitemap: ${SITE.url}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
