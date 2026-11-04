import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const environment = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const SSR_COMBINATIONS = (process.env.SSR_COMBINATIONS || environment.SSR_COMBINATIONS) === 'true';
const adapter = SSR_COMBINATIONS
  ? (await import('@astrojs/vercel')).default({ isr: { expiration: 86400 } })
  : undefined;

export default defineConfig({
  site: process.env.SITE_URL || environment.SITE_URL || 'https://www.adsquirrel.in',
  output: 'static',
  adapter,
  // Preserve the static Sites preview when validating the separate Vercel build.
  outDir: SSR_COMBINATIONS ? './artifacts/vercel-dist' : './dist',
  cacheDir: SSR_COMBINATIONS ? './.astro-vercel' : './.astro',
  integrations: [{
    name: 'adsquirrel-combination-rendering',
    hooks: {
      'astro:route:setup': ({ route }) => {
        const component = route.component.replaceAll('\\', '/');
        if (component.endsWith('/locations/[place]/[industry].astro') || component.endsWith('/sitemaps/[page].xml.ts')) {
          route.prerender = !SSR_COMBINATIONS;
        }
      },
    },
  }],
  trailingSlash: 'always',
  compressHTML: true,
  build: { format: 'directory', inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
  vite: { build: { cssCodeSplit: true } },
});
