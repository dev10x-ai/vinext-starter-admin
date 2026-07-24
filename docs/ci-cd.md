# CI/CD

GitHub Actions for **vinext-starter-admin**: one Cloudflare Worker serves the admin app, mock API (`/api/*`), and Docusaurus docs (`/docs/*`). No review gate; Workers only (not Pages).

## Workflows

| Workflow | Path | When | What |
|----------|------|------|------|
| **CI** | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | Pull requests and branch pushes | `make typecheck`, `oxlint`, `make test`, `make build`, `make docs-build` |
| **Preview** | [`.github/workflows/preview.yml`](../.github/workflows/preview.yml) | Push to any branch | Build admin + merge docs into `dist/docs`, then `wrangler versions upload` (no production traffic) |
| **Deploy** | [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | Tags matching `v*` (and `workflow_dispatch`) | Same build, then `wrangler deploy` for the single admin Worker |

Playwright e2e (`make test-e2e`) is **not** run in CI. Run locally after `make setup`.

## Production URLs

| Surface | Path | Worker | Config | URL |
|---------|------|--------|--------|-----|
| Admin app | `/` | `vinext-starter-admin` | [`wrangler.admin.toml`](../wrangler.admin.toml) | https://vinext-starter-admin.dev10x.ai |
| Mock API | `/api/*` | same | same | https://vinext-starter-admin.dev10x.ai/api/… |
| Docs | `/docs/*` | same | same | https://vinext-starter-admin.dev10x.ai/docs |

There is **no** separate docs Worker or `*-docs.dev10x.ai` hostname. Docs are built with `baseUrl: '/docs/'` and copied into the admin deploy artifact (`website/build` → `dist/docs`).

The Worker also keeps a `*.workers.dev` URL. Custom domains require the `dev10x.ai` zone on the same Cloudflare account with **active Cloudflare nameservers**.

### Routing (`worker/index.ts`)

With `run_worker_first = true` and `not_found_handling = "none"`:

1. `/api` + `/api/*` → mock API
2. `/docs` → redirect to `/docs/`; `/docs/*` → static assets, missing paths → `/docs/404.html`
3. Everything else → admin assets, missing paths → `/index.html` (SPA)

### Build merge

```bash
make build        # vinext → dist/
make docs-build   # docusaurus → website/build, then cp -R → dist/docs
```

CI always runs both in that order before upload/deploy.

## Preview URL pattern

Branch previews use [Workers Preview URLs](https://developers.cloudflare.com/workers/configuration/previews/):

1. Branch name → sanitized preview alias (lowercase, hyphens).
2. `wrangler versions upload --config wrangler.admin.toml --preview-alias <alias>`
3. Typical shapes (exact URL in job log):

   - App: `https://<alias>-vinext-starter-admin.<account-subdomain>.workers.dev`
   - Docs: `https://<alias>-vinext-starter-admin.<account-subdomain>.workers.dev/docs`
   - Versioned: `https://<version-id>-vinext-starter-admin.<account-subdomain>.workers.dev`

Preview uploads **do not** change the production custom domain.

## Required GitHub secrets

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Edit Workers (+ zone DNS as needed for custom domains) |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID for `cloudflare/wrangler-action` |

Set as **repository secrets** and optionally on the `production` environment. Do **not** commit tokens.

## Production release

```bash
git tag v0.1.3
git push origin v0.1.3
```

Runs **Deploy** and updates `https://vinext-starter-admin.dev10x.ai` (including `/docs`).

## Local deploy

```bash
npm ci && npm ci --prefix website
make build && make docs-build
export CLOUDFLARE_ACCOUNT_ID=…   # do not commit
export CLOUDFLARE_API_TOKEN=…    # do not commit
npx wrangler deploy --config wrangler.admin.toml
# preview only:
npx wrangler versions upload --config wrangler.admin.toml --preview-alias my-branch
```

## Local docs DX

```bash
make docs   # http://127.0.0.1:3000/docs/ (standalone Docusaurus)
# Optional: point navbar Admin links at local vinext:
DOCUSAURUS_APP_ORIGIN=http://127.0.0.1:5173 make docs
```

Production path is always **`/docs`** on the admin Worker.

## Actions

https://github.com/raphaelcangucu/vinext-starter-admin/actions
