<?php
/**
 * Hero Section Block - Dynamic Rendering
 *
 * @package CustomTheme
 *
 * @param array    $attributes Block attributes
 * @param string   $content Block content
 * @param WP_Block $block Block instance
 */

$eyebrow_text           = $attributes['eyebrowText'] ?? 'Arizona\'s Discount Accident Lawyers';
$main_heading           = $attributes['mainHeading'] ?? 'Personal injury attorneys trusted by accident victims for nearly 50 years';
$subheading             = $attributes['subheading'] ?? '';
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
$background_image_url   = $attributes['backgroundImageUrl'] ?? '';
$background_image_id    = $attributes['backgroundImageId'] ?? 0;
$background_color       = $attributes['backgroundColor'] ?? 'bg-transparent';
$padding_top            = $attributes['paddingTop'] ?? 'pt-48';
$padding_bottom         = $attributes['paddingBottom'] ?? 'pb-48';
$content_justify        = $attributes['contentJustify'] ?? 'justify-center';
$content_vertical_align = $attributes['contentVerticalAlign'] ?? 'items-center';
$text_max_width         = $attributes['textMaxWidth'] ?? 'max-w-4xl';

// Determine if background color is a hex code or Tailwind class
$is_custom_color = strpos( $background_color, '#' ) === 0;
$bg_class        = $is_custom_color ? '' : $background_color;
$bg_style        = $is_custom_color ? 'background-color: ' . esc_attr( $background_color ) . ';' : '';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'hero-video-container ' . esc_attr( $bg_class ),
	  'style' => $bg_style,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	
	<!-- Video Background -->
	<?php if ( $video_mp4_url || $video_webm_url ) : ?>
		<video 
			class="hero-video" 
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
		<div class="hero-overlay" style="background-image: url('<?php echo esc_url( $overlay_image_url ); ?>');"></div>
	<?php endif; ?>

	<!-- Background Image -->
	<?php if ( $background_image_url ) : ?>
		<?php
		$bg_image_alt_text = ! empty( $background_image_id ) ? get_post_meta( $background_image_id, '_wp_attachment_image_alt', true ) : '';
		if ( empty( $bg_image_alt_text ) ) {
			$bg_image_alt_text = __( 'Background', 'mbn-theme' );
		}
		?>
		<div class="hero-background-image" style="background-image: url('<?php echo esc_url( $background_image_url ); ?>');"></div>
	<?php endif; ?>

	<!-- Hero Content -->
	<div class="hero-content flex <?php echo esc_attr( $content_vertical_align ); ?> px-6 md:px-8 lg:px-12">
		<div class="max-w-[1440px] w-full mx-auto pt-36 pb-20 md:<?php echo esc_attr( $padding_top ); ?> md:<?php echo esc_attr( $padding_bottom ); ?>">
			
			<!-- Main Content Container -->
			<div class="flex flex-col items-center gap-8 md:gap-10">
				
				<!-- Heading Group with Badge -->
				<div class="relative flex flex-col lg:flex-row md:<?php echo esc_attr( $content_justify ); ?> items-center lg:items-start justify-between gap-6 lg:gap-12 w-full">
					
					<!-- Text Content Group -->
					<div class="flex flex-col gap-4 md:gap-6 flex-1 <?php echo esc_attr( $text_max_width ); ?>">
						
						<!-- Eyebrow Text -->
						<?php if ( $eyebrow_text ) : ?>
							<p class="font-body text-sm md:text-base xl:text-lg font-semibold uppercase tracking-[0.15em] text-accent-gold">
								<?php echo esc_html( $eyebrow_text ); ?>
							</p>
						<?php endif; ?>
						
						<!-- Main Heading -->
						<h1 class="font-heading font-semibold text-4xl md:text-5xl xl:text-6xl text-white xl:leading-[72px]">
							<?php echo wp_kses_post( $main_heading ); ?>
						</h1>

					<!-- Subheading -->
					<?php if ( $subheading ) : ?>
						<p class="font-body text-gray-light text-lg md:text-xl leading-relaxed mt-2 pr-5">
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
					<div class="hero-badge flex-shrink-0 lg:self-end px-20">
						<img 
							src="<?php echo esc_url( $badge_image_url ); ?>" 
							alt="<?php echo esc_attr( $badge_alt_text ); ?>"
								class="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64"
							/>
						</div>
					<?php endif; ?>
				</div>

				<!-- CTA Bar -->
				<?php if ( $show_cta_bar ) : ?>
					<div class="cta-bar border border-accent-blue w-full mt-8 rounded-3xl px-6 py-6 xl:px-12">
						<div class="flex flex-col lg:flex-row items-center justify-between gap-6">
							
							<!-- Left Side: Value Propositions -->
							<div class="flex flex-col sm:flex-row items-center w-full lg:w-8/12 xl:w-9/12 gap-6 md:gap-8 xl:gap-16 flex-1 justify-around lg:justify-start">
								
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
							<div class="flex flex-col items-center justify-center w-full lg:w-4/12 xl:w-3/12 gap-4">
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
