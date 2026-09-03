<?php
/**
 * Document shell shared by the Auto Collision templates.
 *
 * Renders its own <html>/<head>/<body> — no site header, no site footer, no
 * sidebar — the way the LP templates do. The design is a single non-scrolling
 * screen with its own header bar and footer, so nothing from the main site
 * chrome belongs here.
 *
 * Expects $mbn_ac_variant to be set by the including template ('lander' or
 * 'thank-you'); it selects the markup partial and decides whether the footer
 * carries the badges and terms, which the thank-you frame drops.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mbn_ac_variant = isset( $mbn_ac_variant ) ? $mbn_ac_variant : 'lander';

/*
 * Load our own support file rather than trusting functions.php to have done
 * it, so a deploy that ships page-templates/ without an updated functions.php
 * renders a plain page instead of fataling on the front end.
 */
if ( ! function_exists( 'mbn_ac_assets_url' ) ) {
	$mbn_ac_support = get_theme_file_path( 'inc/includes-auto-collision-template.php' );

  if ( is_readable( $mbn_ac_support ) ) {
      require_once $mbn_ac_support;
  }
}

if ( ! function_exists( 'mbn_ac_assets_url' ) ) {
	// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log -- deployment fault worth recording.
	error_log( 'MBN Auto Collision: inc/includes-auto-collision-template.php is missing from the theme; assets and form will not render.' );

	/**
	 * Minimal stand-in so the markup partials still render without the support
	 * file. Images resolve, the form does not.
	 *
	 * @return string
	 */
  function mbn_ac_assets_url() {
      return trailingslashit( get_theme_file_uri( 'page-templates/auto-collision/assets' ) );
  }
}

/**
 * Filters the phone number shown in the Auto Collision header.
 *
 * @param string $phone Display number.
 */
$mbn_ac_phone = (string) apply_filters( 'mbn_ac_phone', '480-480-2929' );

/**
 * Filters the footer legal links.
 *
 * @param array<string, string> $links Label => URL.
 */
$mbn_ac_legal_links = (array) apply_filters(
  'mbn_ac_legal_links',
  array(
	  'Privacy Policy' => home_url( '/privacy-policy/' ),
	  'Disclaimer'     => home_url( '/disclaimer/' ),
  )
);

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
<div class="ac-shell ac-shell--<?php echo esc_attr( $mbn_ac_variant ); ?>">

	<header class="ac-header">
		<a class="ac-header__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<img
				src="<?php echo esc_url( mbn_ac_assets_url() . 'logo.svg' ); ?>"
				alt="<?php esc_attr_e( 'Hastings &amp; Hastings, Discount Accident Lawyers', 'mbn-theme' ); ?>"
				width="321"
				height="50"
			>
		</a>
		<a class="ac-header__phone" href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $mbn_ac_phone ) ); ?>">
			<?php echo esc_html( $mbn_ac_phone ); ?>
		</a>
	</header>

	<main id="main" class="ac-main">
		<?php
		while ( have_posts() ) :
			the_post();

			/**
			 * Filters the partial that supplies the Auto Collision markup.
			 *
			 * @param string $path    Absolute path to the markup partial.
			 * @param int    $post_id Current page ID.
			 * @param string $variant 'lander' or 'thank-you'.
			 */
			$mbn_ac_content = (string) apply_filters(
              'mbn_ac_content_path',
              get_theme_file_path( 'thank-you' === $mbn_ac_variant ? 'page-templates/auto-collision/content-thank-you.php' : 'page-templates/auto-collision/content.php' ),
              get_the_ID(),
              $mbn_ac_variant
			);

          if ( is_readable( $mbn_ac_content ) ) {
              require $mbn_ac_content;
          }

		endwhile;
		?>
	</main>

	<footer class="ac-footer">
		<div class="ac-footer__legal">
			<p class="ac-footer__copyright">
				<?php
				printf(
                  /* translators: %s: current year. */
                  esc_html__( '%s Hastings &amp; Hastings, PC. All rights reserved.', 'mbn-theme' ),
                  esc_html( gmdate( 'Y' ) )
				);
				?>
			</p>
			<p class="ac-footer__links">
				<?php
				$mbn_ac_link_markup = array();

                foreach ( $mbn_ac_legal_links as $mbn_ac_label => $mbn_ac_url ) {
                  $mbn_ac_link_markup[] = sprintf(
                    '<a href="%s">%s</a>',
                    esc_url( $mbn_ac_url ),
                    esc_html( $mbn_ac_label )
                  );
                }

				echo wp_kses(
                  implode( ' | ', $mbn_ac_link_markup ),
                  array( 'a' => array( 'href' => array() ) )
				);
				?>
			</p>
			<?php if ( 'thank-you' !== $mbn_ac_variant ) : ?>
				<p class="ac-footer__terms">
					This tool provides a preliminary assessment based solely on the information you provide. It is not
					legal advice, and it does not guarantee any particular outcome, compensation, or that your case will
					be accepted. Every case is different, and past results do not predict future results. No
					attorney-client relationship is formed until a written agreement is signed with Hastings &amp;
					Hastings. By submitting, you consent to be contacted by Hastings &amp; Hastings by phone, text, and
					email regarding your inquiry; message and data rates may apply, and consent is not a condition of
					hiring us.
				</p>
			<?php endif; ?>
		</div>

		<?php if ( 'thank-you' !== $mbn_ac_variant ) : ?>
			<div class="ac-footer__badges">
				<img src="<?php echo esc_url( mbn_ac_assets_url() . 'badge-29-fee.svg' ); ?>" alt="<?php esc_attr_e( '29% fee — keep more of what you deserve', 'mbn-theme' ); ?>" width="100" height="100">
				<img src="<?php echo esc_url( mbn_ac_assets_url() . 'badge-discount-accident-lawyers.svg' ); ?>" alt="<?php esc_attr_e( 'Discount Accident Lawyers', 'mbn-theme' ); ?>" width="100" height="100">
				<img src="<?php echo esc_url( mbn_ac_assets_url() . 'badge-zero-upfront.svg' ); ?>" alt="<?php esc_attr_e( '$0 upfront and $0 out of pocket', 'mbn-theme' ); ?>" width="100" height="100">
			</div>
		<?php endif; ?>
	</footer>

</div>
<?php wp_footer(); ?>
</body>
</html>
