#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$APP_DIR/dist"
OUTPUT_FILE="$OUTPUT_DIR/SuiviCatalogage.msapp"

mkdir -p "$OUTPUT_DIR"
rm -f "$OUTPUT_FILE"

if command -v pac >/dev/null 2>&1; then
  (
    cd "$APP_DIR"
    pac canvas pack --sources . --msapp "$OUTPUT_FILE" --layout SourceCode
  )
else
  echo "pac was not found on PATH; creating a local .msapp zip archive from source files." >&2
  echo "Install Microsoft Power Platform CLI and rerun this script to validate with pac canvas pack." >&2
  (
    cd "$APP_DIR"
    zip -qr "$OUTPUT_FILE" CanvasManifest.json Connections Src
  )
fi

echo "Created $OUTPUT_FILE"
