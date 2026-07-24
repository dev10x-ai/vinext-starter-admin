# ACP Admin Docs

Docusaurus site for the ACP Admin operations console.

**Production:** served at [`https://vinext-starter-admin.dev10x.ai/docs`](https://vinext-starter-admin.dev10x.ai/docs) on the **same Cloudflare Worker** as the admin app (`baseUrl: '/docs/'`). There is no separate docs Worker.

## Local development

From the repo root (preferred):

```bash
make docs
```

Or from this directory:

```bash
npm install
npm start
```

Opens **http://127.0.0.1:3000/docs/** (same `baseUrl` as production). Optional: point navbar Admin/Console links at local vinext:

```bash
DOCUSAURUS_APP_ORIGIN=http://127.0.0.1:5173 make docs
```

### Locales (i18n)

- Default: **English** (`en`) at `/docs/…`
- Alternate: **Português** (`pt`, `htmlLang: pt-BR`) at `/docs/pt/…`
- Switcher: navbar globe → English / Português

| Page | EN | PT |
|------|----|----|
| REST examples | http://127.0.0.1:3000/docs/api/rest-examples | http://127.0.0.1:3000/docs/pt/api/rest-examples |
| API Server | http://127.0.0.1:3000/docs/api/server | http://127.0.0.1:3000/docs/pt/api/server |

Hand-written API docs + Getting started are fully translated. Component docs stay English until translated. OpenAPI **operation** pages (Try It) keep English summaries from `mock/openapi.yaml`; intro/tag pages have PT copies under `i18n/pt/`.

```bash
make docs-write-translations   # refresh i18n JSON stubs for pt
```

Default content lives in `docs/`. Translations: `i18n/pt/docusaurus-plugin-content-docs/current/`.

## OpenAPI / API Reference

- Spec source: [`../mock/openapi.yaml`](../mock/openapi.yaml)
- Plugin: `docusaurus-plugin-openapi-docs` + theme `docusaurus-theme-openapi-docs` (v5, Docusaurus 3.10+)
- Generated MDX: `docs/api/reference/`

```bash
# regenerate after editing mock/openapi.yaml
make docs-gen-api

# or from this directory
npm run gen-api-docs
```

To use a different Swagger/OpenAPI file later: replace `mock/openapi.yaml` (or change `specPath` in `docusaurus.config.ts`) and run `make docs-gen-api`.

With the admin app running (`make dev`), use **Send API Request** on reference pages against same-origin `/api` (or standalone `make mock` on `:4001`).

## Build / serve / deploy artifact

```bash
# from repo root — after `make build` for a full Worker artifact
make docs-build   # gen-api-docs + docusaurus build → website/build, then copy to dist/client/docs
make docs-serve   # serve website/build standalone (still under /docs/ baseUrl)
```

CI and production deploy one Worker: vinext client assets in `dist/client/` plus docs in `dist/client/docs/`. See [`../docs/ci-cd.md`](../docs/ci-cd.md).

## Notes

- Admin UI links use relative `/docs/` (works on the Worker; locally run `make docs` or open production).
- Overrides: `DOCUSAURUS_URL`, `DOCUSAURUS_BASE_URL`, `DOCUSAURUS_APP_ORIGIN`.
- Do not run other apps on port 3000 while developing docs.
