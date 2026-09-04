#!/usr/bin/env node
/**
 * Packages the runtime theme into dist/mbn-theme/ and dist/mbn-theme.zip.
 *
 * Run after `npm run build` — `build/` and `assets/build/` are generated (and
 * gitignored), so the bundle is assembled from the working tree, not from git.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );
const DIST = path.join( ROOT, 'dist' );
const THEME_SLUG = 'mbn-theme';
const STAGE = path.join( DIST, THEME_SLUG );
const ARCHIVE = path.join( DIST, `${ THEME_SLUG }.zip` );

// Everything a WordPress install never reads: tooling, sources that compile
// into build/, and repo metadata.
const EXCLUDE_ANYWHERE = new Set( [
  'node_modules',
  '.git',
  '.claude',
  '.cursor',
  '.vscode',
  '.idea',
] );

// Scoped to the theme root so nested directories that share a name survive —
// build/blocks is the compiled output of the excluded blocks/ sources.
const EXCLUDE_ROOT = new Set( [
  'dist',
  '.github',
  'infra-llm',
  'blocks',
  'resources',
  'scripts',
  'html_tailwind',
  'references',
  'bs-config.js',
  'webpack.config.js',
  'postcss.config.js',
  'tailwind.config.js',
  'package.json',
  'package-lock.json',
  'composer.json',
  'composer.lock',
  'phpcs.xml',
  'CLAUDE.md',
  '.gitignore',
  '.gitattributes',
  '.editorconfig',
  '.infra-llm.env',
] );

const EXCLUDE_PATTERNS = [ /\.log$/, /\.hot-update\.(js|json)$/, /^\.env/, /^\.DS_Store$/ ];

const REQUIRED = [
  'style.css',
  'functions.php',
  'header.php',
  'footer.php',
  'index.php',
  'tailwind-loader.php',
  'assets/build/tailwind.css',
  'build/blocks',
  'vendor/autoload.php',
];

function isExcluded( name, rel ) {
  return (
    EXCLUDE_ANYWHERE.has( name ) ||
    ( rel === name && EXCLUDE_ROOT.has( name ) ) ||
    EXCLUDE_PATTERNS.some( ( re ) => re.test( name ) )
  );
}

function copyTree( from, to ) {
  fs.mkdirSync( to, { recursive: true } );
  for ( const entry of fs.readdirSync( from, { withFileTypes: true } ) ) {
    const src = path.join( from, entry.name );
    if ( isExcluded( entry.name, path.relative( ROOT, src ) ) ) {
      continue;
    }
    const isDir = entry.isDirectory();
    const dest = path.join( to, entry.name );
    if ( isDir ) {
      copyTree( src, dest );
    } else if ( entry.isSymbolicLink() ) {
      fs.symlinkSync( fs.readlinkSync( src ), dest );
    } else {
      fs.copyFileSync( src, dest );
    }
  }
}

fs.rmSync( DIST, { recursive: true, force: true } );
copyTree( ROOT, STAGE );

const missing = REQUIRED.filter( ( rel ) => ! fs.existsSync( path.join( STAGE, rel ) ) );
if ( missing.length ) {
  console.error( `❌ Bundle is missing required files:\n  ${ missing.join( '\n  ' ) }` );
  console.error( 'Run `npm run build` and `composer install --no-dev` first.' );
  process.exit( 1 );
}

// -q keeps the log readable; the tree is large enough that per-file output
// buries the summary below.
execFileSync( 'zip', [ '-rq', ARCHIVE, THEME_SLUG ], { cwd: DIST, stdio: 'inherit' } );

const size = ( fs.statSync( ARCHIVE ).size / 1024 / 1024 ).toFixed( 2 );
console.log( `✅ ${ path.relative( ROOT, ARCHIVE ) } (${ size } MB)` );
console.log( `   contents: ${ fs.readdirSync( STAGE ).sort().join( ', ' ) }` );
