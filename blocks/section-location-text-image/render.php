<?php
/**
 * Section: Location – Text and Image - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$rows = $attributes['rows'] ?? array();

// Build path for local fallback images
$block_assets_uri = get_theme_file_uri( '/build/blocks/section-location-text-image/assets/images' );

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'section-loc-text-image',
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="section-loc-text-image__container">

    <?php foreach ( $rows as $index => $row ) : ?>
      <?php
      $heading               = $row['heading'] ?? '';
      $paragraphs            = $row['paragraphs'] ?? array();
      $list_items            = $row['listItems'] ?? array();
      $paragraphs_after_list = $row['paragraphsAfterList'] ?? array();
      $image_url             = $row['imageUrl'] ?? '';
      $image_id              = $row['imageId'] ?? 0;
      $image_position        = $row['imagePosition'] ?? 'right';

      // Determine fallback image based on index
      $fallback_images = array(
		  'text-image-photo-01.jpg',
		  'text-image-photo-02.jpg',
      );
      $fallback_index  = $index % count( $fallback_images );
      $fallback_image  = $block_assets_uri . '/' . $fallback_images[ $fallback_index ];

      // Use uploaded image or fallback
      $final_image_url = ! empty( $image_url ) ? $image_url : '';

      // Determine image alt text
      $image_alt = '';
      if ( ! empty( $image_id ) ) {
        $image_alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
      }

      // Row modifier class
      $row_class = 'left' === $image_position
        ? 'section-loc-text-image__row section-loc-text-image__row--image-left'
        : 'section-loc-text-image__row section-loc-text-image__row--image-right';

      // Add no-image class if image is empty
      if ( empty( $final_image_url ) ) {
        $row_class .= ' section-loc-text-image__row--no-image';
      }
      ?>

      <!-- ── ROW <?php echo esc_attr( $index + 1 ); ?> ──────────────────────────────────────── -->
      <div class="<?php echo esc_attr( $row_class ); ?>">

        <div class="section-loc-text-image__text">
          <?php if ( ! empty( $heading ) ) : ?>
            <h3 class="section-loc-text-image__heading">
              <?php echo wp_kses_post( $heading ); ?>
            </h3>
          <?php endif; ?>

          <?php if ( ! empty( $paragraphs ) && is_array( $paragraphs ) ) : ?>
            <?php foreach ( $paragraphs as $paragraph ) : ?>
              <?php if ( ! empty( $paragraph ) ) : ?>
                <p class="section-loc-text-image__para">
                  <?php echo wp_kses_post( $paragraph ); ?>
                </p>
              <?php endif; ?>
            <?php endforeach; ?>
          <?php endif; ?>

          <?php if ( ! empty( $list_items ) && is_array( $list_items ) ) : ?>
            <ul class="section-loc-text-image__list">
              <?php foreach ( $list_items as $list_item ) : ?>
                <?php if ( ! empty( $list_item ) ) : ?>
                  <li><?php echo esc_html( $list_item ); ?></li>
                <?php endif; ?>
              <?php endforeach; ?>
            </ul>
          <?php endif; ?>

          <?php if ( ! empty( $paragraphs_after_list ) && is_array( $paragraphs_after_list ) ) : ?>
            <?php foreach ( $paragraphs_after_list as $paragraph ) : ?>
              <?php if ( ! empty( $paragraph ) ) : ?>
                <p class="section-loc-text-image__para">
                  <?php echo wp_kses_post( $paragraph ); ?>
                </p>
              <?php endif; ?>
            <?php endforeach; ?>
          <?php endif; ?>
        </div>
        <?php if ( ! empty( $final_image_url ) ) : ?>       
        <figure class="section-loc-text-image__image-wrap">
          <img
            class="section-loc-text-image__image"
            src="<?php echo esc_url( $final_image_url ); ?>"
            alt="<?php echo esc_attr( $image_alt ); ?>"
          >
        </figure>
        <?php endif; ?>
      </div>
      <!-- ── /ROW <?php echo esc_attr( $index + 1 ); ?> ──────────────────────────────────────── -->

    <?php endforeach; ?>

  </div>
</section>
