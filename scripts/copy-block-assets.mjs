#!/usr/bin/env node
/**
 * Mirrors static block media into build/.
 *
 * These directories hold ~260MB of images. Routing them through webpack's
 * CopyPlugin pushes every byte into the compilation graph, which pushed the
 * production build to a ~3GB heap and made it die on smaller machines and CI
 * runners with blocks half-emitted. Plain file copies cost nothing.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );
const blockFilter = process.env.BLOCK || '';

function mirror( from, to ) {
  if ( ! fs.existsSync( from ) ) {
    return 0;
  }
  fs.rmSync( to, { recursive: true, force: true } );
  fs.cpSync( from, to, { recursive: true } );
  return fs.readdirSync( from, { recursive: true } ).length;
}

let copied = 0;

for ( const entry of fs.readdirSync( path.join( ROOT, 'blocks' ), { withFileTypes: true } ) ) {
  if ( ! entry.isDirectory() || entry.name === 'shared' ) {
    continue;
  }
  if ( blockFilter && ! entry.name.includes( blockFilter ) ) {
    continue;
  }
  copied += mirror(
    path.join( ROOT, 'blocks', entry.name, 'assets' ),
    path.join( ROOT, 'build/blocks', entry.name, 'assets' )
  );
}

copied += mirror( path.join( ROOT, 'assets/icons' ), path.join( ROOT, 'build/assets/icons' ) );

console.log( `🖼  Mirrored ${ copied } static block asset entries into build/.` );
