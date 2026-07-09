<?php
/**
 * Practice Area Details Block — Dynamic Rendering
 *
 * Instance-based: renders an ordered, repeatable list of section instances.
 *
 * @package MBN_Theme
 *
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$sections = $attributes['sections'] ?? array();

// Block assets URI for fallback images.
$block_assets_uri = get_theme_file_uri( '/build/blocks/practice-area-details/assets/images' );

if ( ! function_exists( 'mbn_pad_alt_text' ) ) {
  /**
   * Resolve an attachment's alt text, with a fallback.
   *
   * @param int    $image_id Attachment ID.
   * @param string $fallback Fallback alt text.
   * @return string
   */
  function mbn_pad_alt_text( $image_id, $fallback ) {
    $alt = '';
    if ( ! empty( $image_id ) ) {
      $alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
    }
    return ! empty( $alt ) ? $alt : $fallback;
  }
}

if ( ! function_exists( 'mbn_pad_render_section_title' ) ) {
  /**
   * Render the optional Section Title band above a component.
   *
   * @param array $data Section title data: heading, paragraphs, backgroundColor.
   */
  function mbn_pad_render_section_title( $data ) {
    $heading    = $data['heading'] ?? '';
    $paragraphs = $data['paragraphs'] ?? array();
    $bg_color   = $data['backgroundColor'] ?? 'bg-light-blue';

    if ( empty( $heading ) && empty( $paragraphs ) ) {
      return;
    }

    $bg_class = $bg_color;
    $bg_style = '';
    if ( strpos( (string) $bg_color, '#' ) === 0 ) {
      $bg_class = '';
      $bg_style = 'background-color: ' . $bg_color . ';';
    }
    ?>
  <div class="pad-intro <?php echo esc_attr( $bg_class ); ?>" style="<?php echo esc_attr( $bg_style ); ?>">
    <div class="pad-container pad-intro__inner">
      <?php if ( ! empty( $heading ) ) : ?>
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $heading ); ?></h2>
      <?php endif; ?>
      <?php foreach ( (array) $paragraphs as $paragraph ) : ?>
        <?php if ( ! empty( $paragraph ) ) : ?>
      <div class="pad-section-subtitle"><?php echo wp_kses_post( $paragraph ); ?></div>
        <?php endif; ?>
      <?php endforeach; ?>
    </div>
  </div>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_why_hire' ) ) {
  /**
   * Render a Why Hire section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_why_hire( $data, $assets ) {
    $d         = array_merge(
      array(
		  'heading'                      => '',
		  'subtitle'                     => '',
		  'features'                     => array(),
		  'freeEvaluationsTitle'         => '',
		  'freeEvaluationsDescription'   => '',
		  'millionsRecoveredTitle'       => '',
		  'millionsRecoveredDescription' => '',
      ),
      (array) $data
    );
    $photo     = ! empty( $data['photoUrl'] ) ? $data['photoUrl'] : $assets . '/img-why-hire-photo.png';
    $badge90   = ! empty( $data['badge90YearsUrl'] ) ? $data['badge90YearsUrl'] : $assets . '/badge-90-plus-combined-legal-experience-blck.svg';
    $map_bg    = ! empty( $data['mapBackgroundUrl'] ) ? $data['mapBackgroundUrl'] : $assets . '/hero-map-bg.jpg';
    $badge_fee = ! empty( $data['badgeNoFeeUrl'] ) ? $data['badgeNoFeeUrl'] : $assets . '/badge-no-fee-until-win.svg';
    ?>
<section class="pad-why-hire">
  <div class="pad-container">
    <div class="pad-section-header pad-section-header--center">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $d['heading'] ); ?></h2>
      <p class="pad-section-subtitle"><?php echo esc_html( $d['subtitle'] ); ?></p>
    </div>

    <div class="pad-why-hire__layout">
      <div class="pad-why-hire__features">
        <?php foreach ( $d['features'] as $feature ) : ?>
        <article class="pad-why-hire__feature">
          <h3><?php echo esc_html( $feature['title'] ?? '' ); ?></h3>
          <?php echo wp_kses_post( $feature['description'] ?? '' ); ?>
        </article>
        <?php endforeach; ?>
      </div>

      <div class="pad-why-hire__visual">
        <div class="pad-why-hire__photo-stack" aria-hidden="true">
          <img src="<?php echo esc_url( $photo ); ?>" alt="" class="pad-why-hire__photo-front">
        </div>
        <div class="pad-badge pad-badge--years" aria-label="90+ Years Combined Legal Experience">
          <img src="<?php echo esc_url( $badge90 ); ?>" alt="" aria-hidden="true">
        </div>
      </div>
    </div>
  </div>

  <div class="pad-why-hire__map" aria-hidden="true">
    <img src="<?php echo esc_url( $map_bg ); ?>" alt="">
  </div>

  <div class="pad-container">
    <div class="pad-why-hire__secondary">
      <div class="pad-why-hire__badge-col">
        <div class="pad-badge pad-badge--no-fee" aria-label="No Fee Until We Win — No Settlement No Fee">
          <img src="<?php echo esc_url( $badge_fee ); ?>" alt="" class="pad-badge__settle-text" aria-hidden="true">
        </div>
        <article class="pad-why-hire__feature">
          <h3><?php echo esc_html( $d['freeEvaluationsTitle'] ); ?></h3>
          <?php echo wp_kses_post( $d['freeEvaluationsDescription'] ); ?>
        </article>
      </div>
      <?php if ( ! empty( $d['millionsRecoveredTitle'] ) || ! empty( $d['millionsRecoveredDescription'] ) ) : ?>
      <div class="pad-why-hire__millions">
        <h3><?php echo esc_html( $d['millionsRecoveredTitle'] ); ?></h3>
        <?php echo wp_kses_post( $d['millionsRecoveredDescription'] ); ?>
      </div>
      <?php endif; ?>
    </div>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_case_result' ) ) {
  /**
   * Render a Case Result card.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_case_result( $data, $assets ) {
    $has_photo = ! empty( $data['photoUrl'] );
    $has_card  = ! empty( $data['tag'] ) || ! empty( $data['amount'] ) || ! empty( $data['title'] ) || ! empty( $data['description'] );
    if ( ! $has_photo && ! $has_card ) {
      return;
    }
    $photo = $has_photo ? $data['photoUrl'] : $assets . '/case-result-photo.jpg';
    $tag   = $data['tag'] ?? '';
    ?>
<div class="pad-case-result pad-container">
    <?php if ( $has_photo ) : ?>
  <figure class="pad-case-result__photo">
    <img src="<?php echo esc_url( $photo ); ?>" alt="<?php echo esc_attr( $tag . ' case result' ); ?>">
  </figure>
  <?php endif; ?>
    <?php
    if ( $has_card ) {
      mbn_pad_render_case_result_card( $data );
    }
    ?>
</div>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_case_result_card' ) ) {
  /**
   * Render the inner card of a Case Result section.
   *
   * @param array $data Section data.
   */
  function mbn_pad_render_case_result_card( $data ) {
    $tag         = $data['tag'] ?? '';
    $amount      = $data['amount'] ?? '';
    $title       = $data['title'] ?? '';
    $description = $data['description'] ?? '';
    ?>
  <div class="pad-case-result__card">
      <?php if ( '' !== $tag ) : ?>
    <span class="pad-case-result__tag"><?php echo esc_html( $tag ); ?></span>
    <?php endif; ?>
      <?php if ( '' !== $amount ) : ?>
    <p class="pad-case-result__amount"><?php echo esc_html( $amount ); ?></p>
    <?php endif; ?>
      <?php if ( '' !== $title ) : ?>
    <h4 class="pad-case-result__title"><?php echo esc_html( $title ); ?></h4>
    <?php endif; ?>
      <?php if ( '' !== $description ) : ?>
        <?php echo wp_kses_post( $description ); ?>
    <?php endif; ?>
  </div>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_cta' ) ) {
  /**
   * Render a CTA banner.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_cta( $data, $assets ) {
    $logo    = ! empty( $data['logoUrl'] ) ? $data['logoUrl'] : $assets . '/logo-mark.svg';
    $texture = ! empty( $data['textureUrl'] ) ? $data['textureUrl'] : $assets . '/cta-bg-texture.jpg';
    $phone   = $data['phoneNumber'] ?? '';
    $tel     = preg_replace( '/[^0-9+]/', '', $phone );
    ?>
<div class="pad-cta-bar">
  <div class="pad-cta-bar__bg" aria-hidden="true">
    <img src="<?php echo esc_url( $texture ); ?>" alt="">
  </div>
  <div class="pad-container pad-cta-bar__inner">
    <div class="pad-cta-bar__logo" aria-hidden="true">
      <img src="<?php echo esc_url( $logo ); ?>" alt="">
      <div class="pad-cta-bar__text">
        <h4 class="pad-cta-bar__heading"><?php echo esc_html( $data['heading'] ?? '' ); ?></h4>
        <p class="pad-cta-bar__subtext"><?php echo esc_html( $data['subtext'] ?? '' ); ?></p>
      </div>
    </div>
    <div class="pad-cta-bar__body">
      <div class="pad-cta-bar__actions">
        <a href="<?php echo esc_url( $data['buttonUrl'] ?? '' ); ?>" class="pad-btn pad-btn--gold"><?php echo esc_html( $data['buttonText'] ?? '' ); ?></a>
        <p class="pad-cta-bar__phone"><?php echo esc_html( $data['phoneLabel'] ?? '' ); ?> <a href="tel:<?php echo esc_attr( $tel ); ?>"><?php echo esc_html( $phone ); ?></a></p>
      </div>
    </div>
  </div>
</div>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_after_accident' ) ) {
  /**
   * Render an After Accident section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_after_accident( $data, $assets ) {
    $heading  = $data['heading'] ?? '';
    $splits   = $data['splits'] ?? array();
    $defaults = array( 'photo-accident-scene.jpg', 'photo-police-scene.jpg', 'photo-legal-meeting.jpg' );
    ?>
<section class="pad-after-accident">
  <div class="pad-container">
    <?php foreach ( $splits as $index => $split ) : ?>
      <?php
      $layout_class = 'pad-split--' . esc_attr( $split['layout'] ?? 'text-left' );
      $image_url    = ! empty( $split['imageUrl'] ) ? $split['imageUrl'] : $assets . '/' . $defaults[ $index % count( $defaults ) ];
      $alt_text     = mbn_pad_alt_text( $split['imageId'] ?? 0, __( 'Car accident scene', 'mbn-theme' ) );
      ?>
    <div class="pad-split <?php echo esc_attr( $layout_class ); ?>">
      <div class="pad-split__text">
        <?php if ( ! empty( $heading ) && 0 === $index ) : ?>
        <h2 class="pad-section-heading"><?php echo wp_kses_post( $heading ); ?></h2>
        <?php endif; ?>
        <?php echo wp_kses_post( $split['text'] ?? '' ); ?>
      </div>
      <figure class="pad-split__image">
        <img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $alt_text ); ?>" loading="lazy">
      </figure>
    </div>
    <?php endforeach; ?>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_steps_question' ) ) {
  /**
   * Render the question label of a Steps accordion item.
   *
   * Uses phrasing-content spans (never list elements) so the markup is valid
   * inside the accordion <button>. When the list type is 'ol' the step number
   * is rendered as text; 'ul' shows the question with no number.
   *
   * @param string $question    Question text.
   * @param string $list_type   List style: 'ol' (numbered) or 'ul' (no marker).
   * @param int    $step_number 1-based step number, shown when numbered.
   */
  function mbn_pad_render_steps_question( $question, $list_type, $step_number ) {
    if ( 'ul' === $list_type ) {
      printf(
        '<span class="pad-steps__question-label"><span class="pad-steps__question-text">%s</span></span>',
        esc_html( $question )
      );
      return;
    }
    printf(
      '<span class="pad-steps__question-label"><span class="pad-steps__question-number">%s.</span><span class="pad-steps__question-text">%s</span></span>',
      esc_html( $step_number ),
      esc_html( $question )
    );
  }
}

if ( ! function_exists( 'mbn_pad_render_steps_plain_list' ) ) {
  /**
   * Render a Steps list as plain title-only rows (no accordion).
   *
   * @param array $items Step items; only each item's question is shown.
   */
  function mbn_pad_render_steps_plain_list( $items ) {
    if ( ! is_array( $items ) ) {
      return;
    }
    ?>
      <ul class="pad-steps__plain-list">
        <?php foreach ( $items as $item ) : ?>
        <li class="pad-steps__plain-item"><?php echo wp_kses_post( $item['question'] ?? '' ); ?></li>
        <?php endforeach; ?>
      </ul>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_steps' ) ) {
  /**
   * Render a Steps Accordion section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_steps( $data, $assets ) {
    $d         = array_merge(
      array(
		  'heading'   => '',
		  'introText' => '',
		  'listType'  => 'ol',
      ),
      (array) $data
    );
    $accordion = $d['accordion'] ?? array();
    $chevron   = ! empty( $d['chevronIconUrl'] ) ? $d['chevronIconUrl'] : $assets . '/icon-chevron-up.svg';
    ?>
<section class="pad-steps">
  <div class="pad-container">
    <div class="pad-steps__layout">
      <div class="pad-steps__intro">
        <h2 class="pad-section-heading"><?php echo wp_kses_post( $d['heading'] ); ?></h2>
        <?php echo wp_kses_post( $d['introText'] ); ?>
      </div>

      <?php if ( 'plain' === $d['listType'] ) : ?>
        <?php mbn_pad_render_steps_plain_list( $accordion ); ?>
      <?php else : ?>
      <div class="pad-steps__accordion" role="list">
        <?php foreach ( $accordion as $step_index => $step ) : ?>
          <?php
          $step_id = 'step-answer-' . ( $step_index + 1 );
          $is_open = ( 0 === $step_index );
          ?>
        <div class="pad-steps__item <?php echo $is_open ? 'pad-steps__item--open' : ''; ?>" role="listitem">
          <button class="pad-steps__question" aria-expanded="<?php echo $is_open ? 'true' : 'false'; ?>" aria-controls="<?php echo esc_attr( $step_id ); ?>">
            <?php mbn_pad_render_steps_question( $step['question'] ?? '', $d['listType'], $step_index + 1 ); ?>
            <img src="<?php echo esc_url( $chevron ); ?>" alt="" aria-hidden="true" class="pad-steps__icon">
          </button>
          <div class="pad-steps__answer <?php echo $is_open ? '' : 'pad-steps__answer--hidden'; ?>" id="<?php echo esc_attr( $step_id ); ?>">
            <?php echo wp_kses_post( $step['answer'] ?? '' ); ?>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>
    </div>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_time_limit' ) ) {
  /**
   * Render a Time Limit section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_time_limit( $data, $assets ) {
    $photo = ! empty( $data['photoUrl'] ) ? $data['photoUrl'] : $assets . '/photo-time-limit.jpg';
    $alt   = mbn_pad_alt_text( $data['photoId'] ?? 0, __( 'Person signing legal documents', 'mbn-theme' ) );
    ?>
<section class="pad-time-limit">
  <div class="pad-container">
    <div class="pad-section-header pad-section-header--center">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $data['heading'] ?? '' ); ?></h2>
      <div class="pad-section-subtitle"><?php echo wp_kses_post( $data['subtitle'] ?? '' ); ?></div>
    </div>

    <div class="pad-split pad-split--text-left">
      <div class="pad-split__text">
        <?php echo wp_kses_post( $data['text'] ?? '' ); ?>
      </div>
      <figure class="pad-split__image">
        <img src="<?php echo esc_url( $photo ); ?>" alt="<?php echo esc_attr( $alt ); ?>" loading="lazy">
      </figure>
    </div>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_insurance' ) ) {
  /**
   * Render an Insurance section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_insurance( $data, $assets ) {
    $photo = ! empty( $data['photoUrl'] ) ? $data['photoUrl'] : $assets . '/photo-insurance-meeting.jpg';
    $alt   = mbn_pad_alt_text( $data['photoId'] ?? 0, __( 'Attorney meeting with client about insurance claim', 'mbn-theme' ) );
    ?>
<section class="pad-insurance">
  <div class="pad-container">
    <div class="pad-split pad-split--text-left">
      <div class="pad-split__text">
        <h2 class="pad-section-heading"><?php echo wp_kses_post( $data['heading'] ?? '' ); ?></h2>
        <?php echo wp_kses_post( $data['text'] ?? '' ); ?>
      </div>
      <figure class="pad-split__image">
        <img src="<?php echo esc_url( $photo ); ?>" alt="<?php echo esc_attr( $alt ); ?>" loading="lazy">
      </figure>
    </div>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_section_style' ) ) {
  /**
   * Build the class / inline-style pair for a section's background and padding overrides.
   *
   * @param array $data Section data: backgroundColor, paddingTop, paddingBottom.
   * @return array { class: string, style: string }
   */
  function mbn_pad_section_style( $data ) {
    $bg_color = $data['backgroundColor'] ?? '';
    $bg_class = '';
    $style    = '';
    if ( ! empty( $bg_color ) ) {
      if ( strpos( (string) $bg_color, '#' ) === 0 ) {
        $style = 'background-color: ' . $bg_color . ';';
      } else {
        $bg_class = $bg_color;
      }
    }
    foreach ( array(
		'paddingTop'    => 'padding-top',
		'paddingBottom' => 'padding-bottom',
    ) as $key => $property ) {
      $value = $data[ $key ] ?? '';
      if ( '' !== $value && null !== $value ) {
        $style .= $property . ': ' . intval( $value ) . 'px;';
      }
    }
    return array(
		'class' => $bg_class,
		'style' => $style,
    );
  }
}

if ( ! function_exists( 'mbn_pad_render_liability_intro' ) ) {
  /**
   * Render the optional intro block of a Liability section.
   *
   * @param array $data Section data: introHeading, introText.
   */
  function mbn_pad_render_liability_intro( $data ) {
    $heading = $data['introHeading'] ?? '';
    $text    = $data['introText'] ?? '';
    if ( empty( $heading ) && empty( $text ) ) {
      return;
    }
    ?>
    <div class="pad-liability__intro">
      <?php if ( ! empty( $heading ) ) : ?>
      <h3 class="pad-liability__intro-heading"><?php echo wp_kses_post( $heading ); ?></h3>
      <?php endif; ?>
      <?php if ( ! empty( $text ) ) : ?>
      <div class="pad-liability__intro-text"><?php echo wp_kses_post( $text ); ?></div>
      <?php endif; ?>
    </div>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_liability' ) ) {
  /**
   * Render a Liability section.
   *
   * @param array $data Section data.
   */
  function mbn_pad_render_liability( $data ) {
    $items   = $data['items'] ?? array();
    $section = mbn_pad_section_style( $data );
    ?>
<section class="pad-liability <?php echo esc_attr( $section['class'] ); ?>" style="<?php echo esc_attr( $section['style'] ); ?>">
  <div class="pad-container">
    <?php if ( ! empty( $data['heading'] ) || ! empty( $data['subtitle'] ) ) : ?>
    <div class="pad-section-header pad-section-header--center">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $data['heading'] ?? '' ); ?></h2>
      <p class="pad-section-subtitle"><?php echo wp_kses_post( $data['subtitle'] ?? '' ); ?></p>
    </div>
    <?php endif; ?>

    <?php mbn_pad_render_liability_intro( $data ); ?>

    <ul class="pad-liability__list">
      <?php foreach ( $items as $item ) : ?>
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

    <?php if ( ! empty( $data['afterText'] ) ) : ?>
    <div class="pad-liability__after">
      <?php echo wp_kses_post( $data['afterText'] ); ?>
    </div>
    <?php endif; ?>

  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_compensation' ) ) {
  /**
   * Render a Compensation section.
   *
   * @param array $data Section data.
   */
  function mbn_pad_render_compensation( $data ) {
    $items = $data['items'] ?? array();
    ?>
<section class="pad-compensation">
  <div class="pad-container">
    <div class="pad-section-header pad-section-header--center">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $data['heading'] ?? '' ); ?></h2>
      <p class="pad-section-subtitle"><?php echo wp_kses_post( $data['subtitle'] ?? '' ); ?></p>
    </div>

    <div class="pad-compensation__grid">
      <?php foreach ( $items as $item ) : ?>
        <?php $item_class = ! empty( $item['featured'] ) ? 'pad-compensation__item pad-compensation__item--featured' : 'pad-compensation__item'; ?>
      <article class="<?php echo esc_attr( $item_class ); ?>">
        <h3><?php echo esc_html( $item['title'] ?? '' ); ?></h3>
        <?php echo wp_kses_post( $item['description'] ?? '' ); ?>
      </article>
      <?php endforeach; ?>
    </div>

    <?php if ( ! empty( $data['afterText'] ) ) : ?>
    <div class="pad-compensation__after">
      <?php echo wp_kses_post( $data['afterText'] ); ?>
    </div>
    <?php endif; ?>

  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_documentation' ) ) {
  /**
   * Render a Documentation section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_documentation( $data, $assets ) {
    $photo = ! empty( $data['photoUrl'] ) ? $data['photoUrl'] : $assets . '/photo-documentation.jpg';
    $alt   = mbn_pad_alt_text( $data['photoId'] ?? 0, __( 'Smartphone displaying online medical records', 'mbn-theme' ) );
    ?>
<section class="pad-documentation">
  <div class="pad-container">
    <div class="pad-split pad-split--text-left">
      <div class="pad-split__text">
        <h2 class="pad-section-heading"><?php echo wp_kses_post( $data['heading'] ?? '' ); ?></h2>
        <?php echo wp_kses_post( $data['text'] ?? '' ); ?>
      </div>
      <figure class="pad-split__image">
        <img src="<?php echo esc_url( $photo ); ?>" alt="<?php echo esc_attr( $alt ); ?>" loading="lazy">
      </figure>
    </div>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_attorneys' ) ) {
  /**
   * Render an Attorneys section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_attorneys( $data, $assets ) {
    $d        = array_merge(
      array(
		  'heading' => '',
		  'text'    => '',
      ),
      (array) $data
    );
    $badges   = $d['badgeCards'] ?? array();
    $photo    = ! empty( $d['photoUrl'] ) ? $d['photoUrl'] : $assets . '/img-hastings-with-logo.png';
    $defaults = array( 'badge-no-fee-until-win.svg', 'badge-29-percent-discount.svg', 'badge-14-percent.svg' );
    ?>
<section class="pad-attorneys">
  <div class="pad-container">
    <div class="pad-attorneys__badges">
      <?php foreach ( $badges as $badge_index => $badge ) : ?>
        <?php $badge_img = ! empty( $badge['imageUrl'] ) ? $badge['imageUrl'] : $assets . '/' . $defaults[ $badge_index % count( $defaults ) ]; ?>
      <div class="pad-badge-card">
        <div class="pad-badge pad-badge--num pad-badge--sm" aria-label="Badge">
          <img src="<?php echo esc_url( $badge_img ); ?>" alt="" aria-hidden="true">
        </div>
        <p><?php echo esc_html( $badge['description'] ?? '' ); ?></p>
      </div>
      <?php endforeach; ?>
    </div>
  </div>

  <div class="pad-attorneys__feature">
    <div class="pad-attorneys__photo-col" aria-hidden="true">
      <img src="<?php echo esc_url( $photo ); ?>" alt="" class="pad-attorneys__attorney">
    </div>
    <div class="pad-attorneys__text-col">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $d['heading'] ); ?></h2>
      <?php echo wp_kses_post( $d['text'] ); ?>
    </div>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_third_party' ) ) {
  /**
   * Render a Third-Party Liability section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_third_party( $data, $assets ) {
    $photo   = ! empty( $data['photoUrl'] ) ? $data['photoUrl'] : $assets . '/photo-third-party-claim.jpg';
    $alt     = mbn_pad_alt_text( $data['photoId'] ?? 0, __( 'Claim documents being handed across a desk during a legal consultation', 'mbn-theme' ) );
    $chevron = ! empty( $data['chevronIconUrl'] ) ? $data['chevronIconUrl'] : $assets . '/icon-chevron-right.svg';
    $items   = $data['items'] ?? array();
    ?>
<section class="pad-third-party">
  <div class="pad-container">
    <div class="pad-split pad-split--text-left">
      <div class="pad-split__text">
        <?php echo wp_kses_post( $data['text'] ?? '' ); ?>
        <?php if ( ! empty( $items ) ) : ?>
        <ul class="pad-third-party__list">
          <?php foreach ( $items as $item ) : ?>
          <li class="pad-third-party__item"><img src="<?php echo esc_url( $chevron ); ?>" alt="" aria-hidden="true"><span><?php echo wp_kses_post( $item['text'] ?? '' ); ?></span></li>
          <?php endforeach; ?>
        </ul>
        <?php endif; ?>
      </div>
      <figure class="pad-split__image">
        <img src="<?php echo esc_url( $photo ); ?>" alt="<?php echo esc_attr( $alt ); ?>" loading="lazy">
      </figure>
    </div>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_common_causes' ) ) {
  /**
   * Render a Common Causes section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_common_causes( $data, $assets ) {
    $photo = ! empty( $data['photoUrl'] ) ? $data['photoUrl'] : $assets . '/photo-construction-excavator.jpg';
    $alt   = mbn_pad_alt_text( $data['photoId'] ?? 0, __( 'Excavator working on a construction site', 'mbn-theme' ) );
    $items = $data['items'] ?? array();
    ?>
<section class="pad-common-causes">
  <div class="pad-container">
    <div class="pad-common-causes__layout">
      <div class="pad-common-causes__intro">
        <h2 class="pad-section-heading"><?php echo wp_kses_post( $data['heading'] ?? '' ); ?></h2>
        <?php echo wp_kses_post( $data['text'] ?? '' ); ?>
        <figure class="pad-common-causes__image">
          <img src="<?php echo esc_url( $photo ); ?>" alt="<?php echo esc_attr( $alt ); ?>" loading="lazy">
        </figure>
      </div>

      <ul class="pad-common-causes__list">
        <?php foreach ( $items as $item ) : ?>
        <li><?php echo wp_kses_post( $item['text'] ?? '' ); ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_testimonials' ) ) {
  /**
   * Render a Testimonials section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_testimonials( $data, $assets ) {
    $stars = ! empty( $data['starsIconUrl'] ) ? $data['starsIconUrl'] : $assets . '/icon-stars-five.svg';
    $items = $data['items'] ?? array();
    ?>
<section class="pad-testimonials">
  <div class="pad-container">
    <div class="pad-section-header pad-section-header--center pad-testimonials__header">
      <?php if ( ! empty( $data['eyebrow'] ) ) : ?>
      <p class="pad-testimonials__eyebrow"><?php echo esc_html( $data['eyebrow'] ); ?></p>
      <?php endif; ?>
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $data['heading'] ?? '' ); ?></h2>
      <?php if ( ! empty( $data['subtitle'] ) ) : ?>
      <p class="pad-section-subtitle"><?php echo esc_html( $data['subtitle'] ); ?></p>
      <?php endif; ?>
    </div>

    <div class="pad-testimonials__grid">
      <?php foreach ( $items as $item ) : ?>
      <figure class="pad-testimonials__card">
        <img src="<?php echo esc_url( $stars ); ?>" alt="<?php esc_attr_e( 'Rated five out of five stars', 'mbn-theme' ); ?>" class="pad-testimonials__stars">
        <blockquote>
          <p><?php echo esc_html( $item['quote'] ?? '' ); ?></p>
        </blockquote>
        <figcaption class="pad-testimonials__attribution">
          <span class="pad-testimonials__name"><?php echo esc_html( $item['name'] ?? '' ); ?></span>
          <?php if ( ! empty( $item['role'] ) ) : ?>
          <span class="pad-testimonials__role"><?php echo esc_html( $item['role'] ); ?></span>
          <?php endif; ?>
        </figcaption>
      </figure>
      <?php endforeach; ?>
    </div>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_accident_list' ) ) {
  /**
   * Render a Lists of Accidents section: a heading above a sortable grid of links.
   *
   * @param array $data Section data: heading, backgroundColor, items[{label,url}].
   */
  function mbn_pad_render_accident_list( $data ) {
    $items = $data['items'] ?? array();
    if ( empty( $data['heading'] ) && empty( $items ) ) {
      return;
    }
    $section = mbn_pad_section_style( $data );
    ?>
<section class="pad-accident-list <?php echo esc_attr( $section['class'] ); ?>" style="<?php echo esc_attr( $section['style'] ); ?>">
  <div class="pad-container">
    <?php if ( ! empty( $data['heading'] ) ) : ?>
    <h3 class="pad-accident-list__heading"><?php echo wp_kses_post( $data['heading'] ); ?></h3>
    <?php endif; ?>
    <?php if ( ! empty( $items ) ) : ?>
    <ul class="pad-accident-list__grid">
      <?php
      foreach ( $items as $item ) :
        $label = $item['label'] ?? '';
        $url   = $item['url'] ?? '';
        if ( '' === $label ) {
          continue;
        }
        ?>
      <li class="pad-accident-list__item">
        <?php if ( '' !== $url ) : ?>
        <a class="pad-accident-list__link" href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( $label ); ?></a>
        <?php else : ?>
        <span class="pad-accident-list__link"><?php echo esc_html( $label ); ?></span>
        <?php endif; ?>
      </li>
      <?php endforeach; ?>
    </ul>
    <?php endif; ?>
  </div>
</section>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_why_lawyer_row' ) ) {
  /**
   * Render a single row of a Why You Need a Lawyer section.
   *
   * @param array  $row       Row data: layout, heading, text, imageUrl, imageId.
   * @param int    $row_index Row position, used to pick a fallback image.
   * @param string $assets    Block assets URI.
   */
  function mbn_pad_render_why_lawyer_row( $row, $row_index, $assets ) {
    if ( ! is_array( $row ) ) {
      return;
    }
    $defaults     = array( 'photo-burn-injury.jpg', 'photo-evidence-review.png', 'photo-insurance-negotiation.png' );
    $layout_class = 'image-left' === ( $row['layout'] ?? 'text-left' ) ? ' pad-why-lawyer__row--image-left' : '';
    $image_url    = ! empty( $row['imageUrl'] ) ? $row['imageUrl'] : $assets . '/' . $defaults[ $row_index % count( $defaults ) ];
    $alt_text     = mbn_pad_alt_text( $row['imageId'] ?? 0, __( 'Why you need a lawyer', 'mbn-theme' ) );
    ?>
      <div class="pad-why-lawyer__row<?php echo esc_attr( $layout_class ); ?>">
        <div class="pad-why-lawyer__text">
          <h3 class="pad-why-lawyer__row-heading"><?php echo wp_kses_post( $row['heading'] ?? '' ); ?></h3>
          <?php echo wp_kses_post( $row['text'] ?? '' ); ?>
        </div>
        <figure class="pad-why-lawyer__image">
          <img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $alt_text ); ?>" loading="lazy">
        </figure>
      </div>
    <?php
  }
}

if ( ! function_exists( 'mbn_pad_render_why_lawyer' ) ) {
  /**
   * Render a Why You Need a Lawyer section.
   *
   * @param array  $data   Section data.
   * @param string $assets Block assets URI.
   */
  function mbn_pad_render_why_lawyer( $data, $assets ) {
    if ( ! is_array( $data ) ) {
      return;
    }
    $rows = isset( $data['rows'] ) && is_array( $data['rows'] ) ? $data['rows'] : array();
    ?>
<section class="pad-why-lawyer">
  <div class="pad-container">
    <?php if ( ! empty( $data['heading'] ) || ! empty( $data['subtitle'] ) ) : ?>
    <div class="pad-section-header pad-section-header--center pad-why-lawyer__header">
      <h2 class="pad-section-heading"><?php echo wp_kses_post( $data['heading'] ?? '' ); ?></h2>
      <p class="pad-section-subtitle"><?php echo wp_kses_post( $data['subtitle'] ?? '' ); ?></p>
    </div>
    <?php endif; ?>

    <div class="pad-why-lawyer__rows">
      <?php foreach ( $rows as $row_index => $row ) : ?>
        <?php mbn_pad_render_why_lawyer_row( (array) $row, $row_index, $assets ); ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>
    <?php
  }
}

// Map section types to their renderer callbacks.
$renderers = array(
	'whyHire'       => 'mbn_pad_render_why_hire',
	'caseResult'    => 'mbn_pad_render_case_result',
	'cta'           => 'mbn_pad_render_cta',
	'afterAccident' => 'mbn_pad_render_after_accident',
	'steps'         => 'mbn_pad_render_steps',
	'timeLimit'     => 'mbn_pad_render_time_limit',
	'insurance'     => 'mbn_pad_render_insurance',
	'liability'     => 'mbn_pad_render_liability',
	'compensation'  => 'mbn_pad_render_compensation',
	'documentation' => 'mbn_pad_render_documentation',
	'attorneys'     => 'mbn_pad_render_attorneys',
	'thirdParty'    => 'mbn_pad_render_third_party',
	'commonCauses'  => 'mbn_pad_render_common_causes',
	'testimonials'  => 'mbn_pad_render_testimonials',
	'accidentList'  => 'mbn_pad_render_accident_list',
	'whyLawyer'     => 'mbn_pad_render_why_lawyer',
);

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <?php
  foreach ( $sections as $section ) {
    $section_type = $section['type'] ?? '';
    if ( ! isset( $renderers[ $section_type ] ) || ! function_exists( $renderers[ $section_type ] ) ) {
      continue;
    }
    mbn_pad_render_section_title( $section['title'] ?? array() );
    call_user_func( $renderers[ $section_type ], $section['data'] ?? array(), $block_assets_uri );
  }
  ?>
</div>
