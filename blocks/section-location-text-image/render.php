<?php
/**
 * Section: Location – Text and Image - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$rows             = $attributes['rows'] ?? array();
$background_color = $attributes['backgroundColor'] ?? 'bg-white';

// Build path for local fallback images and icons
$block_assets_uri = get_theme_file_uri( '/build/blocks/section-location-text-image/assets/images' );
$chevron_icon     = $block_assets_uri . '/chevron-right.svg';

// Handle background color: Tailwind class or custom hex
$is_custom_color = strpos( $background_color, '#' ) === 0;
$bg_class        = $is_custom_color ? '' : $background_color;
$bg_style        = $is_custom_color ? 'background-color: ' . esc_attr( $background_color ) . ';' : '';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'section-loc-text-image ' . esc_attr( $bg_class ),
	  'style' => $bg_style,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="section-loc-text-image__container">

    <?php foreach ( $rows as $index => $row ) : ?>
      <?php
      $heading               = $row['heading'] ?? '';
      $paragraphs            = $row['paragraphs'] ?? array();
      $list_style            = $row['listStyle'] ?? 'single';
      $list_items            = $row['listItems'] ?? array();
      $paragraphs_after_list = $row['paragraphsAfterList'] ?? array();
      $image_url             = $row['imageUrl'] ?? '';
      $image_id              = $row['imageId'] ?? 0;
      $image_position        = $row['imagePosition'] ?? 'right';

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

      // List class based on style
      $list_class = 'two-column' === $list_style
        ? 'section-loc-text-image__list section-loc-text-image__list--two-col'
        : 'section-loc-text-image__list section-loc-text-image__list--single-col';
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
            <ul class="<?php echo esc_attr( $list_class ); ?>">
              <?php foreach ( $list_items as $item ) : ?>
                <?php
                // Handle both old format (strings) and new format (objects)
                $is_object = is_array( $item );

                if ( 'two-column' === $list_style && $is_object ) :
                  $label = $item['label'] ?? '';
                  $url   = $item['url'] ?? '';
                  ?>
                  <?php if ( ! empty( $label ) ) : ?>
                    <li class="section-loc-text-image__list-item">
                      <img
                        class="section-loc-text-image__item-icon"
                        src="<?php echo esc_url( $chevron_icon ); ?>"
                        alt=""
                        aria-hidden="true"
                        width="24"
                        height="24"
                      >
                      <?php if ( ! empty( $url ) ) : ?>
                        <a class="section-loc-text-image__item-label" href="<?php echo esc_url( $url ); ?>">
                          <?php echo esc_html( $label ); ?>
                        </a>
                      <?php else : ?>
                        <span class="section-loc-text-image__item-label">
                          <?php echo esc_html( $label ); ?>
                        </span>
                      <?php endif; ?>
                    </li>
                  <?php endif; ?>
                <?php elseif ( $is_object ) : ?>
                  <?php
                  $item_title       = $item['title'] ?? '';
                  $item_description = $item['description'] ?? '';
                  ?>
                  <?php if ( ! empty( $item_title ) || ! empty( $item_description ) ) : ?>
                    <li class="section-loc-text-image__list-item">
                      <img
                        class="section-loc-text-image__item-icon"
                        src="<?php echo esc_url( $chevron_icon ); ?>"
                        alt=""
                        aria-hidden="true"
                        width="24"
                        height="24"
                      >
                      <div class="section-loc-text-image__item-text">
                        <?php if ( ! empty( $item_title ) ) : ?>
                          <strong class="section-loc-text-image__item-title"><?php echo wp_kses_post( $item_title ); ?></strong>
                        <?php endif; ?>
                        <?php if ( ! empty( $item_description ) ) : ?>
                          <span class="section-loc-text-image__item-desc"><?php echo wp_kses_post( $item_description ); ?></span>
                        <?php endif; ?>
                      </div>
                    </li>
                  <?php endif; ?>
                <?php else : ?>
                  <?php // Backward compatibility for old string format ?>
                  <?php if ( ! empty( $item ) ) : ?>
                    <li><?php echo esc_html( $item ); ?></li>
                  <?php endif; ?>
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
