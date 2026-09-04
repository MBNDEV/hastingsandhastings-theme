const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const glob = require( 'glob' );
const CopyPlugin = require( 'copy-webpack-plugin' );

// Auto-discover block entry points.
// Set BLOCK env var to filter: e.g. BLOCK=header-navigation
const blockFilter = process.env.BLOCK || '';
const blockEntries = {};
const blockFiles = glob.sync( './blocks/*/index.{js,jsx,ts,tsx}' );

blockFiles.forEach( ( file ) => {
  // Normalize path separators for Windows compatibility
  const normalizedFile = file.replace( /\\/g, '/' );
  const match = normalizedFile.match( /blocks\/([^/]+)\/index\./ );
  if ( match ) {
    const blockName = match[ 1 ];
    if ( ! blockFilter || blockName.includes( blockFilter ) ) {
      blockEntries[ `blocks/${ blockName }/index` ] = path.resolve( file );
    }
  }
} );

// Copy block.json, style.css, and render.php into build/blocks/{name}/.
const copyPatterns = [];
const blockDirs = glob.sync( './blocks/*/' );

blockDirs.forEach( ( dir ) => {
  // Normalize path separators for Windows compatibility
  const normalizedDir = dir.replace( /\\/g, '/' );
  const match = normalizedDir.match( /blocks\/([^/]+)\/?$/ );
  const blockName = match?.[ 1 ];
  if ( ! blockName ) {
    return;
  }
  // Skip shared components directory
  if ( blockName === 'shared' ) {
    return;
  }
  if ( blockFilter && ! blockName.includes( blockFilter ) ) {
    return;
  }
  
  copyPatterns.push(
    {
      from: path.resolve( dir, 'block.json' ),
      to: path.resolve( __dirname, `build/blocks/${ blockName }/block.json` ),
      noErrorOnMissing: true,
    },
    {
      from: path.resolve( dir, 'style.css' ),
      to: path.resolve( __dirname, `build/blocks/${ blockName }/style.css` ),
      noErrorOnMissing: true,
    },
    {
      from: path.resolve( dir, 'render.php' ),
      to: path.resolve( __dirname, `build/blocks/${ blockName }/render.php` ),
      noErrorOnMissing: true,
    },
    {
      from: path.resolve( dir, 'script.js' ),
      to: path.resolve( __dirname, `build/blocks/${ blockName }/script.js` ),
      noErrorOnMissing: true,
    }
  );
} );

// blocks/*/assets and assets/icons are mirrored by scripts/copy-block-assets.mjs
// instead — see that file for why they stay out of the compilation.

// Debug: Log copy patterns
if ( copyPatterns.length > 0 ) {
  console.log( `📋 Copying ${ copyPatterns.length } files for ${ blockDirs.length } blocks...` );
}

module.exports = {
  ...defaultConfig,
  entry: blockEntries,
  // Keep the inotify watcher count down in dev; node_modules and static block
  // assets never change while watching.
  watchOptions: {
    ...( defaultConfig.watchOptions || {} ),
    ignored: [ '**/node_modules/**', '**/build/**', '**/blocks/*/assets/**' ],
    aggregateTimeout: 300,
    // Poll instead of using inotify. The system watcher limit is shared with
    // other tooling (editors especially) and runs out on large trees, which
    // surfaces as "ENOSPC: System limit for number of file watchers reached".
    // Set WATCH_POLL=0 to go back to filesystem events.
    poll: process.env.WATCH_POLL === '0' ? false : 1000,
  },
  output: {
    ...defaultConfig.output,
    filename: '[name].js',
    path: path.resolve( __dirname, 'build' ),
    // Static block media is mirrored in outside the compilation, so webpack
    // must not treat it as a stale artifact and delete it on every rebuild.
    clean: blockFilter ? false : { keep: ( asset ) => /(^|[\\/])assets[\\/]/.test( asset ) },
  },
  performance: { hints: false },
  plugins: [
    ...( defaultConfig.plugins || [] ),
    ...( copyPatterns.length ? [ new CopyPlugin( { patterns: copyPatterns } ) ] : [] ),
  ],
};
