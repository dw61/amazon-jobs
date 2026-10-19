import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function searchUrl(city = '') {
  const url = new URL('https://www.amazon.jobs/en/search.json');
  url.search = new URLSearchParams({
    offset: '0', result_limit: '1', sort: 'recent',
    'category[]': 'software-development',
    'schedule_type_id[]': 'Full-Time',
    'normalized_country_code[]': 'USA',
    'facets[]': city ? 'business_category' : 'normalized_city_name',
  });
  if (city) url.searchParams.set('normalized_city_name[]', city);
  return url;
}

export function facetRows(data, key) {
  if (data.error || !Number.isSafeInteger(data.hits) || data.hits < 0) {
    throw new Error('Amazon returned an invalid job count');
  }
  const rows = data.facets?.[key];
  if (data.hits === 0 && rows === undefined) return [];
  if (!Array.isArray(rows) || (data.hits > 0 && rows.length === 0)) {
    throw new Error(`Amazon did not return ${key}`);
  }
  const seen = new Set();
  return rows.map(row => {
    if (!row || Object.keys(row).length !== 1) throw new Error('Invalid Amazon facet');
    const [name, count] = Object.entries(row)[0];
    if (!name || seen.has(name) || !Number.isSafeInteger(count) || count < 0) {
      throw new Error('Invalid or duplicate Amazon facet count');
    }
    seen.add(name);
    return { name, count };
  }).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchCounts(city, { fetcher = fetch, sleep = pause } = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetcher(searchUrl(city), {
        headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error(`Amazon search returned HTTP ${response.status}`);
      const data = await response.json();
      return {
        total: data.hits,
        counts: facetRows(data, city ? 'business_category_facet' : 'normalized_city_name_facet'),
      };
    } catch (error) {
      if (attempt === 2) throw new Error(`Refresh failed for ${city || 'US overview'}: ${error.message}`);
      await sleep(1000 * 2 ** attempt);
    }
  }
}

export async function collectOpenings(options = {}) {
  const startedAt = new Date().toISOString();
  const overview = await fetchCounts('', options);
  const cities = new Array(overview.counts.length);
  let nextIndex = 0;
  // At most three requests at once; each response contains counts, not thousands of job descriptions.
  const workers = Array.from({ length: Math.min(3, cities.length) }, async () => {
    while (nextIndex < cities.length) {
      const index = nextIndex++;
      const { name } = overview.counts[index];
      const result = await fetchCounts(name, options);
      cities[index] = { name, total: result.total, teams: result.counts };
    }
  });
  const outcomes = await Promise.allSettled(workers);
  const failure = outcomes.find(outcome => outcome.status === 'rejected');
  if (failure) throw failure.reason;
  return {
    schemaVersion: 1, startedAt, fetchedAt: new Date().toISOString(),
    source: 'https://www.amazon.jobs/en/search',
    filters: { country: 'USA', category: 'software-development', schedule: 'Full-Time' },
    total: overview.total,
    // City counts can overlap: one posting may be available in several cities.
    cityCounts: overview.counts, cities,
  };
}

export async function refreshFile(output, options = {}) {
  const data = await collectOpenings(options);
  await mkdir(dirname(output), { recursive: true });
  const temporary = `${output}.tmp`;
  await writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`);
  await rename(temporary, output);
  return data;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--output' || !args[1])) {
    console.error('Usage: node scripts/refresh-openings.mjs [--output openings.json]');
    process.exitCode = 1;
  } else {
    try {
      const output = resolve(args[1] || 'openings.json');
      const data = await refreshFile(output);
      console.log(`Refreshed ${data.total} US postings across ${data.cities.length} cities at ${data.fetchedAt}`);
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
