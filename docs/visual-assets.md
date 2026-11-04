# Visual asset provenance

## Hero sculpture

The hero artwork is an AI-generated conceptual studio still life, produced with the built-in image-generation tool for this project. It represents an abstract sculpture, not a client, team member, office or completed campaign.

- Original generated file: `artifacts/growth-sculpture-original.png` (kept locally and excluded from publication).
- Optimized website asset: `public/images/growth-sculpture.webp`.
- Decorative purpose: the surrounding HTML carries the marketing message; the image should not be the only carrier of important information.
- No third-party reference image was supplied to the generator.

Exact generation prompt:

> Use case: stylized-concept. Asset type: abstract editorial hero artwork for a premium digital marketing agency website. Create one stunning landscape 3D studio still life, aspect ratio 3:2. A single large sculptural inflated ribbon of glossy deep violet glass twists into an unexpected organic loose knot with one loop like a flowing lowercase letter, hovering above a matte pale lilac floor, with a single small acid lime sphere resting beside it. Big tangible smooth object, playful but very restrained and refined, architectural product photography quality, sophisticated soft shadows, subtle iridescence along edges, front three-quarter view, entire object visible, centered, pale lavender seamless studio backdrop. Color palette pale lavender #ece7fa, deep violet #7541e8 and small acid lime #d5f565. No text, no letters, no logo, no watermark, no grids, no small decorative shapes. This will sit on the right side of a clean cream-colored editorial website. Save the generated file so it can be copied into project assets.

## Typography

`public/fonts/manrope-latin.woff2` is the unmodified Google Fonts Latin variable build of Manrope, weights 200–800, retrieved on 4 November 2026. It is 24,532 bytes and served locally, avoiding a runtime request to Google Fonts. `public/fonts/fonts.css` uses `font-display: swap`.

- [Official Google Fonts CSS source](https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap).
- [Downloaded WOFF2 source](https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggexSg.woff2).
- [Google Fonts project and license](https://github.com/google/fonts/tree/main/ofl/manrope).
- The complete SIL Open Font License and copyright notice are distributed at `public/fonts/OFL.txt`.

The Latin subset does not contain Malayalam glyphs; the CSS font stack must allow an appropriate system fallback for Malayalam place names.

## Vector assets

`public/favicon.svg` is an original minimal acorn mark drawn for this rebuild. `public/og-image.svg` is an original 1200 × 630 social-preview composition using the agency name and supplied design palette. Neither contains client logos, invented performance metrics or third-party trademarks.

Some social platforms do not support SVG Open Graph images. For broad social sharing, export `og-image.svg` to a 1200 × 630 PNG and point the Open Graph metadata at that raster file.
