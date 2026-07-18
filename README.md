# Playwright Book Code Companion v1.0

This repository contains runnable Playwright code aligned with the book version 1.0 examples.

The book v1.0 text uses Sauce Demo-style learning scenarios. This repository runs those scenarios against the included local `demo-app` so the examples are reproducible without depending on an external website.

## Install

```bash
npm ci
npx playwright install
```

## Run

```bash
npm test
npm run test:v1
npm run test:v1:auth
npm run test:v1:catalog
npm run test:v1:checkout
npm run test:v1:api
```

## Main legacy paths used by book v1.0

- `tests/pages/`
- `tests/specs/auth/login.spec.ts`
- `tests/specs/catalog/sort_and_add.spec.ts`
- `tests/specs/checkout/checkout_happy.spec.ts`
- `tests/api/products.spec.ts`
- `tests/e2e/`
- `tests/fixtures/global-setup.ts`
