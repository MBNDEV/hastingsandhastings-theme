<?php
/**
 * 2 column - Text and Image block rendering.
 *
 * @package CustomTheme
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 */

$eyebrow_text         = $attributes['eyebrowText'] ?? 'What Sets Our Firm Apart';
$main_heading         = $attributes['mainHeading'] ?? 'Experienced legal help for injury victims across Arizona';
$subheading           = $attributes['subheading'] ?? '';
$background_image_url = $attributes['backgroundImageUrl'] ?? '';
$background_image_id  = $attributes['backgroundImageId'] ?? 0;
$swap_columns         = ! empty( $attributes['swapColumns'] );
$background_color     = $attributes['backgroundColor'] ?? 'bg-white';

$allowed_bg_classes = array( 'bg-white', 'bg-gray-50', 'bg-slate-50' );
if ( ! in_array( $background_color, $allowed_bg_classes, true ) ) {
  $background_color = 'bg-white';
}

$layout_class = $swap_columns
  ? 'section-two-column-text-image__layout section-two-column-text-image__layout--image-left grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-center'
  : 'section-two-column-text-image__layout section-two-column-text-image__layout--image-right grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-center';

$text_wrap_class = $swap_columns
  ? 'section-two-column-text-image__text-wrap max-w-full lg:max-w-xl order-2 lg:order-2'
  : 'section-two-column-text-image__text-wrap max-w-full lg:max-w-xl order-1 lg:order-1';

$image_wrap_class = $swap_columns
  ? 'section-two-column-text-image__image-wrap order-1 lg:order-1'
  : 'section-two-column-text-image__image-wrap order-2 lg:order-2';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'section-two-column-text-image py-12 md:py-16 lg:py-20 !pb-0 overflow-hidden ' . $background_color,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-12 border-b border-primary-200">
    <div class="<?php echo esc_attr( $layout_class ); ?>">
      <div class="<?php echo esc_attr( $text_wrap_class ); ?>">
        <?php if ( ! empty( $eyebrow_text ) ) : ?>
          <p class="font-body text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-secondary">
            <?php echo esc_html( $eyebrow_text ); ?>
          </p>
        <?php endif; ?>

        <?php if ( ! empty( $main_heading ) ) : ?>
          <h2 class="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-heading !leading-tight md:!leading-[60px]">
            <?php echo wp_kses_post( $main_heading ); ?>
          </h2>
        <?php endif; ?>

        <?php if ( ! empty( $subheading ) ) : ?>
          <p class="mt-6 font-body text-base md:text-lg text-text-body !leading-relaxed md:!leading-[28px] pb-12">
            <?php echo wp_kses_post( $subheading ); ?>
          </p>
        <?php endif; ?>

      </div>

      <div class="<?php echo esc_attr( $image_wrap_class ); ?>">
        <?php if ( ! empty( $background_image_url ) ) : ?>
          <?php
          $image_alt_text = ! empty( $background_image_id ) ? get_post_meta( $background_image_id, '_wp_attachment_image_alt', true ) : '';
          if ( empty( $image_alt_text ) ) {
            $image_alt_text = __( 'Image', 'mbn-theme' );
          }
          ?>
          <img
            src="<?php echo esc_url( $background_image_url ); ?>"
            alt="<?php echo esc_attr( $image_alt_text ); ?>"
            class="section-two-column-text-image__image"
          />
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>
