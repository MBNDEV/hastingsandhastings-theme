<?php
/**
 * Section: Testimonials Feedback CTA - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$cta_title           = $attributes['title'] ?? 'We value your feedback';
$body                = $attributes['body'] ?? '';
$note                = $attributes['note'] ?? '';
$yelp_logo_url       = $attributes['yelpLogoUrl'] ?? '';
$yelp_button_label   = $attributes['yelpButtonLabel'] ?? 'Click Here to Review Us on Yelp';
$yelp_button_url     = $attributes['yelpButtonUrl'] ?? '#';
$google_logo_url     = $attributes['googleLogoUrl'] ?? '';
$google_button_label = $attributes['googleButtonLabel'] ?? 'Click Here to Review Us on Google';
$google_button_url   = $attributes['googleButtonUrl'] ?? '#';

$block_assets_uri = get_theme_file_uri( '/build/blocks/section-testimonials-feedback-cta/assets/images' );

$yelp_logo   = ! empty( $yelp_logo_url ) ? $yelp_logo_url : $block_assets_uri . '/yelp-logo.png';
$google_logo = ! empty( $google_logo_url ) ? $google_logo_url : $block_assets_uri . '/google-logo.png';

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'tfcta' ) );
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="tfcta__container">
		<div class="tfcta__card">

			<div class="tfcta__text">
				<h2 class="tfcta__title"><?php echo wp_kses_post( $cta_title ); ?></h2>
				<?php if ( ! empty( $body ) ) : ?>
					<p class="tfcta__body"><?php echo wp_kses_post( $body ); ?></p>
				<?php endif; ?>
				<?php if ( ! empty( $note ) ) : ?>
					<p class="tfcta__note"><?php echo wp_kses_post( $note ); ?></p>
				<?php endif; ?>
			</div>

			<div class="tfcta__platforms">
				<div class="tfcta__platform">
					<figure class="tfcta__logo">
						<img src="<?php echo esc_url( $yelp_logo ); ?>" alt="Yelp">
					</figure>
					<a href="<?php echo esc_url( $yelp_button_url ); ?>" class="tfcta__btn btn-cta">
						<?php echo esc_html( $yelp_button_label ); ?>
					</a>
				</div>
				<div class="tfcta__platform tfcta__platform--divider">
					<figure class="tfcta__logo">
						<img src="<?php echo esc_url( $google_logo ); ?>" alt="Google">
					</figure>
					<a href="<?php echo esc_url( $google_button_url ); ?>" class="tfcta__btn btn-cta">
						<?php echo esc_html( $google_button_label ); ?>
					</a>
				</div>
			</div>

		</div>
	</div>
</section>
