SHELL := /bin/bash
.PHONY: setup install dev mock docs docs-gen-api docs-build docs-serve test test-unit test-e2e typecheck build preview clean help

help:
	@echo "ACP Admin targets:"
	@echo "  make setup         Install app + docs deps, Playwright browsers"
	@echo "  make install       npm install (app)"
	@echo "  make dev           Frontend + mock API (concurrent)"
	@echo "  make mock          Mock API only (json-server :4001)"
	@echo "  make docs          Docusaurus dev server (:3000)"
	@echo "  make docs-gen-api  Regenerate OpenAPI MDX from mock/openapi.yaml"
	@echo "  make docs-build    Generate API docs + build documentation site"
	@echo "  make docs-serve    Serve built docs"
	@echo "  make test          Unit tests"
	@echo "  make test-e2e      Playwright e2e"
	@echo "  make typecheck     TypeScript check"
	@echo "  make build         Production build (admin)"
	@echo "  make preview       Preview production build"

setup: install
	cd website && npm install
	npx playwright install chromium

install:
	npm install

dev:
	npm run dev:all

mock:
	npm run mock

docs:
	npm run docs

docs-gen-api:
	npm run docs:gen-api

docs-build:
	npm run docs:build

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

preview:
	npm run preview

clean:
	rm -rf dist coverage playwright-report test-results website/build website/.docusaurus
