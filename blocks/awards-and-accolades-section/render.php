<?php
/**
 * Awards and Accolades Section block rendering.
 *
 * @package CustomTheme
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 */

$awards_label = $attributes['awardsLabel'] ?? 'Awards & Accolades';
$awards       = $attributes['awards'] ?? array();

$awards_with_images = array_values(
  array_filter(
    $awards,
    static function ( $award ) {
      return ! empty( $award['imageUrl'] );
    }
  )
);

if ( empty( $awards_with_images ) ) {
  return;
}

wp_enqueue_style( 'swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', array(), '11.0.0' );
wp_enqueue_script( 'swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', array(), '11.0.0', true );

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'section-awards-accolades',
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-12">
    <div class="flex flex-col items-center gap-6 md:flex-row md:gap-10 lg:gap-20">
      <p class="font-heading max-w-none text-sm font-bold text-text-muted md:max-w-[100px] md:flex-shrink-0 md:text-base">
        <?php echo esc_html( $awards_label ); ?>
      </p>

      <div class="swiper awards-slider w-full md:flex-1">
        <div class="swiper-wrapper">
          <?php foreach ( $awards_with_images as $award ) : ?>
            <?php
            $award_image_url = $award['imageUrl'] ?? '';
            $award_image_id  = $award['imageId'] ?? 0;
            $award_alt_text  = ! empty( $award_image_id ) ? get_post_meta( $award_image_id, '_wp_attachment_image_alt', true ) : '';
            if ( empty( $award_alt_text ) ) {
              $award_alt_text = __( 'Award', 'mbn-theme' );
            }
            ?>
            <div class="swiper-slide">
              <div class="flex h-auto w-full items-center justify-center">
                <img
                  src="<?php echo esc_url( $award_image_url ); ?>"
                  alt="<?php echo esc_attr( $award_alt_text ); ?>"
                  class="h-full max-h-24 w-full object-contain"
                />
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </div>
</section>
