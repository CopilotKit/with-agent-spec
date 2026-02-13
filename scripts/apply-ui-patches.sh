#!/usr/bin/env bash
set -euo pipefail

# Apply repo-checked-in UI patches into node_modules.
# These patches are temporary workarounds until upstream fixes land.

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 1) Patch @copilotkit/a2ui-renderer
src_a2ui="$root_dir/src/app/patches/@copilotkit/a2ui-renderer/dist"
dst_a2ui="$root_dir/node_modules/@copilotkit/a2ui-renderer/dist"
if [[ -f "$src_a2ui/A2UIMessageRenderer.js" ]]; then
  mkdir -p "$dst_a2ui"
  cp "$src_a2ui/A2UIMessageRenderer.js" "$dst_a2ui/A2UIMessageRenderer.js"
  [[ -f "$src_a2ui/A2UIMessageRenderer.js.map" ]] && cp "$src_a2ui/A2UIMessageRenderer.js.map" "$dst_a2ui/A2UIMessageRenderer.js.map"
  echo "Applied patch: @copilotkit/a2ui-renderer"
fi

# 2) Patch @copilotkitnext/react (pnpm virtual store path)
src_next="$root_dir/src/app/patches/@copilotkitnext/react/dist"
if [[ -f "$src_next/index.mjs" ]]; then
  matches=("$root_dir"/node_modules/.pnpm/@copilotkitnext+react@1.51.3_*/node_modules/@copilotkitnext/react/dist)
  if [[ ${#matches[@]} -gt 0 && -d "${matches[0]}" ]]; then
    dst_next="${matches[0]}"
    cp "$src_next/index.mjs" "$dst_next/index.mjs"
    [[ -f "$src_next/index.mjs.map" ]] && cp "$src_next/index.mjs.map" "$dst_next/index.mjs.map"
    echo "Applied patch: @copilotkitnext/react"
  else
    echo "Warning: could not locate @copilotkitnext/react dist folder under node_modules/.pnpm" >&2
  fi
fi
