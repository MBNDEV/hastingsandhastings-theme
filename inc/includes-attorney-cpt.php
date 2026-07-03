<?php
/**
 * Attorney custom post type registration.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

/**
 * Register Attorney post type.
 *
 * @return void
 */
function custom_theme_register_attorney_post_type(): void {
  $labels = array(
	  'name'                  => __( 'Attorneys', 'mbn-theme' ),
	  'singular_name'         => __( 'Attorney', 'mbn-theme' ),
	  'add_new'               => __( 'Add New', 'mbn-theme' ),
	  'add_new_item'          => __( 'Add New Attorney', 'mbn-theme' ),
	  'edit_item'             => __( 'Edit Attorney', 'mbn-theme' ),
	  'new_item'              => __( 'New Attorney', 'mbn-theme' ),
	  'view_item'             => __( 'View Attorney', 'mbn-theme' ),
	  'view_items'            => __( 'View Attorneys', 'mbn-theme' ),
	  'search_items'          => __( 'Search Attorneys', 'mbn-theme' ),
	  'not_found'             => __( 'No attorneys found.', 'mbn-theme' ),
	  'not_found_in_trash'    => __( 'No attorneys found in Trash.', 'mbn-theme' ),
	  'all_items'             => __( 'Attorneys', 'mbn-theme' ),
	  'archives'              => __( 'Attorney Archives', 'mbn-theme' ),
	  'attributes'            => __( 'Attorney Attributes', 'mbn-theme' ),
	  'insert_into_item'      => __( 'Insert into attorney', 'mbn-theme' ),
	  'uploaded_to_this_item' => __( 'Uploaded to this attorney', 'mbn-theme' ),
	  'menu_name'             => __( 'Attorneys', 'mbn-theme' ),
  );

  register_post_type(
    'attorney',
    array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array(
			'slug'       => 'attorneys',
			'with_front' => false,
		),
		'capability_type'    => 'post',
		'has_archive'        => false,
		'hierarchical'       => false,
		'show_in_rest'       => true,
		'menu_position'      => 22,
		'menu_icon'          => 'dashicons-businessperson',
		'supports'           => array( 'title', 'revisions', 'page-attributes' ),
    )
  );
}
add_action( 'init', 'custom_theme_register_attorney_post_type', 6 );

/**
 * Flush rewrite rules when theme is activated so attorney permalinks resolve.
 *
 * @return void
 */
function custom_theme_attorney_flush_rewrite_on_switch_theme(): void {
  custom_theme_register_attorney_post_type();
  flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'custom_theme_attorney_flush_rewrite_on_switch_theme' );

/**
 * One-time rewrite flush after CPT is first added to a running theme.
 * Self-disables after the first flush by storing a flag in wp_options.
 *
 * @return void
 */
function custom_theme_attorney_one_time_flush(): void {
  if ( get_option( 'custom_theme_attorney_rewrite_flushed' ) ) {
    return;
  }
  flush_rewrite_rules();
  update_option( 'custom_theme_attorney_rewrite_flushed', true, false );
}
add_action( 'init', 'custom_theme_attorney_one_time_flush', 99 );
