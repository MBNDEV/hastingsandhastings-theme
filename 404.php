<?php
/**
 * 404 Error Page Template.
 *
 * @package CustomTheme
 */

get_header();
?>

<main id="main" class="site-main">
	<?php
	// Output 404 Error Page Template block content.
	$template_html = custom_theme_get_global_404_template_output_html();

	// If template not found, show simple error message.
	if ( empty( $template_html ) ) {
      ?>
		<div class="container mx-auto px-4 py-16 text-center">
			<h1 class="text-4xl font-bold mb-4">404 - Page Not Found</h1>
			<p class="text-lg mb-8">The page you are looking for does not exist.</p>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn-primary">Go to Homepage</a>
		</div>
		<?php
	} else {
		echo $template_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- block editor content
	}
	?>
</main>

<?php
get_footer();
