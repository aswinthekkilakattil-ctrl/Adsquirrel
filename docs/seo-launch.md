# AdSquirrel search launch

Checked against the linked primary documentation on 4 November 2026. This is a launch and measurement guide; it is not a ranking or indexing guarantee.

## What the architecture can do

Serve the hero, location, industry, contact details, metadata and useful page content in the initial HTML. Location and industry routes give search engines a stable page to return for the corresponding query. A visitor who opens that URL sees the matching hero without the site needing to inspect their original search.

Use a generic headline when location or industry is unknown. Explicit visitor choices and validated campaign parameters can tailor the experience. Treat parameters as untrusted input: match them to the data catalogue, never insert arbitrary HTML, and keep duplicate parameter variants out of sitemaps. Do not infer a person's industry from their device location.

Organic Google searches generally do not expose the original query to the destination site. Google's own [traffic-source documentation](https://support.google.com/analytics/answer/1033173?hl=en) describes encrypted search keywords as unavailable. Search Console query reports are aggregate search-performance information, not a live per-visitor query feed. IP location is approximate and browser location requires permission; neither identifies the words someone searched.

## Content before volume

A list of every known place is a catalogue, not evidence that every place needs a distinct marketing page. Google identifies substantially similar regional pages and large amounts of low-value content made to manipulate rankings as [doorway and scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies).

Before putting a location × industry combination in the search sitemap, give it something a visitor can use: the actual service scope, audience and language plan, a relevant conversion journey, an example deliverable, practical FAQs and real evidence when available. Clearly distinguish illustrative strategy examples from completed client work. A different town name alone adds little value. Keep the browse hierarchy useful and avoid linking every page to every possible combination.

The agency has one supplied office: 1st Floor, Kinfra Hi-Tech Park, Kalamassery, Kerala 683503. Other localities are service areas. Do not describe them as offices or add fabricated branch addresses. Use only genuine testimonials with permission. Design placeholders must stay visibly labelled as examples and must not become review or aggregate-rating structured data.

No public source can certify every Kerala locality or all spellings of informal names. Preserve source attribution, retrieval date, aliases and district identifiers; distinguish same-name places and merge verified duplicates. See `docs/data-sources.md` for the actual dataset and its coverage limits.

## Technical launch checks

1. Run `npm.cmd install` and `npm.cmd run build` in this Windows workspace. Use the Node version required by the pinned dependency in `package.json`. The latest Astro install guide currently asks for Node 22.23.4 or newer; this machine initially had Node 22.16.0, so do not silently upgrade Astro beyond the compatible runtime. Check the [official Astro installation guide](https://docs.astro.build/en/install-and-setup/) when upgrading.
2. Publish the generated static output, normally `dist`, using the Astro preset or a static host. Remove the old Vite SPA catch-all rewrite in `vercel.json`: rewriting every extensionless path to `/` would make all location URLs serve the homepage. Real files must resolve directly and unknown paths must return HTTP 404.
3. Set one verified production origin for the Astro `site` setting, absolute canonical tags, Open Graph URLs, JSON-LD and sitemap links. The earlier site used `https://www.adsquirrel.in`; verify ownership and the intended www/non-www version before production. Redirect alternate origins and legacy URLs with permanent HTTP redirects.
4. Open the homepage, one location, one industry and one combined route directly with JavaScript disabled. Check that the title, H1, description, canonical and intended local content are present in the response source. Confirm every sitemap URL returns 200 and unknown routes return 404.
5. Use self-referencing canonicals for genuinely distinct pages and a consistent trailing-slash policy. Parameter-only duplicates should reference their stable equivalent. Internal links and sitemap entries should use that same canonical URL. Canonicals are signals, not commands; follow [Google's canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
6. Submit only canonical, indexable, successful URLs. Split XML sitemaps before either 50,000 URLs or 50MB uncompressed and list them in a sitemap index. Advertise the root sitemap in `robots.txt`. Do not invent `lastmod` values on every build; use real content changes. See [Google's sitemap specification and submission guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
7. Validate JSON-LD against the visible content. Use Organization/ProfessionalService, PostalAddress, Service and BreadcrumbList as appropriate. Do not add fake ratings or unsupported claims. FAQs can be useful prose even when the site is not eligible for a Google FAQ rich result.
8. Verify the real contact form destination and test a received enquiry. Check phone, email and WhatsApp links on a phone. Do not report that a message was delivered unless the configured delivery service confirms success.
9. Test the mobile page with PageSpeed Insights after deployment and monitor field Core Web Vitals in Search Console once traffic is sufficient. Keep the initial page small: compressed responsive imagery, explicit image dimensions, deferred nonessential scripts, no autoplay background video and no third-party analytics until needed. A local build alone does not establish real-user loading performance.

## Answer-engine visibility

Google says that [AI Overviews and AI Mode use the same SEO foundations](https://developers.google.com/search/docs/appearance/ai-features); there are no extra technical requirements or special schema required for inclusion. Make the agency identity and actual service scope clear. Give direct answers to real purchasing questions, with supporting detail and consistent contact information. Link related services and useful locality/industry pages in normal HTML. Structured data should describe the visible page, not substitute for it.

`llms.txt`, FAQs or schema do not guarantee an AI citation. Crawling, indexing, rankings and AI inclusion remain decisions of each platform.

## After production deployment

Verify a Google Search Console domain property using DNS, submit the sitemap index, then inspect a small sample of important routes. Monitor Page Indexing, Crawl Stats, Core Web Vitals, canonical selection and query-to-page performance. Fix exclusions and weak content before increasing page volume. Keep an accurate Google Business Profile for the real Kalamassery office and use the same business name, address and phone everywhere.

For very large deployments, track the ratio of useful indexed pages to discovered URLs, server response time and wasted parameter crawling. Google's [crawl-budget guide](https://developers.google.com/crawling/docs/crawl-budget) explains why publishing millions of URLs does not imply millions will be crawled or indexed. Measure qualified enquiries and relevant search visibility, not the number of generated files.
