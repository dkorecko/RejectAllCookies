#!/usr/bin/env bash
# Submits the current source tree as a new version to AMO's listed channel.
# Requires AMO_JWT_ISSUER / AMO_JWT_SECRET env vars — never pass these as
# plain CLI args or commit them, since they'd end up in shell history/VCS.
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -z "${AMO_JWT_ISSUER:-}" || -z "${AMO_JWT_SECRET:-}" ]]; then
  cat >&2 <<'EOF'
Missing AMO API credentials.

Get a JWT issuer/secret pair from:
  https://addons.mozilla.org/developers/addon/api/key/

Then run:
  AMO_JWT_ISSUER=... AMO_JWT_SECRET=... npm run release
EOF
  exit 1
fi

npx web-ext sign \
  --source-dir=. \
  --artifacts-dir=web-ext-artifacts \
  --ignore-files package.json package-lock.json amo-metadata.json "scripts/**" \
  --amo-metadata=amo-metadata.json \
  --api-key="$AMO_JWT_ISSUER" \
  --api-secret="$AMO_JWT_SECRET" \
  --channel=listed
