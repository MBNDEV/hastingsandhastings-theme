<?php
/**
 * Section: Testimonial Badges - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$testimonials      = $attributes['testimonials'] ?? array();
$badges            = $attributes['badges'] ?? array();
$testimonial_style = $attributes['testimonialStyle'] ?? 'classic';
$background_layout = $attributes['backgroundLayout'] ?? 'full';

$wrapper_class = 'w-full overflow-hidden';
$inner_class   = 'max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12';

if ( 'full' === $background_layout ) {
	$wrapper_class .= ' testimonials-section-bg py-12 md:py-16 lg:py-20';
}

if ( 'contained' === $background_layout ) {
	$inner_class    = 'max-w-[1440px] mx-auto testimonials-section-bg p-6 md:p-10 lg:p-5 rounded-2xl';
	$wrapper_class .= ' pt-12 md:pt-20 lg:pt-32';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $wrapper_class ) );

// Generate unique ID for this block instance
$slider_id = 'testimonials-slider-' . wp_unique_id();
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="<?php echo esc_attr( $inner_class ); ?>">
		
		<div class="flex flex-col lg:flex-row gap-8 lg:gap-16">
			
			<!-- Left Column: Testimonials Slider -->
			<div class="relative lg:w-[60%] flex-shrink-0">
				
				<?php if ( ! empty( $testimonials ) ) : ?>
					<div class="swiper testimonials-slider <?php echo 'classic' === $testimonial_style ? 'border-l-8 border-secondary' : 'testimonial-detailed'; ?>" id="<?php echo esc_attr( $slider_id ); ?>">
						<div class="swiper-wrapper">
							
							<?php foreach ( $testimonials as $testimonial ) : ?>
								<div class="swiper-slide">
									<div class="flex flex-col gap-6">

										<!-- Star Rating -->
										<?php if ( ! empty( $testimonial['starRating'] ) ) : ?>
											<?php $star_count = intval( $testimonial['starRating'] ); ?>
											<div class="flex gap-1">
												<?php for ( $i = 0; $i < $star_count; $i++ ) : ?>
												<img src="<?php echo esc_url( get_theme_file_uri( '/assets/icons/icn-single-star.svg' ) ); ?>" alt="" class="star-icon" />
												<?php endfor; ?>
											</div>
										<?php endif; ?>

										<?php if ( 'detailed' === $testimonial_style ) : ?>

											<!-- Testimonial Quote (Detailed) -->
											<?php if ( ! empty( $testimonial['content'] ) ) : ?>
												<blockquote class="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white !leading-tight">
													<?php echo wp_kses_post( $testimonial['content'] ); ?>
												</blockquote>
											<?php endif; ?>

											<!-- Testimonial Description (Detailed only) -->
											<?php if ( ! empty( $testimonial['description'] ) ) : ?>
												<p class="font-body text-base md:text-lg text-primary-300 !leading-relaxed">
													<?php echo wp_kses_post( $testimonial['description'] ); ?>
												</p>
											<?php endif; ?>

											<!-- Author (Detailed) -->
											<?php if ( ! empty( $testimonial['author'] ) ) : ?>
												<p class="font-body text-sm md:text-base text-secondary font-semibold">
													<?php echo esc_html( $testimonial['author'] ); ?>
												</p>
											<?php endif; ?>

										<?php else : ?>

											<!-- Testimonial Quote (Classic) -->
											<?php if ( ! empty( $testimonial['content'] ) ) : ?>
												<blockquote class="font-heading text-2xl md:text-3xl lg:text-4xl font-normal text-white leading-relaxed">
													<?php echo wp_kses_post( $testimonial['content'] ); ?>
												</blockquote>
											<?php endif; ?>

											<!-- Author (Classic) -->
											<?php if ( ! empty( $testimonial['author'] ) ) : ?>
												<p class="font-body text-sm md:text-base text-secondary font-medium">
													<?php echo esc_html( $testimonial['author'] ); ?>
												</p>
											<?php endif; ?>

										<?php endif; ?>

									</div>
								</div>
							<?php endforeach; ?>
							
						</div>
					</div>
				<?php endif; ?>
				
			</div>

			<!-- Right Column: Badges/Stats -->
			<div class="flex flex-col justify-center gap-8 md:gap-10 lg:gap-12 lg:w-[40%] flex-shrink-0">
				
				<?php if ( ! empty( $badges ) ) : ?>
					<?php foreach ( $badges as $badge ) : ?>
						<div class="flex items-center gap-4 md:gap-6">
							
							<!-- Icon -->
							<?php if ( ! empty( $badge['iconUrl'] ) ) : ?>
								<?php
								$alt_text = ! empty( $badge['iconId'] ) ? get_post_meta( $badge['iconId'], '_wp_attachment_image_alt', true ) : '';
								?>
								<div class="badge-icon flex-shrink-0">
									<img src="<?php echo esc_url( $badge['iconUrl'] ); ?>" alt="<?php echo esc_attr( $alt_text ); ?>" class="w-full h-full" />
								</div>
							<?php endif; ?>
							
							<div class="flex flex-col">
								<!-- Primary Text -->
								<?php if ( ! empty( $badge['primaryText'] ) ) : ?>
									<p class="font-heading text-lg md:text-xl font-bold text-white leading-tight">
										<?php echo esc_html( $badge['primaryText'] ); ?>
									</p>
								<?php endif; ?>
								
								<!-- Secondary Text -->
								<?php if ( ! empty( $badge['secondaryText'] ) ) : ?>
									<p class="font-heading text-lg md:text-xl font-bold text-secondary">
										<?php echo esc_html( $badge['secondaryText'] ); ?>
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

<?php if ( ! empty( $testimonials ) ) : ?>
	<!-- Swiper JS (only load once) -->
	<script>
		if (typeof Swiper === 'undefined') {
			const swiperScript = document.createElement('script');
			swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
			swiperScript.onload = function() {
				initTestimonialsSlider();
			};
			document.head.appendChild(swiperScript);

			const swiperCSS = document.createElement('link');
			swiperCSS.rel = 'stylesheet';
			swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
			document.head.appendChild(swiperCSS);
		} else {
			initTestimonialsSlider();
		}

		function initTestimonialsSlider() {
			const sliders = document.querySelectorAll('.testimonials-slider');
			sliders.forEach(function(slider) {
				if (!slider.swiper) {
					new Swiper(slider, {
						slidesPerView: 1,
						spaceBetween: 30,
						loop: <?php echo count( $testimonials ) > 1 ? 'true' : 'false'; ?>,
						autoplay: {
							delay: 2000,
							disableOnInteraction: false,
						},
					});
				}
			});
		}
	</script>
<?php endif; ?>
