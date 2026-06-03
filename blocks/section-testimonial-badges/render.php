<?php
/**
 * Section: Testimonial Badges - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$testimonials = $attributes['testimonials'] ?? array();
$badges       = $attributes['badges'] ?? array();

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'testimonials-section-bg w-full py-12 md:py-16 lg:py-20 overflow-hidden',
  )
);

// Generate unique ID for this block instance
$slider_id = 'testimonials-slider-' . wp_unique_id();
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
		
		<div class="flex flex-col lg:flex-row gap-8 lg:gap-16">
			
			<!-- Left Column: Testimonials Slider -->
			<div class="relative lg:w-[60%] flex-shrink-0">
				
				<?php if ( ! empty( $testimonials ) ) : ?>
					<div class="swiper testimonials-slider border-l-8 border-secondary" id="<?php echo esc_attr( $slider_id ); ?>">
						<div class="swiper-wrapper">
							
							<?php foreach ( $testimonials as $testimonial ) : ?>
								<div class="swiper-slide">
									<div class="flex flex-col gap-6">
										
										<!-- Star Rating -->
										<?php if ( ! empty( $testimonial['starRating'] ) ) : ?>
											<?php $star_count = intval( $testimonial['starRating'] ); ?>
											<div class="flex gap-1">
												<?php for ( $i = 0; $i < $star_count; $i++ ) : ?>
													<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/icons/icn-single-star.svg' ); ?>" alt="" class="star-icon" />
												<?php endfor; ?>
											</div>
										<?php endif; ?>
										
										<!-- Testimonial Quote -->
										<?php if ( ! empty( $testimonial['content'] ) ) : ?>
											<blockquote class="font-heading text-2xl md:text-3xl lg:text-4xl font-normal text-white leading-relaxed">
												<?php echo wp_kses_post( $testimonial['content'] ); ?>
											</blockquote>
										<?php endif; ?>
										
										<!-- Author -->
										<?php if ( ! empty( $testimonial['author'] ) ) : ?>
											<p class="font-body text-sm md:text-base text-secondary font-medium">
												<?php echo esc_html( $testimonial['author'] ); ?>
											</p>
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
								<div class="badge-icon flex-shrink-0">
									<img src="<?php echo esc_url( $badge['iconUrl'] ); ?>" alt="" class="w-full h-full" />
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
