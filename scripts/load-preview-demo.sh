#!/usr/bin/env bash
# Copy preview demo fixtures into a Huashu preview content directory.
#
# Usage:
#   scripts/load-preview-demo.sh <content_dir> [fragment|full|both]

set -euo pipefail

CONTENT_DIR="${1:-}"
MODE="${2:-both}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEMO_DIR="$REPO_ROOT/demos/preview-v1"

if [[ -z "$CONTENT_DIR" ]]; then
  echo "Usage: scripts/load-preview-demo.sh <content_dir> [fragment|full|both]" >&2
  exit 1
fi

mkdir -p "$CONTENT_DIR"

copy_fragment() {
  cp "$DEMO_DIR/choice-fragment.html" "$CONTENT_DIR/01-choice-fragment.html"
}

copy_full() {
  mkdir -p "$CONTENT_DIR/full"
  cp "$DEMO_DIR/full/full-prototype.html" "$CONTENT_DIR/full/02-full-prototype.html"
  cp "$DEMO_DIR/full/style.css" "$CONTENT_DIR/full/style.css"
}

case "$MODE" in
  fragment) copy_fragment ;;
  full) copy_full ;;
  both) copy_fragment; copy_full ;;
  *)
    echo "Unknown mode: $MODE (expected fragment|full|both)" >&2
    exit 1
    ;;
esac

echo "Loaded preview demo ($MODE) into: $CONTENT_DIR"
