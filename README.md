# MBN Theme

Custom WordPress theme for My Biz Niche.

## Theme Details

- Theme Name: `MBN Theme`
- Description: `Custom Theme for MBN`
- Version: `1.1.0`
- Author: `My Biz Niche`
- Theme URI: [https://github.com/MBNDEV/hastingsandhastings-theme](https://github.com/MBNDEV/hastingsandhastings-theme)
- Author URI: [https://www.mybizniche.com/](https://www.mybizniche.com/)
- License: `GPL2` - [GPL-2.0](https://www.gnu.org/licenses/gpl-2.0.html)
- Text Domain: `hastingsandhastings-theme`

## Requirements

- WordPress (current supported version)
- PHP compatible with WordPress requirements
- Node.js & npm (for building Gutenberg blocks)
- Composer (for development tooling)

## Installation

1. Copy or clone this theme into `wp-content/themes/hastingsandhastings-theme`.
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Install Node dependencies:
   ```bash
   npm install
   ```
4. Build Gutenberg blocks:
   ```bash
   npm run build
   ```
5. In WordPress Admin, go to **Appearance > Themes** and activate **MBN Theme**.

## Development

### Block Development

This theme uses **native WordPress Gutenberg blocks** with React and Tailwind CSS.

**Start development server with hot reload:**
```bash
npm run start
```

**Build for production:**
```bash
npm run build
```

See [blocks/README.md](blocks/README.md) for detailed block development guide.

### Figma to Gutenberg Blocks

This theme supports **Figma MCP integration** for converting designs directly to blocks.

**Quick Setup:**
1. Get your Figma Personal Access Token: https://www.figma.com/developers/api#access-tokens
2. Copy `.vscode/mcp-settings.json.template` to your MCP settings
3. Add your token to the configuration
4. See [.github/FIGMA_MCP_SETUP.md](.github/FIGMA_MCP_SETUP.md) for complete instructions

**Usage:**
```
@wp-gutenberg-dev Create a hero block from this Figma design:
https://www.figma.com/file/YOUR_FILE_ID
```

### PHP Development

This theme uses Composer autoloading for vendor packages.

- Primary package in use:
  - `yahnis-elsts/plugin-update-checker`
- Autoload is conditionally loaded in `functions.php` to avoid duplicate class loading.

## Update Checker

The theme includes GitHub-based update checks through Plugin Update Checker.

- Repository configured in code:
  - [https://github.com/MBNDEV/hastingsandhastings-theme](https://github.com/MBNDEV/hastingsandhastings-theme)
- Slug configured in code:
  - `hastingsandhastings-theme`

## Version Releasing

MBN Theme uses **Semantic Versioning** and **GitHub Releases** to manage versions. This allows developers to use specific stable versions instead of always pulling from the master branch.

### For Developers Using This Theme

**Checkout a specific version:**
```bash
# List available versions
git tag -l

# Checkout a specific stable version
git checkout v1.0.2

# Or checkout the latest release
git checkout $(git describe --tags --abbrev=0)
```

**Update to latest release:**
```bash
git fetch --all --tags
git checkout $(git describe --tags --abbrev=0)
composer install --no-dev
npm install
npm run build
```

### For WordPress Sites

WordPress sites using this theme will automatically receive update notifications through Plugin Update Checker. Simply update from **WordPress Admin → Appearance → Themes**.

### For Theme Maintainers

**Create a new release:**
```bash
# Bump version and update files
php scripts/bump-version.php 1.1.0

# Commit and tag
git add -A
git commit -m "chore: bump version to 1.1.0"
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main --tags
```

Pushing the tag triggers the live deployment — see [Deployment](#deployment).

### Documentation

- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes

## Linting

Run WordPress coding standards checks before committing:

- `composer run lint`
- `composer run lint:fix`
- `composer run lint:security`
- `composer run lint:run`

## Block Template Sync System

The theme includes a comprehensive template sync system for deploying Block Templates across environments.

### What Gets Synced

**System Templates** (`template-parts/`):
- `header-template.php` → Header Template Block
- `footer-template.php` → Footer Template Block

**Page Template Blocks** (`template-parts/layouts/`):
- `blank.php` → Blank Page Template blocks
- `sample.php` → Sample Page Template blocks
- `sidebar.php` → Sidebar Page Template blocks
- `single.php` → Single Post Template blocks

**Traditional WordPress Templates** (`page-templates/` - NOT synced):
- `template-blank.php`, `template-sample.php`, etc.
- These contain traditional WordPress template code (get_header(), get_footer(), etc.)
- Edited directly in PHP, tracked in Git normally
- Create corresponding Block Template posts automatically

### Workflow

**Local Development:**
1. Edit Block Templates in WordPress Admin → Block Templates
2. Go to **Block Templates → Sync Tools**
3. Click **"📤 Export to Files"** to save block content to PHP files
4. Commit files to Git:
   - `template-parts/*.php` (header/footer)
   - `template-parts/layouts/*.php` (page template blocks)
5. Push to GitHub

**Staging/Production Deployment:**
1. Pull latest code from Git
2. Go to **Block Templates → Sync Tools**
3. Click **"📥 Import from Files"** to overwrite database with file content
4. All template block content is now synced!

### Why This System?

Block Templates are stored in the WordPress database, but we need to:
- Version control template content
- Deploy template changes across environments
- Maintain consistency between local, staging, and production

The sync tools provide bi-directional sync between:
- **Files** (Git-tracked, version controlled)
- **Database** (Block Template posts, editable in WordPress)

## Deployment

Deployments are driven by **tags**, not branches. Pushing a tag builds the theme
on the GitHub runner and ships the resulting archive to the target server.

| Tag format | Workflow | GitHub environment |
|------------|----------|--------------------|
| `v1.2.3` | `.github/workflows/live.yml` | `Production` |
| `staging1.2.3` | `.github/workflows/staging.yml` | `Staging` |

```bash
# Release to live
git tag -a v1.2.0 -m "Release v1.2.0" && git push origin v1.2.0

# Release to staging
git tag -a staging1.2.0 -m "Staging 1.2.0" && git push origin staging1.2.0
```

### What the deploy does

The runner installs dependencies, runs `npm run bundle` and hands
`.github/scripts/deploy.sh` the resulting `dist/mbn-theme.zip`. The script uploads
that archive and swaps it into `GIT_THEME_DIR`. Staging and live therefore install
a byte-identical artifact, so what you verified on staging is exactly what ships.

The swap is two renames within the themes directory — the current theme moves
aside, the unpacked one takes its place — so the theme is absent for milliseconds
rather than for the length of an unpack. The archive is validated *before* the
swap, so an incomplete build never reaches the live path, and a failed swap puts
the previous copy straight back.

This is a **wholesale replacement**: anything in the theme directory that is not
in the bundle is gone. That is the intent, but it also means edits made directly
on the server are lost. Nothing is kept on the server — the copy moved aside is
deleted once the swap succeeds, so revert by pushing an earlier release tag.

Once the files are in place the script activates the theme, flushes the object
cache, and clears the mbn-resolver caches when that plugin's WP-CLI command is
available. All three are best-effort: the files are already live, so a failure
warns rather than reverting a good deploy.

**One-time server setup:** make sure `unzip` is on the deploy user's `PATH` and
that the user can write to the themes directory. `wp-cli` is optional, but without
it nothing is activated or cache-cleared and the script says so. The server no
longer needs `git`, `node`, `npm` or `composer`.

### Building a bundle by hand

```bash
npm run bundle
```

This is what the deploy workflows run, and it also works for hand-installing the
theme somewhere. It runs `npm run build`, then `scripts/bundle.mjs` stages the runtime
theme in `dist/mbn-theme/` and packs `dist/mbn-theme.zip`, keeping only what
WordPress reads. It exits non-zero if a required runtime file is missing.

### Required environment secrets

Set these per environment in **Settings → Environments → Production / Staging**:

| Secret | Description |
|--------|-------------|
| `GIT_SSH_KEY` | SSH private key for the deploy user |
| `GIT_HOST` | Server hostname or IP |
| `GIT_PORT` | SSH port |
| `GIT_USER` | SSH username |
| `GIT_THEME_DIR` | Absolute path to the theme directory itself, e.g. `/home/u207-xxxx/www/newsite-staging.example.com/public_html/wp-content/themes/mbn-theme`. No longer needs to be a git checkout; the name is kept so existing secrets keep working. |
| `GIT_PASSPHRASE` | *Optional.* The passphrase protecting `GIT_SSH_KEY`. Leave it unset for an unencrypted key; when set, the deploy unlocks the key into an `ssh-agent` for the run. |

## Security

Please review `SECURITY.md` for:

- supported versions
- vulnerability reporting process
- enforced secure coding standards
