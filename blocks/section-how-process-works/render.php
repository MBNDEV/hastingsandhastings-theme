<?php
/**
 * Section: How Process Works - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$eyebrow_text     = $attributes['eyebrowText'] ?? 'WHAT HAPPENS NEXT? THREE EASY STEPS.';
$main_heading     = $attributes['mainHeading'] ?? 'How our process works.';
$description      = $attributes['description'] ?? '';
$steps            = $attributes['steps'] ?? array();
$show_cta         = $attributes['showCta'] ?? true;
$cta_logo_url     = $attributes['ctaLogoUrl'] ?? '';
$cta_heading      = $attributes['ctaHeading'] ?? 'Start Your Free Consultation';
$cta_description  = $attributes['ctaDescription'] ?? '';
$cta_button_text  = $attributes['ctaButtonText'] ?? 'Start your free consultation now!';
$cta_button_url   = $attributes['ctaButtonUrl'] ?? '#contact';
$cta_phone_label  = $attributes['ctaPhoneLabel'] ?? 'CALL TODAY';
$cta_phone_number = $attributes['ctaPhoneNumber'] ?? '(480) 480-2929';
$background_color = $attributes['backgroundColor'] ?? 'bg-white';

// Determine if background color is a hex code or Tailwind class
$is_custom_color = strpos( $background_color, '#' ) === 0;
$bg_class        = $is_custom_color ? '' : $background_color;
$bg_style        = $is_custom_color ? 'background-color: ' . esc_attr( $background_color ) . ';' : '';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'w-full py-16 md:py-20 lg:py-24 ' . esc_attr( $bg_class ),
	  'style' => $bg_style,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
			
			<!-- Left Column: Fixed Content -->
			<div class="lg:sticky lg:top-24 lg:self-start">
				<!-- Eyebrow -->
				<?php if ( ! empty( $eyebrow_text ) ) : ?>
					<p class="font-body text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-secondary mb-6">
						<?php echo esc_html( $eyebrow_text ); ?>
					</p>
				<?php endif; ?>
				
				<!-- Main Heading -->
				<?php if ( ! empty( $main_heading ) ) : ?>
					<h2 class="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-text-heading mb-8">
						<?php echo wp_kses_post( $main_heading ); ?>
					</h2>
				<?php endif; ?>
				
				<!-- Description -->
				<?php if ( ! empty( $description ) ) : ?>
					<p class="font-body text-base md:text-lg text-text-body leading-relaxed max-w-xl">
						<?php echo esc_html( $description ); ?>
					</p>
				<?php endif; ?>
			</div>

			<!-- Right Column: Timeline Cards -->
			<div class="relative">
				
				<!-- Timeline Line -->
				<div class="timeline-line"></div>

				<?php if ( ! empty( $steps ) ) : ?>
					<?php foreach ( $steps as $index => $step ) : ?>
						<!-- Step -->
						<div class="mb-8 md:mb-12">
							<div class="flex gap-6 md:gap-8">
								<!-- Timeline Dot -->
								<div class="flex-shrink-0 pt-2">
									<div class="timeline-dot"></div>
								</div>
								
								<!-- Content -->
								<div class="flex-1 bg-transparent pb-8">
									<?php if ( ! empty( $step['heading'] ) ) : ?>
										<h3 class="font-heading font-bold text-2xl md:text-3xl text-text-heading mb-4">
											<?php echo esc_html( $step['heading'] ); ?>
										</h3>
									<?php endif; ?>
									
									<?php if ( ! empty( $step['description'] ) ) : ?>
										<p class="font-body text-base md:text-lg text-text-body leading-relaxed">
											<?php echo esc_html( $step['description'] ); ?>
										</p>
									<?php endif; ?>
								</div>
							</div>
						</div>
					<?php endforeach; ?>
				<?php endif; ?>

				<?php if ( $show_cta ) : ?>
					<!-- CTA Card -->
					<div class="-mt-5">
						<div class="flex gap-6 md:gap-8">
							<!-- Timeline Dot -->
							<div class="flex-shrink-0 pt-10">
								<div class="timeline-dot"></div>
							</div>
							
							<!-- CTA Content -->
							<div class="flex-1">
								<div class="cta-card-gradient rounded-2xl border border-accent-blue p-8 md:px-8 md:py-6">
									
									<!-- Logo Icon -->
									<?php if ( ! empty( $cta_logo_url ) ) : ?>
										<div class="mb-6">
											<div class="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 p-3">
												<img src="<?php echo esc_url( $cta_logo_url ); ?>" alt="<?php esc_attr_e( 'Logo', 'mbn-theme' ); ?>" class="w-full h-full object-contain" />
											</div>
										</div>
									<?php endif; ?>

									<!-- CTA Heading -->
									<?php if ( ! empty( $cta_heading ) ) : ?>
										<h3 class="font-heading font-bold text-2xl text-white mb-4">
											<?php echo esc_html( $cta_heading ); ?>
										</h3>
									<?php endif; ?>
									
									<!-- CTA Description -->
									<?php if ( ! empty( $cta_description ) ) : ?>
										<p class="font-body text-base md:text-lg text-white/90 leading-relaxed mb-8">
											<?php echo esc_html( $cta_description ); ?>
										</p>
									<?php endif; ?>

									<!-- CTA Button -->
									<div class="flex flex-col items-center justify-center gap-4">
										<?php if ( ! empty( $cta_button_text ) ) : ?>
											<a href="<?php echo esc_url( $cta_button_url ); ?>" class="btn-cta w-full">
												<?php echo esc_html( $cta_button_text ); ?>
											</a>
										<?php endif; ?>
										
										<div class="flex items-center gap-2 text-white">
											<?php if ( ! empty( $cta_phone_label ) ) : ?>
												<span class="font-body font-semibold text-base xl:text-lg">
													<?php echo esc_html( $cta_phone_label ); ?>
												</span>
											<?php endif; ?>
											<?php if ( ! empty( $cta_phone_number ) ) : ?>
												<a 
													href="tel:<?php echo esc_attr( preg_replace( '/[^0-9]/', '', $cta_phone_number ) ); ?>" 
													class="font-body font-bold text-base xl:text-lg text-primary underline hover:text-accent-gold transition-colors"
												>
													<?php echo esc_html( $cta_phone_number ); ?>
												</a>
											<?php endif; ?>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>
				<?php endif; ?>

			</div>

		</div>

	</div>
</section>
