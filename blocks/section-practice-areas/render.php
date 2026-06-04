<?php
/**
 * Section: Practice Areas Grid - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$eyebrow_text     = $attributes['eyebrowText'] ?? 'INJURIES & ACCIDENTS WE HELP WITH';
$main_heading     = $attributes['mainHeading'] ?? 'Legal help for the injuries and accidents people face every day';
$description      = $attributes['description'] ?? '';
$cards            = $attributes['cards'] ?? array();
$show_cta_panel   = $attributes['showCtaPanel'] ?? true;
$cta_logo_url     = $attributes['ctaLogoUrl'] ?? '';
$cta_heading      = $attributes['ctaHeading'] ?? 'Not Sure Where Your Case Fits?';
$cta_description  = $attributes['ctaDescription'] ?? '';
$cta_button_text  = $attributes['ctaButtonText'] ?? 'VIEW ALL PRACTICE AREAS';
$cta_button_url   = $attributes['ctaButtonUrl'] ?? '#';
$background_color = $attributes['backgroundColor'] ?? 'bg-light-blue';

// Determine if background color is a hex code or Tailwind class
$is_custom_color = strpos( $background_color, '#' ) === 0;
$bg_class        = $is_custom_color ? '' : $background_color;
$bg_style        = $is_custom_color ? 'background-color: ' . esc_attr( $background_color ) . ';' : '';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'w-full py-12 md:py-16 lg:py-20 ' . esc_attr( $bg_class ),
	  'style' => $bg_style,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
		
		<!-- Section Header -->
		<div class="text-center mb-12 md:mb-16">
			<?php if ( ! empty( $eyebrow_text ) ) : ?>
				<p class="font-body text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-secondary mb-4">
					<?php echo esc_html( $eyebrow_text ); ?>
				</p>
			<?php endif; ?>
			
			<?php if ( ! empty( $main_heading ) ) : ?>
				<h2 class="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-text-heading mb-6 max-w-4xl mx-auto">
					<?php echo wp_kses_post( $main_heading ); ?>
				</h2>
			<?php endif; ?>
			
			<?php if ( ! empty( $description ) ) : ?>
				<p class="font-body text-base md:text-lg text-text-body leading-relaxed max-w-3xl mx-auto">
					<?php echo esc_html( $description ); ?>
				</p>
			<?php endif; ?>
		</div>

		<!-- Grid Container -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
			
			<?php if ( ! empty( $cards ) ) : ?>
				<?php foreach ( $cards as $card ) : ?>
					<!-- Practice Area Card -->
					<div class="practice-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
						<?php if ( ! empty( $card['imageUrl'] ) ) : ?>
							<div class="aspect-[4/3] bg-gray-200 overflow-hidden">
								<img 
									src="<?php echo esc_url( $card['imageUrl'] ); ?>" 
									alt="<?php echo esc_attr( $card['heading'] ?? '' ); ?>" 
									class="practice-card-image w-full h-full object-cover transition-transform duration-300"
								/>
							</div>
						<?php endif; ?>
						
						<div class="p-6">
							<?php if ( ! empty( $card['heading'] ) ) : ?>
								<h3 class="font-heading font-bold text-xl md:text-2xl text-text-heading mb-3">
									<?php echo esc_html( $card['heading'] ); ?>
								</h3>
							<?php endif; ?>
							
							<?php if ( ! empty( $card['description'] ) ) : ?>
								<p class="font-body text-sm md:text-base text-text-body leading-relaxed">
									<?php echo esc_html( $card['description'] ); ?>
								</p>
							<?php endif; ?>
						</div>
					</div>
				<?php endforeach; ?>
			<?php endif; ?>

			<!-- CTA Panel -->
			<?php if ( $show_cta_panel ) : ?>
				<div class="lg:col-span-2 bg-white rounded-lg overflow-hidden shadow-md border-2 border-secondary lg:col-start-3">
					<div class="p-8 md:p-10 flex flex-col items-center justify-center text-center h-full">
						
						<!-- Logo -->
						<?php if ( ! empty( $cta_logo_url ) ) : ?>
							<div class="mb-6">
								<img 
									src="<?php echo esc_url( $cta_logo_url ); ?>" 
									alt="<?php esc_attr_e( 'Logo', 'mbn-theme' ); ?>" 
									class="w-16 h-16 md:w-20 md:h-20"
								/>
							</div>
						<?php endif; ?>

						<!-- Heading -->
						<?php if ( ! empty( $cta_heading ) ) : ?>
							<h3 class="font-heading font-bold text-2xl md:text-3xl text-text-heading mb-4">
								<?php echo esc_html( $cta_heading ); ?>
							</h3>
						<?php endif; ?>
						
						<!-- Description -->
						<?php if ( ! empty( $cta_description ) ) : ?>
							<p class="font-body text-base text-text-body leading-relaxed mb-8 max-w-md">
								<?php echo esc_html( $cta_description ); ?>
							</p>
						<?php endif; ?>

						<!-- Button -->
						<?php if ( ! empty( $cta_button_text ) ) : ?>
							<a 
								href="<?php echo esc_url( $cta_button_url ); ?>" 
								class="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 rounded-full font-body font-bold text-sm md:text-base bg-text-heading text-white hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-auto"
							>
								<?php echo esc_html( $cta_button_text ); ?>
							</a>
						<?php endif; ?>
					</div>
				</div>
			<?php endif; ?>

		</div>

	</div>
</section>
