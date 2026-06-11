<?php
/**
 * Section: Text & Image Split - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$heading          = $attributes['heading'] ?? '';
$paragraph        = $attributes['paragraph'] ?? '';
$image_url        = $attributes['imageUrl'] ?? '';
$image_id         = $attributes['imageId'] ?? 0;
$swap_columns     = ! empty( $attributes['swapColumns'] );
$background_color = $attributes['backgroundColor'] ?? 'bg-white';

$is_custom_color = strpos( $background_color, '#' ) === 0;
$bg_class        = $is_custom_color ? '' : $background_color;
$bg_style        = $is_custom_color ? 'background-color: ' . esc_attr( $background_color ) . ';' : '';

// On desktop: default = text left (order-1), image right (order-2).
// Swapped  = text right (lg:order-2), image left (lg:order-1).
// On mobile: image always on top (order-1), text below (order-2).
$text_col_class  = $swap_columns ? 'order-2 lg:order-2' : 'order-2 lg:order-1';
$image_col_class = $swap_columns ? 'order-1 lg:order-1' : 'order-1 lg:order-2';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'section-text-image-split py-12  ' . esc_attr( $bg_class ),
	  'style' => $bg_style,
  )
);

$image_alt = ! empty( $image_id ) ? get_post_meta( $image_id, '_wp_attachment_image_alt', true ) : '';
if ( empty( $image_alt ) ) {
  $image_alt = '';
}
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-12">
		<div class="section-text-image-split__grid grid grid-cols-1 <?php echo $swap_columns ? 'lg:grid-cols-[60%_40%]' : 'lg:grid-cols-[35%_65%]'; ?> gap-12 xl:gap-24 items-center">

			<!-- Text Column: order-2 on mobile, swap-aware on desktop -->
			<div class="<?php echo esc_attr( $text_col_class ); ?> text-center lg:text-left ">
				<?php if ( ! empty( $heading ) ) : ?>
					<h3 class="section-text-image-split__heading font-heading font-semibold text-h3 leading-[40px] text-text-heading max-w-full lg:max-w-sm">
						<?php echo wp_kses_post( $heading ); ?>
					</h3>
				<?php endif; ?>

				<?php if ( ! empty( $paragraph ) ) : ?>
					<p class="section-text-image-split__paragraph font-body font-normal text-lg leading-7 text-text-body mt-4 max-w-full lg:max-w-sm">
						<?php echo wp_kses_post( $paragraph ); ?>
					</p>
				<?php endif; ?>
			</div>

			<!-- Image Column: order-1 on mobile (always top) -->
			<?php if ( ! empty( $image_url ) ) : ?>
				<div class="<?php echo esc_attr( $image_col_class ); ?>">
					<img
						src="<?php echo esc_url( $image_url ); ?>"
						alt="<?php echo esc_attr( $image_alt ); ?>"
						class="section-text-image-split__image w-full h-auto rounded-2xl object-cover"
					/>
				</div>
			<?php endif; ?>

		</div>
	</div>
</section>
