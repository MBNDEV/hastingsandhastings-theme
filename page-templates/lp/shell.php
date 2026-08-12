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

		if ( is_readable( $mbn_lp_content ) ) {
			require $mbn_lp_content;
		}

	endwhile;
	?>
</main>
<?php wp_footer(); ?>
</body>
</html>
