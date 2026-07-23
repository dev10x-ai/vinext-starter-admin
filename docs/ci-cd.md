# CI/CD

GitHub Actions for **vinext-starter-admin**, adapted from [gambaLabs/frontend](https://github.com/gambaLabs/frontend) with a narrower surface: no review gate, Cloudflare Workers only.

## Workflows

| Workflow | Path | When | What |
|----------|------|------|------|
| **CI** | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | Pull requests | `make typecheck`, `oxlint`, `make test`, `make build`, `make docs-build` |
| **Deploy** | [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | Push to `main` (and manual `workflow_dispatch`) | Typecheck, unit tests, admin build, then deploy `dist/` to Cloudflare Workers |

Playwright e2e (`make test-e2e`) is **not** run in CI (browser install cost). Run it locally after `make setup`.

`references/` is gitignored and never used in CI.

## Deploy target

Production admin UI is published as a **Cloudflare Worker** with [Workers static assets](https://developers.cloudflare.com/workers/static-assets/) pointing at Vite’s `dist/`. Config: [`wrangler.toml`](../wrangler.toml).

- SPA fallback: `not_found_handling = "single-page-application"` (React Router client routes).
- Docs (`website/`) are built in CI for regression checks only; they are **not** deployed by the Worker workflow.

## Required GitHub secrets

Set these under **Settings → Secrets and variables → Actions** (repository or the `production` environment):

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | API token with permission to edit Workers (and account read as needed) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID used by `cloudflare/wrangler-action` |

Do **not** commit tokens, `.env` files, or account credentials. The deploy job reads secrets only at runtime.

Optional: create a GitHub Environment named `production` (referenced by the deploy job) for environment-scoped secrets or protection rules. Protection rules are optional — there is **no** AI/review-gate job.

## Local deploy (optional)

```bash
npm ci
make build
npx wrangler deploy
```

Requires Wrangler authenticated (`npx wrangler login`) or `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` in the environment.

## Omitted from gambaLabs/frontend

Intentionally **not** copied:

- `review-gate.yml` / Claude AI review blocking deploy
- `claude-review.yml`, `code_review.yml`
- Cloudflare **Pages** publish (`cloudflare/pages-action`)
- Multi-env `ENV_DEV` / `ENV_PROD*` secret file injection
- `development` branch deploy, production-preview, force-deploy bypass
- Yarn / Nuxt (`nuxi prepare`) specific steps
- Self-hosted `8-core` runners

## Actions tab

After the first push that includes these workflows:

https://github.com/raphaelcangucu/vinext-starter-admin/actions
