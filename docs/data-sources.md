# Kerala location and business category data

The checked-in directory contains **10,566 named location records**, **102 editorial marketing categories** and **4,656 official industrial classification records**. It is a large, sourced directory, not a guarantee that every Kerala place name or business activity is represented. Counts and source metadata are machine-readable in `src/data/coverage.json`.

## Administrative names: LGD

Contains administrative data from the **Local Government Directory (LGD), Ministry of Panchayati Raj, Government of India**, used under the **Government Open Data License – India (GODL-India)**, accessed via the data.gov.in open-data API through the pinned public mirror described below. Boundary polygons in that mirror derive from the `ramSeraph/indian_admin_boundaries` compilation of LGD / Survey of India data. Government data does not imply government endorsement of AdSquirrel.

- Primary registry: https://lgdirectory.gov.in/
- Government licence: https://data.gov.in/government-open-data-license-india
- Pinned source: https://github.com/mchittineni/india-village-finder/releases/tag/v1.5.19
- Exact download: https://github.com/mchittineni/india-village-finder/releases/download/v1.5.19/kerala_data.zip
- Mirror attribution and licence details: https://github.com/mchittineni/india-village-finder/blob/main/DATA_LICENSE.md
- Source snapshot: **25 September 2026**.
- Imported source coverage: **all 1,666 village rows, 78 taluks and 14 districts** in that snapshot. These are revenue / administrative villages; they are not every colloquial village, locality or neighbourhood.
- Independent official context: Kerala's Department of Land Revenue describes 14 districts, 78 taluks and 1,666 villages at https://clr.kerala.gov.in/eng/.

Modifications: names normalised for display, official village names retained, aliases merged, district and taluk records added, stable route slugs generated. Only Malayalam names labelled `authoritative` by the source are included. Machine-transliterated Malayalam guesses in the mirror are excluded. Coordinates present in the mirror are supplementary; missing coordinates are not invented.

## Localities, hamlets, towns and cities: OpenStreetMap

**© OpenStreetMap contributors. Data available under the Open Database License (ODbL) 1.0.** The location database combines modified OSM data and administrative records and should be redistributed under ODbL with its attribution preserved. This licence applies to the derived location database, not to the site's original design or application code. Expose a download of `places.json` with this notice when publishing the directory.

- Attribution and contributor information: https://www.openstreetmap.org/copyright
- ODbL: https://opendatacommons.org/licenses/odbl/1-0/
- API documentation: https://wiki.openstreetmap.org/wiki/Overpass_API
- Exact query endpoint: https://overpass-api.de/api/interpreter
- Imported map snapshot: **3 November 2026, 18:53:35 UTC**.
- Source query uses Kerala relation `2018151` / area `3602018151` and imports **9,995 named place nodes**:

```overpass
[out:json][timeout:90];
area(3602018151)->.kerala;
node[place][name](area.kerala);
out;
```

Settlement and locality types include cities, towns, villages, census towns, hamlets, suburbs, neighbourhoods, quarters, localities, isolated dwellings and small named settlements. No Google Maps scraping or proprietary Google place database is used.

Modifications: place nodes are assigned to districts using point-in-polygon checks against the administrative boundary snapshot. Same normalised settlement names within a district are merged while retaining multiple source references. Districts and taluks stay separate. Informal spelling variants from OSM are preserved as aliases. Well-known English aliases such as Cochin / Kochi, Calicut / Kozhikode and Trivandrum / Thiruvananthapuram are also included.

Source exclusions are explicit in `coverage.json`: 30 administrative or non-settlement nodes (state, region, county, islands, squares and plots) and 10 points outside the available simplified district polygons without a usable district tag. Thirty-two unusual community `place` tag values are normalised to `locality` instead of presented as official administrative types.

### Completeness and identity limits

OSM is contributor-maintained and can contain missing names, errors and informal labels. This import uses nodes; a place represented only as an OSM way or relation can be absent. Administrative boundaries and map data have different snapshot dates. Informal micro-localities and recent names can be missing. Transliteration varies.

Same-name settlements in one district may be merged. This directory is designed for named-location discovery, not geocoding or legal administrative use. `source`, `sources`, `lgdCode` and `lgdCodes` retain source identities for later review. A place page represents an area served, not an AdSquirrel office at that location. The only supplied agency address is **1st Floor, Kinfra Hi-Tech Park, Kalamassery, Kerala 683503**.

## Business classification: official NIC and editorial marketing categories

The **National Industrial Classification** is published by the **Ministry of Statistics and Programme Implementation (MoSPI), Government of India**. The latest imported edition is NIC 2025; NIC 2008 remains available for legacy comparison. Official spreadsheet codes and titles are preserved with attribution.

- Classification publisher: https://mospi.gov.in/classification/national-industrial-classification
- Official NIC 2008 workbook: https://www.mospi.gov.in/uploads/documents/publicDocuments/1760616763355-NIC_2008.xlsx
- Official NIC 2025 workbook: https://www.mospi.gov.in/uploads/publications_reports/publications_reports1763618655097_29a4a622-fa4c-47e9-abba-b549e27a1bbb_NIC_2025.xlsx
- NIC 2008 imported records: **2,049** — 88 divisions, 238 groups, 419 class rows and **1,304 subclasses**.
- NIC 2025 imported records: **2,607** — 257 groups, 463 class rows and **1,887 subclasses**. The source workbook expresses divisions as headings; this extraction preserves all numeric group/class/subclass rows rather than treating headings as activity records.
- Output: `src/data/nic-taxonomy.json`, with `version`, exact string `code` (including leading zeroes), official `title`, `level` and exact `source` URL.

`src/data/industries.json` contains **102 readable editorial marketing categories**, mapped broadly to NIC 2008 divisions. These are separate from the full official taxonomy: they group customer-facing categories such as restaurants, houseboats, dental clinics, coir businesses, schools and software providers. Their descriptions, audiences, marketing services and enquiry goals are original planning content, not scraped testimonials, official business records or evidence of verified expertise. No claim is made that every NIC category operates in Kerala, or that AdSquirrel has worked for every listed industry.

## Refresh and verification

Run `node scripts/import-kerala.mjs` to regenerate all outputs from existing cached sources, fetching missing caches on the first run. Run `node scripts/import-kerala.mjs --refresh` to request new OSM data while retaining the pinned LGD release and official NIC workbook URLs. The script validates pinned LGD counts, unique slugs, OSM response completeness and minimum taxonomy record counts before writing outputs. New OSM data can change counts, so review the generated changes and update the snapshot description here after a refresh.

Run `node scripts/import-industries.mjs` after editing its editorial category seed. The importer uses Node built-ins, including a small read-only ZIP/XLSX parser, with no production network request and no paid API dependency. Download caches live in `.cache/`; published pages consume checked-in JSON and do not call Overpass on visitor requests.
