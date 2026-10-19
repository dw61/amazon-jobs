import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectOpenings, facetRows, fetchCounts, refreshFile, searchUrl } from '../scripts/refresh-openings.mjs';

const overview = { hits: 3, facets: { normalized_city_name_facet: [{ Seattle: 2 }, { Austin: 2 }] } };
const city = { hits: 2, facets: { business_category_facet: [{ aws: 1 }, { advertising: 1 }] } };
const reply = body => new Response(JSON.stringify(body));
const noSleep = async () => {};
const fixture = async url => reply(url.searchParams.has('normalized_city_name[]') ? city : overview);

test('queries the same public search filters as Amazon, with a properly encoded city', () => {
  const url = searchUrl('East Palo Alto');
  assert.equal(url.origin, 'https://www.amazon.jobs');
  assert.equal(url.searchParams.get('category[]'), 'software-development');
  assert.equal(url.searchParams.get('schedule_type_id[]'), 'Full-Time');
  assert.equal(url.searchParams.get('normalized_country_code[]'), 'USA');
  assert.equal(url.searchParams.get('normalized_city_name[]'), 'East Palo Alto');
  assert.equal(url.searchParams.get('facets[]'), 'business_category');
  assert.equal(url.searchParams.get('result_limit'), '1');
});

test('uses Amazon unique total instead of adding overlapping city counts', async () => {
  const result = await collectOpenings({ fetcher: fixture });
  assert.equal(result.total, 3);
  assert.equal(result.cityCounts.reduce((sum, row) => sum + row.count, 0), 4);
  assert.equal(result.cities.length, 2);
  assert.equal(result.cities.find(row => row.name === 'Seattle').teams[0].count, 1);
  assert.ok(Date.parse(result.fetchedAt) >= Date.parse(result.startedAt));
});

test('accepts a real zero-result response', async () => {
  const result = await collectOpenings({ fetcher: async () => reply({ hits: 0, facets: {} }) });
  assert.equal(result.total, 0);
  assert.deepEqual(result.cities, []);
});

test('rejects missing facets, upstream errors and malformed counts', () => {
  for (const data of [
    { hits: 1, facets: {} }, { hits: 1, facets: { normalized_city_name_facet: [] } },
    { hits: -1, facets: {} }, { error: 'Unavailable', hits: 0, facets: {} },
    { hits: 1, facets: { normalized_city_name_facet: [{ Seattle: '1' }] } },
    { hits: 1, facets: { normalized_city_name_facet: [{ Seattle: 1 }, { Seattle: 1 }] } },
  ]) assert.throws(() => facetRows(data, 'normalized_city_name_facet'));
});

test('retries a temporary Amazon failure', async () => {
  let requests = 0;
  const result = await fetchCounts('', {
    fetcher: async () => ++requests === 1 ? new Response('', { status: 429 }) : reply(overview),
    sleep: noSleep,
  });
  assert.equal(requests, 2);
  assert.equal(result.total, 3);
});

test('fails after bounded retries instead of publishing a partial snapshot', async () => {
  let requests = 0;
  await assert.rejects(collectOpenings({
    fetcher: async url => {
      if (!url.searchParams.has('normalized_city_name[]')) return reply(overview);
      requests++;
      return new Response('Unavailable', { status: 503 });
    }, sleep: noSleep,
  }), /Refresh failed/);
  assert.equal(requests, 6);
});

test('limits simultaneous city queries to three', async () => {
  let active = 0;
  let peak = 0;
  const result = await collectOpenings({ fetcher: async url => {
    if (!url.searchParams.has('normalized_city_name[]')) {
      return reply({ hits: 10, facets: { normalized_city_name_facet: Array.from({ length: 10 }, (_, i) => ({ ['City ' + i]: 1 })) } });
    }
    active++;
    peak = Math.max(peak, active);
    await new Promise(resolve => setTimeout(resolve, 5));
    active--;
    return reply(city);
  } });
  assert.equal(result.cities.length, 10);
  assert.equal(peak, 3);
});

test('keeps the previous file intact on failure, replaces it on success', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'amazon-refresh-'));
  const output = join(directory, 'openings.json');
  try {
    await writeFile(output, 'previous snapshot');
    await assert.rejects(refreshFile(output, { fetcher: async () => reply({ hits: 1 }), sleep: noSleep }));
    assert.equal(await readFile(output, 'utf8'), 'previous snapshot');
    await refreshFile(output, { fetcher: fixture });
    assert.equal(JSON.parse(await readFile(output, 'utf8')).total, 3);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
