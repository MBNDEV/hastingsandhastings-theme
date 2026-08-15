<?php
/**
 * Native Gutenberg Block Registry
 *
 * Auto-discovers and registers all native Gutenberg blocks from the blocks/ directory.
 * Blocks are identified by the presence of a block.json file.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register shared styles used by the location detailed-page block set.
 *
 * @return void
 */
function hastingsandhastings_register_location_block_shared_styles() {
	$shared_style_relative_path = 'assets/css/location-blocks-shared.css';
	$shared_style_file_path     = get_theme_file_path( $shared_style_relative_path );

  if ( ! file_exists( $shared_style_file_path ) ) {
      return;
  }

	wp_register_style(
      'hastingsandhastings-location-blocks-shared',
      get_theme_file_uri( $shared_style_relative_path ),
      array(),
      (string) filemtime( $shared_style_file_path )
	);
}
add_action( 'init', 'hastingsandhastings_register_location_block_shared_styles', 5 );

/**
 * Auto-discover and register all native Gutenberg blocks.
 *
 * Scans the build/blocks/ directory for subdirectories containing block.json files
 * and registers them with WordPress.
 *
 * @return void
 */
function hastingsandhastings_register_blocks() {
	$blocks_dir = get_theme_file_path( 'build/blocks' );

	// Check if blocks directory exists.
  if ( ! is_dir( $blocks_dir ) ) {
      return;
  }

	// Get all subdirectories in the blocks folder.
	$block_folders = glob( $blocks_dir . '/*', GLOB_ONLYDIR );

  if ( empty( $block_folders ) ) {
      return;
  }

	// Register each block that has a block.json file.
  foreach ( $block_folders as $block_folder ) {
      $block_json = $block_folder . '/block.json';

    if ( file_exists( $block_json ) ) {
        register_block_type( $block_folder );
    }
  }
}
add_action( 'init', 'hastingsandhastings_register_blocks' );

/**
 * Register custom block category for theme blocks.
 *
 * @param array $categories Array of block categories.
 * @return array Modified array of block categories.
 */
function hastingsandhastings_register_block_category( $categories ) {
	// Check if category already exists.
  foreach ( $categories as $category ) {
    if ( 'mbn-blocks' === $category['slug'] ) {
        return $categories;
    }
  }

	// Add custom category at the beginning.
	return array_merge(
      array(
		  array(
			  'slug'  => 'mbn-blocks',
			  'title' => __( 'MBN Blocks', 'mbn-theme' ),
			  'icon'  => 'wordpress',
		  ),
	  ),
      $categories
	);
}
add_filter( 'block_categories_all', 'hastingsandhastings_register_block_category' );

/**
 * Enqueue block editor assets.
 *
 * @return void
 */
function hastingsandhastings_enqueue_block_editor_assets() {
	// Enqueue editor styles if needed.
	// This is where you can add global editor styles that apply to all blocks.
	$editor_css = get_theme_file_uri( 'assets/css/editor.css' );

  if ( file_exists( get_theme_file_path( 'assets/css/editor.css' ) ) ) {
      wp_enqueue_style(
        'hastingsandhastings-editor-styles',
        $editor_css,
        array(),
        wp_get_theme()->get( 'Version' )
      );
  }
}
add_action( 'enqueue_block_editor_assets', 'hastingsandhastings_enqueue_block_editor_assets' );
