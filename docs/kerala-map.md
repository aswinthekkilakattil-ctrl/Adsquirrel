# Kerala location map

`KeralaMap.astro` renders a north-up vector outline and exactly fourteen green dots, one per district headquarters. There are no visible names, captions, tooltips or other text in the map panel. Its accessible image description is available to screen readers.

The outline and markers share a uniform Web Mercator projection. The outline is simplified to within 0.16 viewBox units (less than a rendered pixel), preserving geographic proportions rather than using the previous hand-drawn, rotated silhouette. The projected geometry is stored in `src/data/kerala-map.json`, so the map needs no network requests or browser JavaScript.

## Sources

- Boundary: [Survey of India / Esri India administrative boundary service](https://livingatlas.esri.in/server/rest/services/LivingAtlas/IND_AdminBoundary/MapServer/1), filtered to Kerala, with WGS84 coordinates requested using `outSR=4326`.
- Headquarters points: [Akula Guru Datta's Kerala District Hq GeoJSON](https://github.com/datta07/INDIAN-SHAPEFILES/blob/master/STATES/KERALA/KERALA%20District%20Hq.geojson). The upstream MIT licence is retained in `kerala-headquarters-LICENSE.txt`.
- The upstream 2011 headquarters point for Ernakulam city is corrected to Kakkanad (76.344 E, 10.017 N). [Ernakulam district administration](https://ernakulam.nic.in/en/demography/) identifies Kakkanad as its headquarters. Painavu is retained for Idukki and Kalpetta for Wayanad.

The dots represent headquarters settlements; they do not imply AdSquirrel offices.
