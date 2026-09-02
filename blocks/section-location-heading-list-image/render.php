<?php
/**
 * Section: Location – Heading List with Image - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$heading                = $attributes['heading'] ?? '';
$intro_paragraphs       = $attributes['introParagraphs'] ?? array();
$list_style             = $attributes['listStyle'] ?? 'single';
$list_items             = $attributes['listItems'] ?? array();
$image_url              = $attributes['imageUrl'] ?? '';
$image_id               = $attributes['imageId'] ?? 0;
$image_position         = $attributes['imagePosition'] ?? 'right';
$content_title          = $attributes['contentTitle'] ?? '';
$before_list_paragraphs = $attributes['beforeListParagraphs'] ?? array();
$after_list_paragraphs  = $attributes['afterListParagraphs'] ?? array();
$footer_paragraphs      = $attributes['footerParagraphs'] ?? array();
$background_color       = $attributes['backgroundColor'] ?? 'bg-light-blue';

// Build path for local fallback images
$block_assets_uri = get_theme_file_uri( '/build/blocks/section-location-heading-list-image/assets/images' );
$chevron_icon     = $block_assets_uri . '/chevron-right.svg';

// Use uploaded image or fallback
$final_image_url = ! empty( $image_url ) ? $image_url : $block_assets_uri . '/heading-list-image-photo.jpg';

// Determine image alt text
$image_alt = '';
if ( ! empty( $image_id ) ) {
  $image_alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
}

// List class based on style
$list_class = 'two-column' === $list_style
  ? 'loc-hlimg__list loc-hlimg__list--two-col'
  : 'loc-hlimg__list';

// Body class based on image position
$body_class = 'left' === $image_position
  ? 'loc-hlimg__body loc-hlimg__body--image-left'
  : 'loc-hlimg__body';

// Handle background color
$is_custom_color = strpos( $background_color, '#' ) === 0;
$bg_class        = $is_custom_color ? '' : $background_color;
$bg_style        = $is_custom_color ? 'background-color: ' . esc_attr( $background_color ) . ';' : '';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'loc-hlimg ' . esc_attr( $bg_class ),
	  'style' => $bg_style,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="loc-hlimg__container">

    <!-- ── Header (centered) ──────────────────────────────── -->
    <?php if ( ! empty( $heading ) || ! empty( $intro_paragraphs ) ) : ?>
      <div class="loc-hlimg__header">
        <?php if ( ! empty( $heading ) ) : ?>
          <h3 class="loc-hlimg__heading">
            <?php echo wp_kses_post( $heading ); ?>
          </h3>
        <?php endif; ?>

        <?php if ( ! empty( $intro_paragraphs ) && is_array( $intro_paragraphs ) ) : ?>
          <?php foreach ( $intro_paragraphs as $paragraph ) : ?>
            <?php if ( ! empty( $paragraph ) ) : ?>
              <p class="loc-hlimg__intro">
                <?php echo wp_kses_post( $paragraph ); ?>
              </p>
            <?php endif; ?>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    <?php endif; ?>

    <!-- ── Body: list + image ─────────────────────────────── -->
    <?php if ( ! empty( $list_items ) || ! empty( $final_image_url ) || ! empty( $content_title ) || ! empty( $before_list_paragraphs ) || ! empty( $after_list_paragraphs ) ) : ?>
      <div class="<?php echo esc_attr( $body_class ); ?>">
        <div class="loc-hlimg__content">
          <!-- Content Title -->
          <?php if ( ! empty( $content_title ) ) : ?>
            <h4 class="loc-hlimg__content-title">
              <?php echo esc_html( $content_title ); ?>
            </h4>
          <?php endif; ?>

          <!-- Before List Paragraphs -->
          <?php if ( ! empty( $before_list_paragraphs ) && is_array( $before_list_paragraphs ) ) : ?>
            <div class="loc-hlimg__before-list">
              <?php foreach ( $before_list_paragraphs as $paragraph ) : ?>
                <?php if ( ! empty( $paragraph ) ) : ?>
                  <p class="loc-hlimg__before-list-para">
                    <?php echo wp_kses_post( $paragraph ); ?>
                  </p>
                <?php endif; ?>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>

          <?php if ( ! empty( $list_items ) && is_array( $list_items ) ) : ?>
            <ul class="<?php echo esc_attr( $list_class ); ?>">
              <?php foreach ( $list_items as $item ) : ?>
                <?php if ( 'two-column' === $list_style ) : ?>
                  <?php
                  $label = $item['label'] ?? '';
                  $url   = $item['url'] ?? '';
                  ?>
                  <?php if ( ! empty( $label ) ) : ?>
                    <li class="loc-hlimg__list-item">
                      <img
                        class="loc-hlimg__item-icon"
                        src="<?php echo esc_url( $chevron_icon ); ?>"
                        alt=""
                        aria-hidden="true"
                        width="24"
                        height="24"
                      >
                      <?php if ( ! empty( $url ) ) : ?>
                        <a class="loc-hlimg__item-label" href="<?php echo esc_url( $url ); ?>">
                          <?php echo esc_html( $label ); ?>
                        </a>
                      <?php else : ?>
                        <span class="loc-hlimg__item-label">
                          <?php echo esc_html( $label ); ?>
                        </span>
                      <?php endif; ?>
                    </li>
                  <?php endif; ?>
                <?php else : ?>
                  <?php
                  $item_title       = $item['title'] ?? '';
                  $item_description = $item['description'] ?? '';
                  $item_url         = $item['url'] ?? '';
                  ?>
                  <?php if ( ! empty( $item_title ) || ! empty( $item_description ) ) : ?>
                    <li class="loc-hlimg__list-item">
                      <img
                        class="loc-hlimg__item-icon"
                        src="<?php echo esc_url( $chevron_icon ); ?>"
                        alt=""
                        aria-hidden="true"
                        width="24"
                        height="24"
                      >
                      <div class="loc-hlimg__item-text">
                        <?php if ( ! empty( $item_title ) ) : ?>
                          <strong class="loc-hlimg__item-title">
                            <?php if ( ! empty( $item_url ) ) : ?>
                              <a class="loc-hlimg__item-title-link" href="<?php echo esc_url( $item_url ); ?>">
                                <?php echo esc_html( $item_title ); ?>
                              </a>
                            <?php else : ?>
                              <?php echo esc_html( $item_title ); ?>
                            <?php endif; ?>
                          </strong>
                        <?php endif; ?>
                        <?php if ( ! empty( $item_description ) ) : ?>
                          <span class="loc-hlimg__item-desc"><?php echo wp_kses_post( $item_description ); ?></span>
                        <?php endif; ?>
                      </div>
                    </li>
                  <?php endif; ?>
                <?php endif; ?>
              <?php endforeach; ?>
            </ul>
          <?php endif; ?>

          <!-- After List Paragraphs -->
          <?php if ( ! empty( $after_list_paragraphs ) && is_array( $after_list_paragraphs ) ) : ?>
            <div class="loc-hlimg__after-list">
              <?php foreach ( $after_list_paragraphs as $paragraph ) : ?>
                <?php if ( ! empty( $paragraph ) ) : ?>
                  <p class="loc-hlimg__after-list-para">
                    <?php echo wp_kses_post( $paragraph ); ?>
                  </p>
                <?php endif; ?>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
        </div>
        <?php if ( ! empty( $final_image_url ) ) : ?>
          <figure class="loc-hlimg__image-wrap">
            <img
              class="loc-hlimg__image"
              src="<?php echo esc_url( $final_image_url ); ?>"
              alt="<?php echo esc_attr( $image_alt ); ?>"
            >
          </figure>
        <?php endif; ?>

      </div>
    <?php endif; ?>

    <!-- ── Footer paragraphs (centered) ──────────────────── -->
    <?php if ( ! empty( $footer_paragraphs ) && is_array( $footer_paragraphs ) ) : ?>
      <div class="loc-hlimg__footer">
        <?php foreach ( $footer_paragraphs as $paragraph ) : ?>
          <?php if ( ! empty( $paragraph ) ) : ?>
            <p class="loc-hlimg__footer-para">
              <?php echo wp_kses_post( $paragraph ); ?>
            </p>
          <?php endif; ?>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

  </div>
</section>
