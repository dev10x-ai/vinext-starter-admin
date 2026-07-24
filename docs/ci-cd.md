# CI/CD

GitHub Actions for **vinext-starter-admin**: Cloudflare Workers for the admin SPA and Docusaurus docs. No review gate; Workers only (not Pages).

## Workflows

| Workflow | Path | When | What |
|----------|------|------|------|
| **CI** | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | Pull requests and branch pushes | `make typecheck`, `oxlint`, `make test`, `make build`, `make docs-build` |
| **Preview** | [`.github/workflows/preview.yml`](../.github/workflows/preview.yml) | Push to any branch | Build admin + docs, then `wrangler versions upload` for **both** workers (no production traffic) |
| **Deploy** | [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | Tags matching `v*` (and `workflow_dispatch`) | Build admin + docs, then `wrangler deploy` for **both** workers |

Playwright e2e (`make test-e2e`) is **not** run in CI. Run locally after `make setup`.

## Production URLs

| Surface | Worker | Config | URL |
|---------|--------|--------|-----|
| Admin SPA | `vinext-starter-admin` | [`wrangler.toml`](../wrangler.toml) | `https://vinext-starter-admin.dev10x.ai` |
| Docs | `vinext-starter-admin-docs` | [`wrangler.docs.toml`](../wrangler.docs.toml) | `https://vinext-starter-admin-docs.dev10x.ai` |

Each worker also keeps a `*.workers.dev` URL. Custom domains require the `dev10x.ai` zone on the same Cloudflare account with **active Cloudflare nameservers**.

Admin SPA uses `not_found_handling = "single-page-application"`. Docs use `not_found_handling = "404-page"` (Docusaurus `404.html`).

## Preview URL pattern

Branch previews use [Workers Preview URLs](https://developers.cloudflare.com/workers/configuration/previews/):

1. Branch name → sanitized preview alias (lowercase, hyphens).
2. `wrangler versions upload --preview-alias <alias>` (admin) and the same with `--config wrangler.docs.toml` (docs).
3. Typical shapes (exact URL in job log):

   - Admin: `https://<alias>-vinext-starter-admin.<account-subdomain>.workers.dev`
   - Docs: `https://<alias>-vinext-starter-admin-docs.<account-subdomain>.workers.dev`
   - Versioned: `https://<version-id>-<worker-name>.<account-subdomain>.workers.dev`

Preview uploads **do not** change the production custom domains.

## Required GitHub secrets

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Edit Workers (+ zone DNS as needed for custom domains) |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID for `cloudflare/wrangler-action` |

Set as **repository secrets** and optionally on the `production` environment. Do **not** commit tokens.

## Production release

```bash
git tag v0.1.0
git push origin v0.1.0
```

Runs **Deploy** and updates both production domains.

## Local deploy

```bash
npm ci && npm ci --prefix website
make build && make docs-build
export CLOUDFLARE_ACCOUNT_ID=…   # do not commit
export CLOUDFLARE_API_TOKEN=…    # do not commit
npx wrangler deploy
npx wrangler deploy --config wrangler.docs.toml
# preview only:
npx wrangler versions upload --preview-alias my-branch
npx wrangler versions upload --config wrangler.docs.toml --preview-alias my-branch
```

## Actions

https://github.com/raphaelcangucu/vinext-starter-admin/actions
