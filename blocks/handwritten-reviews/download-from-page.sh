#!/bin/bash
# download-from-page.sh
#
# Scrapes all WordPress upload images from a page URL and downloads them
# into assets/images/YYYY/MM/ following the source path convention.
#
# Existing files are skipped — run upload-to-media.sh afterwards to
# register any newly downloaded images in the WordPress media library.
#
# Usage:
#   bash download-from-page.sh <page-url>
#   bash download-from-page.sh <page-url> --dry-run

set -euo pipefail

# ── Args ──────────────────────────────────────────────────────────────────────

if [[ $# -lt 1 ]]; then
  echo "Usage: bash $(basename "$0") <page-url> [--dry-run]"
  exit 1
fi

PAGE_URL="$1"
DRY_RUN=false
if [[ "${2:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "=== DRY RUN — no files will be downloaded ==="
  echo ""
fi

# ── Config ────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="${SCRIPT_DIR}/assets/images"

# Derive base URL (scheme + host) for resolving relative URLs
BASE_URL=$(echo "$PAGE_URL" | grep -oE "https?://[^/]+")

# ── Fetch page ────────────────────────────────────────────────────────────────

echo "Fetching: ${PAGE_URL}"
echo ""

html=$(curl -sL --max-time 30 --fail "$PAGE_URL") || {
  echo "Error: failed to fetch ${PAGE_URL}"
  exit 1
}

# ── Extract image URLs ────────────────────────────────────────────────────────
# Target only .gallery .gallery-item elements and pull the href from the
# first <a> tag inside each one.  Uses Python3 for reliable HTML parsing.

tmp_html=$(mktemp)
echo "$html" > "$tmp_html"

mapfile -t image_urls < <(
  python3 - "$tmp_html" "$BASE_URL" << 'PYEOF'
import sys, re, html as h

html_file, base_url = sys.argv[1], sys.argv[2]
with open(html_file) as f:
    content = f.read()

# Target: div.gallery .gallery-item .gallery-icon > a
# Find each .gallery-icon div and grab its first direct-child <a>.
items = re.findall(r'(?s)<dt[^>]*\bgallery-icon\b[^>]*>(.*?)</dt>', content)

seen = set()
for item in items:
    m = re.search(r'<a\s[^>]*\bhref=["\']([^"\']+)["\']', item, re.IGNORECASE)
    if not m:
        continue
    url = h.unescape(m.group(1)).strip()
    # Resolve root-relative URLs
    if url.startswith('/'):
        url = base_url + url
    if url not in seen:
        seen.add(url)
        print(url)
PYEOF
)

rm -f "$tmp_html"

if [[ ${#image_urls[@]} -eq 0 ]]; then
  echo "No WordPress upload images found on this page."
  exit 0
fi

echo "Found ${#image_urls[@]} unique image URL(s)."
echo ""

# ── Download ──────────────────────────────────────────────────────────────────

total=0
downloaded=0
skipped=0
failed=0

for url in "${image_urls[@]}"; do
  # Extract the YYYY/MM/filename segment from the URL path
  rel_path=$(echo "$url" | grep -oE "wp-content/uploads/[0-9]{4}/[0-9]{2}/[^/]+" \
    | sed 's|wp-content/uploads/||')

  if [[ -z "$rel_path" ]]; then
    continue
  fi

  year=$(echo "$rel_path"  | cut -d'/' -f1)
  month=$(echo "$rel_path" | cut -d'/' -f2)
  filename=$(echo "$rel_path" | cut -d'/' -f3)
  dest_dir="${IMAGES_DIR}/${year}/${month}"
  dest_file="${dest_dir}/${filename}"

  total=$((total + 1))

  # Skip if the file already exists and is non-empty
  if [[ -f "$dest_file" && -s "$dest_file" ]]; then
    echo "  --  ${year}/${month}/${filename}  (exists)"
    skipped=$((skipped + 1))
    continue
  fi

  if $DRY_RUN; then
    echo "  [dry-run]  ${year}/${month}/${filename}"
    downloaded=$((downloaded + 1))
    continue
  fi

  mkdir -p "$dest_dir"

  if curl -sL --max-time 30 --fail -o "$dest_file" "$url" && [[ -s "$dest_file" ]]; then
    echo "  OK   ${year}/${month}/${filename}"
    downloaded=$((downloaded + 1))
  else
    # Remove empty/partial file on failure
    [[ -f "$dest_file" ]] && rm -f "$dest_file"
    echo "  ERR  ${year}/${month}/${filename}  (download failed)"
    failed=$((failed + 1))
  fi
done

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "════════════════════════════════════"
echo " Total:      ${total}"
echo " Downloaded: ${downloaded}"
echo " Skipped:    ${skipped}  (already exists)"
if [[ $failed -gt 0 ]]; then
  echo " Failed:     ${failed}"
fi
echo "════════════════════════════════════"
