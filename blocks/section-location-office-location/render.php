<?php
/**
 * Section: Location – Office Location - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$locations_heading = $attributes['locationsHeading'] ?? 'Office Locations';
$office_locations  = $attributes['officeLocations'] ?? array();
$map_iframe_url    = $attributes['mapIframeUrl'] ?? 'https://www.google.com/maps/d/embed?mid=1BU_B90ZoJAEWzUgMy_fXd-KdC5y5WdXm&ehbc=2E312F';
$map_title         = $attributes['mapTitle'] ?? 'Map showing Hastings & Hastings office locations across Arizona';

$block_assets_uri = get_theme_file_uri( '/build/blocks/section-location-office-location/assets/images' );

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'contact-locations',
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="contact-locations__container">

    <!-- ===== OFFICE LOCATIONS HEADER ===== -->
    <?php if ( ! empty( $locations_heading ) ) : ?>
      <h2 class="contact-locations__heading"><?php echo esc_html( $locations_heading ); ?></h2>
    <?php endif; ?>

    <!-- ===== OFFICE LOCATIONS GRID ===== -->
    <?php if ( ! empty( $office_locations ) && is_array( $office_locations ) ) : ?>
      <div class="contact-locations__offices-grid">
        <?php
        // Split locations into 3 columns
        $total_locations      = count( $office_locations );
        $locations_per_column = ceil( $total_locations / 3 );
        $columns              = array_chunk( $office_locations, $locations_per_column );
        ?>

        <?php foreach ( $columns as $column ) : ?>
          <div class="contact-locations__offices-col">
            <?php foreach ( $column as $office ) : ?>
              <article class="contact-locations__office">
                <header class="contact-locations__office-header">
                  <?php if ( ! empty( $office['name'] ) ) : ?>
                    <h3 class="contact-locations__office-name"><?php echo esc_html( $office['name'] ); ?></h3>
                  <?php endif; ?>
                  
                  <?php if ( ! empty( $office['byAppointmentOnly'] ) ) : ?>
                    <p class="contact-locations__office-note"><?php esc_html_e( '(By Appointment Only)', 'mbn-theme' ); ?></p>
                  <?php endif; ?>
                </header>
                
                <ul class="contact-locations__office-links">
                  <?php if ( ! empty( $office['address'] ) ) : ?>
                    <li class="contact-locations__office-link contact-locations__office-link--address">
                      <img src="<?php echo esc_url( $block_assets_uri . '/icon-location-pin.svg' ); ?>" alt="" width="24" height="24" aria-hidden="true">
                      <?php if ( ! empty( $office['addressUrl'] ) ) : ?>
                        <a href="<?php echo esc_url( $office['addressUrl'] ); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html( $office['address'] ); ?></a>
                      <?php else : ?>
                        <span><?php echo esc_html( $office['address'] ); ?></span>
                      <?php endif; ?>
                    </li>
                  <?php endif; ?>
                  
                  <?php if ( ! empty( $office['phoneNumber'] ) ) : ?>
                    <li class="contact-locations__office-link contact-locations__office-link--phone">
                      <img src="<?php echo esc_url( $block_assets_uri . '/icon-phone-chevron.svg' ); ?>" alt="" width="24" height="24" aria-hidden="true">
                      <a href="<?php echo esc_url( $office['phoneUrl'] ?? '' ); ?>"><?php echo esc_html( $office['phoneNumber'] ); ?></a>
                    </li>
                  <?php endif; ?>

                  <?php if ( ! empty( $office['otherNumbers'] ) && is_array( $office['otherNumbers'] ) ) : ?>
                    <?php foreach ( $office['otherNumbers'] as $other_number ) : ?>
                      <?php if ( ! empty( $other_number['phoneNumber'] ) ) : ?>
                      <li class="contact-locations__office-link contact-locations__office-link--other">
                        <?php if ( ! empty( $other_number['iconUrl'] ) ) : ?>
                        <img src="<?php echo esc_url( $other_number['iconUrl'] ); ?>" alt="" width="24" height="24" aria-hidden="true">
                        <?php endif; ?>
                        <?php if ( ! empty( $other_number['label'] ) ) : ?>
                        <span class="contact-locations__office-link-label"><?php echo esc_html( $other_number['label'] ); ?></span>
                        <?php endif; ?>
                        <a href="<?php echo esc_url( $other_number['phoneUrl'] ?? '' ); ?>"><?php echo esc_html( $other_number['phoneNumber'] ); ?></a>
                      </li>
                      <?php endif; ?>
                    <?php endforeach; ?>
                  <?php endif; ?>
                </ul>
              </article>
            <?php endforeach; ?>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <!-- ===== MAP ===== -->
    <?php if ( ! empty( $map_iframe_url ) ) : ?>
      <figure class="contact-locations__map">
        <iframe
          src="<?php echo esc_url( $map_iframe_url ); ?>"
          title="<?php echo esc_attr( $map_title ); ?>"
          class="contact-locations__map-iframe"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </figure>
    <?php endif; ?>

  </div>
</section>
