SHELL := /bin/bash
.PHONY: setup install dev mock docs docs-gen-api docs-write-translations docs-build docs-serve test test-unit test-e2e typecheck build preview start clean help deploy

help:
	@echo "ACP Admin targets:"
	@echo "  make setup         Install app + docs deps, Playwright browsers"
	@echo "  make install       npm install (app)"
	@echo "  make dev           vinext App Router (:5173) + in-app /api mock"
	@echo "  make mock          Standalone json-server mock API (:4001)"
	@echo "  make docs          Docusaurus dev server (:3000/docs/) — production path is /docs"
	@echo "  make docs-gen-api  Regenerate OpenAPI MDX from mock/openapi.yaml"
	@echo "  make docs-write-translations  Refresh i18n JSON stubs (locale=pt)"
	@echo "  make docs-build    Build docs (en + pt) and merge into dist/docs"
	@echo "  make docs-serve    Serve built docs (standalone :3000)"
	@echo "  make test          Unit tests"
	@echo "  make test-e2e      Playwright e2e"
	@echo "  make typecheck     TypeScript check"
	@echo "  make build         Production build (vinext) — run docs-build after for deploy"
	@echo "  make start         Serve production build (vinext start)"
	@echo "  make preview       Alias for make start"
	@echo "  make deploy        vinext deploy (Cloudflare Workers)"

setup: install
	cd website && npm install
	npx playwright install chromium

install:
	npm install

dev:
	npm run dev

mock:
	npm run mock

docs:
	npm run docs

docs-gen-api:
	npm run docs:gen-api

docs-write-translations:
	npm --prefix website run write-translations -- --locale pt

# Build Docusaurus with baseUrl /docs/, then merge into the admin deploy artifact.
# Order for production/CI: `make build && make docs-build` then wrangler deploy.
docs-build:
	npm run docs:build
	rm -rf dist/docs
	mkdir -p dist
	cp -R website/build dist/docs

docs-serve:
	npm run docs:serve

test test-unit:
	npm test

test-e2e:
	npm run test:e2e

typecheck:
	npm run typecheck

build:
	npm run build

preview start:
	npm run start

deploy:
	npm run deploy

clean:
	rm -rf dist coverage playwright-report test-results website/build website/.docusaurus .next
