<?php
/**
 * Section: Client Testimonials - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

// Enqueue Swiper for mobile slider (WordPress standard approach)
wp_enqueue_style( 'swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', array(), '11.0.0' );
wp_enqueue_script( 'swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', array(), '11.0.0', true );

$eyebrow_text     = $attributes['eyebrowText'] ?? 'CLIENT EXPERIENCES';
$main_heading     = $attributes['mainHeading'] ?? 'Trusted by injury victims across Arizona';
$description      = $attributes['description'] ?? 'When people are dealing with the aftermath of an accident, trust matters. Our clients consistently speak to the care, clarity, and support they received throughout the process.';
$testimonials     = $attributes['testimonials'] ?? array();
$background_color = $attributes['backgroundColor'] ?? 'bg-white';

// Determine if background color is a hex code or Tailwind class
$is_custom_color = strpos( $background_color, '#' ) === 0;
$bg_class        = $is_custom_color ? '' : $background_color;
$bg_style        = $is_custom_color ? 'background-color: ' . esc_attr( $background_color ) . ';' : '';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'w-full pt-16 pb-4 sm:py-14 md:py-20 lg:py-24 ' . esc_attr( $bg_class ),
	  'style' => $bg_style,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="max-w-[1440px] mx-auto px-6 md:px-6 lg:px-12">
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
			
			<!-- Left Column: Fixed Content -->
			<div class="sticky-content max-w-full lg:max-w-lg">
				<!-- Eyebrow -->
				<?php if ( ! empty( $eyebrow_text ) ) : ?>
					<p class="font-body text-xs md:text-sm font-semibold uppercase tracking-[0.15em] text-secondary mb-6">
						<?php echo esc_html( $eyebrow_text ); ?>
					</p>
				<?php endif; ?>
				
				<!-- Main Heading -->
				<?php if ( ! empty( $main_heading ) ) : ?>
					<h2 class="font-heading font-semibold text-4xl md:text-5xl text-text-heading mb-8 md:leading-[60px]">
						<?php echo wp_kses_post( $main_heading ); ?>
					</h2>
				<?php endif; ?>
				
				<!-- Description -->
				<?php if ( ! empty( $description ) ) : ?>
					<p class="font-body text-base md:text-lg text-text-body leading-relaxed max-w-full lg:max-w-xl">
						<?php echo esc_html( $description ); ?>
					</p>
				<?php endif; ?>
			</div>

			<!-- Right Column: Stacking Testimonial Cards -->
			<div class="cards-container">
				
			<!-- Swiper Container for Mobile -->
			<div class="testimonials-swiper-container swiper lg:!hidden">
				<div class="swiper-wrapper">
					<?php if ( ! empty( $testimonials ) ) : ?>
						<?php foreach ( $testimonials as $index => $testimonial ) : ?>
							<div class="swiper-slide">
								<!-- Testimonial Card -->
								<div class="testimonial-card">
									<!-- Stars -->
									<?php
									$rating = isset( $testimonial['rating'] ) ? absint( $testimonial['rating'] ) : 5;
									$rating = max( 1, min( 5, $rating ) ); // Ensure rating is between 1-5
									?>
									<div class="stars">
										<?php for ( $i = 0; $i < $rating; $i++ ) : ?>
											<img src="<?php echo esc_url( get_theme_file_uri( '/assets/icons/icn-single-star-no-shadow.svg' ) ); ?>" alt="<?php esc_attr_e( 'Star', 'mbn-theme' ); ?>" class="star-icon">
										<?php endfor; ?>
									</div>

									<!-- Testimonial Text -->
									<?php if ( ! empty( $testimonial['quote'] ) ) : ?>
										<p class="font-body text-base md:text-lg text-text-body leading-relaxed mb-8">
											<?php echo esc_html( $testimonial['quote'] ); ?>
										</p>
									<?php endif; ?>

									<?php if ( ! empty( $testimonial['fullText'] ) ) : ?>
										<p class="font-body text-base md:text-lg text-text-body leading-relaxed mb-8">
											<?php echo esc_html( $testimonial['fullText'] ); ?>
										</p>
									<?php endif; ?>

									<!-- Client Info -->
									<div class="border-t border-gray-200 pt-6">
										<?php if ( ! empty( $testimonial['authorName'] ) ) : ?>
											<p class="font-body font-bold text-base text-text-heading mb-1">
												<?php echo esc_html( $testimonial['authorName'] ); ?>
											</p>
										<?php endif; ?>
										
										<?php if ( ! empty( $testimonial['authorTitle'] ) ) : ?>
											<p class="font-body text-sm text-text-body">
												<?php echo esc_html( $testimonial['authorTitle'] ); ?>
											</p>
										<?php endif; ?>
									</div>
								</div>
							</div>
						<?php endforeach; ?>
					<?php endif; ?>
				</div>
				<!-- Pagination Dots -->
				<div class="swiper-pagination testimonials-pagination"></div>
			</div>

			<!-- Desktop Stacking Cards -->
			<div class="testimonials-desktop-cards hidden lg:block">
				<?php if ( ! empty( $testimonials ) ) : ?>
					<?php
					$total_testimonials = count( $testimonials );
					foreach ( $testimonials as $index => $testimonial ) :
						$is_last  = ( $total_testimonials - 1 === $index );
						$mb_class = $is_last ? '' : 'mb-8';
                      ?>
						<!-- Testimonial Card -->
						<div class="testimonial-card <?php echo esc_attr( $mb_class ); ?>">
						<!-- Stars -->
						<?php
						$rating = isset( $testimonial['rating'] ) ? absint( $testimonial['rating'] ) : 5;
						$rating = max( 1, min( 5, $rating ) ); // Ensure rating is between 1-5
						?>
						<div class="stars">
							<?php for ( $i = 0; $i < $rating; $i++ ) : ?>
								<img src="<?php echo esc_url( get_theme_file_uri( '/assets/icons/icn-single-star-no-shadow.svg' ) ); ?>" alt="<?php esc_attr_e( 'Star', 'mbn-theme' ); ?>" class="star-icon">
							<?php endfor; ?>
							</div>

							<!-- Testimonial Text -->
							<?php if ( ! empty( $testimonial['quote'] ) ) : ?>
								<p class="font-body text-base md:text-lg text-text-body leading-relaxed mb-8">
									<?php echo esc_html( $testimonial['quote'] ); ?>
								</p>
							<?php endif; ?>

							<?php if ( ! empty( $testimonial['fullText'] ) ) : ?>
								<p class="font-body text-base md:text-lg text-text-body leading-relaxed mb-8">
									<?php echo esc_html( $testimonial['fullText'] ); ?>
								</p>
							<?php endif; ?>

							<!-- Client Info -->
							<div class="border-t border-gray-200 pt-6">
								<?php if ( ! empty( $testimonial['authorName'] ) ) : ?>
									<p class="font-body font-bold text-base text-text-heading mb-1">
										<?php echo esc_html( $testimonial['authorName'] ); ?>
									</p>
								<?php endif; ?>
								
								<?php if ( ! empty( $testimonial['authorTitle'] ) ) : ?>
									<p class="font-body text-sm text-text-body">
										<?php echo esc_html( $testimonial['authorTitle'] ); ?>
									</p>
								<?php endif; ?>
							</div>
						</div>
					<?php endforeach; ?>
				<?php endif; ?>
			</div>
		</div>

	</div>
</section>
