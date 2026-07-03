<?php
/**
 * Section Location - CTA Card with Badges block render template.
 *
 * @package MBN_Theme
 * @param array $attributes Block attributes.
 */

$block_assets_uri = get_theme_file_uri( '/build/blocks/section-location-cta-card-badges/assets/images' );

$align                         = $attributes['align'] ?? 'full';
$cta_title                     = $attributes['ctaTitle'] ?? 'Start Your Free Consultation';
$cta_description               = $attributes['ctaDescription'] ?? '';
$cta_button_text               = $attributes['ctaButtonText'] ?? 'CONTACT US TODAY';
$cta_button_url                = $attributes['ctaButtonUrl'] ?? '#contact';
$cta_phone_label               = $attributes['ctaPhoneLabel'] ?? 'CALL TODAY';
$cta_phone_text                = $attributes['ctaPhoneText'] ?? '(480) 605-3939';
$cta_phone_url                 = $attributes['ctaPhoneUrl'] ?? 'tel:4806053939';
$cta_background_image_url      = $attributes['ctaBackgroundImageUrl'] ?? '';
$cta_background_image_id       = $attributes['ctaBackgroundImageId'] ?? 0;
$cta_background_image_fallback = $attributes['ctaBackgroundImageFallback'] ?? 'column-bg-faq.jpg';
$cta_logo_image_url            = $attributes['ctaLogoImageUrl'] ?? '';
$cta_logo_image_id             = $attributes['ctaLogoImageId'] ?? 0;
$cta_logo_image_fallback       = $attributes['ctaLogoImageFallback'] ?? 'logo-hh.svg';
$badges_text_paragraphs        = ! empty( $attributes['badgesTextParagraphs'] ) && is_array( $attributes['badgesTextParagraphs'] ) ? $attributes['badgesTextParagraphs'] : array();
$badges_items                  = ! empty( $attributes['badgesItems'] ) && is_array( $attributes['badgesItems'] ) ? $attributes['badgesItems'] : array();

// Resolve background image
$cta_bg = ! empty( $cta_background_image_url )
  ? $cta_background_image_url
  : $block_assets_uri . '/' . ltrim( (string) $cta_background_image_fallback, '/' );

// Resolve logo image
$cta_logo = ! empty( $cta_logo_image_url )
  ? $cta_logo_image_url
  : $block_assets_uri . '/' . ltrim( (string) $cta_logo_image_fallback, '/' );

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'ldp-cta-card-badges-wrapper' . ( ! empty( $align ) ? ' align' . $align : '' ),
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="ldp-container">
    <div class="ldp-cta-card ldp-cta-card--faq" id="contact">
      <div class="ldp-cta-card__bg" style="background-image: url('<?php echo esc_url( $cta_bg ); ?>')"></div>
      <div class="ldp-cta-card__logo" aria-hidden="true">
        <img src="<?php echo esc_url( $cta_logo ); ?>" alt="" class="ldp-cta-card__logo-left">
      </div>
      <div class="ldp-cta-card__body">
        <div class="ldp-cta-card__text">
          <h4 class="ldp-cta-card__title"><?php echo esc_html( $cta_title ); ?></h4>
          <?php if ( ! empty( $cta_description ) ) : ?>
            <p class="ldp-cta-card__desc"><?php echo wp_kses_post( $cta_description ); ?></p>
          <?php endif; ?>
        </div>
        <div class="ldp-cta-card__actions">
          <a class="ldp-btn ldp-btn--yellow" href="<?php echo esc_url( $cta_button_url ); ?>"><?php echo esc_html( $cta_button_text ); ?></a>
          <p class="ldp-cta-card__phone">
            <?php echo esc_html( $cta_phone_label ); ?>
            <a href="<?php echo esc_url( $cta_phone_url ); ?>"><?php echo esc_html( $cta_phone_text ); ?></a>
          </p>
        </div>
      </div>
    </div>

    <div class="ldp-faq__badges">
      <?php if ( ! empty( $badges_text_paragraphs ) && is_array( $badges_text_paragraphs ) ) : ?>
        <div class="ldp-faq__badges-row-text">
          <?php foreach ( $badges_text_paragraphs as $paragraph ) : ?>
            <?php if ( ! empty( $paragraph['text'] ) ) : ?>
              <p class="ldp-faq__badges-text"><?php echo wp_kses_post( $paragraph['text'] ); ?></p>
            <?php endif; ?>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>

      <?php if ( ! empty( $badges_items ) && is_array( $badges_items ) ) : ?>
        <div class="ldp-faq__badges-row">
          <?php foreach ( $badges_items as $badge ) : ?>
            <?php
            if ( ! is_array( $badge ) ) {
              continue;
            }

            $badge_image_url = '';
            $badge_image_id  = $badge['imageId'] ?? 0;
            if ( ! empty( $badge_image_id ) && ! empty( $badge['imageUrl'] ) ) {
              $badge_image_url = $badge['imageUrl'];
            } elseif ( ! empty( $badge['imageFallback'] ) ) {
              $badge_image_url = $badge['imageFallback'];
            }

            $badge_alt_text = '';
            if ( ! empty( $badge_image_id ) ) {
              $badge_alt_text = get_post_meta( $badge_image_id, '_wp_attachment_image_alt', true );
            }
            if ( empty( $badge_alt_text ) ) {
              $badge_alt_text = $badge['imageAlt'] ?? '';
            }

            $badge_width  = $badge['imageWidth'] ?? 303;
            $badge_height = $badge['imageHeight'] ?? 303;
            ?>

            <?php if ( ! empty( $badge_image_url ) ) : ?>
              <figure class="ldp-faq__badge">
                <img src="<?php echo esc_url( $badge_image_url ); ?>"
                     alt="<?php echo esc_attr( $badge_alt_text ); ?>"
                     width="<?php echo esc_attr( $badge_width ); ?>"
                     height="<?php echo esc_attr( $badge_height ); ?>">
              </figure>
            <?php endif; ?>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    </div>
  </div>
</section>
