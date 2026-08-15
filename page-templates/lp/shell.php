<?php
/**
 * Document shell shared by the landing page templates.
 *
 * Renders its own <html>/<head>/<body> — no site header, no site footer, no
 * sidebar — the way Elementor Canvas did on the page this design was captured
 * from. The LP carries its own header bar and footer inside the markup partial.
 *
 * Expects $mbn_lp_variant to be set by the including template ('en' or 'es').
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mbn_lp_variant = isset( $mbn_lp_variant ) ? $mbn_lp_variant : 'en';

/*
 * Load our own support file rather than trusting functions.php to have done it.
 *
 * The markup partials call mbn_lp_assets_url() and mbn_lp_render_form(), so a
 * deploy that ships page-templates/ without an updated functions.php would
 * otherwise fatal on the front end. Templates should carry their dependencies.
 */
if ( ! function_exists( 'mbn_lp_assets_url' ) ) {
	$mbn_lp_support = get_theme_file_path( 'inc/includes-lp-template.php' );

  if ( is_readable( $mbn_lp_support ) ) {
      require_once $mbn_lp_support;
  }
}

if ( ! function_exists( 'mbn_lp_assets_url' ) ) {
	// Still missing: render the shell empty rather than take the site down.
	// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log -- deployment fault worth recording.
	error_log( 'MBN LP: inc/includes-lp-template.php is missing from the theme; landing page not rendered.' );
}

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<main id="main" class="site-main mbn-lp">
	<?php
	while ( have_posts() ) :
		the_post();

		/**
		 * Filters the partial that supplies the landing page markup.
		 *
		 * @param string $path    Absolute path to the markup partial.
		 * @param int    $post_id Current page ID.
		 * @param string $variant Language variant ('en' or 'es').
		 */
		$mbn_lp_content = (string) apply_filters(
          'mbn_lp_content_path',
          get_theme_file_path( 'es' === $mbn_lp_variant ? 'page-templates/lp/content-es.php' : 'page-templates/lp/content.php' ),
          get_the_ID(),
          $mbn_lp_variant
		);

      if ( function_exists( 'mbn_lp_assets_url' ) && is_readable( $mbn_lp_content ) ) {
          require $mbn_lp_content;
      }

	endwhile;
	?>
</main>
<?php wp_footer(); ?>
</body>
</html>
