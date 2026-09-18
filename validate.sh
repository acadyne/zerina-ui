#!/usr/bin/env bash

set -euo pipefail

pnpm --dir internal-test typecheck
pnpm --dir internal-test test
pnpm --dir internal-test test:browser
pnpm --dir internal-test build
pnpm typecheck
pnpm build
git diff --check