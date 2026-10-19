# Amazon software development openings in the US

[Open the site](https://dw61.github.io/amazon-jobs/)

## Where is the data from?

GitHub Actions queries Amazon's public `/en/search.json` endpoint once a day,
using the Software Development category, Full-Time schedule, and USA country filters.
It requests Amazon's city counts, then business-category counts for each city. No
Amazon login, private database access, separate backend host, or third-party proxy is needed.

The page loads the latest published snapshot once and displays its last-updated
date and time in the visitor's time zone. Visitors cannot trigger collection or
GitHub Actions from the website. Reloading the page loads the published data.

One posting may appear in several cities. City counts therefore overlap and must
not be added up or used as shares of the US total. Counts across cities are fetched
over a short window, so a city total may differ slightly from its earlier overview
count if Amazon changes listings during collection. Business-category labels come
from Amazon's category identifiers, with simple display formatting.

## Refresh and deployment

The **Refresh jobs and deploy** workflow collects data daily at 15:17 UTC. The
repository owner can also start collection from the repository's **Actions** tab.
Schedules can be delayed by GitHub; public repository schedules can be disabled
after 60 days of repository inactivity. Re-enable the workflow in Actions if
GitHub disables it.

The workflow validates the data, retries temporary failures, and limits collection
to three concurrent requests. If any city fails, it fails the run and leaves the
previous Pages deployment intact. Check the failed Actions run for details.

After successful collection, the refresh job commits `openings.json` to `main`
as `github-actions[bot]`. Only this job has `contents: write`; it runs only for
scheduled or manually requested refreshes on `main`. The workflow then builds
and deploys that exact commit to GitHub Pages. The repository and published site
therefore use the same snapshot. A rejected push fails the refresh without
overwriting newer commits or deploying uncommitted data.

Pushes to `main` publish the existing committed data without querying Amazon.
Pull requests run tests without collecting, committing, or deploying data.
GitHub's built-in token pushes do not start another push workflow, so a daily
refresh commits and deploys within the same run without a recursive loop.

The Pages publishing source must be **GitHub Actions** in repository Settings →
Pages. No custom credentials or secrets are required; commits and deployment use
GitHub's built-in token. Repository rules must allow the bot to push data commits
to `main`.

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
