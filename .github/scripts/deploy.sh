#!/usr/bin/env bash
#
# Ships the archive the workflow already built: uploads dist/mbn-theme.zip to the
# target host and swaps it into GIT_THEME_DIR. The server needs no toolchain and
# no git checkout — staging and live receive the byte-identical artifact the
# runner produced, so what passed on staging is literally what goes live.
#
# Shared by live.yml and staging.yml; both supply the GIT_* environment secrets.
# GIT_PASSPHRASE is the one optional secret: set it only when GIT_SSH_KEY is an
# encrypted key.
# GIT_THEME_DIR keeps its name for compatibility with the configured secrets, but
# it is now just the theme directory itself, no longer a checkout, e.g.
# /home/user/site/public_html/wp-content/themes/mbn-theme
set -euo pipefail

for var in GIT_SSH_KEY GIT_HOST GIT_PORT GIT_USER GIT_THEME_DIR; do
  if [ -z "${!var:-}" ]; then
    echo "❌ Missing environment secret: $var" >&2
    exit 1
  fi
done

ARCHIVE="dist/mbn-theme.zip"
if [ ! -f "$ARCHIVE" ]; then
  echo "❌ $ARCHIVE not found — the build step must run 'npm run bundle' first." >&2
  exit 1
fi

RELEASE_REF="${GITHUB_REF_NAME:-}"
if [ -z "$RELEASE_REF" ]; then
  echo "❌ No release tag: GITHUB_REF_NAME is empty. These workflows run on tag pushes." >&2
  exit 1
fi

THEME_DIR="${GIT_THEME_DIR%/}"

KEY_DIR="$(mktemp -d)"
AGENT_STARTED=0
cleanup_local() {
  [ "$AGENT_STARTED" = 1 ] && ssh-agent -k >/dev/null 2>&1
  rm -rf "$KEY_DIR"
}
trap cleanup_local EXIT
KEY="$KEY_DIR/id_deploy"
printf '%s\n' "$GIT_SSH_KEY" > "$KEY"
chmod 600 "$KEY"

# ssh cannot decrypt a key on its own without a terminal, so an encrypted
# GIT_SSH_KEY is unlocked once here and served to scp/ssh by an agent. The
# passphrase reaches ssh-add through the environment rather than the askpass
# script's body, which would otherwise leave it on disk.
if [ -n "${GIT_PASSPHRASE:-}" ]; then
  ASKPASS="$KEY_DIR/askpass"
  # ssh-add re-invokes askpass indefinitely when the passphrase is rejected, so
  # answering exactly once turns a wrong GIT_PASSPHRASE into a failed step
  # instead of a job that hangs until the runner times out.
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    '[ -e "$0.used" ] && exit 1' \
    ': > "$0.used"' \
    'printf %s "$GIT_PASSPHRASE"' > "$ASKPASS"
  chmod 700 "$ASKPASS"
  eval "$( ssh-agent -s )" >/dev/null
  AGENT_STARTED=1
  if ! GIT_PASSPHRASE="$GIT_PASSPHRASE" DISPLAY="${DISPLAY:-none}" \
       SSH_ASKPASS="$ASKPASS" SSH_ASKPASS_REQUIRE=force \
       ssh-add "$KEY" >/dev/null 2>&1; then
    echo "❌ ssh-add could not unlock the deploy key — check GIT_SSH_KEY and GIT_PASSPHRASE." >&2
    exit 1
  fi
fi

ssh-keyscan -p "$GIT_PORT" -H "$GIT_HOST" > "$KEY_DIR/known_hosts" 2>/dev/null

SSH_OPTS=( -i "$KEY" -o "UserKnownHostsFile=$KEY_DIR/known_hosts" -o BatchMode=yes )
STAMP="$( date -u +%Y%m%d%H%M%S )-${GITHUB_RUN_ID:-manual}"
# Staged beside the theme rather than in /tmp so the final swap is a rename
# within one filesystem instead of a copy across two.
REMOTE_ZIP="$( dirname "$THEME_DIR" )/.mbn-deploy-$STAMP.zip"

echo "🚀 Deploying $RELEASE_REF ($( du -h "$ARCHIVE" | cut -f1 )) to $GIT_HOST:$THEME_DIR"

scp "${SSH_OPTS[@]}" -P "$GIT_PORT" "$ARCHIVE" "$GIT_USER@$GIT_HOST:$REMOTE_ZIP"

ssh "${SSH_OPTS[@]}" -p "$GIT_PORT" "$GIT_USER@$GIT_HOST" \
  bash -s -- "$THEME_DIR" "$RELEASE_REF" "$REMOTE_ZIP" "$STAMP" <<'REMOTE'
set -euo pipefail
THEME_DIR="${1%/}"
RELEASE_REF="$2"
REMOTE_ZIP="$3"
STAMP="$4"

# This replaces the live theme wholesale, so refuse anything that does not look
# like a theme directory rather than trusting a mistyped secret.
case "$THEME_DIR" in
  /*/wp-content/themes/?*) ;;
  *)
    echo "❌ GIT_THEME_DIR must be an absolute path ending in wp-content/themes/<theme>" >&2
    echo "   got: $THEME_DIR" >&2
    exit 1
    ;;
esac

command -v unzip >/dev/null 2>&1 || { echo "❌ unzip is not installed on the server" >&2; exit 1; }

THEMES_DIR="$( dirname "$THEME_DIR" )"
SLUG="$( basename "$THEME_DIR" )"
STAGE="$THEMES_DIR/.mbn-deploy-$STAMP"
BACKUP="$THEMES_DIR/.mbn-backup-$SLUG-$STAMP"

# The upload and the unpacked staging tree are scratch either way; the backup is
# deliberately left behind for rollback.
cleanup() { rm -rf "$STAGE" "$REMOTE_ZIP"; }
trap cleanup EXIT

rm -rf "$STAGE"
mkdir -p "$STAGE"
unzip -q "$REMOTE_ZIP" -d "$STAGE"

# bundle.mjs always stages the tree under mbn-theme/, but the live directory may
# be named something else and WordPress identifies a theme by that name.
NEW="$STAGE/mbn-theme"
[ -d "$NEW" ] || { echo "❌ Archive did not contain mbn-theme/" >&2; exit 1; }

for f in style.css functions.php index.php tailwind-loader.php assets/build/tailwind.css build/blocks vendor/autoload.php; do
  [ -e "$NEW/$f" ] || { echo "❌ Archive is missing $f" >&2; exit 1; }
done

# Two renames on one filesystem, so the theme directory is absent for
# milliseconds rather than for the length of an unpack.
if [ -e "$THEME_DIR" ] && ! mv "$THEME_DIR" "$BACKUP"; then
  echo "❌ Could not move the current theme aside; nothing was changed." >&2
  exit 1
fi

if ! mv "$NEW" "$THEME_DIR"; then
  echo "↩️  Swap failed — restoring the previous theme" >&2
  [ -e "$BACKUP" ] && mv "$BACKUP" "$THEME_DIR"
  exit 1
fi

WP_ROOT="${THEME_DIR%/wp-content/themes/*}"
if command -v wp >/dev/null 2>&1; then
  # The files are already live at this point, so a failed activation is worth
  # shouting about but not worth reverting a good deploy over.
  wp --path="$WP_ROOT" theme activate "$SLUG" >/dev/null 2>&1 \
    || echo "⚠️  Deployed, but 'wp theme activate $SLUG' failed — activate it in wp-admin." >&2
  wp --path="$WP_ROOT" cache flush >/dev/null 2>&1 || true
  # mbn-resolver owns the page and edge layers (SiteGround, NitroPack) that
  # `wp cache flush` does not reach. has-command keeps this a no-op wherever the
  # plugin is absent or inactive.
  if wp --path="$WP_ROOT" cli has-command 'mbn-resolver cache clear' >/dev/null 2>&1; then
    wp --path="$WP_ROOT" mbn-resolver cache clear >/dev/null 2>&1 \
      || echo "⚠️  'wp mbn-resolver cache clear' failed — clear the cache manually." >&2
  fi
else
  echo "⚠️  wp-cli not found: theme not activated and caches not flushed." >&2
fi

# Keep two generations. That is enough to step back from a bad release without
# letting ~278 MB copies pile up. The stamp is a UTC timestamp, so the glob's
# lexical order is chronological.
shopt -s nullglob
BACKUPS=( "$THEMES_DIR/.mbn-backup-$SLUG-"* )
shopt -u nullglob
if [ "${#BACKUPS[@]}" -gt 2 ]; then
  for old in "${BACKUPS[@]:0:${#BACKUPS[@]}-2}"; do
    rm -rf "$old"
  done
  BACKUPS=( "${BACKUPS[@]: -2}" )
fi

BLOCKS="$( find "$THEME_DIR/build/blocks" -maxdepth 1 -mindepth 1 -type d | wc -l )"
echo "✅ $THEME_DIR now at $RELEASE_REF, $BLOCKS blocks, ${#BACKUPS[@]} backup(s) retained"
REMOTE
