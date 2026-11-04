/**
 * Rebuild the Kerala directory from licensed public source snapshots.
 * Run: node scripts/import-kerala.mjs [--refresh]
 * No credentials or Google Maps scraping is required. See docs/data-sources.md.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { inflateRawSync } from 'node:zlib';

const CACHE = path.resolve('.cache');
const OUT = path.resolve('src/data');
const refresh = process.argv.includes('--refresh');
const sources = {
  lgd: 'https://github.com/mchittineni/india-village-finder/releases/download/v1.5.19/kerala_data.zip',
  osm: 'https://overpass-api.de/api/interpreter',
  nic2008: 'https://www.mospi.gov.in/uploads/documents/publicDocuments/1760616763355-NIC_2008.xlsx',
  nic2025: 'https://www.mospi.gov.in/uploads/publications_reports/publications_reports1763618655097_29a4a622-fa4c-47e9-abba-b549e27a1bbb_NIC_2025.xlsx',
};
const query = '[out:json][timeout:90];area(3602018151)->.kerala;node[place][name](area.kerala);out;';
await fs.mkdir(CACHE, { recursive: true });
await fs.mkdir(OUT, { recursive: true });

async function download(filename, url) {
  const filenamePath = path.join(CACHE, filename);
  if (!refresh) {
    try { return await fs.readFile(filenamePath); } catch { /* first run */ }
  }
  const response = await fetch(url, {
    headers: { 'User-Agent': 'AdSquirrel-Kerala-Directory/1.0 (https://www.adsquirrel.in)' },
    signal: AbortSignal.timeout(180_000),
  });
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(filenamePath, buffer);
  return buffer;
}

// Read standard ZIP/XLSX entries without a production dependency or extracting paths.
function unzip(buffer) {
  let end = buffer.length - 22;
  while (end >= Math.max(0, buffer.length - 65557) && buffer.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0 || buffer.readUInt32LE(end) !== 0x06054b50) throw new Error('Invalid ZIP archive');
  const entries = buffer.readUInt16LE(end + 10);
  let offset = buffer.readUInt32LE(end + 16);
  const result = new Map();
  for (let i = 0; i < entries; i++) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error('Invalid ZIP directory');
    const method = buffer.readUInt16LE(offset + 10);
    const size = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString();
    const start = localOffset + 30 + buffer.readUInt16LE(localOffset + 26) + buffer.readUInt16LE(localOffset + 28);
    const compressed = buffer.subarray(start, start + size);
    if (!name.endsWith('/')) {
      if (method !== 0 && method !== 8) throw new Error(`Unsupported ZIP method: ${method}`);
      result.set(name, (method === 8 ? inflateRawSync(compressed) : compressed).toString('utf8'));
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return result;
}

function csv(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted;
    } else if (ch === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (ch === '\n' && !quoted) { row.push(cell.replace(/\r$/, '')); if (row.some(Boolean)) rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell.replace(/\r$/, '')); rows.push(row); }
  const headers = rows.shift();
  return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i] || ''])));
}
const xmlText = (text = '') => text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).trim();
function spreadsheet(buffer) {
  const files = unzip(buffer);
  const strings = [...files.get('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m => xmlText(m[1]));
  return [...files.get('xl/worksheets/sheet1.xml').matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)].map(row => {
    const cells = {};
    for (const cell of row[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const column = cell[1].match(/\br="([A-Z]+)/)?.[1];
      const value = cell[2]?.match(/<v>([\s\S]*?)<\/v>/)?.[1] || '';
      cells[column] = /\bt="s"/.test(cell[1]) ? strings[Number(value)] : value;
    }
    return cells;
  });
}
const clean = value => value.replace(/\s+/g, ' ').trim();
const normal = value => clean(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s*\((?:ct|m|m corp\.?|municipality)\)\s*/gi, '').replace(/[^\p{L}\p{N}]+/gu, '');
const slugify = value => clean(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const display = value => clean(value).replace(/\s*\((?:ct|m|m corp\.?)\)\s*/gi, '').trim();
const pointInRing = (x, y, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (((yi > y) !== (yj > y)) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
function inGeometry(lon, lat, geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some(rings => pointInRing(lon, lat, rings[0]) && !rings.slice(1).some(ring => pointInRing(lon, lat, ring)));
}

const [bundle, osmBuffer, nic08, nic25] = await Promise.all([
  download('kerala-data.zip', sources.lgd),
  download('kerala-osm-0.json', `${sources.osm}?data=${encodeURIComponent(query)}`),
  download('nic-2008.xlsx', sources.nic2008),
  download('nic-2025.xlsx', sources.nic2025),
]);
const lgdFiles = unzip(bundle);
const getBundle = name => {
  const entry = [...lgdFiles.entries()].find(([file]) => file.endsWith(name));
  if (!entry) throw new Error(`Missing source file ${name}`);
  return entry[1];
};
const regions = JSON.parse(getBundle('/web/data/regions.json'));
const boundaries = JSON.parse(getBundle('/web/data/districts.geojson'));
const coords = JSON.parse(getBundle('/web/data/coords.json'));
const lgd = csv(getBundle('/data/kerala_villages.csv'));
const osm = JSON.parse(osmBuffer.toString());
if (!Array.isArray(osm.elements) || osm.remark) throw new Error(`Incomplete OSM response: ${osm.remark || 'missing elements'}`);
if (lgd.length !== 1666 || regions.districts.length !== 14) throw new Error('Unexpected pinned LGD source counts');

const placeMap = new Map();
const districtsByNormal = new Map(regions.districts.map(d => [normal(d.n), d.n]));
const supplementalAliases = {
  Kochi: ['Cochin'], Thiruvananthapuram: ['Trivandrum'], Kozhikode: ['Calicut'],
  Alappuzha: ['Alleppey'], Kollam: ['Quilon'], Thrissur: ['Trichur'], Palakkad: ['Palghat'],
  Kasaragod: ['Kasargod'], Kalamassery: ['Kalamasseri'], Kannur: ['Cannanore'],
};
function addPlace(place, distinct = '') {
  const key = `${normal(place.name)}|${place.district}|${distinct}`;
  const previous = placeMap.get(key);
  if (previous) {
    previous.aliases = [...new Set([...(previous.aliases || []), ...(place.aliases || []), place.name])].filter(n => n !== previous.name);
    previous.sources = [...new Set([...(previous.sources || [previous.source]), ...(place.sources || [place.source])])];
    if (place.source.startsWith('https://www.openstreetmap.org/')) {
      previous.latitude = place.latitude; previous.longitude = place.longitude;
      if (['city', 'town', 'suburb', 'neighbourhood'].includes(place.type)) previous.type = place.type;
    }
    if (place.lgdCode) previous.lgdCodes = [...new Set([...(previous.lgdCodes || (previous.lgdCode ? [previous.lgdCode] : [])), place.lgdCode])];
    return;
  }
  placeMap.set(key, place);
}
for (const district of regions.districts) {
  addPlace({ name: district.n, district: district.n, type: 'district', lgdCode: String(district.c), aliases: supplementalAliases[district.n] || [], source: 'https://lgdirectory.gov.in/', sourceSnapshot: '2026-09-25' }, 'district');
}
for (const taluk of regions.mandals) {
  addPlace({ name: taluk.n, district: regions.districts[taluk.d].n, type: 'taluk', lgdCode: String(taluk.c), aliases: [], source: 'https://lgdirectory.gov.in/', sourceSnapshot: '2026-09-25' }, 'taluk');
}
for (const village of lgd) {
  const coordinate = coords[village['Village Code']];
  addPlace({ name: display(village.Village), district: village.District, type: /\(Ct\)/i.test(village.Village) ? 'census-town' : 'village', officialName: village.Village, taluk: village.Mandal, lgdCode: village['Village Code'], aliases: [village.Village, ...(village['Native Source'] === 'authoritative' && village['Village (Native)'] ? [village['Village (Native)']] : [])], ...(coordinate ? { latitude: coordinate[0], longitude: coordinate[1] } : {}), source: 'https://lgdirectory.gov.in/', sourceSnapshot: '2026-09-25' });
}
let skipped = 0, noDistrict = 0, unusualTypes = 0;
const allowedTypes = new Set(['city', 'town', 'village', 'hamlet', 'suburb', 'neighbourhood', 'quarter', 'locality', 'isolated_dwelling', 'city_block', 'farm', 'colony', 'dwelling']);
for (const element of osm.elements) {
  const tags = element.tags || {};
  if (['island', 'square', 'plot', 'state', 'county', 'region'].includes(tags.place)) { skipped++; continue; }
  let name = clean(tags['name:en'] || tags.name || '');
  if (!name) { skipped++; continue; }
  let district = boundaries.features.find(f => inGeometry(element.lon, element.lat, f.geometry))?.properties.n;
  if (!district) {
    district = districtsByNormal.get(normal(tags['addr:district'] || tags['is_in:district'] || ''));
    if (!district) { noDistrict++; continue; }
  }
  const type = allowedTypes.has(tags.place) ? tags.place.replaceAll('_', '-') : 'locality';
  if (!allowedTypes.has(tags.place)) unusualTypes++;
  const aliases = [...new Set([tags.name, tags['name:en'], tags['name:ml'], ...(tags.alt_name || '').split(';'), ...(tags.old_name || '').split(';'), ...(supplementalAliases[name] || [])].filter(Boolean))].filter(n => n !== name);
  addPlace({ name, district, type, aliases, latitude: element.lat, longitude: element.lon, source: `https://www.openstreetmap.org/${element.type}/${element.id}`, sourceSnapshot: osm.osm3s.timestamp_osm_base.slice(0, 10) });
}
const places = [...placeMap.values()];
const slugCounts = new Map();
for (const place of places) {
  const base = slugify(place.name);
  slugCounts.set(base, (slugCounts.get(base) || 0) + 1);
}
const stableMajor = new Set(['kochi', 'kalamassery', 'thiruvananthapuram', 'kozhikode', 'thrissur', 'kollam', 'kannur', 'alappuzha', 'palakkad', 'kottayam', 'malappuram', 'kasaragod']);
const usedSlugs = new Set();
places.sort((a, b) => ({ city: 0, town: 1, suburb: 2, village: 3, district: 7, taluk: 8 }[a.type] ?? 5) - ({ city: 0, town: 1, suburb: 2, village: 3, district: 7, taluk: 8 }[b.type] ?? 5) || a.name.localeCompare(b.name));
for (const place of places) {
  const base = slugify(place.name) || `place-${place.source.split('/').at(-1)}`;
  let slug = ['district', 'taluk'].includes(place.type) ? `${base}-${place.type}` : (stableMajor.has(base) && !usedSlugs.has(base)) || slugCounts.get(base) === 1 ? base : `${base}-${slugify(place.district)}`;
  if (usedSlugs.has(slug)) slug = `${slug}-${place.lgdCode || place.source.split('/').at(-1)}`;
  if (usedSlugs.has(slug)) throw new Error(`Duplicate slug: ${slug}`);
  place.slug = slug; usedSlugs.add(slug);
  place.aliases = [...new Set([...(place.aliases || []), ...(supplementalAliases[place.name] || [])])].filter(n => n !== place.name);
}
places.sort((a, b) => a.name.localeCompare(b.name));

const taxonomy = [];
for (const row of spreadsheet(nic08)) {
  if (!/^\d{2,5}$/.test(row.A || '') || !row.B) continue;
  taxonomy.push({ version: 'NIC 2008', code: row.A, title: clean(row.B), level: ({ 2: 'division', 3: 'group', 4: 'class', 5: 'subclass' })[row.A.length], source: sources.nic2008 });
}
for (const row of spreadsheet(nic25)) {
  const code = row.C || row.B || row.A;
  if (!/^\d{3,6}$/.test(code || '') || !row.D) continue;
  taxonomy.push({ version: 'NIC 2025', code, title: clean(row.D), level: ({ 3: 'group', 4: 'class', 6: 'subclass' })[code.length] || 'other', source: sources.nic2025 });
}
if (taxonomy.filter(r => r.version === 'NIC 2008' && r.level === 'subclass').length < 1000) throw new Error('Incomplete NIC 2008 taxonomy');
if (taxonomy.filter(r => r.version === 'NIC 2025' && r.level === 'subclass').length < 1500) throw new Error('Incomplete NIC 2025 taxonomy');
await import('./import-industries.mjs');
const industries = JSON.parse(await fs.readFile(path.join(OUT, 'industries.json'), 'utf8'));
const by = (items, key) => items.reduce((result, item) => { const value = item[key]; result[value] = (result[value] || 0) + 1; return result; }, {});
const coverage = {
  generatedAt: new Date().toISOString(),
  counts: { places: places.length, districts: 14, lgdVillageSourceRows: lgd.length, lgdTaluks: regions.mandals.length, osmSourceNodes: osm.elements.length, marketingIndustries: industries.length, nicRecords: taxonomy.length, nic2008Subclasses: taxonomy.filter(r => r.version === 'NIC 2008' && r.level === 'subclass').length, nic2025Subclasses: taxonomy.filter(r => r.version === 'NIC 2025' && r.level === 'subclass').length },
  placesByType: by(places, 'type'), placesByDistrict: by(places, 'district'), nicByVersion: by(taxonomy, 'version'),
  excluded: { osmAdministrativeOrNonSettlementNodes: skipped, osmNodesOutsideAvailableDistrictPolygons: noDistrict, unusualPlaceTagsNormalizedToLocality: unusualTypes },
  sources: [
    { name: 'Local Government Directory (LGD)', publisher: 'Ministry of Panchayati Raj, Government of India', url: 'https://lgdirectory.gov.in/', download: sources.lgd, snapshot: '2026-09-25', license: 'Government Open Data License - India (GODL-India)', licenseUrl: 'https://data.gov.in/government-open-data-license-india', mirror: 'mchittineni/india-village-finder release v1.5.19; derived from the data.gov.in LGD API', modifications: 'Names normalized for display, district/taluk records added, aliases merged, source IDs preserved, stable slugs generated.' },
    { name: 'OpenStreetMap place nodes', publisher: 'OpenStreetMap contributors', url: 'https://www.openstreetmap.org/copyright', download: sources.osm, snapshot: osm.osm3s.timestamp_osm_base, license: 'Open Database License (ODbL) 1.0', licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/', query, modifications: 'Settlement/locality nodes filtered, mapped into district polygons, same-name district entries merged, names and slugs normalized.' },
    { name: 'NIC 2008 and NIC 2025', publisher: 'Ministry of Statistics and Programme Implementation, Government of India', url: 'https://mospi.gov.in/classification/national-industrial-classification', downloads: [sources.nic2008, sources.nic2025], license: 'Government source; original classifications retained with attribution', modifications: 'XLSX classification codes and titles extracted to JSON; separate marketing categories are editorial mappings, not an official NIC classification.' },
  ],
  completeness: { exhaustive: false, statement: 'Includes all 1,666 revenue-village source rows, all 78 taluks and all 14 districts from the pinned LGD snapshot, augmented with available named OpenStreetMap place nodes. Informal localities, alternate spellings, recently changed names and unmapped places may be missing. It is not a complete register of every Kerala place or a verified list of categories operating in Kerala.', deduplication: 'Same normalized settlement name within the same district is merged, retaining source references. Separate district and taluk records remain. Distinct settlements sharing a name inside one district can be merged; source IDs preserve provenance for later review.', districtAssignment: 'Point-in-polygon against simplified district boundaries from the pinned LGD/Survey of India-derived bundle. Coastal and boundary points without a polygon match are excluded unless an explicit OSM district tag resolves them.' },
};
await Promise.all([
  fs.writeFile(path.join(OUT, 'places.json'), JSON.stringify(places, null, 2) + '\n'),
  fs.writeFile(path.join(OUT, 'nic-taxonomy.json'), JSON.stringify(taxonomy, null, 2) + '\n'),
  fs.writeFile(path.join(OUT, 'coverage.json'), JSON.stringify(coverage, null, 2) + '\n'),
]);
console.log(JSON.stringify({ places: places.length, types: coverage.placesByType, excluded: coverage.excluded, nic: coverage.nicByVersion }, null, 2));
