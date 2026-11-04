# Hero growth illustration

The hero pairs its existing copy with a static, lightweight SVG illustration. Three rising arches in lavender, purple and lime connect strategy, creativity and momentum. Fine orbital lines and small star marks follow the existing visual language. The lower caption and its star have been removed, and the hero uses compact vertical padding without a minimum height.

The diagonal text marquee, duplicated words, animation, pause button, ResizeObserver and reserved 350px marquee space have been removed. The replacement needs no JavaScript or image requests.

## Files

- `src/components/HeroGrowth.astro`: inline vector illustration and accessible figure description.
- `src/components/LandingPage.astro`: hero copy and illustration.
- `src/styles/hero-art.css`: responsive two-column layout, stacking below 1000px, with natural content spacing.

The illustration sits in its own column so location names can wrap without overlapping it. On mobile it follows the primary call to action.

## Verification

The existing browser QA passed all 22 checks, including no horizontal overflow at 360, 390, 768 and 1440px, navigation, location personalization, forms and no browser runtime errors. Screenshots: `artifacts/desktop.png` and `artifacts/mobile.png`. Full report: `artifacts/browser-qa.json`.

Historical glass ribbon images remain unused in `public/images/`; they are not requested by the hero.
