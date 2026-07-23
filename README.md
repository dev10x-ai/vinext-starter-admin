# vinext-starter-admin

Reusable **Vite + React** admin starter kit (demo brand: **ACP Admin**). Fork this repo to bootstrap a new multi-tenant admin product — for example `slot-battle-acp`.

Mocked multi-tenant admin frontend with a UI/UX shell patterned after **Macro Wallets**, gap fill from **Xip Cash admin**, plus a public landing page and Docusaurus docs.

## Quick start

```bash
make setup          # install app + docs + Playwright Chromium
make dev            # landing/admin :5173 + mock API :4001
make docs           # Docusaurus :3000
```

Demo login: `admin@acp.local` / `Admin123!`  
OTP demo (user with 2FA): `sam@acp.local` / `Operator1!` → code `123456`

## Makefile

| Target | Description |
|--------|-------------|
| `make setup` | Install everything |
| `make dev` | Vite + mock API |
| `make mock` | json-server only |
| `make docs` | Docs dev server |
| `make docs-gen-api` | Regenerate API Reference from `mock/openapi.yaml` |
| `make docs-build` | Generate OpenAPI MDX + build docs |
| `make test` | Vitest unit tests |
| `make test-e2e` | Playwright |
| `make build` | Production admin build |

## Structure

- `src/` — React app (landing, auth, dashboard, access, settings)
- `mock/` — json-server + auth routes
- `website/` — Docusaurus documentation
- `docs/` — engineering comparison & design specs
- `mock/openapi.yaml` — OpenAPI for the mock API (Docusaurus API Reference)
- `references/` — optional local clones of reference apps (gitignored; do not commit)

## Comparison

See [`docs/comparison-xip-vs-macro.md`](docs/comparison-xip-vs-macro.md).
