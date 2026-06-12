<?php
/**
 * Section: Attorney Listing - Server-side rendering.
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 */

$heading     = $attributes['heading'] ?? 'Our Attorneys';
$description = $attributes['description'] ?? 'Meet the attorneys ready to fight for your case.';

$attorney_query = new WP_Query(
  array(
	  'post_type'              => 'attorney',
	  'post_status'            => 'publish',
	  'posts_per_page'         => -1,
	  'orderby'                => 'menu_order title',
	  'order'                  => 'ASC',
	  'no_found_rows'          => true,
	  'update_post_meta_cache' => true,
	  'update_post_term_cache' => false,
	  'meta_query'             => array(
		  array(
			  'key'     => 'attorney_personal_information_attorney_active',
			  'value'   => '1',
			  'compare' => '=',
		  ),
	  ),
  )
);

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'attorney-listing-block w-full py-12 md:py-16 lg:py-20 bg-[#f1f2f4]',
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
    <?php if ( ! empty( $heading ) || ! empty( $description ) ) : ?>
      <header class="mb-10 text-center">
        <?php if ( ! empty( $heading ) ) : ?>
          <h2 class="font-heading text-3xl md:text-4xl font-bold text-text-heading mb-3"><?php echo esc_html( $heading ); ?></h2>
        <?php endif; ?>
        <?php if ( ! empty( $description ) ) : ?>
          <p class="font-body text-base md:text-lg text-text-body max-w-3xl mx-auto"><?php echo esc_html( $description ); ?></p>
        <?php endif; ?>
      </header>
    <?php endif; ?>

    <?php if ( $attorney_query->have_posts() ) : ?>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        <?php
        while ( $attorney_query->have_posts() ) :
          $attorney_query->the_post();

          $current_post_id = get_the_ID();

          $name          = (string) get_post_meta( $current_post_id, 'attorney_profile_attorney_name', true );
          $attorney_type = (string) get_post_meta( $current_post_id, 'attorney_profile_attorney_type', true );
          $position      = (string) get_post_meta( $current_post_id, 'attorney_profile_attorney_position', true );
          $image_id      = (int) get_post_meta( $current_post_id, 'attorney_profile_attorney_profile_image', true );
          $phone         = (string) get_post_meta( $current_post_id, 'attorney_personal_information_attorney_contact_information_phone_number', true );
          $main_bio      = (string) get_post_meta( $current_post_id, 'attorney_personal_information_attorney_main_content', true );

          $display_name  = '' !== $name ? $name : get_the_title();
          $display_role  = trim( $position );
          $image_url     = $image_id > 0 ? wp_get_attachment_image_url( $image_id, 'large' ) : '';
          $image_alt     = $image_id > 0 ? (string) get_post_meta( $image_id, '_wp_attachment_image_alt', true ) : '';
          $profile_url   = get_permalink( $current_post_id );
          $phone_display = $phone;
          $phone_href    = preg_replace( '/[^0-9+]/', '', $phone_display );

          $stripped_bio   = wp_strip_all_tags( $main_bio );
          $excerpt_source = '' !== trim( $stripped_bio ) ? $stripped_bio : get_the_excerpt( $current_post_id );
          $excerpt_text   = wp_trim_words( $excerpt_source, 26, '...' );
          ?>
          <article class="attorney-listing-card">
            <div class="attorney-listing-image-wrap mb-4">
              <?php if ( ! empty( $image_url ) ) : ?>
                <img
                  class="attorney-listing-image"
                  src="<?php echo esc_url( $image_url ); ?>"
                  alt="<?php echo esc_attr( '' !== $image_alt ? $image_alt : $display_name ); ?>"
                  loading="lazy"
                />
              <?php else : ?>
                <div class="attorney-listing-image attorney-listing-image--fallback" aria-hidden="true"></div>
              <?php endif; ?>
            </div>

            <h3 class="attorney-listing-name font-heading font-bold text-text-heading mb-1">
              <a href="<?php echo esc_url( $profile_url ); ?>" class="hover:underline"><?php echo esc_html( $display_name ); ?></a>
            </h3>

            <?php if ( '' !== $display_role ) : ?>
              <p class="attorney-listing-meta font-body text-text-muted mb-3"><?php echo esc_html( $display_role ); ?></p>
            <?php endif; ?>

            <?php if ( '' !== $excerpt_text ) : ?>
              <p class="attorney-listing-excerpt font-body text-text-body mb-5"><?php echo esc_html( $excerpt_text ); ?></p>
            <?php endif; ?>

            <div class="flex items-center justify-between gap-6">
              <a class="attorney-listing-action" href="<?php echo esc_url( $profile_url ); ?>">
                <span><?php esc_html_e( 'View Profile', 'mbn-theme' ); ?></span>
                <img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/icon-chevron-right-blue.svg' ) ); ?>" alt="" aria-hidden="true" class="w-6 h-6" />
              </a>

              <?php if ( '' !== $phone_href ) : ?>
                <a class="attorney-listing-action" href="<?php echo esc_url( 'tel:' . $phone_href ); ?>">
                  <span><?php esc_html_e( 'Call Office', 'mbn-theme' ); ?></span>
                  <img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/icn-phone-blue.svg' ) ); ?>" alt="" aria-hidden="true" class="w-6 h-6" />
                </a>
              <?php endif; ?>
            </div>
          </article>
        <?php endwhile; ?>
      </div>
      <?php wp_reset_postdata(); ?>
    <?php else : ?>
      <p class="text-center text-text-body"><?php esc_html_e( 'No active attorneys found.', 'mbn-theme' ); ?></p>
    <?php endif; ?>
  </div>
</section>
