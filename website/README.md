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

Opens **http://localhost:3000** with ACP Admin documentation (Getting started, Components, API Server, REST examples, **API Reference**).

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
