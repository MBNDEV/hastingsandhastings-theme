<?php
/**
 * Locations Directory block render template.
 *
 * @package MBN_Theme
 * @param array $attributes Block attributes.
 */

$theme_uri = get_template_directory_uri();

$icon_chevron = ! empty( $attributes['iconChevronUrl'] )
  ? $attributes['iconChevronUrl']
  : $theme_uri . '/blocks/locations-directory/assets/images/icon-chevron-link.svg';

$icon_map_pin = ! empty( $attributes['iconMapPinUrl'] )
  ? $attributes['iconMapPinUrl']
  : $theme_uri . '/blocks/locations-directory/assets/images/icon-map-pin.svg';

$icon_phone = ! empty( $attributes['iconPhoneUrl'] )
  ? $attributes['iconPhoneUrl']
  : $theme_uri . '/blocks/locations-directory/assets/images/icon-phone.svg';

$map_title = ! empty( $attributes['mapTitle'] )
  ? $attributes['mapTitle']
  : 'Hastings & Hastings office locations across Arizona';

$map_embed_url = ! empty( $attributes['mapEmbedUrl'] )
  ? $attributes['mapEmbedUrl']
  : 'https://www.google.com/maps/d/embed?mid=1BU_B90ZoJAEWzUgMy_fXd-KdC5y5WdXm&ehbc=2E312F';

$regions = ! empty( $attributes['regions'] ) && is_array( $attributes['regions'] )
  ? $attributes['regions']
  : array();

$map_areas = ! empty( $attributes['mapAreas'] ) && is_array( $attributes['mapAreas'] )
  ? $attributes['mapAreas']
  : array();

$wrapper_attributes = get_block_wrapper_attributes(
  array(
      'class' => 'locations-directory',
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

  <div class="locations-directory__list-section">
    <div class="locations-directory__container">

      <?php foreach ( $regions as $region_index => $region ) : ?>
        <?php
        $is_last_region   = count( $regions ) - 1 === $region_index;
        $region_classes   = 'locations-directory__region';
        $region_classes  .= $is_last_region ? ' locations-directory__region--last' : '';
        $region_title     = $region['title'] ?? '';
        $region_desc      = $region['description'] ?? '';
        $region_links     = ! empty( $region['links'] ) && is_array( $region['links'] ) ? $region['links'] : array();
        $region_cards     = ! empty( $region['cards'] ) && is_array( $region['cards'] ) ? $region['cards'] : array();
        $link_list_class  = 'locations-directory__sidebar-links';
        $link_list_class .= count( $region_links ) > 3 ? ' locations-directory__sidebar-links--grid' : '';
        ?>

        <div class="<?php echo esc_attr( $region_classes ); ?>">
          <div class="locations-directory__region-sidebar">
            <div class="locations-directory__region-text">
              <h3 class="locations-directory__region-title"><?php echo esc_html( $region_title ); ?></h3>
              <p class="locations-directory__region-desc"><?php echo esc_html( $region_desc ); ?></p>
            </div>
            <ul class="<?php echo esc_attr( $link_list_class ); ?>">
              <?php foreach ( $region_links as $region_link ) : ?>
                <li class="locations-directory__sidebar-link-item">
                  <img src="<?php echo esc_url( $icon_chevron ); ?>" alt="" class="locations-directory__link-icon" aria-hidden="true">
                  <a href="<?php echo esc_url( $region_link['url'] ?? '#' ); ?>"><?php echo esc_html( $region_link['label'] ?? '' ); ?></a>
                </li>
              <?php endforeach; ?>
            </ul>
          </div>

          <div class="locations-directory__region-cards">
            <?php foreach ( $region_cards as $card ) : ?>
              <?php
              $card_fallback = ! empty( $card['imageFallback'] )
                ? $theme_uri . '/blocks/locations-directory/assets/images/' . ltrim( $card['imageFallback'], '/' )
                : $theme_uri . '/blocks/locations-directory/assets/images/office-mesa.jpg';
              $card_image    = ! empty( $card['imageUrl'] ) ? $card['imageUrl'] : $card_fallback;
              ?>

              <article class="locations-directory__card">
                <figure class="locations-directory__card-figure">
                  <img src="<?php echo esc_url( $card_image ); ?>" alt="<?php echo esc_attr( $card['imageAlt'] ?? '' ); ?>" class="locations-directory__card-img">
                </figure>
                <div class="locations-directory__card-content">
                  <h5 class="locations-directory__card-title"><?php echo esc_html( $card['title'] ?? '' ); ?></h5>
                  <div class="locations-directory__card-meta">
                    <div class="locations-directory__card-row">
                      <img src="<?php echo esc_url( $icon_map_pin ); ?>" alt="" class="locations-directory__meta-icon" aria-hidden="true">
                      <a href="<?php echo esc_url( $card['addressUrl'] ?? '#' ); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html( $card['address'] ?? '' ); ?></a>
                    </div>
                    <div class="locations-directory__card-row">
                      <img src="<?php echo esc_url( $icon_phone ); ?>" alt="" class="locations-directory__meta-icon" aria-hidden="true">
                      <a href="<?php echo esc_url( $card['phoneUrl'] ?? '#' ); ?>"><?php echo esc_html( $card['phone'] ?? '' ); ?></a>
                    </div>
                  </div>
                </div>
              </article>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>

    </div>
  </div>

  <div class="locations-directory__map-section">
    <div class="locations-directory__container">
      <figure class="locations-directory__map">
        <iframe
          src="<?php echo esc_url( $map_embed_url ); ?>"
          title="<?php echo esc_attr( $map_title ); ?>"
          class="locations-directory__map-iframe"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </figure>

      <div class="locations-directory__area-grid">
        <?php foreach ( $map_areas as $area ) : ?>
          <?php
          $area_links       = ! empty( $area['links'] ) && is_array( $area['links'] ) ? $area['links'] : array();
          $area_link_class  = 'locations-directory__area-links';
          $area_link_class .= count( $area_links ) > 3 ? ' locations-directory__area-links--grid' : '';
          ?>

          <div class="locations-directory__area-col">
            <div class="locations-directory__area-text">
              <h4 class="locations-directory__area-title"><?php echo esc_html( $area['title'] ?? '' ); ?></h4>
              <p class="locations-directory__area-desc"><?php echo esc_html( $area['description'] ?? '' ); ?></p>
            </div>
            <ul class="<?php echo esc_attr( $area_link_class ); ?>">
              <?php foreach ( $area_links as $area_link ) : ?>
                <li class="locations-directory__area-link-item">
                  <img src="<?php echo esc_url( $icon_chevron ); ?>" alt="" class="locations-directory__link-icon" aria-hidden="true">
                  <a href="<?php echo esc_url( $area_link['url'] ?? '#' ); ?>"><?php echo esc_html( $area_link['label'] ?? '' ); ?></a>
                </li>
              <?php endforeach; ?>
            </ul>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>

</section>
