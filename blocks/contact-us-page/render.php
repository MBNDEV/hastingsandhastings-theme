<?php
/**
 * Contact Us Page - Dynamic Render
 *
 * @param array $attributes Block attributes
 * @param string $content Block content
 * @param WP_Block $block Block instance
 * @package MBN_Theme
 */

// Extract attributes
$eyebrow_text      = $attributes['eyebrowText'] ?? 'Contact Us';
$heading           = $attributes['heading'] ?? 'Talk with Hastings & Hastings about your case';
$body_text         = $attributes['bodyText'] ?? 'If you were hurt in an accident, our team is here to listen, answer your questions, and help you understand the next step.';
$phone_label       = $attributes['phoneLabel'] ?? 'Call Local:';
$phone_number      = $attributes['phoneNumber'] ?? '(480) 706-1100';
$phone_url         = $attributes['phoneUrl'] ?? 'tel:4807061100';
$social_label      = $attributes['socialLabel'] ?? 'Connect with Us';
$social_links      = $attributes['socialLinks'] ?? array();
$gravity_form_id   = $attributes['gravityFormId'] ?? '';
$locations_heading = $attributes['locationsHeading'] ?? 'Office Locations';
$office_locations  = $attributes['officeLocations'] ?? array();
$map_iframe_url    = $attributes['mapIframeUrl'] ?? 'https://www.google.com/maps/d/embed?mid=1BU_B90ZoJAEWzUgMy_fXd-KdC5y5WdXm&ehbc=2E312F';
$map_title         = $attributes['mapTitle'] ?? 'Map showing Hastings & Hastings office locations across Arizona';
$badges            = $attributes['badges'] ?? array();

$block_assets_uri = get_theme_file_uri( '/build/blocks/contact-us-page/assets/images' );

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'contact-us-page-block',
  )
);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<section class="contact-hero">
		<div class="contact-hero__container">

			<!-- Left: Message + Contact Info -->
			<article class="contact-hero__message">
				<header class="contact-hero__text-wrapper">
					<?php if ( ! empty( $eyebrow_text ) ) : ?>
						<p class="contact-hero__eyebrow"><?php echo esc_html( $eyebrow_text ); ?></p>
					<?php endif; ?>
					
					<?php if ( ! empty( $heading ) ) : ?>
						<h1 class="contact-hero__heading"><?php echo esc_html( $heading ); ?></h1>
					<?php endif; ?>
					
					<?php if ( ! empty( $body_text ) ) : ?>
						<p class="contact-hero__body"><?php echo esc_html( $body_text ); ?></p>
					<?php endif; ?>
				</header>

				<div class="contact-hero__links-row">
					<?php if ( ! empty( $phone_number ) ) : ?>
						<div class="contact-hero__link-group">
							<?php if ( ! empty( $phone_label ) ) : ?>
								<p class="contact-hero__link-label"><?php echo esc_html( $phone_label ); ?></p>
							<?php endif; ?>
							<a href="<?php echo esc_url( $phone_url ); ?>" class="contact-hero__phone-link">
								<img src="<?php echo esc_url( $block_assets_uri . '/icon-chevron-phone.svg' ); ?>" alt="" class="contact-hero__phone-icon" aria-hidden="true">
								<span><?php echo esc_html( $phone_number ); ?></span>
							</a>
						</div>
					<?php endif; ?>

					<?php if ( ! empty( $social_links ) ) : ?>
						<div class="contact-hero__link-group">
							<?php if ( ! empty( $social_label ) ) : ?>
								<p class="contact-hero__link-label"><?php echo esc_html( $social_label ); ?></p>
							<?php endif; ?>
							<nav class="contact-hero__social-icons" aria-label="Social media links">
								<?php foreach ( $social_links as $social ) : ?>
									<?php if ( ! empty( $social['url'] ) && ! empty( $social['icon'] ) ) : ?>
										<a href="<?php echo esc_url( $social['url'] ); ?>" aria-label="<?php echo esc_attr( $social['platform'] ?? $social['icon'] ); ?>">
											<img src="<?php echo esc_url( $block_assets_uri . '/icon-' . sanitize_key( $social['icon'] ) . '.svg' ); ?>" alt="<?php echo esc_attr( $social['platform'] ?? $social['icon'] ); ?>" width="24" height="24">
										</a>
									<?php endif; ?>
								<?php endforeach; ?>
							</nav>
						</div>
					<?php endif; ?>
				</div>
			</article>

			<!-- Right: Contact Form -->
			<div class="contact-hero__form-wrapper">
				<?php if ( ! empty( $gravity_form_id ) && function_exists( 'gravity_form' ) ) : ?>
					<?php
					gravity_form(
                      $gravity_form_id,
                      false, // Display title
                      false, // Display description
                      false, // Display inactive
                      null,  // Field values
                      true,  // Enable AJAX
                      0,     // Tabindex
                      true   // Echo
					);
					?>
				<?php else : ?>
					<div class="contact-hero__form form-placeholder">
						<p><?php esc_html_e( 'No Gravity Form selected or Gravity Forms plugin not active.', 'mbn-theme' ); ?></p>
					</div>
				<?php endif; ?>
			</div>

		</div>
	</section>

	<!-- ===== SECTION 2: OFFICE LOCATIONS + BADGES ===== -->
	<section class="contact-locations">
		<div class="contact-locations__container">

			<!-- ===== OFFICE LOCATIONS HEADER ===== -->
			<?php if ( ! empty( $locations_heading ) ) : ?>
				<h2 class="contact-locations__heading"><?php echo esc_html( $locations_heading ); ?></h2>
			<?php endif; ?>

			<!-- ===== OFFICE LOCATIONS GRID ===== -->
			<?php if ( ! empty( $office_locations ) ) : ?>
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
												<a href="<?php echo esc_url( $office['phoneUrl'] ); ?>"><?php echo esc_html( $office['phoneNumber'] ); ?></a>
											</li>
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

			<!-- ===== BADGE CARDS ===== -->
			<?php if ( ! empty( $badges ) ) : ?>
				<div class="contact-locations__badges">
					<?php foreach ( $badges as $index => $badge ) : ?>
						<article class="contact-locations__badge-card">
							<figure class="contact-locations__badge">
								<?php
								$badge_image_url = $badge['imageUrl'] ?? '';
								$badge_image_id  = $badge['imageId'] ?? 0;

								// Fallback images for the 3 badges
								$fallback_images = array(
									'badge-no-fee-until-win.svg',
									'badge-29-percent-discount.svg',
									'badge-14-percent.svg',
								);

								if ( empty( $badge_image_url ) && isset( $fallback_images[ $index ] ) ) {
									$badge_image_url = $block_assets_uri . '/' . $fallback_images[ $index ];
								}

								$alt_text = '';
								if ( ! empty( $badge_image_id ) ) {
									$alt_text = get_post_meta( $badge_image_id, '_wp_attachment_image_alt', true );
								}
								?>
								<img src="<?php echo esc_url( $badge_image_url ); ?>" alt="<?php echo esc_attr( $alt_text ); ?>" class="contact-locations__badge-img">
							</figure>
							<?php if ( ! empty( $badge['caption'] ) ) : ?>
								<p class="contact-locations__badge-caption"><?php echo esc_html( $badge['caption'] ); ?></p>
							<?php endif; ?>
						</article>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

		</div>
	</section>
</div>
