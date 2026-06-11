<?php
/**
 * Section: 3 Column Badge with CTA Bar - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$eyebrow_text                    = $attributes['eyebrowText'] ?? 'MORE OF YOUR SETTLEMENT STAYS WITH YOU';
$main_heading                    = $attributes['mainHeading'] ?? 'A more affordable way to get trusted legal help';
$sub_heading                     = $attributes['subHeading'] ?? '';
$main_content                    = $attributes['mainContent'] ?? '';
$background_color                = $attributes['backgroundColor'] ?? 'bg-white';
$background_image                = $attributes['backgroundImageUrl'] ?? '';
$video_mp4_url                   = $attributes['videoMp4Url'] ?? '';
$video_webm_url                  = $attributes['videoWebmUrl'] ?? '';
$poster_image_url                = $attributes['posterImageUrl'] ?? '';
$overlay_image_url               = $attributes['overlayImageUrl'] ?? '';
$show_overlay                    = $attributes['showOverlay'] ?? true;
$overlay_fallback_style          = $attributes['overlayFallbackStyle'] ?? 'gradient';
$badges                          = $attributes['badges'] ?? array();
$badge_text_color                = $attributes['badgeTextColor'] ?? 'text-gray-200';
$show_cta_bar                    = $attributes['showCtaBar'] ?? true;
$cta_heading                     = $attributes['ctaHeading'] ?? 'Get trusted legal help with a lower fee';
$cta_text                        = $attributes['ctaText'] ?? '';
$cta_button_text                 = $attributes['ctaButtonText'] ?? 'REQUEST A FREE CONSULTATION';
$cta_button_url                  = $attributes['ctaButtonUrl'] ?? '#';
$phone_number                    = $attributes['phoneNumber'] ?? '(480) 480-2929';
$phone_number_url                = $attributes['phoneNumberUrl'] ?? 'tel:4804802929';
$overlay_style                   = '';
$allowed_overlay_fallback_styles = array( 'gradient', 'transparent' );
$allowed_badge_text_colors       = array( 'text-gray-200', 'text-body' );

if ( ! in_array( $overlay_fallback_style, $allowed_overlay_fallback_styles, true ) ) {
	$overlay_fallback_style = 'gradient';
}

if ( ! in_array( $badge_text_color, $allowed_badge_text_colors, true ) ) {
	$badge_text_color = 'text-gray-200';
}

if ( $show_overlay ) {
  if ( $overlay_image_url ) {
	  $overlay_style = 'background-image: url(\'' . esc_url( $overlay_image_url ) . '\'); background-size: cover; background-position: center;';
  } elseif ( 'transparent' === $overlay_fallback_style ) {
	  $overlay_style = 'background: transparent;';
  } else {
	  $overlay_style = 'background: linear-gradient(180deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.40) 100%);';
  }
}

$overlay_inline_style = $overlay_style . ' pointer-events: none;';
$is_custom_color      = strpos( $background_color, '#' ) === 0;
$bg_class             = $is_custom_color ? '' : $background_color;
$bg_style             = $is_custom_color ? 'background-color: ' . esc_attr( $background_color ) . ';' : '';
$wrapper_attributes   = get_block_wrapper_attributes(
  array(
	  'class' => 'relative overflow-hidden ' . esc_attr( $bg_class ),
	  'style' => $bg_style,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	
	<!-- Video Background -->
	<?php if ( $video_mp4_url || $video_webm_url ) : ?>
		<video 
			class="absolute inset-0 w-full h-full object-cover" 
			autoplay 
			muted 
			loop 
			playsinline 
			<?php
			if ( $poster_image_url ) :
              ?>
				poster="<?php echo esc_url( $poster_image_url ); ?>"<?php endif; ?>
		>
			<?php if ( $video_mp4_url ) : ?>
				<source src="<?php echo esc_url( $video_mp4_url ); ?>" type="video/mp4">
			<?php endif; ?>
			<?php if ( $video_webm_url ) : ?>
				<source src="<?php echo esc_url( $video_webm_url ); ?>" type="video/webm">
			<?php endif; ?>
			<?php esc_html_e( 'Your browser does not support the video tag.', 'mbn-theme' ); ?>
		</video>
	<?php elseif ( $background_image ) : ?>
		<div class="absolute inset-0 w-full h-full" style="background-image: url('<?php echo esc_url( $background_image ); ?>'); background-size: cover; background-position: center;"></div>
	<?php endif; ?>

	<!-- Overlay Image -->
	<?php if ( $show_overlay ) : ?>
		<div class="absolute inset-0 w-full h-full" style="<?php echo safecss_filter_attr( $overlay_inline_style ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>"></div>
	<?php endif; ?>

	<div class="relative py-12 md:py-16 lg:py-20">
		<div class="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
			
			<!-- Heading Section -->
			<div class="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
				<?php if ( ! empty( $eyebrow_text ) ) : ?>
					<p class="font-body text-sm md:text-base font-semibold uppercase tracking-[0.15em] text-accent-gold mb-4">
						<?php echo esc_html( $eyebrow_text ); ?>
					</p>
				<?php endif; ?>
				
				<?php if ( ! empty( $main_heading ) ) : ?>
					<h2 class="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-white !leading-normal">
					<?php echo wp_kses_post( $main_heading ); ?>
					</h2>
				<?php endif; ?>

				<?php if ( ! empty( $sub_heading ) ) : ?>
					<h3 class="font-heading text-heading text-center text-[28px] font-semibold leading-10 mt-4 max-w-3xl mx-auto">
						<?php echo wp_kses_post( $sub_heading ); ?>
					</h3>
				<?php endif; ?>

				<?php if ( ! empty( $main_content ) ) : ?>
					<p class="font-body text-body text-center text-lg font-normal leading-7 mt-3 max-w-3xl mx-auto">
						<?php echo wp_kses_post( $main_content ); ?>
					</p>
				<?php endif; ?>
			</div>

			<!-- 3 Column Badges -->
			<?php if ( ! empty( $badges ) ) : ?>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-20 mb-12 md:mb-16">
					<?php foreach ( $badges as $badge ) : ?>
						<div class="flex flex-col items-center text-center gap-6 section-3col-badge-item">
							<?php if ( ! empty( $badge['imageUrl'] ) ) : ?>
								<?php
								$alt_text = ! empty( $badge['imageId'] ) ? get_post_meta( $badge['imageId'], '_wp_attachment_image_alt', true ) : '';
								?>
							<img src="<?php echo esc_url( $badge['imageUrl'] ); ?>" alt="<?php echo esc_attr( $alt_text ); ?>" class="w-40 h-40 lg:w-full lg:h-full lg:max-w-[215px] lg:max-h-[215px] object-contain" />
							<?php endif; ?>
							<?php if ( ! empty( $badge['text'] ) ) : ?>
								<p class="font-body <?php echo esc_attr( $badge_text_color ); ?> text-sm md:text-base leading-relaxed">
									<?php echo esc_html( $badge['text'] ); ?>
								</p>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<!-- CTA Bar -->
			<?php if ( $show_cta_bar ) : ?>
				<div class="rounded-[32px] px-6 py-8 md:px-10 md:py-10 lg:px-12 cta-bar border border-accent-blue w-full">
					<div class="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
						
						<!-- Left: Text Content -->
						<div class="flex-1 text-center lg:text-left max-w-2xl">
							<?php if ( ! empty( $cta_heading ) ) : ?>
								<h3 class="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
								<?php echo wp_kses_post( $cta_heading ); ?>
							</h3>
						<?php endif; ?>
						<?php if ( ! empty( $cta_text ) ) : ?>
							<p class="font-body text-gray-200 text-base md:text-lg leading-relaxed">
								<?php echo wp_kses_post( $cta_text ); ?>
								</p>
							<?php endif; ?>
						</div>
						
						<!-- Right: Buttons -->
						<div class="flex flex-col items-center gap-4">
							<a href="<?php echo esc_url( $cta_button_url ); ?>" class="btn-cta">
								<?php echo esc_html( $cta_button_text ); ?>
							</a>
							<a href="<?php echo esc_url( $phone_number_url ); ?>" class="font-body font-bold text-sm transition-colors whitespace-nowrap">
								<span class="text-white no-underline"><?php esc_html_e( 'CALL TODAY', 'mbn-theme' ); ?></span> 
				<span class="text-primary underline"><?php echo esc_html( $phone_number ); ?></span>
							</a>
						</div>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
