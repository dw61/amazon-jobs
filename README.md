# Amazon software development openings in the US

[Open the site](https://dw61.github.io/amazon-jobs/)

## Where is the data from?

GitHub Actions queries Amazon's public `/en/search.json` endpoint about once an hour,
using the Software Development category, Full-Time schedule, and USA country filters.
It requests Amazon's city counts, then business-category counts for each city. No
Amazon login, private database access, separate backend host, or third-party proxy is needed.

The page shows the latest successful snapshot and its collection time. This is an
hourly refresh, not a request to Amazon on every page visit. The page checks for a
new published snapshot every five minutes while visible; **Check for update** checks
the published file immediately, rather than triggering a GitHub workflow.

One posting may appear in several cities. City counts therefore overlap and must
not be added up or used as shares of the US total. Counts across cities are fetched
over a short window, so a city total may differ slightly from its earlier overview
count if Amazon changes listings during collection. Business-category labels come
from Amazon's category identifiers, with simple display formatting.

## Refresh and deployment

The **Refresh jobs and deploy** workflow runs hourly at minute 17, on pushes to
`main`, and manually from the repository's **Actions** tab. Schedules can be delayed
by GitHub; public repository schedules can be disabled after 60 days of repository
inactivity. The page flags data older than three hours. Re-enable the workflow in
Actions if GitHub disables it.

The workflow validates the data, retries temporary failures, and limits collection
to three concurrent requests. If any city fails, it fails the run and leaves the
previous Pages deployment intact. Check the failed Actions run for details.

The workflow publishes a Pages artifact directly, without making hourly data
commits. The Pages publishing source must be **GitHub Actions** in repository
Settings → Pages. `openings.json` in the repository is an initial example snapshot;
the deployed site gets newly collected data in every successful workflow run.
No custom credentials or secrets are required; deployment uses GitHub's built-in token.

## Local development

Requires Node.js 22 or newer and Python 3 for the preview server. No packages to install.

```sh
npm test
npm run refresh
python3 -m http.server 8000
```

Open `http://localhost:8000`. To choose another output file:

```sh
node scripts/refresh-openings.mjs --output _site/openings.json
```

`openings.py` and the screenshots are retained as historical documentation of the
original 2022 manual collection process; the scheduled workflow does not use them.
