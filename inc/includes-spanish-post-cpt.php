<?php
/**
 * Spanish Post custom post type and taxonomy registration.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

/**
 * Register Spanish Post Category taxonomy.
 *
 * Kept separate from the built-in 'category' taxonomy so Spanish-language
 * articles have their own independent term set.
 *
 * @return void
 */
function custom_theme_register_spanish_post_category_taxonomy(): void {
  $labels = array(
	  'name'              => __( 'Spanish Post Categories', 'mbn-theme' ),
	  'singular_name'     => __( 'Spanish Post Category', 'mbn-theme' ),
	  'search_items'      => __( 'Search Spanish Post Categories', 'mbn-theme' ),
	  'all_items'         => __( 'All Spanish Post Categories', 'mbn-theme' ),
	  'parent_item'       => __( 'Parent Spanish Post Category', 'mbn-theme' ),
	  'parent_item_colon' => __( 'Parent Spanish Post Category:', 'mbn-theme' ),
	  'edit_item'         => __( 'Edit Spanish Post Category', 'mbn-theme' ),
	  'update_item'       => __( 'Update Spanish Post Category', 'mbn-theme' ),
	  'add_new_item'      => __( 'Add New Spanish Post Category', 'mbn-theme' ),
	  'new_item_name'     => __( 'New Spanish Post Category Name', 'mbn-theme' ),
	  'menu_name'         => __( 'Categories', 'mbn-theme' ),
  );

  register_taxonomy(
    'spanish_post_category',
    array( 'spanish_post' ),
    array(
		'labels'            => $labels,
		'public'            => true,
		'show_ui'           => true,
		'show_admin_column' => true,
		'show_in_rest'      => true,
		'hierarchical'      => true,
		'rewrite'           => array( 'slug' => 'spanish-category' ),
		'query_var'         => true,
    )
  );
}
add_action( 'init', 'custom_theme_register_spanish_post_category_taxonomy', 6 );

/**
 * Register Spanish Post post type.
 *
 * Mirrors the standard 'post' post type (title, editor, excerpt) so it works
 * as a drop-in Spanish-language equivalent for the blog listing block.
 *
 * @return void
 */
function custom_theme_register_spanish_post_post_type(): void {
  $labels = array(
	  'name'               => __( 'Spanish Posts', 'mbn-theme' ),
	  'singular_name'      => __( 'Spanish Post', 'mbn-theme' ),
	  'add_new'            => __( 'Add New', 'mbn-theme' ),
	  'add_new_item'       => __( 'Add New Spanish Post', 'mbn-theme' ),
	  'edit_item'          => __( 'Edit Spanish Post', 'mbn-theme' ),
	  'new_item'           => __( 'New Spanish Post', 'mbn-theme' ),
	  'view_item'          => __( 'View Spanish Post', 'mbn-theme' ),
	  'view_items'         => __( 'View Spanish Posts', 'mbn-theme' ),
	  'search_items'       => __( 'Search Spanish Posts', 'mbn-theme' ),
	  'not_found'          => __( 'No Spanish posts found.', 'mbn-theme' ),
	  'not_found_in_trash' => __( 'No Spanish posts found in Trash.', 'mbn-theme' ),
	  'all_items'          => __( 'Spanish Posts', 'mbn-theme' ),
	  'archives'           => __( 'Spanish Post Archives', 'mbn-theme' ),
	  'menu_name'          => __( 'Spanish Posts', 'mbn-theme' ),
  );

  register_post_type(
    'spanish_post',
    array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'show_in_admin_bar'  => true,
		'show_in_nav_menus'  => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'es' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'show_in_rest'       => true,
		'menu_position'      => 22,
		'menu_icon'          => 'dashicons-translation',
		'supports'           => array( 'title', 'editor', 'excerpt', 'revisions' ),
		'taxonomies'         => array( 'spanish_post_category' ),
    )
  );
}
add_action( 'init', 'custom_theme_register_spanish_post_post_type', 7 );

/**
 * Flush rewrite rules on theme switch for CPT registration consistency.
 *
 * @return void
 */
function custom_theme_spanish_post_flush_rewrite_on_switch_theme(): void {
  custom_theme_register_spanish_post_category_taxonomy();
  custom_theme_register_spanish_post_post_type();
  flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'custom_theme_spanish_post_flush_rewrite_on_switch_theme' );

/**
 * One-time rewrite flush after CPT is first added to a running theme.
 * Self-disables after the first flush by storing a flag in wp_options.
 *
 * @return void
 */
function custom_theme_spanish_post_one_time_flush(): void {
  if ( get_option( 'custom_theme_spanish_post_rewrite_flushed' ) ) {
    return;
  }
  flush_rewrite_rules();
  update_option( 'custom_theme_spanish_post_rewrite_flushed', true, false );
}
add_action( 'init', 'custom_theme_spanish_post_one_time_flush', 99 );

if ( ! defined( 'CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG' ) ) {
  define( 'CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG', 'espanol-posts' );
}

/**
 * Whether the current request is the Spanish posts archive page.
 *
 * Single source of truth for every Spanish-page override below (language
 * attributes, SEO meta, header/footer template swap in
 * includes-block-templates.php) — the page isn't a real WPML-translated
 * duplicate, just one English-registered page whose content is Spanish.
 *
 * @return bool
 */
function custom_theme_is_spanish_posts_page(): bool {
  return is_page( CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG );
}

/**
 * Serve the Spanish posts archive page as Spanish to browsers and crawlers.
 *
 * Mirrors mbn_lp_language_attributes() for the Spanish landing page template.
 *
 * @param string $output Language attributes for the <html> tag.
 * @return string
 */
function custom_theme_spanish_posts_page_language_attributes( string $output ): string {
  if ( ! custom_theme_is_spanish_posts_page() ) {
    return $output;
  }

  /**
   * Filters the locale advertised by the Spanish posts archive page.
   *
   * @param string $locale BCP 47 language tag.
   */
  $locale = (string) apply_filters( 'custom_theme_spanish_posts_page_locale', 'es' );

  return preg_replace( '/lang="[^"]*"/', 'lang="' . esc_attr( $locale ) . '"', $output );
}
add_filter( 'language_attributes', 'custom_theme_spanish_posts_page_language_attributes' );

/**
 * Advertise the Spanish posts archive page's Open Graph locale as Spanish.
 *
 * @param string $locale Yoast's default og:locale value.
 * @return string
 */
function custom_theme_spanish_posts_page_og_locale( string $locale ): string {
  if ( ! custom_theme_is_spanish_posts_page() ) {
    return $locale;
  }

  /**
   * Filters the og:locale advertised by the Spanish posts archive page.
   *
   * @param string $og_locale Underscore-formatted locale (e.g. 'es_ES').
   */
  return (string) apply_filters( 'custom_theme_spanish_posts_page_og_locale', 'es_ES' );
}
add_filter( 'wpseo_locale', 'custom_theme_spanish_posts_page_og_locale' );

/**
 * Correct the hreflang tag WPML emits for the Spanish posts page.
 *
 * The page is registered in WPML as English content (there's no real Spanish
 * translation counterpart), so WPML's own hreflang output claims "en" even
 * though the page renders Spanish content and chrome. Swap that language
 * code for "es" so the hreflang matches what's actually served.
 *
 * @param array $hreflang_items Hreflang code => URL map.
 * @return array
 */
function custom_theme_spanish_posts_page_hreflang( array $hreflang_items ): array {
  if ( ! custom_theme_is_spanish_posts_page() ) {
    return $hreflang_items;
  }

  $url = $hreflang_items['en'] ?? home_url( '/' . CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG . '/' );
  unset( $hreflang_items['en'] );

  $hreflang_items['es']        = $url;
  $hreflang_items['x-default'] = $url;

  return $hreflang_items;
}
add_filter( 'wpml_hreflangs', 'custom_theme_spanish_posts_page_hreflang' );
