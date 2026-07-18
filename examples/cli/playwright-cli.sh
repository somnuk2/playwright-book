#!/usr/bin/env bash
set -euo pipefail

npx playwright test
npx playwright test --headed
npx playwright test --debug
npx playwright test --project=chromium
npx playwright show-report
