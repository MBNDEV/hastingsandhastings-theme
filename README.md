# MBN Theme

Custom WordPress theme for My Biz Niche.

## Theme Details

- Theme Name: `MBN Theme`
- Description: `Custom Theme for MBN`
- Version: `1.0.0`
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

Deployments are driven by **tags**, not branches. Pushing a tag tells the target
server over SSH to pull that tag into its own checkout and build it there.

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

GitHub Actions only checks out `.github/scripts/deploy.sh` and runs it; nothing
is compiled on the runner. The script SSHes to the host and, inside
`GIT_THEME_DIR`, fetches the tag, checks it out, installs dependencies and runs
`npm run build` — so the server compiles the same assets `npm run dev` produces
locally, from the same sources, instead of trusting an uploaded archive.

The checkout is followed by a cleanup of untracked files, so files an earlier tag
left behind are dropped and this stays a **replacement, not a merge**. Ignored
paths are left alone, so `node_modules/`, `vendor/` and the build output survive
between deploys.

If any step fails the script checks the previous commit back out and rebuilds
it, so a broken release does not leave the site on half-built assets. It also
refuses any `GIT_THEME_DIR` that is not an absolute path ending in
`wp-content/themes/<theme>`, or that is not the root of a git checkout.

**One-time server setup:** clone this repo into `GIT_THEME_DIR` (the theme
directory *is* the checkout), and make sure `git`, `node`, `npm` and `composer`
are on the deploy user's `PATH`. The script fails with a clear message if any
of that is missing.

### Building a bundle by hand

```bash
npm run bundle
```

Not used by deployment — this is for hand-installing the theme somewhere without
a checkout. It runs `npm run build`, then `scripts/bundle.mjs` stages the runtime
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
| `GIT_THEME_DIR` | Absolute path to the theme directory itself, which must be a git checkout of this repo, e.g. `/home/u207-xxxx/www/newsite-staging.example.com/public_html/wp-content/themes/mbn-theme` |

## Security

Please review `SECURITY.md` for:

- supported versions
- vulnerability reporting process
- enforced secure coding standards
