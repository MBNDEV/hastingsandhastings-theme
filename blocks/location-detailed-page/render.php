<?php
/**
 * Location Detailed Page block render template.
 *
 * @package MBN_Theme
 * @param array $attributes Block attributes.
 */

$block_assets_uri = get_theme_file_uri( '/build/blocks/location-detailed-page/assets/images' );

$why_choose_title                = $attributes['whyChooseTitle'] ?? '';
$why_choose_intro                = $attributes['whyChooseIntro'] ?? '';
$why_choose_items                = ! empty( $attributes['whyChooseItems'] ) && is_array( $attributes['whyChooseItems'] ) ? $attributes['whyChooseItems'] : array();
$why_choose_stats                = ! empty( $attributes['whyChooseStats'] ) && is_array( $attributes['whyChooseStats'] ) ? $attributes['whyChooseStats'] : array();
$why_choose_stats_display_mode   = $attributes['whyChooseStatsDisplayMode'] ?? 'stats';
$why_choose_stats_image_fallback = ! empty( $attributes['whyChooseStatsImageFallback'] ) ? $attributes['whyChooseStatsImageFallback'] : 'img-team.png';
$why_choose_stats_image          = ! empty( $attributes['whyChooseStatsImageUrl'] ) ? $attributes['whyChooseStatsImageUrl'] : $block_assets_uri . '/' . ltrim( (string) $why_choose_stats_image_fallback, '/' );
$why_choose_stats_image_alt      = $attributes['whyChooseStatsImageAlt'] ?? 'Why choose supporting image';

$case_results_title    = $attributes['caseResultsTitle'] ?? '';
$case_results_subtitle = $attributes['caseResultsSubtitle'] ?? '';
$case_results_button_t = $attributes['caseResultsButtonText'] ?? '';
$case_results_button_u = $attributes['caseResultsButtonUrl'] ?? '#';

$testimonials_title    = $attributes['testimonialsTitle'] ?? 'Client Testimonial';
$testimonials_subtitle = $attributes['testimonialsSubtitle'] ?? '';
$testimonials          = ! empty( $attributes['testimonials'] ) && is_array( $attributes['testimonials'] ) ? $attributes['testimonials'] : array();

$how_we_help_title          = $attributes['howWeHelpTitle'] ?? 'How Can Our Mesa Personal Injury Lawyer Help?';
$how_we_help_intro          = $attributes['howWeHelpIntro'] ?? '';
$how_we_help_header_img_id  = $attributes['howWeHelpHeaderImageId'] ?? 0;
$how_we_help_header_img_url = $attributes['howWeHelpHeaderImageUrl'] ?? '';
$how_we_help_header_img_alt = $attributes['howWeHelpHeaderImageAlt'] ?? 'Attorney at desk reviewing personal injury case documents';
$how_we_help_items          = ! empty( $attributes['howWeHelpItems'] ) && is_array( $attributes['howWeHelpItems'] ) ? $attributes['howWeHelpItems'] : array();
$case_categories_title      = $attributes['caseCategoriesTitle'] ?? 'Mesa Personal Injury Cases We Handle';
$case_categories_subtitle   = $attributes['caseCategoriesSubtitle'] ?? 'Our team at Hastings and Hastings has extensive experience handling personal injury lawsuits of every type and scope. While each Mesa injury case is different and presents its own set of facts, Arizona law underpinning personal injury cases is often the same across each case. Over the course of the last 40 years, our Mesa car accident attorneys have built a proven track record of success in representing Arizona personal injury victims, including our specialized Mesa brain injury lawyer, and our familiarity with the law of personal injuries speaks for itself. We also have the best representation at our Chandler car accident attorney office.';
$case_categories_closing    = $attributes['caseCategoriesClosing'] ?? '';
$faq_title                  = $attributes['faqTitle'] ?? 'FAQ: Arizona Personal Injury Claims';
$faq_subtitle               = $attributes['faqSubtitle'] ?? 'Below we address some of the common questions that we receive about personal injury claims.';
$serving_title              = $attributes['servingTitle'] ?? 'Proudly Serving Mesa, AZ and the Phoenix Area';

$cta_cards       = ! empty( $attributes['ctaCards'] ) && is_array( $attributes['ctaCards'] ) ? $attributes['ctaCards'] : array();
$case_results    = ! empty( $attributes['caseResults'] ) && is_array( $attributes['caseResults'] ) ? $attributes['caseResults'] : array();
$resources_links = ! empty( $attributes['resourcesLinks'] ) && is_array( $attributes['resourcesLinks'] ) ? $attributes['resourcesLinks'] : array();
$case_categories = ! empty( $attributes['caseCategories'] ) && is_array( $attributes['caseCategories'] ) ? $attributes['caseCategories'] : array();
$faq_items       = ! empty( $attributes['faqItems'] ) && is_array( $attributes['faqItems'] ) ? $attributes['faqItems'] : array();
$serving_columns = ! empty( $attributes['servingColumns'] ) && is_array( $attributes['servingColumns'] ) ? $attributes['servingColumns'] : array();

$fault_intro_row_id          = $attributes['faultIntroRowId'] ?? 'intro-row';
$fault_intro_title           = $attributes['faultIntroTitle'] ?? 'Determining Fault for Your Mesa, AZ Accident';
$fault_intro_text            = $attributes['faultIntroText'] ?? '';
$fault_intro_image_id        = $attributes['faultIntroImageId'] ?? 0;
$fault_intro_image_url       = $attributes['faultIntroImageUrl'] ?? '';
$fault_intro_image_alt       = $attributes['faultIntroImageAlt'] ?? 'Car accident intersection scene in Arizona';
$fault_comparative_id        = $attributes['faultComparativeId'] ?? 'comparative';
$fault_comparative_title     = $attributes['faultComparativeTitle'] ?? 'Comparative Negligence Laws in Arizona Accidents';
$fault_comparative_column1   = $attributes['faultComparativeColumn1'] ?? '';
$fault_comparative_column2   = $attributes['faultComparativeColumn2'] ?? '';
$fault_compensation_id       = $attributes['faultCompensationId'] ?? 'compensation';
$fault_compensation_title    = $attributes['faultCompensationTitle'] ?? 'Recovering Compensation After an Injury';
$fault_compensation_subtitle = $attributes['faultCompensationSubtitle'] ?? '';
$fault_damage_types          = ! empty( $attributes['faultDamageTypes'] ) && is_array( $attributes['faultDamageTypes'] ) ? $attributes['faultDamageTypes'] : array();
$fault_steps_id              = $attributes['faultStepsId'] ?? 'steps';
$fault_steps_title           = $attributes['faultStepsTitle'] ?? 'Important Steps for Your Mesa Personal Injury Case';
$fault_steps_subtitle        = $attributes['faultStepsSubtitle'] ?? '';
$fault_steps                 = ! empty( $attributes['faultSteps'] ) && is_array( $attributes['faultSteps'] ) ? $attributes['faultSteps'] : array();
$fault_time_limit_row_id     = $attributes['faultTimeLimitRowId'] ?? 'time-limit-row';
$fault_time_limit_title      = $attributes['faultTimeLimitTitle'] ?? 'How Long Do I Have to File a Personal Injury Claim in Mesa, Arizona?';
$fault_time_limit_paragraph1 = $attributes['faultTimeLimitParagraph1'] ?? '';
$fault_time_limit_paragraph2 = $attributes['faultTimeLimitParagraph2'] ?? '';
$fault_time_limit_image_id   = $attributes['faultTimeLimitImageId'] ?? 0;
$fault_time_limit_image_url  = $attributes['faultTimeLimitImageUrl'] ?? '';
$fault_time_limit_image_alt  = $attributes['faultTimeLimitImageAlt'] ?? 'Accident scene highlighting the urgency of filing claims';
$fault_statute_row_id        = $attributes['faultStatuteRowId'] ?? 'statute-row';
$fault_statute_image_id      = $attributes['faultStatuteImageId'] ?? 0;
$fault_statute_image_url     = $attributes['faultStatuteImageUrl'] ?? '';
$fault_statute_image_alt     = $attributes['faultStatuteImageAlt'] ?? 'Legal and medical billing documents';
$fault_statute_text          = $attributes['faultStatuteText'] ?? '';

$chevron_icon = $block_assets_uri . '/chevron-right.svg';
$star_icon    = $block_assets_uri . '/icn-single-star-gold.svg';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'ldp-page',
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

  <section class="ldp-why-choose">
    <div class="ldp-container">
      <div class="ldp-why-choose__header">
        <h2 class="ldp-why-choose__title"><?php echo wp_kses_post( $why_choose_title ); ?></h2>
        <p class="ldp-why-choose__intro"><?php echo wp_kses_post( $why_choose_intro ); ?></p>
      </div>

      <div class="ldp-why-choose__track-record">
        <div class="ldp-why-choose__track-record-text">
          <h3 class="ldp-why-choose__subtitle"><?php echo esc_html( $why_choose_items[0]['heading'] ?? 'Proven Track Record from Real Clients' ); ?></h3>
          <p><?php echo wp_kses_post( $why_choose_items[0]['paragraph'] ?? '' ); ?></p>
        </div>
        <div class="ldp-why-choose__stats">
          <?php if ( 'image' === $why_choose_stats_display_mode ) : ?>
            <div class="ldp-why-choose__stat">
              <img src="<?php echo esc_url( $why_choose_stats_image ); ?>" alt="<?php echo esc_attr( $why_choose_stats_image_alt ); ?>">
            </div>
          <?php else : ?>
            <?php foreach ( $why_choose_stats as $why_choose_stat ) : ?>
              <?php
              if ( ! is_array( $why_choose_stat ) ) {
                continue;
              }
              ?>
              <div class="ldp-why-choose__stat">
                <span class="ldp-why-choose__stat-number"><?php echo esc_html( $why_choose_stat['number'] ?? '' ); ?></span>
                <span class="ldp-why-choose__stat-label"><?php echo esc_html( $why_choose_stat['label'] ?? '' ); ?></span>
              </div>
            <?php endforeach; ?>
          <?php endif; ?>
        </div>
      </div>

      <div class="ldp-why-choose__fee-structure">
        <?php
        $why_choose_fee_fallback = ! empty( $why_choose_items[1]['imageFallback'] ) ? $why_choose_items[1]['imageFallback'] : 'badge-no-fee.svg';
        $why_choose_fee_image    = ! empty( $why_choose_items[1]['imageUrl'] ) ? $why_choose_items[1]['imageUrl'] : $block_assets_uri . '/' . ltrim( (string) $why_choose_fee_fallback, '/' );
        ?>
        <figure class="ldp-why-choose__badge">
          <img src="<?php echo esc_url( $why_choose_fee_image ); ?>" alt="<?php echo esc_attr( $why_choose_items[1]['imageAlt'] ?? 'No Fee Until We Win badge' ); ?>" width="303" height="303">
        </figure>
        <div class="ldp-why-choose__fee-text">
          <h3 class="ldp-why-choose__subtitle"><?php echo esc_html( $why_choose_items[1]['heading'] ?? 'Innovative Discount Fee Structure' ); ?></h3>
          <p><?php echo wp_kses_post( $why_choose_items[1]['paragraph'] ?? '' ); ?></p>
        </div>
      </div>

      <div class="ldp-why-choose__attorneys">
        <div class="ldp-why-choose__attorneys-text">
          <h3 class="ldp-why-choose__subtitle"><?php echo esc_html( $why_choose_items[2]['heading'] ?? 'Licensed Arizona Personal Injury Attorneys Handling Your Case' ); ?></h3>
          <p><?php echo wp_kses_post( $why_choose_items[2]['paragraph'] ?? '' ); ?></p>
        </div>
        <figure class="ldp-why-choose__attorneys-img">
          <div class="ldp-why-choose__img-stack">
            <?php
            $why_choose_attorneys_fallback = ! empty( $why_choose_items[2]['imageFallback'] ) ? $why_choose_items[2]['imageFallback'] : 'img-team.png';
            $why_choose_attorneys_image    = ! empty( $why_choose_items[2]['imageUrl'] ) ? $why_choose_items[2]['imageUrl'] : $block_assets_uri . '/' . ltrim( (string) $why_choose_attorneys_fallback, '/' );
            ?>
            <img src="<?php echo esc_url( $why_choose_attorneys_image ); ?>" alt="<?php echo esc_attr( $why_choose_items[2]['imageAlt'] ?? 'Hastings and Hastings legal team' ); ?>" class="ldp-why-choose__img-team">
          </div>
        </figure>
      </div>
    </div>

    <?php if ( ! empty( $cta_cards[0] ) && is_array( $cta_cards[0] ) ) : ?>
      <?php
      $cta_1_bg   = ! empty( $cta_cards[0]['backgroundImageUrl'] )
        ? $cta_cards[0]['backgroundImageUrl']
        : $block_assets_uri . '/' . ltrim( (string) ( $cta_cards[0]['backgroundImageFallback'] ?? 'column-bg.jpg' ), '/' );
      $cta_1_logo = ! empty( $cta_cards[0]['logoImageUrl'] )
        ? $cta_cards[0]['logoImageUrl']
        : $block_assets_uri . '/' . ltrim( (string) ( $cta_cards[0]['logoImageFallback'] ?? 'logo-hh.svg' ), '/' );
      ?>
      <div class="ldp-cta-card ldp-container">
        <div class="ldp-cta-card__bg" style="background-image: url('<?php echo esc_url( $cta_1_bg ); ?>')"></div>
        <div class="ldp-cta-card__logo" aria-hidden="true">
          <img src="<?php echo esc_url( $cta_1_logo ); ?>" alt="" class="ldp-cta-card__logo-left">
        </div>
        <div class="ldp-cta-card__body">
          <div class="ldp-cta-card__text">
            <h4 class="ldp-cta-card__title"><?php echo esc_html( $cta_cards[0]['title'] ?? '' ); ?></h4>
            <p class="ldp-cta-card__desc"><?php echo wp_kses_post( $cta_cards[0]['description'] ?? '' ); ?></p>
          </div>
          <div class="ldp-cta-card__actions">
            <a class="ldp-btn ldp-btn--yellow" href="<?php echo esc_url( $cta_cards[0]['buttonUrl'] ?? '#' ); ?>"><?php echo esc_html( $cta_cards[0]['buttonText'] ?? '' ); ?></a>
            <p class="ldp-cta-card__phone"><?php echo esc_html( $cta_cards[0]['phoneLabel'] ?? '' ); ?> <a href="<?php echo esc_url( $cta_cards[0]['phoneUrl'] ?? '#' ); ?>"><?php echo esc_html( $cta_cards[0]['phoneText'] ?? '' ); ?></a></p>
          </div>
        </div>
      </div>
    <?php endif; ?>
  </section>

  <section class="ldp-case-results">
    <div class="ldp-container">
      <div class="ldp-case-results__header">
        <h3 class="ldp-section-title"><?php echo wp_kses_post( $case_results_title ); ?></h3>
        <p class="ldp-section-subtitle"><?php echo wp_kses_post( $case_results_subtitle ); ?></p>
      </div>

      <div class="ldp-case-results__list">
        <?php foreach ( $case_results as $index => $case ) : ?>
          <?php
          if ( ! is_array( $case ) ) {
            continue;
          }
          $img_fallback = ! empty( $case['imageFallback'] )
            ? $block_assets_uri . '/' . ltrim( (string) $case['imageFallback'], '/' )
            : $block_assets_uri . '/case-car-accident.jpg';
          $img_src      = ! empty( $case['imageUrl'] ) ? $case['imageUrl'] : $img_fallback;
          $is_right     = 1 === $index % 2;
          ?>
          <article class="ldp-case-card <?php echo esc_attr( $is_right ? 'ldp-case-card--img-right' : 'ldp-case-card--img-left' ); ?>">
            <?php if ( $is_right ) : ?>
              <div class="ldp-case-card__content ldp-case-card__content--right">
            <?php else : ?>
              <div class="ldp-case-card__content">
            <?php endif; ?>
              <span class="ldp-case-card__tag"><?php echo esc_html( $case['tag'] ?? '' ); ?></span>
              <p class="ldp-case-card__amount<?php echo esc_attr( $is_right ? ' ldp-case-card__amount--right' : '' ); ?>"><?php echo esc_html( $case['amount'] ?? '' ); ?></p>
              <h4 class="ldp-case-card__case-title<?php echo esc_attr( $is_right ? ' ldp-case-card__case-title--right' : '' ); ?>"><?php echo esc_html( $case['title'] ?? '' ); ?></h4>
              <p class="ldp-case-card__desc<?php echo esc_attr( $is_right ? ' ldp-case-card__desc--right' : '' ); ?>"><?php echo wp_kses_post( $case['description'] ?? '' ); ?></p>
            </div>
            <figure class="ldp-case-card__img <?php echo esc_attr( $is_right ? 'ldp-case-card__img--right-border' : 'ldp-case-card__img--left-border' ); ?>">
              <img src="<?php echo esc_url( $img_src ); ?>" alt="<?php echo esc_attr( $case['imageAlt'] ?? '' ); ?>" loading="lazy">
            </figure>
          </article>
        <?php endforeach; ?>
      </div>

      <div class="ldp-case-results__footer">
        <a href="<?php echo esc_url( $case_results_button_u ); ?>" class="ldp-btn ldp-btn--outline"><?php echo esc_html( $case_results_button_t ); ?></a>
      </div>
    </div>
  </section>

  <section class="ldp-testimonial">
    <div class="ldp-container ldp-testimonial__inner">
      <div class="ldp-testimonial__header">
        <h3 class="ldp-section-title"><?php echo wp_kses_post( $testimonials_title ); ?></h3>
        <?php if ( ! empty( $testimonials_subtitle ) ) : ?>
          <p class="ldp-section-subtitle"><?php echo wp_kses_post( $testimonials_subtitle ); ?></p>
        <?php endif; ?>
      </div>

      <div class="ldp-testimonial__swiper-container swiper">
        <div class="swiper-wrapper">
          <?php foreach ( $testimonials as $testimonial ) : ?>
            <?php
            if ( ! is_array( $testimonial ) ) {
              continue;
            }
            $rating = isset( $testimonial['rating'] ) ? max( 1, min( 5, (int) $testimonial['rating'] ) ) : 5;
            ?>
            <article class="ldp-testimonial__card swiper-slide">
              <div class="ldp-testimonial__stars">
                <?php for ( $star = 0; $star < $rating; $star++ ) : ?>
                  <img src="<?php echo esc_url( $star_icon ); ?>" alt="single star rating" width="20" height="19">
                <?php endfor; ?>
              </div>
              <?php if ( ! empty( $testimonial['quote'] ) ) : ?>
                <blockquote class="ldp-testimonial__quote">
                  <p><?php echo wp_kses_post( $testimonial['quote'] ); ?></p>
                </blockquote>
              <?php endif; ?>
              <div class="ldp-testimonial__author">
                <?php if ( ! empty( $testimonial['authorName'] ) ) : ?>
                  <p class="ldp-testimonial__author-name"><?php echo esc_html( $testimonial['authorName'] ); ?></p>
                <?php endif; ?>
                <?php if ( ! empty( $testimonial['authorRole'] ) ) : ?>
                  <p class="ldp-testimonial__author-role"><?php echo esc_html( $testimonial['authorRole'] ); ?></p>
                <?php endif; ?>
              </div>
            </article>
          <?php endforeach; ?>
        </div>

        <!-- Swiper Pagination -->
        <div class="ldp-testimonial__pagination swiper-pagination"></div>

        <!-- Swiper Navigation -->
        <!-- <div class="ldp-testimonial__button-prev swiper-button-prev"></div>
        <div class="ldp-testimonial__button-next swiper-button-next"></div> -->
      </div>
    </div>
  </section>

  <section class="ldp-how-we-help">
    <div class="ldp-container">
      <div class="ldp-how-we-help__row ldp-how-we-help__row--text-left">
        <div class="ldp-how-we-help__text">
          <h3 class="ldp-section-title"><?php echo wp_kses_post( $how_we_help_title ); ?></h3>
          <?php if ( ! empty( $how_we_help_intro ) ) : ?>
            <p><?php echo wp_kses_post( $how_we_help_intro ); ?></p>
          <?php endif; ?>
        </div>
        <figure class="ldp-how-we-help__img">
          <?php
          $how_we_help_header_img_fallback = $block_assets_uri . '/lawyer-consultation.jpg';
          $how_we_help_header_img_src      = ! empty( $how_we_help_header_img_url ) ? $how_we_help_header_img_url : $how_we_help_header_img_fallback;
          ?>
          <img src="<?php echo esc_url( $how_we_help_header_img_src ); ?>" alt="<?php echo esc_attr( $how_we_help_header_img_alt ); ?>" loading="lazy">
        </figure>
      </div>

      <?php foreach ( $how_we_help_items as $how_help_item ) : ?>
        <?php
        if ( ! is_array( $how_help_item ) ) {
          continue;
        }
        $item_position     = $how_help_item['imagePosition'] ?? 'right';
        $item_row_class    = 'left' === $item_position ? 'ldp-how-we-help__row--img-left' : 'ldp-how-we-help__row--text-left';
        $item_img_fallback = ! empty( $how_help_item['imageFallback'] )
          ? $block_assets_uri . '/' . ltrim( (string) $how_help_item['imageFallback'], '/' )
          : $block_assets_uri . '/lawyer-consultation.jpg';
        $item_img_src      = ! empty( $how_help_item['imageUrl'] ) ? $how_help_item['imageUrl'] : $item_img_fallback;
        ?>
        <div class="ldp-how-we-help__row <?php echo esc_attr( $item_row_class ); ?>">
          <?php if ( 'left' === $item_position ) : ?>
            <figure class="ldp-how-we-help__img">
              <img src="<?php echo esc_url( $item_img_src ); ?>" alt="<?php echo esc_attr( $how_help_item['imageAlt'] ?? '' ); ?>" loading="lazy">
            </figure>
            <div class="ldp-how-we-help__text">
              <p><?php echo wp_kses_post( $how_help_item['text'] ?? '' ); ?></p>
            </div>
          <?php else : ?>
            <div class="ldp-how-we-help__text">
              <p><?php echo wp_kses_post( $how_help_item['text'] ?? '' ); ?></p>
            </div>
            <figure class="ldp-how-we-help__img">
              <img src="<?php echo esc_url( $item_img_src ); ?>" alt="<?php echo esc_attr( $how_help_item['imageAlt'] ?? '' ); ?>" loading="lazy">
            </figure>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>

      <nav class="ldp-resources-box" aria-label="Resources on this page">
        <p class="ldp-resources-box__title">Resources on This Page</p>
        <ul class="ldp-resources-box__grid">
          <?php foreach ( $resources_links as $resource_link ) : ?>
            <?php
            if ( ! is_array( $resource_link ) ) {
              continue; }
            ?>
            <li>
              <a href="<?php echo esc_url( $resource_link['url'] ?? '#' ); ?>">
                <img src="<?php echo esc_url( $chevron_icon ); ?>" alt="" aria-hidden="true">
                <?php echo esc_html( $resource_link['label'] ?? '' ); ?>
              </a>
            </li>
          <?php endforeach; ?>
        </ul>
      </nav>
    </div>
  </section>

  <section class="ldp-cases-handle" id="cases-we-handle">
    <div class="ldp-container">
      <div class="ldp-cases-handle__header">
        <h3 class="ldp-section-title ldp-section-title--center"><?php echo esc_html( $case_categories_title ); ?></h3>
        <p class="ldp-section-subtitle ldp-cases-handle__header--subtitle"><?php echo wp_kses_post( $case_categories_subtitle ); ?></p>
      </div>

      <?php foreach ( $case_categories as $cat_index => $category ) : ?>
        <?php
        if ( ! is_array( $category ) ) {
          continue;
        }
        $cat_img_fallback = ! empty( $category['imageFallback'] )
          ? $block_assets_uri . '/' . ltrim( (string) $category['imageFallback'], '/' )
          : $block_assets_uri . '/vehicle-accidents.jpg';
        $cat_img_src      = ! empty( $category['imageUrl'] ) ? $category['imageUrl'] : $cat_img_fallback;
        ?>
        <div class="ldp-cases-handle__row <?php echo esc_attr( 1 === $cat_index % 2 ? 'ldp-cases-handle__row--img-left' : 'ldp-cases-handle__row--text-left' ); ?>">
          <div class="ldp-cases-handle__text">
            <h4 class="ldp-cases-handle__cat-title"><?php echo esc_html( $category['title'] ?? '' ); ?></h4>
            <p><?php echo wp_kses_post( $category['description'] ?? '' ); ?></p>
            <ul class="ldp-link-grid">
              <?php if ( ! empty( $category['links'] ) && is_array( $category['links'] ) ) : ?>
                <?php foreach ( $category['links'] as $category_link ) : ?>
                  <?php
                  if ( ! is_array( $category_link ) ) {
                    continue; }
                  ?>
                  <li>
                    <a href="<?php echo esc_url( $category_link['url'] ?? '#' ); ?>">
                      <img src="<?php echo esc_url( $chevron_icon ); ?>" alt="" aria-hidden="true">
                      <?php echo esc_html( $category_link['label'] ?? '' ); ?>
                    </a>
                  </li>
                <?php endforeach; ?>
              <?php endif; ?>
            </ul>
          </div>
          <figure class="ldp-cases-handle__img">
            <img src="<?php echo esc_url( $cat_img_src ); ?>" alt="<?php echo esc_attr( $category['imageAlt'] ?? '' ); ?>" loading="lazy">
          </figure>
        </div>
      <?php endforeach; ?>

      <?php if ( ! empty( $case_categories_closing ) ) : ?>
        <p class="ldp-cases-handle__closing"><?php echo wp_kses_post( $case_categories_closing ); ?></p>
      <?php endif; ?>
    </div>
  </section>

  <section class="ldp-fault" id="determining-fault">
    <div class="ldp-container">
      <?php if ( ! empty( $fault_intro_title ) || ! empty( $fault_intro_text ) ) : ?>
        <div class="ldp-fault__intro-row" id="<?php echo esc_attr( $fault_intro_row_id ); ?>">
          <div class="ldp-fault__intro-text">
            <?php if ( ! empty( $fault_intro_title ) ) : ?>
              <h3 class="ldp-section-title"><?php echo esc_html( $fault_intro_title ); ?></h3>
            <?php endif; ?>
            <?php if ( ! empty( $fault_intro_text ) ) : ?>
              <p><?php echo wp_kses_post( $fault_intro_text ); ?></p>
            <?php endif; ?>
          </div>
          <?php if ( ! empty( $fault_intro_image_url ) ) : ?>
            <?php
            $fault_intro_alt_text = ! empty( $fault_intro_image_id ) ? get_post_meta( $fault_intro_image_id, '_wp_attachment_image_alt', true ) : '';
            if ( empty( $fault_intro_alt_text ) ) {
              $fault_intro_alt_text = $fault_intro_image_alt;
            }
            ?>
            <figure class="ldp-fault__intro-img">
              <img src="<?php echo esc_url( $fault_intro_image_url ); ?>" alt="<?php echo esc_attr( $fault_intro_alt_text ); ?>" loading="lazy">
            </figure>
          <?php endif; ?>
        </div>
      <?php endif; ?>

      <?php if ( ! empty( $fault_comparative_title ) || ! empty( $fault_comparative_column1 ) || ! empty( $fault_comparative_column2 ) ) : ?>
        <div class="ldp-fault__comparative" id="<?php echo esc_attr( $fault_comparative_id ); ?>">
          <?php if ( ! empty( $fault_comparative_title ) ) : ?>
            <h4 class="ldp-section-title"><?php echo esc_html( $fault_comparative_title ); ?></h4>
          <?php endif; ?>
          <div></div>
          <?php if ( ! empty( $fault_comparative_column1 ) ) : ?>
            <div class="ldp-fault__comparative-col">
              <p><?php echo wp_kses_post( $fault_comparative_column1 ); ?></p>
            </div>
          <?php endif; ?>
          <?php if ( ! empty( $fault_comparative_column2 ) ) : ?>
            <div class="ldp-fault__comparative-col">
              <p><?php echo wp_kses_post( $fault_comparative_column2 ); ?></p>
            </div>
          <?php endif; ?>
        </div>
      <?php endif; ?>

      <?php if ( ! empty( $fault_compensation_title ) || ! empty( $fault_damage_types ) ) : ?>
        <div class="ldp-fault__compensation" id="<?php echo esc_attr( $fault_compensation_id ); ?>">
          <div class="ldp-fault__section-header">
            <?php if ( ! empty( $fault_compensation_title ) ) : ?>
              <h3 class="ldp-section-title ldp-section-title--center"><?php echo esc_html( $fault_compensation_title ); ?></h3>
            <?php endif; ?>
            <?php if ( ! empty( $fault_compensation_subtitle ) ) : ?>
              <p class="ldp-section-subtitle ldp-section-subtitle--center"><?php echo wp_kses_post( $fault_compensation_subtitle ); ?></p>
            <?php endif; ?>
          </div>
          <?php if ( ! empty( $fault_damage_types ) ) : ?>
            <div class="ldp-fault__damages">
              <?php foreach ( $fault_damage_types as $damage ) : ?>
                <?php
                if ( ! is_array( $damage ) ) {
                  continue;
                }
                ?>
                <div class="ldp-fault__damage-col">
                  <?php if ( ! empty( $damage['title'] ) ) : ?>
                    <h4 class="ldp-fault__damage-title"><?php echo esc_html( $damage['title'] ); ?></h4>
                  <?php endif; ?>
                  <?php if ( ! empty( $damage['description'] ) ) : ?>
                    <p><?php echo wp_kses_post( $damage['description'] ); ?></p>
                  <?php endif; ?>
                </div>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
        </div>
      <?php endif; ?>

      <?php if ( ! empty( $fault_steps_title ) || ! empty( $fault_steps ) ) : ?>
        <div class="ldp-fault__steps" id="<?php echo esc_attr( $fault_steps_id ); ?>">
          <div class="ldp-fault__section-header">
            <?php if ( ! empty( $fault_steps_title ) ) : ?>
              <h3 class="ldp-section-title ldp-section-title--center"><?php echo esc_html( $fault_steps_title ); ?></h3>
            <?php endif; ?>
            <?php if ( ! empty( $fault_steps_subtitle ) ) : ?>
              <p class="ldp-section-subtitle ldp-section-subtitle--center"><?php echo wp_kses_post( $fault_steps_subtitle ); ?></p>
            <?php endif; ?>
          </div>
          <?php if ( ! empty( $fault_steps ) ) : ?>
            <ol class="ldp-steps">
              <?php foreach ( $fault_steps as $step ) : ?>
                <?php
                if ( ! is_array( $step ) ) {
                  continue;
                }
                ?>
                <li class="ldp-steps__item">
                  <div class="ldp-steps__content">
                    <?php if ( ! empty( $step['title'] ) ) : ?>
                      <h4 class="ldp-steps__num-title">
                        <?php if ( ! empty( $step['number'] ) ) : ?>
                          <span class="ldp-steps__num"><?php echo esc_html( $step['number'] ); ?>.</span>
                        <?php endif; ?>
                        <?php echo esc_html( $step['title'] ); ?>
                      </h4>
                    <?php endif; ?>
                    <?php if ( ! empty( $step['description'] ) ) : ?>
                      <p><?php echo wp_kses_post( $step['description'] ); ?></p>
                    <?php endif; ?>
                  </div>
                </li>
              <?php endforeach; ?>
            </ol>
          <?php endif; ?>
        </div>
      <?php endif; ?>

      <?php if ( ! empty( $fault_time_limit_title ) || ! empty( $fault_time_limit_paragraph1 ) || ! empty( $fault_time_limit_paragraph2 ) ) : ?>
        <div class="ldp-fault__time-limit-row" id="<?php echo esc_attr( $fault_time_limit_row_id ); ?>">
          <div class="ldp-fault__time-limit-text">
            <?php if ( ! empty( $fault_time_limit_title ) ) : ?>
              <h3 class="ldp-section-title"><?php echo esc_html( $fault_time_limit_title ); ?></h3>
            <?php endif; ?>
            <?php if ( ! empty( $fault_time_limit_paragraph1 ) ) : ?>
              <p><?php echo wp_kses_post( $fault_time_limit_paragraph1 ); ?></p>
            <?php endif; ?>
            <?php if ( ! empty( $fault_time_limit_paragraph2 ) ) : ?>
              <p><?php echo wp_kses_post( $fault_time_limit_paragraph2 ); ?></p>
            <?php endif; ?>
          </div>
          <?php if ( ! empty( $fault_time_limit_image_url ) ) : ?>
            <?php
            $fault_time_limit_alt_text = ! empty( $fault_time_limit_image_id ) ? get_post_meta( $fault_time_limit_image_id, '_wp_attachment_image_alt', true ) : '';
            if ( empty( $fault_time_limit_alt_text ) ) {
              $fault_time_limit_alt_text = $fault_time_limit_image_alt;
            }
            ?>
            <figure class="ldp-fault__time-limit-img">
              <img src="<?php echo esc_url( $fault_time_limit_image_url ); ?>" alt="<?php echo esc_attr( $fault_time_limit_alt_text ); ?>" loading="lazy">
            </figure>
          <?php endif; ?>
        </div>
      <?php endif; ?>

      <?php if ( ! empty( $fault_statute_image_url ) || ! empty( $fault_statute_text ) ) : ?>
        <div class="ldp-fault__statute-row" id="<?php echo esc_attr( $fault_statute_row_id ); ?>">
          <?php if ( ! empty( $fault_statute_image_url ) ) : ?>
            <?php
            $fault_statute_alt_text = ! empty( $fault_statute_image_id ) ? get_post_meta( $fault_statute_image_id, '_wp_attachment_image_alt', true ) : '';
            if ( empty( $fault_statute_alt_text ) ) {
              $fault_statute_alt_text = $fault_statute_image_alt;
            }
            ?>
            <figure class="ldp-fault__statute-img">
              <img src="<?php echo esc_url( $fault_statute_image_url ); ?>" alt="<?php echo esc_attr( $fault_statute_alt_text ); ?>" loading="lazy">
            </figure>
          <?php endif; ?>
          <?php if ( ! empty( $fault_statute_text ) ) : ?>
            <div class="ldp-fault__statute-text">
              <p><?php echo wp_kses_post( $fault_statute_text ); ?></p>
            </div>
          <?php endif; ?>
        </div>
      <?php endif; ?>
    </div>
  </section>

  <section class="ldp-faq" id="faq">
    <div class="ldp-container">
      <div class="ldp-faq__header">
        <h3 class="ldp-section-title ldp-section-title--center"><?php echo wp_kses_post( $faq_title ); ?></h3>
        <?php if ( ! empty( $faq_subtitle ) ) : ?>
          <p class="ldp-section-subtitle ldp-section-subtitle--center"><?php echo wp_kses_post( $faq_subtitle ); ?></p>
        <?php endif; ?>
      </div>

      <div class="ldp-accordion" role="list">
        <?php foreach ( $faq_items as $faq_index => $faq_item ) : ?>
          <?php
          if ( ! is_array( $faq_item ) ) {
            continue;
          }
          $is_open = ( 0 === $faq_index );
          ?>
          <div class="ldp-accordion__item<?php echo esc_attr( $is_open ? ' ldp-accordion__item--open' : '' ); ?>" role="listitem">
            <button class="ldp-accordion__question" aria-expanded="<?php echo esc_attr( $is_open ? 'true' : 'false' ); ?>" aria-controls="faq-answer-<?php echo esc_attr( (string) ( $faq_index + 1 ) ); ?>">
              <span><?php echo esc_html( $faq_item['question'] ?? '' ); ?></span>
              <img src="<?php echo esc_url( $block_assets_uri . '/arrow-up.svg' ); ?>" alt="" aria-hidden="true" class="ldp-accordion__icon">
            </button>
            <div class="ldp-accordion__answer<?php echo esc_attr( $is_open ? '' : ' ldp-accordion__answer--hidden' ); ?>" id="faq-answer-<?php echo esc_attr( (string) ( $faq_index + 1 ) ); ?>">
              <?php echo mbn_pad_kses( $faq_item['answer'] ?? '' ); ?>
              <?php if ( ! empty( $faq_item['bullets'] ) ) : ?>
                <ul><?php echo wp_kses_post( $faq_item['bullets'] ); ?></ul>
              <?php endif; ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>

      <?php if ( ! empty( $cta_cards[1] ) && is_array( $cta_cards[1] ) ) : ?>
        <?php
        $cta_2_bg   = ! empty( $cta_cards[1]['backgroundImageUrl'] )
          ? $cta_cards[1]['backgroundImageUrl']
          : $block_assets_uri . '/' . ltrim( (string) ( $cta_cards[1]['backgroundImageFallback'] ?? 'column-bg-faq.jpg' ), '/' );
        $cta_2_logo = ! empty( $cta_cards[1]['logoImageUrl'] )
          ? $cta_cards[1]['logoImageUrl']
          : $block_assets_uri . '/' . ltrim( (string) ( $cta_cards[1]['logoImageFallback'] ?? 'logo-hh.svg' ), '/' );
        ?>
        <div class="ldp-cta-card ldp-cta-card--faq">
          <div class="ldp-cta-card__bg" style="background-image: url('<?php echo esc_url( $cta_2_bg ); ?>')"></div>
          <div class="ldp-cta-card__logo" aria-hidden="true">
            <img src="<?php echo esc_url( $cta_2_logo ); ?>" alt="" class="ldp-cta-card__logo-left">
          </div>
          <div class="ldp-cta-card__body">
            <div class="ldp-cta-card__text">
              <h4 class="ldp-cta-card__title"><?php echo esc_html( $cta_cards[1]['title'] ?? '' ); ?></h4>
              <p class="ldp-cta-card__desc"><?php echo wp_kses_post( $cta_cards[1]['description'] ?? '' ); ?></p>
            </div>
            <div class="ldp-cta-card__actions">
              <a class="ldp-btn ldp-btn--yellow" href="<?php echo esc_url( $cta_cards[1]['buttonUrl'] ?? '#' ); ?>"><?php echo esc_html( $cta_cards[1]['buttonText'] ?? '' ); ?></a>
              <p class="ldp-cta-card__phone"><?php echo esc_html( $cta_cards[1]['phoneLabel'] ?? '' ); ?> <a href="<?php echo esc_url( $cta_cards[1]['phoneUrl'] ?? '#' ); ?>"><?php echo esc_html( $cta_cards[1]['phoneText'] ?? '' ); ?></a></p>
            </div>
          </div>
        </div>
      <?php endif; ?>

      <?php
      $badges_text_paragraphs = $attributes['badgesTextParagraphs'] ?? array();
      $badges_items           = $attributes['badgesItems'] ?? array();
      $badges_has_text        = ! empty( $badges_text_paragraphs ) && is_array( $badges_text_paragraphs );
      ?>
      <div class="ldp-faq__badges<?php echo $badges_has_text ? '' : ' ldp-faq__badges--no-text'; ?>">
        <?php if ( $badges_has_text ) : ?>
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
              if ( ! empty( $badge['imageId'] ) && ! empty( $badge['imageUrl'] ) ) {
                $badge_image_url = $badge['imageUrl'];
              } elseif ( ! empty( $badge['imageFallback'] ) ) {
                $badge_image_url = $badge['imageFallback'];
              }

              $badge_alt    = $badge['imageAlt'] ?? '';
              $badge_width  = $badge['imageWidth'] ?? 303;
              $badge_height = $badge['imageHeight'] ?? 303;
              ?>

              <?php if ( ! empty( $badge_image_url ) ) : ?>
                <figure class="ldp-faq__badge">
                  <img src="<?php echo esc_url( $badge_image_url ); ?>"
                       alt="<?php echo esc_attr( $badge_alt ); ?>"
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

  <section class="ldp-serving">
    <div class="ldp-container">
      <div class="ldp-serving__header">
        <h2 class="ldp-serving__title"><?php echo esc_html( $serving_title ); ?></h2>
      </div>
      <nav class="ldp-serving__columns" aria-label="Mesa neighborhoods we serve">
        <?php foreach ( $serving_columns as $column ) : ?>
          <?php
          if ( ! is_array( $column ) ) {
            continue; }
          ?>
          <div class="ldp-serving__col">
            <h4 class="ldp-serving__col-title"><?php echo esc_html( $column['title'] ?? '' ); ?></h4>
            <ul class="ldp-serving__links">
              <?php if ( ! empty( $column['links'] ) && is_array( $column['links'] ) ) : ?>
                <?php foreach ( $column['links'] as $column_link ) : ?>
                  <?php
                  if ( ! is_array( $column_link ) ) {
                    continue; }
                  ?>
                  <?php $link_new_tab = $column_link['newTab'] ?? true; ?>
                  <li>
                    <a href="<?php echo esc_url( $column_link['url'] ?? '#' ); ?>"<?php echo $link_new_tab ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>>
                      <img src="<?php echo esc_url( $chevron_icon ); ?>" alt="" aria-hidden="true">
                      <?php echo esc_html( $column_link['label'] ?? '' ); ?>
                    </a>
                  </li>
                <?php endforeach; ?>
              <?php endif; ?>
            </ul>
          </div>
        <?php endforeach; ?>
      </nav>
    </div>
  </section>

</section>
