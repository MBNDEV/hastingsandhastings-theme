<?php
/**
 * Practice Area custom post type registration.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

/**
 * Register Practice Area post type.
 *
 * @return void
 */
function custom_theme_register_practice_area_post_type(): void {
  $labels = array(
	  'name'                  => __( 'Practice Areas', 'mbn-theme' ),
	  'singular_name'         => __( 'Practice Area', 'mbn-theme' ),
	  'add_new'               => __( 'Add New', 'mbn-theme' ),
	  'add_new_item'          => __( 'Add New Practice Area', 'mbn-theme' ),
	  'edit_item'             => __( 'Edit Practice Area', 'mbn-theme' ),
	  'new_item'              => __( 'New Practice Area', 'mbn-theme' ),
	  'view_item'             => __( 'View Practice Area', 'mbn-theme' ),
	  'view_items'            => __( 'View Practice Areas', 'mbn-theme' ),
	  'search_items'          => __( 'Search Practice Areas', 'mbn-theme' ),
	  'not_found'             => __( 'No practice areas found.', 'mbn-theme' ),
	  'not_found_in_trash'    => __( 'No practice areas found in Trash.', 'mbn-theme' ),
	  'all_items'             => __( 'Practice Areas', 'mbn-theme' ),
	  'archives'              => __( 'Practice Area Archives', 'mbn-theme' ),
	  'attributes'            => __( 'Practice Area Attributes', 'mbn-theme' ),
	  'insert_into_item'      => __( 'Insert into practice area', 'mbn-theme' ),
	  'uploaded_to_this_item' => __( 'Uploaded to this practice area', 'mbn-theme' ),
	  'menu_name'             => __( 'Practice Areas', 'mbn-theme' ),
  );

  register_post_type(
    'practice_area',
    array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		// No automatic pretty permalinks — front-end URLs are handled manually
		// (see custom_theme_practice_area_permalink() / custom_theme_practice_area_request())
		// so entries resolve at a flat, page-like URL instead of /practice_area/{slug}/.
		'rewrite'            => false,
		'capability_type'    => 'post',
		'has_archive'        => false,
		'hierarchical'       => false,
		'show_in_rest'       => true,
		'menu_position'      => 24,
		'menu_icon'          => 'dashicons-media-document',
		// 'page-attributes' enables the Template dropdown so editors can manually
		// assign the "Practice Area" template per entry.
		'supports'           => array( 'title', 'editor', 'thumbnail', 'revisions', 'page-attributes' ),
    )
  );
}
add_action( 'init', 'custom_theme_register_practice_area_post_type', 6 );

/**
 * Enable the Featured Image box for Practice Area entries.
 *
 * The theme never declares global 'post-thumbnails' support, so without this,
 * 'thumbnail' in the post type's own 'supports' array above has no effect —
 * WordPress only shows the Featured Image panel for post types the theme has
 * opted into here.
 *
 * @return void
 */
function custom_theme_practice_area_thumbnail_support(): void {
  add_theme_support( 'post-thumbnails', array( 'practice_area' ) );
}
add_action( 'after_setup_theme', 'custom_theme_practice_area_thumbnail_support' );

/**
 * Output flat, page-like permalinks for Practice Area entries (no CPT slug prefix).
 *
 * @param string  $post_link Default permalink.
 * @param WP_Post $post      Post object.
 * @return string
 */
function custom_theme_practice_area_permalink( string $post_link, WP_Post $post ): string {
  if ( 'practice_area' !== $post->post_type ) {
    return $post_link;
  }

  return home_url( user_trailingslashit( $post->post_name ) );
}
add_filter( 'post_type_link', 'custom_theme_practice_area_permalink', 10, 2 );

/**
 * Resolve flat Practice Area URLs that fall through normal routing.
 *
 * WordPress only resolves a flat single-segment request to `pagename` when a real
 * Page already exists at that path (Pages are matched by pre-generated, per-page
 * rewrite rules). For any other flat slug, it falls through to the generic
 * `/%postname%/` catch-all rule, which sets `name` instead and defaults to the
 * `post` post type. We only step in for that fallback case — and only once we've
 * confirmed no real Page (and, for `pagename` requests, no Page at all) already
 * claims the slug — so real Pages and Posts are never intercepted.
 *
 * @param array $query_vars Parsed query vars.
 * @return array
 */
function custom_theme_practice_area_request( array $query_vars ): array {
  if ( is_admin() ) {
    return $query_vars;
  }

  $slug = '';
  if ( ! empty( $query_vars['pagename'] ) ) {
    $slug = $query_vars['pagename'];
  } elseif ( ! empty( $query_vars['name'] ) && empty( $query_vars['post_type'] ) ) {
    $slug = $query_vars['name'];
  }

  if ( '' === $slug || get_page_by_path( $slug ) ) {
    return $query_vars;
  }

  $practice_area = get_page_by_path( $slug, OBJECT, 'practice_area' );

  if ( ! $practice_area ) {
    return $query_vars;
  }

  unset( $query_vars['pagename'] );
  $query_vars['name']      = $practice_area->post_name;
  $query_vars['post_type'] = 'practice_area';

  return $query_vars;
}
add_filter( 'request', 'custom_theme_practice_area_request' );

/**
 * Flush rewrite rules on theme switch for CPT registration consistency.
 *
 * @return void
 */
function custom_theme_practice_area_flush_rewrite_on_switch_theme(): void {
  custom_theme_register_practice_area_post_type();
  flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'custom_theme_practice_area_flush_rewrite_on_switch_theme' );

/**
 * One-time rewrite flush after CPT is first added to a running theme.
 * Self-disables after the first flush by storing a flag in wp_options.
 *
 * @return void
 */
function custom_theme_practice_area_one_time_flush(): void {
  if ( get_option( 'custom_theme_practice_area_rewrite_flushed' ) ) {
    return;
  }
  flush_rewrite_rules();
  update_option( 'custom_theme_practice_area_rewrite_flushed', true, false );
}
add_action( 'init', 'custom_theme_practice_area_one_time_flush', 99 );
