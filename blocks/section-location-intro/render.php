<?php
/**
 * Section: Location – Intro (Why Choose) - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$section_title    = $attributes['title'] ?? '';
$intro_paragraph  = $attributes['introParagraph'] ?? '';
$sections         = $attributes['sections'] ?? array();
$subheader_title  = $attributes['subheaderTitle'] ?? '';
$cta_bg_url       = $attributes['ctaBackgroundImageUrl'] ?? '';
$cta_bg_id        = $attributes['ctaBackgroundImageId'] ?? 0;
$cta_logo_url     = $attributes['ctaLogoUrl'] ?? '';
$cta_logo_id      = $attributes['ctaLogoId'] ?? 0;
$cta_title        = $attributes['ctaTitle'] ?? '';
$cta_description  = $attributes['ctaDescription'] ?? '';
$cta_button_text  = $attributes['ctaButtonText'] ?? '';
$cta_phone_number = $attributes['ctaPhoneNumber'] ?? '';

// Build path for local fallback assets
$block_assets_uri = get_theme_file_uri( '/build/blocks/section-location-intro/assets/images' );

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'ldp-why-choose',
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="ldp-container">

    <!-- ── Header ────────────────────────────────────────── -->
    <?php if ( ! empty( $section_title ) || ! empty( $intro_paragraph ) ) : ?>
      <header class="ldp-why-choose__header">
        <?php if ( ! empty( $section_title ) ) : ?>
          <h2 class="ldp-why-choose__title">
            <?php echo wp_kses_post( $section_title ); ?>
          </h2>
        <?php endif; ?>

        <?php if ( ! empty( $intro_paragraph ) ) : ?>
          <p class="ldp-why-choose__intro">
            <?php echo wp_kses_post( $intro_paragraph ); ?>
          </p>
        <?php endif; ?>
      </header>
    <?php endif; ?>

    <!-- ── Sections (Repeater) ───────────────────────────── -->
    <?php if ( ! empty( $sections ) && is_array( $sections ) ) : ?>
      <?php foreach ( $sections as $section ) : ?>
        <?php
        $section_type = $section['type'] ?? '';
        ?>

        <?php if ( 'track-record' === $section_type ) : ?>
          <?php
          $subtitle        = $section['subtitle'] ?? '';
          $paragraph       = $section['paragraph'] ?? '';
          $stats           = $section['stats'] ?? array();
          $column_position = $section['columnPosition'] ?? 'text-left';
          $layout_class    = 'text-left' === $column_position ? '' : ' ldp-why-choose__track-record--reversed';
          ?>
          <div class="ldp-why-choose__track-record<?php echo esc_attr( $layout_class ); ?>">
            <div class="ldp-why-choose__track-record-text">
              <?php if ( ! empty( $subtitle ) ) : ?>
                <h3 class="ldp-why-choose__subtitle">
                  <?php echo wp_kses_post( $subtitle ); ?>
                </h3>
              <?php endif; ?>

              <?php if ( ! empty( $paragraph ) ) : ?>
                <p><?php echo wp_kses_post( $paragraph ); ?></p>
              <?php endif; ?>
            </div>

            <?php if ( ! empty( $stats ) && is_array( $stats ) ) : ?>
              <div class="ldp-why-choose__stats">
                <?php foreach ( $stats as $stat ) : ?>
                  <?php
                  $number = $stat['number'] ?? '';
                  $label  = $stat['label'] ?? '';
                  ?>
                  <?php if ( ! empty( $number ) || ! empty( $label ) ) : ?>
                    <div class="ldp-why-choose__stat">
                      <?php if ( ! empty( $number ) ) : ?>
                        <span class="ldp-why-choose__stat-number">
                          <?php echo esc_html( $number ); ?>
                        </span>
                      <?php endif; ?>

                      <?php if ( ! empty( $label ) ) : ?>
                        <span class="ldp-why-choose__stat-label">
                          <?php echo esc_html( $label ); ?>
                        </span>
                      <?php endif; ?>
                    </div>
                  <?php endif; ?>
                <?php endforeach; ?>
              </div>
            <?php endif; ?>
          </div>

        <?php elseif ( 'fee-structure' === $section_type ) : ?>
          <?php
          $badge_url       = $section['badgeImageUrl'] ?? '';
          $badge_id        = $section['badgeImageId'] ?? 0;
          $subtitle        = $section['subtitle'] ?? '';
          $paragraph       = $section['paragraph'] ?? '';
          $column_position = $section['columnPosition'] ?? 'badge-left';
          $layout_class    = 'badge-left' === $column_position ? '' : ' ldp-why-choose__fee-structure--reversed';

          // Fallback badge image
          $final_badge_url = ! empty( $badge_url ) ? $badge_url : $block_assets_uri . '/badge-no-fee.svg';
          $badge_alt       = '';
          if ( ! empty( $badge_id ) ) {
            $badge_alt = get_post_meta( $badge_id, '_wp_attachment_image_alt', true );
          }
          ?>
          <div class="ldp-why-choose__fee-structure<?php echo esc_attr( $layout_class ); ?>">
            <figure class="ldp-why-choose__badge">
              <img
                src="<?php echo esc_url( $final_badge_url ); ?>"
                alt="<?php echo esc_attr( $badge_alt ); ?>"
                width="303"
                height="303"
              >
            </figure>

            <div class="ldp-why-choose__fee-text">
              <?php if ( ! empty( $subtitle ) ) : ?>
                <h3 class="ldp-why-choose__subtitle">
                  <?php echo wp_kses_post( $subtitle ); ?>
                </h3>
              <?php endif; ?>

              <?php if ( ! empty( $paragraph ) ) : ?>
                <p><?php echo wp_kses_post( $paragraph ); ?></p>
              <?php endif; ?>
            </div>
          </div>

        <?php elseif ( 'attorneys' === $section_type ) : ?>
          <?php
          $subtitle        = $section['subtitle'] ?? '';
          $paragraph       = $section['paragraph'] ?? '';
          $team_url        = $section['teamImageUrl'] ?? '';
          $team_id         = $section['teamImageId'] ?? 0;
          $column_position = $section['columnPosition'] ?? 'text-left';
          $layout_class    = 'text-left' === $column_position ? '' : ' ldp-why-choose__attorneys--reversed';

          // Fallback team image
          $final_team_url = ! empty( $team_url ) ? $team_url : $block_assets_uri . '/img-team.png';
          $team_alt       = '';
          if ( ! empty( $team_id ) ) {
            $team_alt = get_post_meta( $team_id, '_wp_attachment_image_alt', true );
          }
          ?>
          <div class="ldp-why-choose__attorneys<?php echo esc_attr( $layout_class ); ?>">
            <div class="ldp-why-choose__attorneys-text">
              <?php if ( ! empty( $subtitle ) ) : ?>
                <h3 class="ldp-why-choose__subtitle">
                  <?php echo wp_kses_post( $subtitle ); ?>
                </h3>
              <?php endif; ?>

              <?php if ( ! empty( $paragraph ) ) : ?>
                <p><?php echo wp_kses_post( $paragraph ); ?></p>
              <?php endif; ?>
            </div>

            <figure class="ldp-why-choose__attorneys-img">
              <div class="ldp-why-choose__img-stack">
                <img
                  src="<?php echo esc_url( $final_team_url ); ?>"
                  alt="<?php echo esc_attr( $team_alt ); ?>"
                  class="ldp-why-choose__img-team"
                >
              </div>
            </figure>
          </div>

        <?php endif; ?>
      <?php endforeach; ?>
    <?php endif; ?>

  </div>

  <!-- ── Subheader ─────────────────────────────────────── -->
  <?php if ( ! empty( $subheader_title ) ) : ?>
    <div class="ldp-why-choose__subheader">
      <h3 class="ldp-why-choose__subtitle">
        <?php echo wp_kses_post( $subheader_title ); ?>
      </h3>
    </div>
  <?php endif; ?>

  <!-- ── CTA Card ──────────────────────────────────────── -->
  <div class="ldp-cta-card ldp-container">
    <?php if ( ! empty( $cta_bg_url ) ) : ?>
      <div class="ldp-cta-card__bg" style="background-image: url('<?php echo esc_url( $cta_bg_url ); ?>')"></div>
    <?php endif; ?>

    <?php if ( ! empty( $cta_logo_url ) ) : ?>
      <div class="ldp-cta-card__logo" aria-hidden="true">
        <img src="<?php echo esc_url( $cta_logo_url ); ?>" alt="" class="ldp-cta-card__logo-left">
      </div>
    <?php endif; ?>

    <div class="ldp-cta-card__body">
      <div class="ldp-cta-card__text">
        <?php if ( ! empty( $cta_title ) ) : ?>
          <h4 class="ldp-cta-card__title">
            <?php echo esc_html( $cta_title ); ?>
          </h4>
        <?php endif; ?>

        <?php if ( ! empty( $cta_description ) ) : ?>
          <p class="ldp-cta-card__desc">
            <?php echo esc_html( $cta_description ); ?>
          </p>
        <?php endif; ?>
      </div>

      <div class="ldp-cta-card__actions">
        <?php if ( ! empty( $cta_button_text ) ) : ?>
          <button class="ldp-btn ldp-btn--yellow ldp-btn" type="button">
            <?php echo esc_html( $cta_button_text ); ?>
          </button>
        <?php endif; ?>

        <?php if ( ! empty( $cta_phone_number ) ) : ?>
          <p class="ldp-cta-card__phone">
            Call Today <a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $cta_phone_number ) ); ?>">
              <?php echo esc_html( $cta_phone_number ); ?>
            </a>
          </p>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>
