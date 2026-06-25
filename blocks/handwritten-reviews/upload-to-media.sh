#!/bin/bash
# upload-to-media.sh
#
# Imports all handwritten review images into the WordPress media library,
# preserving the original YYYY/MM folder structure in wp-content/uploads/.
#
# Strategy (WP-CLI 2.12.0 compatible):
#   1. Copy each image into wp-content/uploads/YYYY/MM/ via `docker exec cp`
#      so the file is owned by the container's www-data user (avoids host
#      permission errors on the uploads directory).
#   2. Import via `wp media import --skip-copy` so WP-CLI just registers the
#      file in the database without moving it again.
#
# Usage:
#   bash upload-to-media.sh
#   bash upload-to-media.sh --dry-run      (preview without making changes)

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

CONTAINER="infra-php"

WP_PATH_CONTAINER="/var/www/hastingsandhastings.dev.local/public"
UPLOADS_CONTAINER="${WP_PATH_CONTAINER}/wp-content/uploads"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Resolve the images dir as a container path (same mount, different root prefix)
HOST_ROOT="/home/albert/docker-infra/www"
CONTAINER_ROOT="/var/www"
IMAGES_DIR="${SCRIPT_DIR}/assets/images"
IMAGES_DIR_CONTAINER="${IMAGES_DIR/${HOST_ROOT}/${CONTAINER_ROOT}}"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "=== DRY RUN — no changes will be made ==="
  echo ""
fi

# ── Preflight ─────────────────────────────────────────────────────────────────

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  echo "Error: Docker container '${CONTAINER}' is not running."
  exit 1
fi

if [[ ! -d "$IMAGES_DIR" ]]; then
  echo "Error: Images directory not found: $IMAGES_DIR"
  exit 1
fi

# ── Import ────────────────────────────────────────────────────────────────────

total=0
imported=0
skipped=0
failed=0

for year_dir in "$IMAGES_DIR"/????; do
  [[ -d "$year_dir" ]] || continue
  year=$(basename "$year_dir")

  for month_dir in "$year_dir"/??; do
    [[ -d "$month_dir" ]] || continue
    month=$(basename "$month_dir")

    shopt -s nullglob
    images=("$month_dir"/*.jpg "$month_dir"/*.jpeg "$month_dir"/*.png "$month_dir"/*.webp)
    shopt -u nullglob

    [[ ${#images[@]} -eq 0 ]] && continue

    echo "── ${year}/${month} (${#images[@]} images) ──"

    for img_src in "${images[@]}"; do
      # Skip 0-byte files (failed downloads)
      [[ -f "$img_src" && -s "$img_src" ]] || continue

      filename=$(basename "$img_src")
      src_container="${IMAGES_DIR_CONTAINER}/${year}/${month}/${filename}"
      dest_container="${UPLOADS_CONTAINER}/${year}/${month}/${filename}"
      total=$((total + 1))

      if $DRY_RUN; then
        echo "  [dry-run] copy → uploads/${year}/${month}/${filename}"
        imported=$((imported + 1))
        continue
      fi

      # ── Step 1: copy to uploads/YYYY/MM/ inside the container ──────────────
      # Done via docker exec so the file is owned by the container user (www-data)
      # and avoids host permission issues on the uploads directory.
      if ! docker exec "$CONTAINER" test -f "$dest_container" 2>/dev/null; then
        docker exec "$CONTAINER" mkdir -p "${UPLOADS_CONTAINER}/${year}/${month}"
        docker exec "$CONTAINER" cp "$src_container" "$dest_container"
      fi

      # ── Step 2: register in WordPress media library ─────────────────────────
      result=$(docker exec "$CONTAINER" wp media import "$dest_container" \
        --path="$WP_PATH_CONTAINER" \
        --skip-copy \
        --allow-root \
        --porcelain 2>&1)

      if echo "$result" | grep -qE '^[0-9]+$'; then
        echo "  OK  ${year}/${month}/${filename} → ID: ${result}"
        imported=$((imported + 1))
      elif echo "$result" | grep -qi "already exists\|duplicate\|already been imported"; then
        echo "  --  ${year}/${month}/${filename} (already in library)"
        skipped=$((skipped + 1))
      else
        echo "  ERR ${year}/${month}/${filename}: ${result}"
        failed=$((failed + 1))
      fi
    done
  done
done

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "════════════════════════════════════"
echo " Total:    ${total}"
echo " Imported: ${imported}"
echo " Skipped:  ${skipped} (already in library)"
echo " Failed:   ${failed}"
echo "════════════════════════════════════"
