<?php
/**
 * Section: Case Results - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$eyebrow_text     = $attributes['eyebrowText'] ?? 'CASE RESULTS';
$main_heading     = $attributes['mainHeading'] ?? 'Proven experience. Real results.';
$description      = $attributes['description'] ?? '';
$case_results     = $attributes['caseResults'] ?? array();
$button_text      = $attributes['buttonText'] ?? 'SEE MORE CASE RESULTS';
$button_url       = $attributes['buttonUrl'] ?? '/results/';
$background_color = $attributes['backgroundColor'] ?? 'bg-white';

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
		<div class="text-center mb-12 md:mb-16 lg:mb-20">
			<?php if ( ! empty( $eyebrow_text ) ) : ?>
				<p class="font-body text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-secondary mb-4">
					<?php echo esc_html( $eyebrow_text ); ?>
				</p>
			<?php endif; ?>
			
			<?php if ( ! empty( $main_heading ) ) : ?>
				<h2 class="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-text-heading mb-6">
					<?php echo wp_kses_post( $main_heading ); ?>
				</h2>
			<?php endif; ?>
			
			<?php if ( ! empty( $description ) ) : ?>
				<p class="font-body text-base md:text-lg text-text-body leading-relaxed max-w-3xl mx-auto">
					<?php echo esc_html( $description ); ?>
				</p>
			<?php endif; ?>
		</div>

		<!-- Case Results Cards -->
		<?php if ( ! empty( $case_results ) ) : ?>
			<div class="flex flex-col gap-10 md:gap-16 lg:gap-20">
				
				<?php foreach ( $case_results as $index => $case_result ) : ?>
					<?php
					$is_even        = ( 0 === $index % 2 );
					$flex_direction = $is_even ? 'lg:flex-row' : 'lg:flex-row-reverse';
					$overlay_class  = $is_even ? 'ml-0 lg:-ml-28 xl:-ml-44' : 'mr-0 lg:-mr-28 xl:-mr-44';
					$text_align     = $is_even ? 'text-left' : 'lg:text-right';
					?>
					
					<!-- Case Result Card -->
					<div class="flex flex-col <?php echo esc_attr( $flex_direction ); ?> items-center gap-6 lg:gap-10 xl:gap-16">
						<!-- Image -->
						<div class="w-full lg:w-1/2 flex-shrink-0">
							<?php if ( ! empty( $case_result['imageUrl'] ) ) : ?>
								<?php
								$alt_text = ! empty( $case_result['imageId'] ) ? get_post_meta( $case_result['imageId'], '_wp_attachment_image_alt', true ) : '';
								?>
								<img 
									src="<?php echo esc_url( $case_result['imageUrl'] ); ?>" 
									alt="<?php echo esc_attr( $alt_text ); ?>" 
									class="w-full max-h-96 lg:h-auto shadow-lg object-cover object-center"
								/>
							<?php endif; ?>
						</div>
						
						<!-- Content -->
						<div class="w-full lg:w-1/2 flex flex-col">
							<div class="<?php echo esc_attr( $overlay_class ); ?> bg-white bg-opacity-80 rounded-2xl p-8 md:p-10 lg:px-10 lg:py-6 shadow-xl border border-gray-200 <?php echo esc_attr( $text_align ); ?> z-10">
								
								<!-- Tag Text -->
								<?php if ( ! empty( $case_result['tagText'] ) ) : ?>
									<span class="inline-block font-body text-sm font-normal tracking-wider text-secondary bg-transparent px-4 py-2 rounded border border-gray-200 mb-4">
										<?php echo esc_html( $case_result['tagText'] ); ?>
									</span>
								<?php endif; ?>
								
								<!-- Case Heading -->
								<?php if ( ! empty( $case_result['caseHeading'] ) ) : ?>
									<h3 class="font-heading font-semibold text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-text-heading mb-4">
										<?php echo esc_html( $case_result['caseHeading'] ); ?>
									</h3>
								<?php endif; ?>
								
								<!-- Case Subheading -->
								<?php if ( ! empty( $case_result['caseSubheading'] ) ) : ?>
									<p class="font-heading font-bold text-xl md:text-2xl text-text-heading mb-4">
										<?php echo esc_html( $case_result['caseSubheading'] ); ?>
									</p>
								<?php endif; ?>
								
								<!-- Case Content -->
								<?php if ( ! empty( $case_result['caseContent'] ) ) : ?>
									<p class="font-body text-base text-text-body leading-relaxed">
										<?php echo esc_html( $case_result['caseContent'] ); ?>
									</p>
								<?php endif; ?>
							</div>
						</div>
					</div>
					
				<?php endforeach; ?>

			</div>
		<?php endif; ?>

		<!-- CTA Button -->
		<?php if ( ! empty( $button_text ) ) : ?>
			<div class="text-center mt-12 md:mt-16 lg:mt-20">
				<a 
					href="<?php echo esc_url( $button_url ); ?>" 
					class="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 rounded-[88px] font-body font-bold text-base bg-white text-text-heading border border-text-heading border-opacity-25 hover:bg-text-heading hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
				>
					<?php echo esc_html( $button_text ); ?>
				</a>
			</div>
		<?php endif; ?>

	</div>
</section>
