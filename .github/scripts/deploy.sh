#!/usr/bin/env bash
#
# Ships dist/mbn-theme.zip to GIT_THEME_DIR on the target host. Shared by
# live.yml and staging.yml; both supply the GIT_* environment secrets.
set -euo pipefail

for var in GIT_SSH_KEY GIT_HOST GIT_PORT GIT_USER GIT_THEME_DIR; do
  if [ -z "${!var:-}" ]; then
    echo "❌ Missing environment secret: $var" >&2
    exit 1
  fi
done

ARCHIVE="dist/mbn-theme.zip"
[ -f "$ARCHIVE" ] || { echo "❌ $ARCHIVE not found — did 'npm run bundle' run?" >&2; exit 1; }

KEY_DIR="$(mktemp -d)"
trap 'rm -rf "$KEY_DIR"' EXIT
KEY="$KEY_DIR/id_deploy"
printf '%s\n' "$GIT_SSH_KEY" > "$KEY"
chmod 600 "$KEY"
ssh-keyscan -p "$GIT_PORT" -H "$GIT_HOST" > "$KEY_DIR/known_hosts" 2>/dev/null

SSH_OPTS=(-i "$KEY" -o "UserKnownHostsFile=$KEY_DIR/known_hosts" -o BatchMode=yes)
REMOTE_ARCHIVE="/tmp/mbn-theme-${GITHUB_RUN_ID:-manual}-${GITHUB_SHA:-local}.zip"

scp "${SSH_OPTS[@]}" -P "$GIT_PORT" "$ARCHIVE" "$GIT_USER@$GIT_HOST:$REMOTE_ARCHIVE"

ssh "${SSH_OPTS[@]}" -p "$GIT_PORT" "$GIT_USER@$GIT_HOST" \
  bash -s -- "$GIT_THEME_DIR" "$REMOTE_ARCHIVE" <<'REMOTE'
set -euo pipefail
THEME_DIR="${1%/}"
ARCHIVE="$2"
STAGE="$THEME_DIR.incoming"
UNPACK="$THEME_DIR.unpack"
PREVIOUS="$THEME_DIR.previous"

cleanup() { rm -rf "$STAGE" "$UNPACK" "$ARCHIVE"; }
trap cleanup EXIT

command -v unzip >/dev/null 2>&1 || { echo "❌ unzip is not installed on the server" >&2; exit 1; }

# Unpack beside the live directory and swap, so a half-extracted archive is
# never served and the previous copy stays available until the swap succeeds.
rm -rf "$STAGE" "$UNPACK" "$PREVIOUS"
unzip -q "$ARCHIVE" -d "$UNPACK"
mv "$UNPACK/mbn-theme" "$STAGE"

for f in style.css functions.php index.php assets/build/tailwind.css vendor/autoload.php; do
  [ -e "$STAGE/$f" ] || { echo "❌ Uploaded bundle is missing $f" >&2; exit 1; }
done

mkdir -p "$(dirname "$THEME_DIR")"
if [ -d "$THEME_DIR" ]; then
  mv "$THEME_DIR" "$PREVIOUS"
fi
mv "$STAGE" "$THEME_DIR"
rm -rf "$PREVIOUS"

command -v wp >/dev/null 2>&1 && wp --path="$THEME_DIR/../../.." cache flush 2>/dev/null || true
echo "✅ Deployed to $THEME_DIR"
REMOTE
