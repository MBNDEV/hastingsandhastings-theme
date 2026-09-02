<?php
/**
 * Spanish Post custom post type and taxonomy registration.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

if ( ! defined( 'CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG' ) ) {
  define( 'CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG', 'espanol-posts' );
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
		// Singles live under the same base as the espanol-posts landing page
		// (e.g. /espanol-posts/la-importancia-del-derecho/). The archive must
		// stay off: with it on, the CPT archive rewrite rule would win over
		// the real /espanol-posts/ page and custom_theme_is_spanish_posts_page()
		// would never match.
		'rewrite'            => array(
			'slug'       => CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG,
			'with_front' => false,
		),
		'capability_type'    => 'post',
		'has_archive'        => false,
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
 * Reclaim /espanol-posts/page/N/ from the spanish_post single-post rewrite.
 *
 * Every post type's single permalink automatically gets an unconditional
 * "<permalink>(/[0-9]+)?" rewrite rule for <!--nextpage--> content splitting
 * (WP_Rewrite::generate_rewrite_rules()) — it isn't controlled by has_archive
 * or by the rewrite 'paged' flag. Because spanish_post singles share the
 * landing page's own slug, that rule matches /espanol-posts/page/2/ by
 * treating "page" as a post slug and "2" as its content sub-page, finds no
 * such post, and 404s before the landing page's own ?paged= pagination
 * (blocks/section-blog-listing-filter/render.php) ever gets a chance. A
 * 'top' rule runs before the CPT's permastruct, so it wins the match.
 *
 * @return void
 */
function custom_theme_spanish_posts_page_pagination_rewrite(): void {
  add_rewrite_rule(
    '^' . CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG . '/page/([0-9]{1,})/?$',
    'index.php?pagename=' . CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG . '&paged=$matches[1]',
    'top'
  );
}
add_action( 'init', 'custom_theme_spanish_posts_page_pagination_rewrite', 8 );

/**
 * Flush rewrite rules on theme switch for CPT registration consistency.
 *
 * @return void
 */
function custom_theme_spanish_post_flush_rewrite_on_switch_theme(): void {
  custom_theme_register_spanish_post_category_taxonomy();
  custom_theme_register_spanish_post_post_type();
  custom_theme_spanish_posts_page_pagination_rewrite();
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
  // v3: added the /espanol-posts/page/N/ rewrite rule above — new key forces
  // one re-flush on environments where the v2 flag was already set.
  if ( get_option( 'custom_theme_spanish_post_rewrite_flushed_v3' ) ) {
    return;
  }
  flush_rewrite_rules();
  update_option( 'custom_theme_spanish_post_rewrite_flushed_v3', true, false );
}
add_action( 'init', 'custom_theme_spanish_post_one_time_flush', 99 );

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
 * Whether the current request serves Spanish content: the Spanish posts
 * archive page or a single Spanish Post. Drives the language attributes,
 * SEO meta, and header/footer template swap.
 *
 * @return bool
 */
function custom_theme_is_spanish_context(): bool {
  return custom_theme_is_spanish_posts_page() || is_singular( 'spanish_post' );
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
  if ( ! custom_theme_is_spanish_context() ) {
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
  if ( ! custom_theme_is_spanish_context() ) {
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
  if ( ! custom_theme_is_spanish_context() ) {
    return $hreflang_items;
  }

  $fallback = is_singular( 'spanish_post' )
    ? (string) get_permalink()
    : home_url( '/' . CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG . '/' );
  $url      = $hreflang_items['en'] ?? $fallback;
  unset( $hreflang_items['en'] );

  $hreflang_items['es']        = $url;
  $hreflang_items['x-default'] = $url;

  return $hreflang_items;
}
add_filter( 'wpml_hreflangs', 'custom_theme_spanish_posts_page_hreflang' );

/**
 * Point the WPML language switcher's Spanish link on the Blog page at the
 * Spanish posts landing page.
 *
 * The Blog page has no real WPML-translated Spanish counterpart, so without
 * this WPML falls back to its own guessed URL (e.g. /es/blog/, which doesn't
 * exist) instead of the espanol-posts page that actually serves as its
 * Spanish equivalent.
 *
 * @param string $url  The language URL WPML is about to output.
 * @param array  $data Language data for this switcher link, keyed by 'code'.
 * @return string
 */
function custom_theme_blog_page_spanish_switcher_url( string $url, array $data ): string {
  if ( 'es' === ( $data['code'] ?? '' ) && is_page( 'blog' ) ) {
    return home_url( '/' . CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG . '/' );
  }

  return $url;
}
add_filter( 'wpml_ls_language_url', 'custom_theme_blog_page_spanish_switcher_url', 10, 2 );

/**
 * Correct the hreflang tag WPML emits for the Blog page's Spanish version.
 *
 * Same gap as custom_theme_blog_page_spanish_switcher_url() above: the Blog
 * page has no real WPML-translated Spanish counterpart, so WPML's own
 * hreflang output guesses /es/blog/ (which doesn't exist) instead of the
 * espanol-posts page that actually serves as its Spanish equivalent.
 *
 * @param array $hreflang_items Hreflang code => URL map.
 * @return array
 */
function custom_theme_blog_page_spanish_hreflang( array $hreflang_items ): array {
  if ( ! is_page( 'blog' ) ) {
    return $hreflang_items;
  }

  $hreflang_items['es'] = home_url( '/' . CUSTOM_THEME_SPANISH_POSTS_PAGE_SLUG . '/' );

  return $hreflang_items;
}
// Disabled: re-enable once the espanol-posts hreflang mapping is confirmed correct.
// phpcs:ignore Squiz.PHP.CommentedOutCode.Found -- Intentionally disabled, not dead code.
// add_filter( 'wpml_hreflangs', 'custom_theme_blog_page_spanish_hreflang' );
