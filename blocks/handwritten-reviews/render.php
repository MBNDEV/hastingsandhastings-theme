<?php
/**
 * Handwritten Reviews Block - Dynamic Render
 *
 * Pulls accordion data from the `handwritten_review_month` CPT when available.
 * Falls back to the block's `accordionItems` attribute for backwards compatibility.
 *
 * @package MBN_Theme
 * @param   array    $attributes Block attributes.
 * @param   string   $content    Block default content.
 * @param   WP_Block $block      Block instance.
 */

// The block's accordionItems define which months to display (and their order).
// For each item, images are looked up from a matching CPT post by title.
$block_items = $attributes['accordionItems'] ?? array();

// Build a lookup map: lowercase title => images array, from all CPT posts.
$cpt_image_map = array();
if ( function_exists( 'mbn_get_review_months' ) ) {
	foreach ( mbn_get_review_months() as $month ) {
		$key                  = strtolower( trim( $month['title'] ) );
		$cpt_image_map[ $key ] = array_map(
			function ( $img ) {
				return array(
					'imageUrl' => $img['url'],
					'imageId'  => $img['id'],
					'imageAlt' => $img['alt'],
				);
			},
			$month['images']
		);
	}
}

// Merge: use block items for month labels/order, CPT for images.
$accordion_items = array();
foreach ( $block_items as $item ) {
	$heading = $item['heading'] ?? '';
	$key     = strtolower( trim( $heading ) );
	$images  = $cpt_image_map[ $key ] ?? array();

	$accordion_items[] = array(
		'heading' => $heading,
		'year'    => $item['year'] ?? '',
		'images'  => $images,
	);
}

// Group items by year so we can render year dividers.
$years = array();
foreach ( $accordion_items as $item ) {
	$year = $item['year'] ?? '';
  if ( ! isset( $years[ $year ] ) ) {
      $years[ $year ] = array();
  }
	$years[ $year ][] = $item;
}

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'handwritten-reviews',
  )
);

$global_index = 0;
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="handwritten-reviews__container">
    <div class="handwritten-reviews__accordion">
      <?php foreach ( $years as $year => $items ) : ?>
        <?php if ( ! empty( $year ) ) : ?>
          <div class="handwritten-reviews__year-group">
            <h2 class="handwritten-reviews__year-heading"><?php echo esc_html( $year ); ?></h2>
          </div>
        <?php endif; ?>

        <?php foreach ( $items as $item ) : ?>
          <?php
          $heading = $item['heading'] ?? '';
          $images  = $item['images'] ?? array();
          $item_id = 'accordion-panel-' . esc_attr( $global_index );
          ++$global_index;
          ?>
          <article class="handwritten-reviews__item">
            <button
              class="handwritten-reviews__toggle"
              aria-expanded="false"
              aria-controls="<?php echo esc_attr( $item_id ); ?>"
            >
              <h3 class="handwritten-reviews__heading"><?php echo esc_html( $heading ); ?></h3>
              <span class="handwritten-reviews__chevron" aria-hidden="true">
              </span>
            </button>

            <div
              class="handwritten-reviews__panel"
              id="<?php echo esc_attr( $item_id ); ?>"
              hidden
            >
              <ul class="handwritten-reviews__gallery">
                <?php foreach ( $images as $img_index => $image ) : ?>
                  <?php
                  $image_url = $image['imageUrl'] ?? '';
                  $image_id  = $image['imageId'] ?? 0;
                  $image_alt = $image['imageAlt'] ?? '';

                  if ( empty( $image_alt ) && ! empty( $image_id ) ) {
                      $image_alt = get_post_meta( (int) $image_id, '_wp_attachment_image_alt', true );
                  }
                  if ( empty( $image_alt ) ) {
                      $image_alt = sprintf(
                          /* translators: 1: accordion heading title, 2: image number within the accordion item */
                        __( 'Handwritten review - %1$s, image %2$d', 'mbn-theme' ),
                        $heading,
                        $img_index + 1
                      );
                  }

                  if ( empty( $image_url ) ) {
                      continue;
                  }

                  /* translators: %s: image alt text description */
                  $aria_label = sprintf( __( 'View full size: %s', 'mbn-theme' ), $image_alt );
                  ?>
                  <li class="handwritten-reviews__gallery-item">
                    <figure class="handwritten-reviews__figure">
                      <a
                        href="<?php echo esc_url( $image_url ); ?>"
                        class="handwritten-reviews__lightbox-trigger"
                        aria-label="<?php echo esc_attr( $aria_label ); ?>"
                      >
                        <img
                          src="<?php echo esc_url( $image_url ); ?>"
                          alt="<?php echo esc_attr( $image_alt ); ?>"
                          loading="lazy"
                        >
                      </a>
                    </figure>
                  </li>
                <?php endforeach; ?>
              </ul>
            </div>
          </article>
        <?php endforeach; ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- ── Lightbox ─────────────────────────────────────────────────── -->
<div
  class="handwritten-reviews__lightbox"
  id="reviews-lightbox"
  role="dialog"
  aria-modal="true"
  aria-label="<?php esc_attr_e( 'Review image viewer', 'mbn-theme' ); ?>"
  hidden
>
  <div class="handwritten-reviews__lightbox-overlay"></div>
  <div class="handwritten-reviews__lightbox-inner">
    <button class="handwritten-reviews__lightbox-close" aria-label="<?php esc_attr_e( 'Close image viewer', 'mbn-theme' ); ?>">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <button class="handwritten-reviews__lightbox-prev" aria-label="<?php esc_attr_e( 'Previous image', 'mbn-theme' ); ?>">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <figure class="handwritten-reviews__lightbox-figure">
      <img id="lightbox-img" src="" alt="" class="handwritten-reviews__lightbox-img">
    </figure>
    <button class="handwritten-reviews__lightbox-next" aria-label="<?php esc_attr_e( 'Next image', 'mbn-theme' ); ?>">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  </div>
  <p class="handwritten-reviews__lightbox-counter" id="lightbox-counter" aria-live="polite"></p>
</div>
