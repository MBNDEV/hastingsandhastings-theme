#!/usr/bin/env bash
#
# Deploys by pulling the release tag into GIT_THEME_DIR on the target host and
# building it there, so the server produces exactly what `npm run build`
# produces locally. Shared by live.yml and staging.yml; both supply the GIT_*
# environment secrets.
#
# GIT_THEME_DIR must be a git checkout of this repo whose toplevel is the theme
# directory itself, e.g. /home/user/site/public_html/wp-content/themes/mbn-theme
set -euo pipefail

for var in GIT_SSH_KEY GIT_HOST GIT_PORT GIT_USER GIT_THEME_DIR; do
  if [ -z "${!var:-}" ]; then
    echo "❌ Missing environment secret: $var" >&2
    exit 1
  fi
done

RELEASE_REF="${GITHUB_REF_NAME:-}"
if [ -z "$RELEASE_REF" ]; then
  echo "❌ No release tag: GITHUB_REF_NAME is empty. These workflows run on tag pushes." >&2
  exit 1
fi

KEY_DIR="$(mktemp -d)"
trap 'rm -rf "$KEY_DIR"' EXIT
KEY="$KEY_DIR/id_deploy"
printf '%s\n' "$GIT_SSH_KEY" > "$KEY"
chmod 600 "$KEY"
ssh-keyscan -p "$GIT_PORT" -H "$GIT_HOST" > "$KEY_DIR/known_hosts" 2>/dev/null

echo "🚀 Deploying $RELEASE_REF to $GIT_HOST:$GIT_THEME_DIR"

ssh -i "$KEY" -o "UserKnownHostsFile=$KEY_DIR/known_hosts" -o BatchMode=yes \
  -p "$GIT_PORT" "$GIT_USER@$GIT_HOST" \
  bash -s -- "$GIT_THEME_DIR" "$RELEASE_REF" <<'REMOTE'
set -euo pipefail
THEME_DIR="${1%/}"
RELEASE_REF="$2"

# This checks out over the live theme, so refuse anything that does not look
# like a theme directory rather than trusting a mistyped secret.
case "$THEME_DIR" in
  /*/wp-content/themes/?*) ;;
  *)
    echo "❌ GIT_THEME_DIR must be an absolute path ending in wp-content/themes/<theme>" >&2
    echo "   got: $THEME_DIR" >&2
    exit 1
    ;;
esac

for cmd in git node npm composer; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "❌ $cmd is not installed on the server" >&2; exit 1; }
done

cd "$THEME_DIR"

# A checkout rooted anywhere but here would rewrite files outside the theme.
TOPLEVEL="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ "$TOPLEVEL" != "$THEME_DIR" ]; then
  echo "❌ $THEME_DIR is not the root of a git checkout (toplevel: ${TOPLEVEL:-none})" >&2
  echo "   Clone this repo into that path once before the first deploy." >&2
  exit 1
fi

git fetch --prune --tags --force origin
git rev-parse -q --verify "refs/tags/$RELEASE_REF^{commit}" >/dev/null \
  || { echo "❌ Tag $RELEASE_REF not found on origin" >&2; exit 1; }

PREVIOUS="$(git rev-parse HEAD)"

# The compiled tree is served straight out of this directory, so a failed build
# would leave the site on half-built assets. Put the old commit back and rebuild
# it instead — the equivalent of the atomic swap the archive deploy used to do.
rollback() {
  echo "↩️  Deploy failed — restoring $PREVIOUS" >&2
  git checkout --force --detach "$PREVIOUS" >/dev/null 2>&1 || return
  npm run build >/dev/null 2>&1 || echo "⚠️  Rollback rebuild also failed; the theme needs manual repair." >&2
}
trap rollback ERR

git checkout --force --detach "refs/tags/$RELEASE_REF"
# Drops files a previous tag left behind so this stays a replacement, not a
# merge. No -x, so gitignored node_modules, vendor and build output survive.
git clean -fd

composer install --no-dev --optimize-autoloader --no-progress --no-interaction --prefer-dist
# HUSKY=0 because the deploy checkout has no use for commit hooks.
HUSKY=0 npm ci --no-audit --no-fund
npm run build

for f in style.css functions.php index.php tailwind-loader.php assets/build/tailwind.css build/blocks vendor/autoload.php; do
  [ -e "$f" ] || { echo "❌ Build did not produce $f" >&2; exit 1; }
done

trap - ERR

WP_ROOT="${THEME_DIR%/wp-content/themes/*}"
command -v wp >/dev/null 2>&1 && wp --path="$WP_ROOT" cache flush 2>/dev/null || true
BLOCKS="$(find build/blocks -maxdepth 1 -mindepth 1 -type d | wc -l)"
echo "✅ $THEME_DIR now at $RELEASE_REF ($(git rev-parse --short HEAD)), $BLOCKS blocks built"
REMOTE
