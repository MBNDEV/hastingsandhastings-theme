<?php
/**
 * Single Attorney template.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

get_header();
?>
<main id="main" class="site-main">
<?php
if ( have_posts() ) :
  while ( have_posts() ) :
    the_post();

    $profile             = function_exists( 'get_field' ) ? get_field( 'attorney_profile' ) : array();
    $personal_info       = function_exists( 'get_field' ) ? get_field( 'attorney_personal_information' ) : array();
    $attorney_name       = is_array( $profile ) ? ( $profile['attorney_name'] ?? '' ) : '';
    $attorney_type       = is_array( $profile ) ? ( $profile['attorney_type'] ?? '' ) : '';
    $attorney_position   = is_array( $profile ) ? ( $profile['attorney_position'] ?? '' ) : '';
    $profile_image       = is_array( $profile ) ? ( $profile['attorney_profile_image'] ?? array() ) : array();
    $education           = is_array( $personal_info ) ? ( $personal_info['attorney_education'] ?? array() ) : array();
    $contact_information = is_array( $personal_info ) ? ( $personal_info['attorney_contact_information'] ?? array() ) : array();
    $main_content        = is_array( $personal_info ) ? ( $personal_info['attorney_main_content'] ?? '' ) : '';

    $contact_information_rows = array();
    if ( is_array( $contact_information ) ) {
      if ( isset( $contact_information[0] ) && is_array( $contact_information[0] ) ) {
        $contact_information_rows = $contact_information;
      } elseif ( isset( $contact_information['office_name'] ) || isset( $contact_information['phone_number'] ) || isset( $contact_information['office_address'] ) || isset( $contact_information['office_link'] ) ) {
        // Backward compatibility for old data saved before repeater migration.
        $contact_information_rows = array( $contact_information );
      }
    }

    $display_name = '' !== $attorney_name ? $attorney_name : get_the_title();

    $image_url = '';
    $image_alt = '';
    if ( is_array( $profile_image ) ) {
      $image_url = isset( $profile_image['url'] ) ? (string) $profile_image['url'] : '';
      $image_alt = isset( $profile_image['alt'] ) ? (string) $profile_image['alt'] : '';
    }
    ?>

  <article id="post-<?php the_ID(); ?>" <?php post_class( 'single-attorney' ); ?>>

    <!-- ===== HERO SECTION ===== -->
    <section class="hero-video-container single-attorney-hero">

      <!-- Background Image (stone wall photo) -->
      <div
        class="hero-background-image"
        style="background-image: url('<?php echo esc_url( get_theme_file_uri( 'assets/images/img-bg-single-attorney.jpg' ) ); ?>');"
      ></div>

      <!-- Overlay (gradient fade from left) -->
      <div
        class="hero-overlay"
        style="background-image: url('<?php echo esc_url( get_theme_file_uri( 'assets/images/img-fg-video-overlay.webp' ) ); ?>');"
      ></div>

      <!-- Hero Content -->
      <div class="hero-content single-attorney-hero__content">
        <div class="single-attorney-hero__inner">
          <div class="single-attorney-hero__layout">

            <!-- Profile Image -->
            <?php if ( '' !== $image_url ) : ?>
              <div class="single-attorney-hero__media">
                <img
                  class="single-attorney-hero__image"
                  src="<?php echo esc_url( $image_url ); ?>"
                  alt="<?php echo esc_attr( '' !== $image_alt ? $image_alt : $display_name ); ?>"
                />
              </div>
            <?php endif; ?>

            <!-- Text -->
            <div class="single-attorney-hero__text">
              <?php if ( '' !== $attorney_type ) : ?>
                <p class="single-attorney-hero__eyebrow">
                  <?php echo esc_html( $attorney_type ); ?>
                </p>
              <?php endif; ?>

              <h1 class="single-attorney-hero__title">
                <?php echo esc_html( $display_name ); ?>
              </h1>

              <?php if ( '' !== $attorney_position ) : ?>
                <p class="single-attorney-hero__position">
                  <?php echo esc_html( $attorney_position ); ?>
                </p>
              <?php endif; ?>
            </div>

          </div>
        </div>
      </div>

    </section>
    <!-- ===== END HERO SECTION ===== -->

    <div class="single-attorney__content">
      <div class="single-attorney__body">

        <!-- ===== LEFT SIDEBAR ===== -->
        <aside class="single-attorney__sidebar">

          <?php if ( ! empty( $education ) ) : ?>
            <section class="single-attorney-section single-attorney-education">
              <h2 class="single-attorney-section__title"><?php esc_html_e( 'Education', 'mbn-theme' ); ?></h2>
              <ul class="single-attorney-education__list">
                <?php foreach ( $education as $education_row ) : ?>
                  <?php
                  $school_name  = isset( $education_row['school_name'] ) ? (string) $education_row['school_name'] : '';
                  $achievements = isset( $education_row['achievements'] ) ? (string) $education_row['achievements'] : '';
                  ?>
                  <li class="single-attorney-education__item">
                    <img
                      class="single-attorney-education__icon"
                      src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/icn-toga-cap.svg' ) ); ?>"
                      alt=""
                      aria-hidden="true"
                    />
                    <div class="single-attorney-education__detail">
                      <?php if ( '' !== $school_name ) : ?>
                        <p class="single-attorney-education__school"><?php echo esc_html( $school_name ); ?></p>
                      <?php endif; ?>
                      <?php if ( '' !== $achievements ) : ?>
                        <div class="single-attorney-education__achievements"><?php echo wp_kses_post( $achievements ); ?></div>
                      <?php endif; ?>
                    </div>
                  </li>
                <?php endforeach; ?>
              </ul>
            </section>
          <?php endif; ?>

          <?php if ( ! empty( $contact_information_rows ) ) : ?>
            <section class="single-attorney-section single-attorney-contact">
              <h2 class="single-attorney-section__title"><?php esc_html_e( 'Contact Information', 'mbn-theme' ); ?></h2>

              <?php foreach ( $contact_information_rows as $contact_information_row ) : ?>
                <?php
                $office_name        = isset( $contact_information_row['office_name'] ) ? (string) $contact_information_row['office_name'] : '';
                $phone_number       = isset( $contact_information_row['phone_number'] ) ? (string) $contact_information_row['phone_number'] : '';
                $office_address     = isset( $contact_information_row['office_address'] ) ? (string) $contact_information_row['office_address'] : '';
                $office_link_url    = '';
                $office_link_target = '_self';

                if ( ! empty( $contact_information_row['office_link'] ) && is_array( $contact_information_row['office_link'] ) ) {
                  $office_link_url    = isset( $contact_information_row['office_link']['url'] ) ? (string) $contact_information_row['office_link']['url'] : '';
                  $office_link_target = isset( $contact_information_row['office_link']['target'] ) && '' !== (string) $contact_information_row['office_link']['target'] ? (string) $contact_information_row['office_link']['target'] : '_self';
                }
                ?>

                <?php if ( '' !== $office_name ) : ?>
                  <?php if ( '' !== $office_link_url ) : ?>
                    <a class="single-attorney-contact__office" href="<?php echo esc_url( $office_link_url ); ?>" target="<?php echo esc_attr( $office_link_target ); ?>"<?php echo '_blank' === $office_link_target ? ' rel="noopener noreferrer"' : ''; ?>><?php echo esc_html( $office_name ); ?></a>
                  <?php else : ?>
                    <p class="single-attorney-contact__office">
                      <?php echo esc_html( $office_name ); ?>
                    </p>
                  <?php endif; ?>
                <?php endif; ?>

                <?php if ( '' !== $phone_number ) : ?>
                  <?php $phone_href = preg_replace( '/[^0-9+]/', '', $phone_number ); ?>
                  <a class="single-attorney-contact__row" href="<?php echo esc_url( 'tel:' . $phone_href ); ?>">
                    <img
                      class="single-attorney-contact__icon"
                      src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/icn-phone-blue.svg' ) ); ?>"
                      alt=""
                      aria-hidden="true"
                    />
                    <span><?php echo esc_html( $phone_number ); ?></span>
                  </a>
                <?php endif; ?>

                <?php if ( '' !== $office_address ) : ?>
                  <div class="single-attorney-contact__row">
                    <img
                      class="single-attorney-contact__icon"
                      src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/icn-location-blue.svg' ) ); ?>"
                      alt=""
                      aria-hidden="true"
                    />
                    <address class="single-attorney-contact__address"><?php echo nl2br( esc_html( $office_address ) ); ?></address>
                  </div>
                <?php endif; ?>
              <?php endforeach; ?>

            </section>
          <?php endif; ?>

        </aside>
        <!-- ===== END LEFT SIDEBAR ===== -->

        <!-- ===== RIGHT MAIN CONTENT ===== -->
        <?php if ( '' !== $main_content ) : ?>
          <div class="single-attorney__main">
            <div class="single-attorney-richtext">
              <?php echo wp_kses_post( $main_content ); ?>
            </div>
          </div>
        <?php endif; ?>
        <!-- ===== END RIGHT MAIN CONTENT ===== -->

      </div>
    </div>

    
  </article>

    <?php
  endwhile;
endif;
?>
</main>

<?php
$single_attorney_after_main_block_attrs = wp_json_encode(
  array(
	  'videoMp4Url'   => get_theme_file_uri( '/assets/videos/vid-breathtaking-and-beautiful-view-of-phoenix-az.mp4' ),
	  'videoWebmUrl'  => get_theme_file_uri( '/assets/videos/vid-breathtaking-and-beautiful-view-of-phoenix-az.webm' ),
	  'gravityFormId' => '1',
	  'align'         => 'full',
  )
);

$single_attorney_after_main_block = sprintf(
  '<!-- wp:mbn-theme/section-video-bg-form %s /-->',
  is_string( $single_attorney_after_main_block_attrs ) ? $single_attorney_after_main_block_attrs : '{}'
);
echo do_blocks( $single_attorney_after_main_block ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered Gutenberg block markup.
?>

<?php
get_footer();
