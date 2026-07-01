#!/bin/bash
# upload-to-media.sh
#
# Imports handwritten review images into the WordPress media library,
# preserving the original YYYY/MM folder structure.
#
# Local target (default):
#   Uses docker exec + WP-CLI inside the infra-php container.
#
# Staging target:
#   Uses the WordPress REST API with an Application Password — no SSH needed.
#   Generate one in WP Admin → Users → Profile → Application Passwords.
#   Set credentials in .env.staging and source it before running.
#
# Usage:
#   bash upload-to-media.sh                                       (local, all folders)
#   bash upload-to-media.sh --year 2022                           (all months in 2022)
#   bash upload-to-media.sh --year 2022 --month 01                (only 2022/01)
#   bash upload-to-media.sh --dry-run                             (preview, no changes)
#   bash upload-to-media.sh --backdate-only                       (fix dates on already-imported files)
#   bash upload-to-media.sh --backdate-only --year 2022 --month 01
#
#   source blocks/handwritten-reviews/.env.staging
#   bash upload-to-media.sh --target staging --year 2019 --month 05
#   bash upload-to-media.sh --target staging --backdate-only --year 2019

set -euo pipefail

# ── Args ──────────────────────────────────────────────────────────────────────

TARGET="local"
DRY_RUN=false
FILTER_YEAR=""
FILTER_MONTH=""
BACKDATE_ONLY=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)        TARGET="$2";          shift 2 ;;
    --dry-run)       DRY_RUN=true;         shift ;;
    --year)          FILTER_YEAR="$2";     shift 2 ;;
    --month)         FILTER_MONTH="$2";    shift 2 ;;
    --backdate-only) BACKDATE_ONLY=true;   shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ "$TARGET" != "local" && "$TARGET" != "staging" ]]; then
  echo "Error: --target must be 'local' or 'staging'."
  exit 1
fi

if [[ -n "$FILTER_MONTH" && -z "$FILTER_YEAR" ]]; then
  echo "Error: --month requires --year to also be set."
  exit 1
fi

if $DRY_RUN; then
  echo "=== DRY RUN — no changes will be made ==="
  echo ""
fi

# ── Config ────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="${SCRIPT_DIR}/assets/images"

# Local (Docker)
CONTAINER="infra-php"
WP_PATH_CONTAINER="/var/www/hastingsandhastings.dev.local/public"
UPLOADS_CONTAINER="${WP_PATH_CONTAINER}/wp-content/uploads"
HOST_ROOT="/home/albert/docker-infra/www"
CONTAINER_ROOT="/var/www"
IMAGES_DIR_CONTAINER="${IMAGES_DIR/${HOST_ROOT}/${CONTAINER_ROOT}}"

# Staging (REST API) — set via .env.staging
STAGING_URL="${STAGING_URL:-}"
STAGING_USER="${STAGING_USER:-}"
STAGING_APP_PASS="${STAGING_APP_PASS:-}"

# ── Preflight ─────────────────────────────────────────────────────────────────

if [[ ! -d "$IMAGES_DIR" ]]; then
  echo "Error: Images directory not found: $IMAGES_DIR"
  exit 1
fi

if [[ "$TARGET" == "local" ]]; then
  if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "Error: Docker container '${CONTAINER}' is not running."
    exit 1
  fi
else
  if [[ -z "$STAGING_URL" || -z "$STAGING_USER" || -z "$STAGING_APP_PASS" ]]; then
    echo "Error: Staging credentials not set. Source your .env.staging file first:"
    echo "  source blocks/handwritten-reviews/.env.staging"
    exit 1
  fi

  AUTH_HEADER="Authorization: Basic $(printf '%s:%s' "$STAGING_USER" "$STAGING_APP_PASS" | base64 | tr -d '\n')"

  echo "Verifying staging credentials…"
  auth_response=$(curl -sf -H "$AUTH_HEADER" "${STAGING_URL}/wp-json/wp/v2/users/me" 2>/dev/null || echo "")
  wp_user=$(echo "$auth_response" | python3 -c \
    "import sys,json; print(json.load(sys.stdin).get('name',''))" 2>/dev/null || true)

  if [[ -z "$wp_user" ]]; then
    echo "Error: Could not authenticate with ${STAGING_URL}. Check credentials."
    exit 1
  fi
  echo "Authenticated as: ${wp_user}"
  echo ""
fi

# ── Helpers ───────────────────────────────────────────────────────────────────

get_mime_type() {
  case "${1##*.}" in
    jpg|jpeg) echo "image/jpeg" ;;
    png)      echo "image/png"  ;;
    webp)     echo "image/webp" ;;
    gif)      echo "image/gif"  ;;
    *)        echo "application/octet-stream" ;;
  esac
}

# Search staging media library for an attachment whose source_url contains
# YYYY/MM/filename. Prints the attachment ID if found, empty string otherwise.
staging_find_attachment() {
  local filename="$1" year="$2" month="$3"
  local slug="${filename%.*}"
  curl -sf -H "$AUTH_HEADER" \
    "${STAGING_URL}/wp-json/wp/v2/media?search=${slug}&per_page=20&_fields=id,source_url" \
    2>/dev/null \
  | python3 -c "
import sys, json
fragment = sys.argv[1]
try:
    items = json.load(sys.stdin)
except Exception:
    sys.exit(1)
for i in items:
    if fragment in i.get('source_url', ''):
        print(i['id'])
        sys.exit(0)
sys.exit(1)
" "${year}/${month}/${filename}" 2>/dev/null || true
}

# ── Attachment cache (backdate-only mode) ──────────────────────────────────────

tmp_attachments=""

if $BACKDATE_ONLY; then
  if [[ "$TARGET" == "local" ]]; then
    echo "Fetching attachment list from database…"
    tmp_attachments=$(mktemp)
    docker exec "$CONTAINER" wp eval \
      'global $wpdb; $rows = $wpdb->get_results( "SELECT ID, guid FROM {$wpdb->posts} WHERE post_type = \"attachment\" AND post_status = \"inherit\" ORDER BY ID" ); foreach ( $rows as $r ) { echo $r->ID . "\t" . $r->guid . "\n"; }' \
      --path="$WP_PATH_CONTAINER" \
      --allow-root 2>/dev/null > "$tmp_attachments"
    echo "Done. $(wc -l < "$tmp_attachments") attachment(s) found."
    echo ""

  else
    echo "Fetching attachment list from staging (paginated)…"
    tmp_attachments=$(mktemp)
    page=1
    while : ; do
      tmp_page=$(mktemp)
      curl -sf -H "$AUTH_HEADER" \
        "${STAGING_URL}/wp-json/wp/v2/media?per_page=100&page=${page}&_fields=id,source_url" \
        > "$tmp_page" 2>/dev/null || echo "[]" > "$tmp_page"

      python3 - "$tmp_page" >> "$tmp_attachments" << 'PYEOF'
import sys, json
try:
    with open(sys.argv[1]) as f:
        items = json.load(f)
except Exception:
    items = []
for i in items:
    print(str(i['id']) + '\t' + i.get('source_url', ''))
PYEOF

      page_count=$(python3 -c "
import json
try:
    print(len(json.load(open('$tmp_page'))))
except Exception:
    print(0)
" 2>/dev/null || echo 0)
      rm -f "$tmp_page"

      echo "  Page ${page}: ${page_count} item(s)"
      [[ "$page_count" -lt 100 ]] && break
      page=$((page + 1))
    done
    echo "Done. $(wc -l < "$tmp_attachments") attachment(s) found."
    echo ""
  fi
fi

# ── Import loop ───────────────────────────────────────────────────────────────

total=0
imported=0
skipped=0
failed=0

year_glob="${FILTER_YEAR:-????}"
month_glob="${FILTER_MONTH:-??}"

for year_dir in "$IMAGES_DIR"/${year_glob}; do
  [[ -d "$year_dir" ]] || continue
  year=$(basename "$year_dir")

  for month_dir in "$year_dir"/${month_glob}; do
    [[ -d "$month_dir" ]] || continue
    month=$(basename "$month_dir")

    shopt -s nullglob
    images=("$month_dir"/*.jpg "$month_dir"/*.jpeg "$month_dir"/*.png "$month_dir"/*.webp)
    shopt -u nullglob

    [[ ${#images[@]} -eq 0 ]] && continue

    echo "── ${year}/${month} (${#images[@]} images) ──"

    for img_src in "${images[@]}"; do
      [[ -f "$img_src" && -s "$img_src" ]] || continue

      filename=$(basename "$img_src")
      total=$((total + 1))

      # ── Backdate-only ───────────────────────────────────────────────────────
      if $BACKDATE_ONLY; then
        attachment_id=$(grep -i "${year}/${month}/${filename}" "$tmp_attachments" \
          | cut -f1 | head -1 || true)

        if [[ -z "$attachment_id" ]]; then
          echo "  --  ${year}/${month}/${filename} (not in library)"
          skipped=$((skipped + 1))
          continue
        fi

        if $DRY_RUN; then
          echo "  [dry-run] backdate ID:${attachment_id} → ${year}-${month}-01"
          imported=$((imported + 1))
          continue
        fi

        update_ok=true
        if [[ "$TARGET" == "local" ]]; then
          docker exec "$CONTAINER" wp post update "$attachment_id" \
            --post_date="${year}-${month}-01 00:00:00" \
            --post_date_gmt="${year}-${month}-01 00:00:00" \
            --path="$WP_PATH_CONTAINER" \
            --allow-root \
            --quiet 2>/dev/null || update_ok=false
        else
          curl -sf -X POST \
            -H "$AUTH_HEADER" \
            -H "Content-Type: application/json" \
            -d "{\"date\":\"${year}-${month}-01T00:00:00\",\"date_gmt\":\"${year}-${month}-01T00:00:00\"}" \
            "${STAGING_URL}/wp-json/wp/v2/media/${attachment_id}" > /dev/null 2>&1 || update_ok=false
        fi

        if $update_ok; then
          echo "  OK  ${year}/${month}/${filename} → ID: ${attachment_id}  (${year}-${month}-01)"
          imported=$((imported + 1))
        else
          echo "  ERR ${year}/${month}/${filename} → ID: ${attachment_id} (backdate failed)"
          failed=$((failed + 1))
        fi
        continue
      fi

      # ── Normal import ───────────────────────────────────────────────────────

      if $DRY_RUN; then
        if [[ "$TARGET" == "staging" ]]; then
          echo "  [dry-run] upload → ${year}/${month}/${filename}"
        else
          echo "  [dry-run] copy → uploads/${year}/${month}/${filename}"
        fi
        imported=$((imported + 1))
        continue
      fi

      if [[ "$TARGET" == "staging" ]]; then
        # Step 1: duplicate check
        attachment_id=$(staging_find_attachment "$filename" "$year" "$month")

        if [[ -n "$attachment_id" ]]; then
          echo "  --  ${year}/${month}/${filename} (already in library)"
          skipped=$((skipped + 1))
          continue
        fi

        # Step 2: upload via REST API
        mime=$(get_mime_type "$filename")
        response=$(curl -sf -X POST \
          -H "$AUTH_HEADER" \
          -H "Content-Disposition: attachment; filename=\"${filename}\"" \
          -H "Content-Type: ${mime}" \
          --data-binary "@${img_src}" \
          "${STAGING_URL}/wp-json/wp/v2/media" 2>/dev/null || echo "")

        attachment_id=$(echo "$response" | python3 -c \
          "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || true)

        if [[ -z "$attachment_id" ]]; then
          echo "  ERR ${year}/${month}/${filename} (upload failed)"
          failed=$((failed + 1))
          continue
        fi

        # Step 3: backdate
        curl -sf -X POST \
          -H "$AUTH_HEADER" \
          -H "Content-Type: application/json" \
          -d "{\"date\":\"${year}-${month}-01T00:00:00\",\"date_gmt\":\"${year}-${month}-01T00:00:00\"}" \
          "${STAGING_URL}/wp-json/wp/v2/media/${attachment_id}" > /dev/null 2>/dev/null || true

        echo "  OK  ${year}/${month}/${filename} → ID: ${attachment_id}"
        imported=$((imported + 1))

      else
        # Local: docker exec + WP-CLI
        src_container="${IMAGES_DIR_CONTAINER}/${year}/${month}/${filename}"
        dest_container="${UPLOADS_CONTAINER}/${year}/${month}/${filename}"

        # Step 1: copy file into container
        if ! docker exec "$CONTAINER" test -f "$dest_container" 2>/dev/null; then
          docker exec "$CONTAINER" mkdir -p "${UPLOADS_CONTAINER}/${year}/${month}"
          docker exec "$CONTAINER" cp "$src_container" "$dest_container"
        fi

        # Step 2: register in media library
        result=$(docker exec "$CONTAINER" wp media import "$dest_container" \
          --path="$WP_PATH_CONTAINER" \
          --skip-copy \
          --allow-root \
          --porcelain 2>&1)

        if echo "$result" | grep -qE '^[0-9]+$'; then
          attachment_id="$result"
          # Step 3: backdate
          docker exec "$CONTAINER" wp post update "$attachment_id" \
            --post_date="${year}-${month}-01 00:00:00" \
            --post_date_gmt="${year}-${month}-01 00:00:00" \
            --path="$WP_PATH_CONTAINER" \
            --allow-root \
            --quiet 2>/dev/null || true
          echo "  OK  ${year}/${month}/${filename} → ID: ${attachment_id}"
          imported=$((imported + 1))
        elif echo "$result" | grep -qi "already exists\|duplicate\|already been imported"; then
          echo "  --  ${year}/${month}/${filename} (already in library)"
          skipped=$((skipped + 1))
        else
          echo "  ERR ${year}/${month}/${filename}: ${result}"
          failed=$((failed + 1))
        fi
      fi

    done
  done
done

# ── Cleanup ───────────────────────────────────────────────────────────────────

[[ -n "$tmp_attachments" ]] && rm -f "$tmp_attachments"

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "════════════════════════════════════"
echo " Target:   ${TARGET}"
echo " Total:    ${total}"
if $BACKDATE_ONLY; then
  echo " Backdated: ${imported}"
  echo " Not found: ${skipped} (not in library)"
else
  echo " Imported:  ${imported}"
  echo " Skipped:   ${skipped} (already in library)"
fi
[[ $failed -gt 0 ]] && echo " Failed:    ${failed}"
echo "════════════════════════════════════"
