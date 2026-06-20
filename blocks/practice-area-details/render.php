<?php
/**
 * Practice Area Details Block — Dynamic Rendering
 *
 * @package MBN_Theme
 *
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

// Extract attributes
$why_hire_heading               = $attributes['whyHireHeading'] ?? '';
$why_hire_subtitle              = $attributes['whyHireSubtitle'] ?? '';
$why_hire_features              = $attributes['whyHireFeatures'] ?? array();
$why_hire_photo_url             = $attributes['whyHirePhotoUrl'] ?? '';
$why_hire_photo_id              = $attributes['whyHirePhotoId'] ?? 0;
$badge90_years_url              = $attributes['badge90YearsUrl'] ?? '';
$badge90_years_id               = $attributes['badge90YearsId'] ?? 0;
$map_background_url             = $attributes['mapBackgroundUrl'] ?? '';
$map_background_id              = $attributes['mapBackgroundId'] ?? 0;
$badge_no_fee_url               = $attributes['badgeNoFeeUrl'] ?? '';
$badge_no_fee_id                = $attributes['badgeNoFeeId'] ?? 0;
$free_evaluations_title         = $attributes['freeEvaluationsTitle'] ?? '';
$free_evaluations_description   = $attributes['freeEvaluationsDescription'] ?? '';
$millions_recovered_title       = $attributes['millionsRecoveredTitle'] ?? '';
$millions_recovered_description = $attributes['millionsRecoveredDescription'] ?? '';
$case_result_tag                = $attributes['caseResultTag'] ?? '';
$case_result_amount             = $attributes['caseResultAmount'] ?? '';
$case_result_title              = $attributes['caseResultTitle'] ?? '';
$case_result_description        = $attributes['caseResultDescription'] ?? '';
$case_result_photo_url          = $attributes['caseResultPhotoUrl'] ?? '';
$case_result_photo_id           = $attributes['caseResultPhotoId'] ?? 0;
$cta1_logo_url                  = $attributes['cta1LogoUrl'] ?? '';
$cta1_logo_id                   = $attributes['cta1LogoId'] ?? 0;
$cta1_texture_url               = $attributes['cta1TextureUrl'] ?? '';
$cta1_texture_id                = $attributes['cta1TextureId'] ?? 0;
$cta1_heading                   = $attributes['cta1Heading'] ?? '';
$cta1_subtext                   = $attributes['cta1Subtext'] ?? '';
$cta1_button_text               = $attributes['cta1ButtonText'] ?? '';
$cta1_button_url                = $attributes['cta1ButtonUrl'] ?? '';
$cta1_phone_label               = $attributes['cta1PhoneLabel'] ?? '';
$cta1_phone_number              = $attributes['cta1PhoneNumber'] ?? '';
$after_accident_heading         = $attributes['afterAccidentHeading'] ?? '';
$after_accident_splits          = $attributes['afterAccidentSplits'] ?? array();
$steps_heading                  = $attributes['stepsHeading'] ?? '';
$steps_intro_text               = $attributes['stepsIntroText'] ?? '';
$steps_accordion                = $attributes['stepsAccordion'] ?? array();
$chevron_icon_url               = $attributes['chevronIconUrl'] ?? '';
$chevron_icon_id                = $attributes['chevronIconId'] ?? 0;
$time_limit_heading             = $attributes['timeLimitHeading'] ?? '';
$time_limit_subtitle            = $attributes['timeLimitSubtitle'] ?? '';
$time_limit_text                = $attributes['timeLimitText'] ?? '';
$time_limit_photo_url           = $attributes['timeLimitPhotoUrl'] ?? '';
$time_limit_photo_id            = $attributes['timeLimitPhotoId'] ?? 0;
$insurance_heading              = $attributes['insuranceHeading'] ?? '';
$insurance_text                 = $attributes['insuranceText'] ?? '';
$insurance_photo_url            = $attributes['insurancePhotoUrl'] ?? '';
$insurance_photo_id             = $attributes['insurancePhotoId'] ?? 0;
$cta2_logo_url                  = $attributes['cta2LogoUrl'] ?? '';
$cta2_logo_id                   = $attributes['cta2LogoId'] ?? 0;
$cta2_texture_url               = $attributes['cta2TextureUrl'] ?? '';
$cta2_texture_id                = $attributes['cta2TextureId'] ?? 0;
$cta2_heading                   = $attributes['cta2Heading'] ?? '';
$cta2_subtext                   = $attributes['cta2Subtext'] ?? '';
$cta2_button_text               = $attributes['cta2ButtonText'] ?? '';
$cta2_button_url                = $attributes['cta2ButtonUrl'] ?? '';
$cta2_phone_label               = $attributes['cta2PhoneLabel'] ?? '';
$cta2_phone_number              = $attributes['cta2PhoneNumber'] ?? '';
$liability_heading              = $attributes['liabilityHeading'] ?? '';
$liability_subtitle             = $attributes['liabilitySubtitle'] ?? '';
$liability_items                = $attributes['liabilityItems'] ?? array();
$compensation_heading           = $attributes['compensationHeading'] ?? '';
$compensation_subtitle          = $attributes['compensationSubtitle'] ?? '';
$compensation_items             = $attributes['compensationItems'] ?? array();
$documentation_heading          = $attributes['documentationHeading'] ?? '';
$documentation_text             = $attributes['documentationText'] ?? '';
$documentation_photo_url        = $attributes['documentationPhotoUrl'] ?? '';
$documentation_photo_id         = $attributes['documentationPhotoId'] ?? 0;
$badge_cards                    = $attributes['badgeCards'] ?? array();
$attorneys_heading              = $attributes['attorneysHeading'] ?? '';
$attorneys_text                 = $attributes['attorneysText'] ?? '';
$attorneys_photo_url            = $attributes['attorneysPhotoUrl'] ?? '';
$attorneys_photo_id             = $attributes['attorneysPhotoId'] ?? 0;

// Block assets URI for fallback images
$block_assets_uri = get_theme_file_uri( '/build/blocks/practice-area-details/assets/images' );

// Image fallbacks
$why_hire_photo      = ! empty( $why_hire_photo_url ) ? $why_hire_photo_url : $block_assets_uri . '/img-why-hire-photo.png';
$badge90_years       = ! empty( $badge90_years_url ) ? $badge90_years_url : $block_assets_uri . '/badge-90-plus-combined-legal-experience-blck.svg';
$map_background      = ! empty( $map_background_url ) ? $map_background_url : $block_assets_uri . '/hero-map-bg.jpg';
$badge_no_fee        = ! empty( $badge_no_fee_url ) ? $badge_no_fee_url : $block_assets_uri . '/badge-no-fee-until-win.svg';
$case_result_photo   = ! empty( $case_result_photo_url ) ? $case_result_photo_url : $block_assets_uri . '/case-result-photo.jpg';
$cta1_logo           = ! empty( $cta1_logo_url ) ? $cta1_logo_url : $block_assets_uri . '/logo-mark.svg';
$cta1_texture        = ! empty( $cta1_texture_url ) ? $cta1_texture_url : $block_assets_uri . '/cta-bg-texture.jpg';
$chevron_icon        = ! empty( $chevron_icon_url ) ? $chevron_icon_url : $block_assets_uri . '/icon-chevron-up.svg';
$time_limit_photo    = ! empty( $time_limit_photo_url ) ? $time_limit_photo_url : $block_assets_uri . '/photo-time-limit.jpg';
$insurance_photo     = ! empty( $insurance_photo_url ) ? $insurance_photo_url : $block_assets_uri . '/photo-insurance-meeting.jpg';
$cta2_logo           = ! empty( $cta2_logo_url ) ? $cta2_logo_url : $block_assets_uri . '/logo-mark.svg';
$cta2_texture        = ! empty( $cta2_texture_url ) ? $cta2_texture_url : $block_assets_uri . '/cta-bg-texture.jpg';
$documentation_photo = ! empty( $documentation_photo_url ) ? $documentation_photo_url : $block_assets_uri . '/photo-documentation.jpg';
$attorneys_photo     = ! empty( $attorneys_photo_url ) ? $attorneys_photo_url : $block_assets_uri . '/img-hastings-with-logo.png';

// Wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

<!-- ======================================================
     SECTION 1 · Why Hire Hastings & Hastings?
     ====================================================== -->
<section class="pad-why-hire">
  <div class="pad-container">
    <!-- Header text -->
    <div class="pad-section-header pad-section-header--center">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $why_hire_heading ); ?></h2>
      <p class="pad-section-subtitle"><?php echo esc_html( $why_hire_subtitle ); ?></p>
    </div>

    <div class="pad-why-hire__layout">

      <!-- Left: feature text blocks -->
      <div class="pad-why-hire__features">
        <?php foreach ( $why_hire_features as $feature ) : ?>
        <article class="pad-why-hire__feature">
          <h3><?php echo esc_html( $feature['title'] ?? '' ); ?></h3>
          <?php echo wp_kses_post( $feature['description'] ?? '' ); ?>
        </article>
        <?php endforeach; ?>
      </div>

      <!-- Right: photos + 90+ years badge -->
      <div class="pad-why-hire__visual">
        <div class="pad-why-hire__photo-stack" aria-hidden="true">
          <img src="<?php echo esc_url( $why_hire_photo ); ?>" alt="" class="pad-why-hire__photo-front">
        </div>
        <div class="pad-badge pad-badge--years" aria-label="90+ Years Combined Legal Experience">
          <img src="<?php echo esc_url( $badge90_years ); ?>" alt="" aria-hidden="true">
        </div>
      </div>

    </div>
  </div>

  <!-- Full-width map background -->
  <div class="pad-why-hire__map" aria-hidden="true">
    <img src="<?php echo esc_url( $map_background ); ?>" alt="">
  </div>

  <div class="pad-container">

    <!-- Secondary row: No Fee badge + Free Evaluations feature | Millions recovered -->
    <div class="pad-why-hire__secondary">

      <div class="pad-why-hire__badge-col">
        <div class="pad-badge pad-badge--no-fee" aria-label="No Fee Until We Win — No Settlement No Fee">
          <img src="<?php echo esc_url( $badge_no_fee ); ?>" alt="" class="pad-badge__settle-text" aria-hidden="true">
        </div>
        <article class="pad-why-hire__feature">
          <h3><?php echo esc_html( $free_evaluations_title ); ?></h3>
          <?php echo wp_kses_post( $free_evaluations_description ); ?>
        </article>
      </div>

      <div class="pad-why-hire__millions">
        <h3><?php echo esc_html( $millions_recovered_title ); ?></h3>
        <?php echo wp_kses_post( $millions_recovered_description ); ?>
      </div>

    </div>

  </div>

  <!-- Case Result -->
  <div class="pad-case-result pad-container">
    <figure class="pad-case-result__photo">
      <img src="<?php echo esc_url( $case_result_photo ); ?>" alt="<?php echo esc_attr( $case_result_tag . ' case result' ); ?>">
    </figure>
    <div class="pad-case-result__card">
      <span class="pad-case-result__tag"><?php echo esc_html( $case_result_tag ); ?></span>
      <p class="pad-case-result__amount"><?php echo esc_html( $case_result_amount ); ?></p>
      <h4 class="pad-case-result__title"><?php echo esc_html( $case_result_title ); ?></h4>
      <?php echo wp_kses_post( $case_result_description ); ?>
    </div>
  </div>

  <!-- CTA Banner -->
  <div class="pad-cta-bar">
    <div class="pad-cta-bar__bg" aria-hidden="true">
      <img src="<?php echo esc_url( $cta1_texture ); ?>" alt="">
    </div>
    <div class="pad-container pad-cta-bar__inner">
      <div class="pad-cta-bar__logo" aria-hidden="true">
        <img src="<?php echo esc_url( $cta1_logo ); ?>" alt="">
        <div class="pad-cta-bar__text">
          <h4 class="pad-cta-bar__heading"><?php echo esc_html( $cta1_heading ); ?></h4>
          <p class="pad-cta-bar__subtext"><?php echo esc_html( $cta1_subtext ); ?></p>
        </div>
      </div>
      <div class="pad-cta-bar__body">
        <div class="pad-cta-bar__actions">
          <a href="<?php echo esc_url( $cta1_button_url ); ?>" class="pad-btn pad-btn--gold"><?php echo esc_html( $cta1_button_text ); ?></a>
          <p class="pad-cta-bar__phone"><?php echo esc_html( $cta1_phone_label ); ?> <a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $cta1_phone_number ) ); ?>"><?php echo esc_html( $cta1_phone_number ); ?></a></p>
        </div>
      </div>
    </div>
  </div>

</section>


<!-- ======================================================
     SECTION 2 · What To Do After a Phoenix Car Accident
     ====================================================== -->
<section class="pad-after-accident">
  <div class="pad-container">

        <?php
        $split_default_images = array(
			'photo-accident-scene.jpg',
			'photo-police-scene.jpg',
			'photo-legal-meeting.jpg',
        );
        foreach ( $after_accident_splits as $index => $split ) :
          $layout_class    = 'pad-split--' . esc_attr( $split['layout'] ?? 'text-left' );
          $split_image_url = ! empty( $split['imageUrl'] ) ? $split['imageUrl'] : $block_assets_uri . '/' . $split_default_images[ $index % count( $split_default_images ) ];
          $split_image_id  = $split['imageId'] ?? 0;

          // Get alt text
          $split_alt_text = '';
          if ( ! empty( $split_image_id ) ) {
            $split_alt_text = get_post_meta( $split_image_id, '_wp_attachment_image_alt', true );
          }
          if ( empty( $split_alt_text ) ) {
            $split_alt_text = __( 'Car accident scene', 'mbn-theme' );
          }
          ?>

    <div class="pad-split <?php echo esc_attr( $layout_class ); ?>">
      <div class="pad-split__text">
          <?php if ( ! empty( $after_accident_heading ) && 0 === $index ) : ?>
        <h2 class="pad-section-heading"><?php echo wp_kses_post( $after_accident_heading ); ?></h2>
        <?php endif; ?>
          <?php echo wp_kses_post( $split['text'] ); ?>
      </div>
      <figure class="pad-split__image">
        <img src="<?php echo esc_url( $split_image_url ); ?>" alt="<?php echo esc_attr( $split_alt_text ); ?>" loading="lazy">
      </figure>
    </div>

    <?php endforeach; ?>

  </div>
</section>


<!-- ======================================================
     SECTION 3 · Your Personal Injury Claim: Steps To Follow
     ====================================================== -->
<section class="pad-steps">
  <div class="pad-container">
    <div class="pad-steps__layout">

      <!-- Left: intro text -->
      <div class="pad-steps__intro">
        <h2 class="pad-section-heading"><?php echo wp_kses_post( $steps_heading ); ?></h2>
        <?php echo wp_kses_post( $steps_intro_text ); ?>
      </div>

      <!-- Right: numbered accordion -->
      <div class="pad-steps__accordion" role="list">

        <?php foreach ( $steps_accordion as $step_index => $step ) : ?>
          <?php
          $step_id = 'step-answer-' . ( $step_index + 1 );
          $is_open = ( 0 === $step_index );
          ?>
        <div class="pad-steps__item <?php echo $is_open ? 'pad-steps__item--open' : ''; ?>" role="listitem">
          <button class="pad-steps__question" aria-expanded="<?php echo $is_open ? 'true' : 'false'; ?>" aria-controls="<?php echo esc_attr( $step_id ); ?>">
            <ol class="pad-steps__ol" start="<?php echo esc_attr( $step_index + 1 ); ?>"><li><?php echo esc_html( $step['question'] ?? '' ); ?></li></ol>
            <img src="<?php echo esc_url( $chevron_icon ); ?>" alt="" aria-hidden="true" class="pad-steps__icon">
          </button>
          <div class="pad-steps__answer <?php echo $is_open ? '' : 'pad-steps__answer--hidden'; ?>" id="<?php echo esc_attr( $step_id ); ?>">
            <?php echo wp_kses_post( $step['answer'] ?? '' ); ?>
          </div>
        </div>
        <?php endforeach; ?>

      </div>
    </div>
  </div>
</section>


<!-- ======================================================
     SECTION 4 · Time Limit to File a Claim in Arizona
     ====================================================== -->
<section class="pad-time-limit">
  <div class="pad-container">
    <!-- Header text -->
    <div class="pad-section-header pad-section-header--center">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $time_limit_heading ); ?></h2>
      <div class="pad-section-subtitle"><?php echo wp_kses_post( $time_limit_subtitle ); ?></div>
    </div>

    <div class="pad-split pad-split--text-left">
      <div class="pad-split__text">
        <?php echo wp_kses_post( $time_limit_text ); ?>
      </div>
      <figure class="pad-split__image">
        <?php
        $time_limit_alt_text = '';
        if ( ! empty( $time_limit_photo_id ) ) {
          $time_limit_alt_text = get_post_meta( $time_limit_photo_id, '_wp_attachment_image_alt', true );
        }
        if ( empty( $time_limit_alt_text ) ) {
          $time_limit_alt_text = __( 'Person signing legal documents', 'mbn-theme' );
        }
        ?>
        <img src="<?php echo esc_url( $time_limit_photo ); ?>" alt="<?php echo esc_attr( $time_limit_alt_text ); ?>" loading="lazy">
      </figure>
    </div>

  </div>
</section>


<!-- ======================================================
     SECTION 5 · Dealing With Insurance Companies
     ====================================================== -->
<section class="pad-insurance">
  <div class="pad-container">
    <!-- Header text -->
    <div class="pad-split pad-split--text-left">
      <div class="pad-split__text">
        <h2 class="pad-section-heading"><?php echo wp_kses_post( $insurance_heading ); ?></h2>
        <?php echo wp_kses_post( $insurance_text ); ?>
      </div>
      <figure class="pad-split__image">
        <?php
        $insurance_alt_text = '';
        if ( ! empty( $insurance_photo_id ) ) {
          $insurance_alt_text = get_post_meta( $insurance_photo_id, '_wp_attachment_image_alt', true );
        }
        if ( empty( $insurance_alt_text ) ) {
          $insurance_alt_text = __( 'Attorney meeting with client about insurance claim', 'mbn-theme' );
        }
        ?>
        <img src="<?php echo esc_url( $insurance_photo ); ?>" alt="<?php echo esc_attr( $insurance_alt_text ); ?>" loading="lazy">
      </figure>
    </div>

  </div>

  <!-- CTA Banner -->
  <div class="pad-cta-bar">
    <div class="pad-cta-bar__bg" aria-hidden="true">
      <img src="<?php echo esc_url( $cta2_texture ); ?>" alt="">
    </div>
    <div class="pad-container pad-cta-bar__inner">
      <div class="pad-cta-bar__logo" aria-hidden="true">
        <img src="<?php echo esc_url( $cta2_logo ); ?>" alt="">
        <div class="pad-cta-bar__text">
          <h4 class="pad-cta-bar__heading"><?php echo esc_html( $cta2_heading ); ?></h4>
          <p class="pad-cta-bar__subtext"><?php echo esc_html( $cta2_subtext ); ?></p>
        </div>
      </div>
      <div class="pad-cta-bar__body">
        <div class="pad-cta-bar__actions">
          <a href="<?php echo esc_url( $cta2_button_url ); ?>" class="pad-btn pad-btn--gold"><?php echo esc_html( $cta2_button_text ); ?></a>
          <p class="pad-cta-bar__phone"><?php echo esc_html( $cta2_phone_label ); ?> <a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $cta2_phone_number ) ); ?>"><?php echo esc_html( $cta2_phone_number ); ?></a></p>
        </div>
      </div>
    </div>
  </div>

</section>


<!-- ======================================================
     SECTION 6 · Who is Liable For My Phoenix Car Accident?
     ====================================================== -->
<section class="pad-liability">
  <div class="pad-container">
    <!-- Header text -->
    <div class="pad-section-header pad-section-header--center">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $liability_heading ); ?></h2>
      <p class="pad-section-subtitle"><?php echo esc_html( $liability_subtitle ); ?></p>
    </div>

    <ul class="pad-liability__list">

      <?php foreach ( $liability_items as $item ) : ?>
      <li class="pad-liability__item">
        <hr class="pad-liability__divider" aria-hidden="true">
        <div class="pad-liability__row">
          <h3 class="pad-liability__term"><?php echo esc_html( $item['term'] ?? '' ); ?></h3>
          <div class="pad-liability__desc">
            <?php echo wp_kses_post( $item['description'] ?? '' ); ?>
          </div>
        </div>
      </li>
      <?php endforeach; ?>

    </ul>
  </div>
</section>


<!-- ======================================================
     SECTION 7 · Recovering Compensation For My Injury
     ====================================================== -->
<section class="pad-compensation">
  <div class="pad-container">
    <!-- Header text -->
    <div class="pad-section-header pad-section-header--center">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $compensation_heading ); ?></h2>
      <p class="pad-section-subtitle"><?php echo esc_html( $compensation_subtitle ); ?></p>
    </div>

    <div class="pad-compensation__grid">

      <?php foreach ( $compensation_items as $item ) : ?>
      <article class="pad-compensation__item">
        <h3><?php echo esc_html( $item['title'] ?? '' ); ?></h3>
        <?php echo wp_kses_post( $item['description'] ?? '' ); ?>
      </article>
      <?php endforeach; ?>

    </div>
  </div>
</section>


<!-- ======================================================
     SECTION 8 · Documentation Is Important
     ====================================================== -->
<section class="pad-documentation">
  <div class="pad-container">
    <div class="pad-split pad-split--text-left">
      <div class="pad-split__text">
        <h2 class="pad-section-heading"><?php echo wp_kses_post( $documentation_heading ); ?></h2>
        <?php echo wp_kses_post( $documentation_text ); ?>
      </div>
      <figure class="pad-split__image">
        <?php
        $documentation_alt_text = '';
        if ( ! empty( $documentation_photo_id ) ) {
          $documentation_alt_text = get_post_meta( $documentation_photo_id, '_wp_attachment_image_alt', true );
        }
        if ( empty( $documentation_alt_text ) ) {
          $documentation_alt_text = __( 'Smartphone displaying online medical records', 'mbn-theme' );
        }
        ?>
        <img src="<?php echo esc_url( $documentation_photo ); ?>" alt="<?php echo esc_attr( $documentation_alt_text ); ?>" loading="lazy">
      </figure>
    </div>
  </div>
</section>


<!-- ======================================================
     SECTION 9 · Fee Badges + Our Accident Attorneys Can Help
     ====================================================== -->
<section class="pad-attorneys">

  <!-- Three badge cards -->
  <div class="pad-container">
    <div class="pad-attorneys__badges">

      <?php
      $badge_default_images = array(
		  'badge-no-fee-until-win.svg',
		  'badge-29-percent-discount.svg',
		  'badge-14-percent.svg',
      );
      foreach ( $badge_cards as $badge_index => $badge ) :
        $badge_image_url = ! empty( $badge['imageUrl'] ) ? $badge['imageUrl'] : $block_assets_uri . '/' . $badge_default_images[ $badge_index % count( $badge_default_images ) ];
        $badge_image_id  = $badge['imageId'] ?? 0;
        ?>

      <div class="pad-badge-card">
        <div class="pad-badge pad-badge--num pad-badge--sm" aria-label="Badge">
          <img src="<?php echo esc_url( $badge_image_url ); ?>" alt="" aria-hidden="true">
        </div>
        <p><?php echo esc_html( $badge['description'] ?? '' ); ?></p>
      </div>

      <?php endforeach; ?>

    </div>
  </div>

  <!-- Attorney photo section -->
  <div class="pad-attorneys__feature">
    <div class="pad-attorneys__photo-col" aria-hidden="true">
      <img src="<?php echo esc_url( $attorneys_photo ); ?>" alt="" class="pad-attorneys__attorney">
    </div>
    <div class="pad-attorneys__text-col">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $attorneys_heading ); ?></h2>
      <?php echo wp_kses_post( $attorneys_text ); ?>
    </div>
  </div>

</section>

</div>
