const status = document.getElementById('status');
const refreshButton = document.getElementById('refresh');
const number = new Intl.NumberFormat();
let refreshing = false;
let lastData;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function teamName(name) {
  if (name === 'aws') return 'Amazon Web Services (AWS)';
  if (name === 'no-business-category') return 'Unspecified team';
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

function bars(rows, formatName = name => name) {
  const list = element('ul', undefined, 'bars');
  const max = Math.max(1, ...rows.map(row => row.count));
  for (const row of rows) {
    const item = element('li');
    const label = element('div', undefined, 'bar-label');
    label.append(element('span', formatName(row.name)), element('strong', number.format(row.count)));
    const track = element('div', undefined, 'bar-track');
    track.setAttribute('aria-hidden', 'true');
    const fill = element('div', undefined, 'bar-fill');
    fill.style.width = `${100 * row.count / max}%`;
    track.append(fill);
    item.append(label, track);
    list.append(item);
  }
  return list;
}

function amazonUrl(city) {
  const url = new URL('https://www.amazon.jobs/en/search');
  url.search = new URLSearchParams({
    'category[]': 'software-development', 'schedule_type_id[]': 'Full-Time',
    'normalized_country_code[]': 'USA', 'normalized_city_name[]': city,
  });
  return url.href;
}

function validateData(data) {
  const validRows = rows => Array.isArray(rows) && rows.every(row =>
    typeof row.name === 'string' && Number.isSafeInteger(row.count) && row.count >= 0);
  if (data.schemaVersion !== 1 || !Number.isFinite(Date.parse(data.fetchedAt)) ||
      !Number.isSafeInteger(data.total) || data.total < 0 || !validRows(data.cityCounts) ||
      !Array.isArray(data.cities) || !data.cities.every(city =>
        typeof city.name === 'string' && Number.isSafeInteger(city.total) && city.total >= 0 && validRows(city.teams))) {
    throw new Error('Unexpected job data');
  }
}

function render(data) {
  document.getElementById('total').textContent = number.format(data.total);
  const updated = document.getElementById('updated');
  updated.dateTime = data.fetchedAt;
  updated.textContent = new Date(data.fetchedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  document.getElementById('overview').replaceChildren(
    data.cityCounts.length ? bars(data.cityCounts.slice(0, 10)) : element('p', 'No matching jobs found.'));

  // Preserve expanded city panels when a background check downloads a new snapshot.
  const openCities = new Set([...document.querySelectorAll('details[open]')].map(node => node.dataset.city));
  const panels = data.cities.map(city => {
    const details = element('details', undefined, 'city');
    details.dataset.city = city.name;
    details.open = openCities.has(city.name);
    const summary = element('summary', `${city.name} · ${number.format(city.total)} postings`);
    const link = element('a', 'View jobs on Amazon');
    link.href = amazonUrl(city.name);
    details.append(summary, link, bars(city.teams, teamName));
    return details;
  });
  document.getElementById('cities').replaceChildren(...panels);
  document.getElementById('results').hidden = false;
}

function freshness() {
  const stale = Date.now() - Date.parse(lastData.fetchedAt) > 3 * 60 * 60 * 1000;
  status.textContent = stale
    ? 'These counts are over 3 hours old. The scheduled refresh may be delayed; check Amazon for the latest listings.'
    : 'Counts refresh about hourly. This page checks for a newer update every 5 minutes.';
  status.className = stale ? 'warning' : '';
}

async function refresh() {
  if (refreshing) return;
  refreshing = true;
  refreshButton.disabled = true;
  status.textContent = 'Checking for updated counts…';
  try {
    const response = await fetch('openings.json', { cache: 'no-store', signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    validateData(data);
    if (lastData?.fetchedAt !== data.fetchedAt) render(data);
    lastData = data;
    freshness();
  } catch (error) {
    status.textContent = lastData
      ? 'Could not check for an update. Showing the counts from the time below; try again shortly.'
      : 'Could not load job counts. Please try again shortly or view listings on Amazon.';
    status.className = 'warning';
    console.error('Unable to load job counts:', error);
  } finally {
    refreshing = false;
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener('click', refresh);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
setInterval(() => { if (!document.hidden) refresh(); }, 5 * 60 * 1000);
refresh();
