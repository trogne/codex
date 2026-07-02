#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$APP_DIR/dist"
OUTPUT_FILE="$OUTPUT_DIR/Catalogage.msapp"

mkdir -p "$OUTPUT_DIR"
rm -f "$OUTPUT_FILE"

if ! command -v pac >/dev/null 2>&1; then
  echo "pac was not found on PATH." >&2
  exit 1
fi

(
  cd "$APP_DIR"
  pac canvas pack --sources . --msapp "$OUTPUT_FILE" --layout SourceCode
)

echo "Created $OUTPUT_FILE"
