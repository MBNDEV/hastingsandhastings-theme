<?php
/**
 * Video Background Form Section - Dynamic Render
 *
 * @param array $attributes Block attributes
 * @param string $content Block content
 * @param WP_Block $block Block instance
 * @package MBN_Theme
 */

$video_mp4_url   = $attributes['videoMp4Url'] ?? '';
$video_webm_url  = $attributes['videoWebmUrl'] ?? '';
$enable_gradient = $attributes['enableGradientOverlay'] ?? false;
$eyebrow_text    = $attributes['eyebrowText'] ?? 'Free Consultation';
$main_heading    = $attributes['mainHeading'] ?? 'Talk with Hastings & Hastings about your case';
$subheading_text = $attributes['subheadingText'] ?? 'If you were hurt in an accident, our team is here to listen, answer your questions, and help you understand the next step.';
$gravity_form_id = $attributes['gravityFormId'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'video-bg-form-section',
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    
    <?php if ( ! empty( $video_mp4_url ) ) : ?>
        <!-- Video Background -->
        <video class="video-background" autoplay muted loop playsinline>
            <?php if ( ! empty( $video_mp4_url ) ) : ?>
                <source src="<?php echo esc_url( $video_mp4_url ); ?>" type="video/mp4">
            <?php endif; ?>
            <?php if ( ! empty( $video_webm_url ) ) : ?>
                <source src="<?php echo esc_url( $video_webm_url ); ?>" type="video/webm">
            <?php endif; ?>
        </video>
    <?php endif; ?>
    
    <?php if ( $enable_gradient ) : ?>
        <!-- Gradient Overlay -->
        <div class="gradient-overlay"></div>
    <?php endif; ?>
    
    <!-- Form Container -->
    <div class="form-section-container">
        <div class="form-container">
            
            <!-- Form Header -->
            <div class="form-header">
                <div class="form-header-content">
                    <?php if ( ! empty( $eyebrow_text ) ) : ?>
                        <p class="form-eyebrow">
                            <?php echo esc_html( $eyebrow_text ); ?>
                        </p>
                    <?php endif; ?>
                    
                    <?php if ( ! empty( $main_heading ) ) : ?>
                        <h2 class="form-main-heading">
                            <?php echo esc_html( $main_heading ); ?>
                        </h2>
                    <?php endif; ?>
                    
                    <?php if ( ! empty( $subheading_text ) ) : ?>
                        <p class="form-subheading">
                            <?php echo esc_html( $subheading_text ); ?>
                        </p>
                    <?php endif; ?>
                </div>
            </div>
            
            <?php if ( ! empty( $gravity_form_id ) && function_exists( 'gravity_form' ) ) : ?>
                <!-- Gravity Form -->
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
                <div class="form-placeholder">
                    <p><?php esc_html_e( 'No Gravity Form selected or Gravity Forms plugin not active.', 'mbn-theme' ); ?></p>
                </div>
            <?php endif; ?>
            
        </div>
    </div>
    
</section>
