<?php
/**
 * Mini-Hero Section Block - Dynamic Rendering
 *
 * @package CustomTheme
 *
 * @param array    $attributes Block attributes
 * @param string   $content Block content
 * @param WP_Block $block Block instance
 */

$eyebrow_text           = $attributes['eyebrowText'] ?? 'GET STARTED TODAY';
$main_heading           = $attributes['mainHeading'] ?? 'Talk to a Phoenix accident lawyer. Keep more with our 29% fee';
$subheading             = $attributes['subheading'] ?? 'If you\'ve been injured in an accident, Hastings & Hastings is ready to help you understand your options and take the next step.';
$badge_image_url        = $attributes['badgeImageUrl'] ?? '';
$badge_image_id         = $attributes['badgeImageId'] ?? 0;
$video_mp4_url          = $attributes['videoMp4Url'] ?? '';
$video_webm_url         = $attributes['videoWebmUrl'] ?? '';
$poster_image_url       = $attributes['posterImageUrl'] ?? '';
$overlay_image_url      = $attributes['overlayImageUrl'] ?? '';
$show_cta_bar           = $attributes['showCtaBar'] ?? true;
$cta_button_text        = $attributes['ctaButtonText'] ?? 'REQUEST A FREE CONSULTATION';
$cta_button_url         = $attributes['ctaButtonUrl'] ?? '#contact';
$phone_number           = $attributes['phoneNumber'] ?? '(480) 480-2929';
$phone_number_url       = $attributes['phoneNumberUrl'] ?? 'tel:4804802929';
$settlement_fees_number = $attributes['settlementFeesNumber'] ?? '29';
$settlement_fees_label  = $attributes['settlementFeesLabel'] ?? 'Settlement Fees';
$out_of_pocket_number   = $attributes['outOfPocketNumber'] ?? '$0';
$out_of_pocket_label    = $attributes['outOfPocketLabel'] ?? 'Out-of-Pocket';
$fee_until_win_number   = $attributes['feeUntilWinNumber'] ?? 'NO';
$fee_until_win_label    = $attributes['feeUntilWinLabel'] ?? 'Fee Until We Win';
$background_color       = $attributes['backgroundColor'] ?? 'bg-white';

// Determine if background color is a hex code or Tailwind class
$is_custom_color = strpos( $background_color, '#' ) === 0;
$bg_class        = $is_custom_color ? '' : $background_color;
$bg_style        = $is_custom_color ? 'background-color: ' . esc_attr( $background_color ) . ';' : '';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'mini-hero-video-container ' . esc_attr( $bg_class ),
	  'style' => $bg_style,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<!-- Hero Content -->
	<div class="relative  mini-hero-content flex items-center justify-center px-4 md:px-6 lg:px-12 py-16 md:py-20 ">
    
		<!-- Main Content Container -->
		<div class="relative max-w-[1440px] w-full mx-auto py-8 md:py-16 lg:py-20 px-6 md:px-10 lg:px-14 rounded-3xl overflow-hidden">
      <!-- Video Background -->
      <?php if ( $video_mp4_url || $video_webm_url ) : ?>
        <video 
          class="mini-hero-video" 
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
      <?php endif; ?>

      <!-- Overlay Image -->
      <?php if ( $overlay_image_url ) : ?>
        <div class="mini-hero-overlay" style="background-image: url('<?php echo esc_url( $overlay_image_url ); ?>');"></div>
      <?php endif; ?> 
			<!-- Main Content Container -->
			<div class="relative z-20 flex flex-col items-center gap-8 md:gap-10">
				
				<!-- Heading Group with Badge -->
				<div class="relative flex flex-col lg:flex-row md:justify-center items-center lg:items-end justify-between gap-6 lg:gap-10 w-full">
					
					<!-- Text Content Group -->
					<div class="flex flex-col gap-4 md:gap-6 flex-1 max-w-5xl">
						
						<!-- Eyebrow Text -->
						<?php if ( $eyebrow_text ) : ?>
							<p class="font-body text-sm md:text-base xl:text-lg font-semibold uppercase tracking-[0.15em] text-accent-gold">
								<?php echo esc_html( $eyebrow_text ); ?>
							</p>
						<?php endif; ?>
						
						<!-- Main Heading -->
						<h2 class="font-heading font-semibold text-4xl md:text-5xl text-white md:leading-[60px]">
              <?php echo wp_kses_post( $main_heading ); ?>
            </h2>

					<!-- Subheading -->
					<?php if ( $subheading ) : ?>
						<p class="font-body text-gray-light text-lg md:text-xl leading-relaxed mt-2 pr-5 max-w-3xl">
							<?php echo wp_kses_post( $subheading ); ?>
							</p>
						<?php endif; ?>
					</div>

					<!-- Badge -->
					<?php if ( $badge_image_url ) : ?>
						<?php
						$badge_alt_text = ! empty( $badge_image_id ) ? get_post_meta( $badge_image_id, '_wp_attachment_image_alt', true ) : '';
						if ( empty( $badge_alt_text ) ) {
							$badge_alt_text = __( 'Badge', 'mbn-theme' );
						}
						?>
					<div class="mini-hero-badge flex-shrink-0 lg:self-end px-10">
						<img 
							src="<?php echo esc_url( $badge_image_url ); ?>" 
							alt="<?php echo esc_attr( $badge_alt_text ); ?>"
								class="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 -mb-10 md:-mb-20"
							/>
						</div>
					<?php endif; ?>
				</div>

				<!-- CTA Bar -->
				<?php if ( $show_cta_bar ) : ?>
					<div class="cta-bar border border-accent-blue w-full rounded-3xl px-4 md:px-6 py-6 xl:px-12">
						<div class="flex flex-col lg:flex-row items-center justify-between gap-12">
							
							<!-- Left Side: Value Propositions -->
							<div class="flex flex-col sm:flex-row items-center w-full lg:w-8/12 gap-6 md:gap-8 xl:gap-12 flex-1 justify-around lg:justify-start">
								
								<!-- Settlement Fees -->
								<div class="flex flex-row lg:flex-col xl:flex-row items-center gap-2">
									<span class="font-heading font-bold text-5xl text-secondary leading-none">
										<?php echo esc_html( $settlement_fees_number ); ?><sup class="text-2xl sm:text-3xl -top-4 sm:-top-3">%</sup>
									</span>
									<div class="flex flex-col lg:flex-row xl:flex-col lg:items-center xl:items-start">
										<?php
										$label_lines = explode( ' ', $settlement_fees_label );
										foreach ( $label_lines as $line ) :
                                          ?>
											<span class="font-heading font-bold md:text-lg lg:text-xl text-white leading-[20px]">
												<?php echo esc_html( $line ); ?>
											</span>
										<?php endforeach; ?>
									</div>
								</div>

								<!-- Out-of-Pocket -->
								<div class="flex flex-row lg:flex-col xl:flex-row items-center gap-2">
									<span class="font-heading font-bold text-5xl text-secondary leading-none">
										<?php
										if ( strpos( $out_of_pocket_number, '$' ) === 0 ) {
											echo '<sup class="text-2xl sm:text-3xl -top-4 sm:-top-3">$</sup>' . esc_html( substr( $out_of_pocket_number, 1 ) );
										} else {
											echo esc_html( $out_of_pocket_number );
										}
										?>
									</span>
									<div class="flex flex-col lg:flex-row xl:flex-col lg:items-center xl:items-start">
										<span class="font-heading font-bold md:text-lg lg:text-xl text-white leading-[20px] text-center xl:text-left max-w-none xl:max-w-[100px]">
											<?php echo esc_html( $out_of_pocket_label ); ?>
										</span>
									</div>
								</div>

								<!-- Fee Until We Win -->
								<div class="flex flex-row lg:flex-col xl:flex-row items-center gap-2">
									<span class="font-heading font-bold text-5xl text-secondary leading-none">
										<?php echo esc_html( $fee_until_win_number ); ?>
									</span>
									<div class="flex flex-col lg:flex-row xl:flex-col lg:items-center xl:items-start">
										<span class="font-heading font-bold md:text-lg lg:text-xl text-white leading-[20px] text-center xl:text-left max-w-none xl:max-w-[100px]">
											<?php echo esc_html( $fee_until_win_label ); ?>
										</span>
									</div>
								</div>
							</div>

							<!-- Right Side: CTA Buttons -->
							<div class="flex flex-col items-center justify-center w-full lg:w-4/12 gap-4">
								<a href="<?php echo esc_url( $cta_button_url ); ?>" class="btn-cta">
									<?php echo esc_html( $cta_button_text ); ?>
								</a>
								<div class="flex items-center gap-2 text-white">
									<span class="font-body font-semibold text-base xl:text-lg">
										<?php esc_html_e( 'CALL TODAY', 'mbn-theme' ); ?>
									</span>
									<a href="<?php echo esc_url( $phone_number_url ); ?>" class="font-body font-bold text-base xl:text-lg text-primary underline hover:text-accent-gold transition-colors">
										<?php echo esc_html( $phone_number ); ?>
									</a>
								</div>
							</div>

						</div>
					</div>
				<?php endif; ?>

			</div>

		</div>
	</div>

</section>
