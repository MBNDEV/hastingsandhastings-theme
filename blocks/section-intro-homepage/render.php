<?php
/**
 * Section Intro Homepage Block - Dynamic Rendering
 *
 * @package CustomTheme
 *
 * @param array    $attributes Block attributes
 * @param string   $content Block content
 * @param WP_Block $block Block instance
 */

$eyebrow_text         = $attributes['eyebrowText'] ?? 'Why Arizonans Choose Hastings & Hastings';
$main_heading         = $attributes['mainHeading'] ?? 'Trusted accident lawyer in Phoenix for decades';
$subheading           = $attributes['subheading'] ?? '';
$background_image_url = $attributes['backgroundImageUrl'] ?? '';
$awards_label         = $attributes['awardsLabel'] ?? 'Awards & Accolades';
$awards               = $attributes['awards'] ?? array();

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'section-intro-homepage',
  )
);
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="w-full pt-12 md:pt-16 lg:pt-20 bg-white">
		<div class="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 relative z-10">
			
			<!-- Content Container -->
			<div class="flex flex-col gap-8 md:gap-12">
				
				<!-- Top: Heading and Description -->
				<div class="flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-16">
					
					<!-- Left: Eyebrow + Main Heading -->
					<div class="flex flex-col gap-4 lg:w-1/2">
						<!-- Eyebrow Text -->
						<?php if ( $eyebrow_text ) : ?>
							<p class="font-body text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-secondary">
								<?php echo esc_html( $eyebrow_text ); ?>
							</p>
						<?php endif; ?>
						
						<!-- Main Heading -->
						<h2 class="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-heading !leading-[40px] md:!leading-[60px]">
						<?php echo wp_kses_post( $main_heading ); ?>
					</h2>
				</div>

					<!-- Right: Description -->
					<div class="flex items-center lg:w-1/2">
						<p class="font-body text-base md:text-lg text-text-body leading-relaxed md:!leading-[28px] lg:pt-10">
							<?php echo wp_kses_post( $subheading ); ?>
						</p>
					</div>
				</div>

				<!-- Awards & Accolades Section -->
				<?php if ( ! empty( $awards ) ) : ?>
					<div class="flex flex-col md:flex-row items-center gap-6 md:gap-10 lg:gap-20">
						<p class="font-heading text-sm md:text-base font-bold text-text-muted md:flex-shrink-0 max-w-none md:max-w-[100px]">
							<?php echo esc_html( $awards_label ); ?>
						</p>

						<!-- Awards Logos Slider -->
						<div class="swiper awards-slider w-full md:flex-1">
							<div class="swiper-wrapper">
								
								<?php foreach ( $awards as $award ) : ?>
									<?php if ( ! empty( $award['imageUrl'] ) ) : ?>
										<?php
										$award_alt_text = ! empty( $award['imageId'] ) ? get_post_meta( $award['imageId'], '_wp_attachment_image_alt', true ) : '';
										if ( empty( $award_alt_text ) ) {
											$award_alt_text = __( 'Award', 'mbn-theme' );
										}
										?>
									<div class="swiper-slide">
										<div class="flex items-center justify-center h-auto w-full">
											<img 
												src="<?php echo esc_url( $award['imageUrl'] ); ?>" 
												alt="<?php echo esc_attr( $award_alt_text ); ?>"
													class="h-full w-full max-h-24 object-contain"
												/>
											</div>
										</div>
									<?php endif; ?>
								<?php endforeach; ?>
								
							</div>
						</div>
					</div>
				<?php endif; ?>

			</div>

		</div>

		<!-- Team Image with Text Overlay -->
		<?php if ( $background_image_url ) : ?>
			<?php
			$bg_alt_text = ! empty( $background_image_id ) ? get_post_meta( $background_image_id, '_wp_attachment_image_alt', true ) : '';
			if ( empty( $bg_alt_text ) ) {
				$bg_alt_text = __( 'Team', 'mbn-theme' );
			}
			?>
			<div class="relative w-full overflow-hidden -mt-24 md:-mt-56 xl:-mt-96">
				<img 
					src="<?php echo esc_url( $background_image_url ); ?>" 
					alt="<?php echo esc_attr( $bg_alt_text ); ?>"
					class="w-full h-auto object-cover"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
			</div>
		<?php endif; ?>

	</div>
</section>

<?php if ( ! empty( $awards ) ) : ?>
	<!-- Swiper JS (only load once) -->
	<script>
		if (typeof Swiper === 'undefined') {
			const swiperScript = document.createElement('script');
			swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
			swiperScript.onload = function() {
				initAwardsSlider();
			};
			document.head.appendChild(swiperScript);

			const swiperCSS = document.createElement('link');
			swiperCSS.rel = 'stylesheet';
			swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
			document.head.appendChild(swiperCSS);
		} else {
			initAwardsSlider();
		}

		function initAwardsSlider() {
			const swipers = document.querySelectorAll('.awards-slider');
			swipers.forEach(function(slider) {
				if (!slider.swiper) {
					new Swiper(slider, {
						slidesPerView: 1,
						spaceBetween: 32,
						loop: false,
						pagination: false,
						breakpoints: {
							640: {
								slidesPerView: 2,
								spaceBetween: 32,
							},
							768: {
								slidesPerView: 3,
								spaceBetween: 48,
							},
							1024: {
								slidesPerView: 4,
								spaceBetween: 64,
							},
						},
					});
				}
			});
		}
	</script>
<?php endif; ?>
