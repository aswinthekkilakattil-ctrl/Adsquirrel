# AdSquirrel

A fast, mobile-first digital marketing website built with Astro and plain browser JavaScript. The former React/Firebase marketing app has been replaced; the new public site has no Firebase dependency, login, analytics SDK, autoplay video or client rendering requirement.

## Run

Use Node 22.16 or newer and install the locked dependencies:

```sh
npm ci
npm run dev
```

On Windows PowerShell, use `npm.cmd` if your execution policy blocks `npm.ps1`. Open the local address printed by Astro.

```sh
npm run build
npm run check:build
```

`dist/` contains independently addressable HTML pages, shared CSS and a small JavaScript enhancement. JavaScript is not required to read services, location pages, industry pages, FAQs or contact information.

## Content and coverage

- 10,566 sourced Kerala place records across all 14 districts, including revenue villages, cities, towns, hamlets, neighbourhoods and localities.
- 102 marketing-facing business categories with category-specific audiences, service priorities and descriptions.
- A separate full official NIC 2008 / NIC 2025 taxonomy: 4,656 classification rows, including 1,304 and 1,887 subclasses respectively.
- 96 selected location/industry combinations in the default static build.

The imported place data combines a dated LGD-derived snapshot and OpenStreetMap named place nodes. It is not a guarantee of every possible informal name. Business categories are a taxonomy, not a claim that every category has a verified Kerala business or is an AdSquirrel client.

See [data provenance and import instructions](docs/data-sources.md), [launch guidance](docs/seo-launch.md) and [visual assets, licenses and generation prompt](docs/visual-assets.md).

## URLs and personalization

```text
/
/locations/
/locations/kochi/
/industries/restaurants/
/locations/kochi/restaurants/
/locations/district/ernakulam-district/1/
/data-sources/
/privacy/
```

Location and industry pages have their own HTML heading, title, description, canonical, service information, FAQ and structured data. The office address always identifies the actual Kalamassery office; service-area pages do not claim local branches.

Visitors can select a place and industry or follow explicit URLs such as `/?location=kochi&industry=restaurants` or `/?q=digital%20marketing%20agency%20in%20Kochi`. Valid context resolves to a matching route. A combination that is not generated in static mode uses the location URL with an explicit `?industry=` parameter; its industry copy updates in the browser and its canonical remains the location page. Unknown context retains the generic Kerala page. No browser geolocation, IP inference or hidden organic search keyword collection is used. Organic Google search terms are generally not available to a website per visitor.

## Larger static builds

The complete location × marketing-category product contains 1,077,732 combinations. To explicitly generate all of them, set both build variables:

```dotenv
GENERATE_ALL_COMBINATIONS=true
MAX_COMBINATION_PAGES=1077732
```

The build validates the requested page budget before generating output. The default cap is 50,000 combination pages. A full static expansion can require substantial build time, disk space and hosting file capacity. It does not improve rankings merely by adding more pages. Review the content and hosting limits before enabling it.

## Search and answers

`SITE_URL` sets the canonical production origin; the default is `https://www.adsquirrel.in`. Configure it for the domain actually being deployed. Sitemaps are generated from the same route catalog, split into chunks of at most 10,000 URLs. Canonicals omit personalization query parameters. Structured data describes the real business and visible content, with no fabricated ratings or client endorsements. There is no special schema that guarantees inclusion in AI answers.

The original SPA catch-all rewrite has been removed from `vercel.json`. Vercel can deploy `dist/` as static output, preserving the old advertising URLs through redirects. A private Sites publication is a review copy, not a change to the existing production domain. Search engines cannot index an owner-private review copy.

## Enquiries and testimonials

The contact form validates its fields and opens WhatsApp with a prepared message. The visitor reviews and sends the message in WhatsApp; this site does not silently submit a message or store an enquiry. Direct email and telephone links also work without a backend. The business contact information was retained from the original site.

Testimonials are prominently marked illustrative samples. Replace them with real, approved client quotes before using them as endorsements. No reviews or rating schema is emitted for sample content.

## Editing

- `src/components/LandingPage.astro`: shared marketing page and sections.
- `src/components/SiteLayout.astro`: navigation, footer, document layout.
- `src/styles/global.css`: responsive visual system.
- `src/lib/site.mjs`: service copy, FAQs, page metadata and structured data.
- `src/data/`: sourced locations, industry copy, official taxonomy and coverage.
- `src/scripts/site.ts`: navigation, explicit visitor intent and contact enhancement.
- `scripts/browser-qa.mjs`: Chrome browser checks; screenshots and report go to ignored `artifacts/`.

Keep `.env` and download caches out of published source. Import scripts need network access; ordinary builds use checked-in data and do not make data-provider requests.
