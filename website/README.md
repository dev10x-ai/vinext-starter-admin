# ACP Admin Docs

Docusaurus site for the ACP Admin operations console.

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

Opens **http://127.0.0.1:3000** with ACP Admin documentation (Getting started, Concepts, Components, API).

### Locales (i18n)

- Default: **English** (`en`) at `/…`
- Alternate: **Português** (`pt`, `htmlLang: pt-BR`) at `/pt/…`
- Switcher: navbar globe → English / Português

| Page | EN | PT |
|------|----|----|
| REST examples | http://127.0.0.1:3000/api/rest-examples | http://127.0.0.1:3000/pt/api/rest-examples |
| API Server | http://127.0.0.1:3000/api/server | http://127.0.0.1:3000/pt/api/server |

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

With `make mock` / `make dev` running, use **Send API Request** on reference pages against `http://localhost:4001`.

## Build / serve

```bash
# from repo root
make docs-build   # gen-api-docs + docusaurus build
make docs-serve
```

## Notes

- App links in the admin UI point at `http://localhost:3000` for local docs.
- Do not run other apps (e.g. Dittofeed) on port 3000 while developing docs.
