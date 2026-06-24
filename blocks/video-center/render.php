<?php
/**
 * Video Center Block - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$video_cards = $attributes['videoCards'] ?? array();

$block_assets_uri = get_theme_file_uri( '/build/blocks/video-center/assets/images' );

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'video-center',
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="video-center__container">
    <ul class="video-center__grid" role="list">

      <?php foreach ( $video_cards as $card ) : ?>
        <?php
        $video_type = $card['videoType'] ?? 'youtube';
        $is_mp4     = ( 'mp4' === $video_type );

        // Determine thumbnail source for MP4 videos
        $thumbnail_src = '';
        if ( $is_mp4 ) {
          // Use custom thumbnail if provided, otherwise use placeholder image
          $thumbnail_src = ! empty( $card['thumbnailUrl'] )
            ? $card['thumbnailUrl']
            : $block_assets_uri . '/bg-placeholder.jpg';
        }
        ?>
      <li class="video-center__item">
        <article class="video-center__card"
                 data-video-type="<?php echo esc_attr( $video_type ); ?>"
                 data-video-src="<?php echo esc_url( $card['videoSrc'] ?? '' ); ?>">
          <figure class="video-center__thumbnail">
            <img
              src="<?php echo esc_url( $thumbnail_src ); ?>"
              alt="<?php echo esc_attr( $card['thumbnailAlt'] ?? '' ); ?>"
              class="video-center__thumb-img"
              width="405"
              height="270"
            >
            <div class="video-center__thumb-overlay" aria-hidden="true">
              <svg class="video-center__play-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.5)"/>
                <polygon points="26,20 50,32 26,44" fill="white"/>
              </svg>
            </div>
          </figure>
          <div class="video-center__content">
            <h3 class="video-center__title"><?php echo esc_html( $card['title'] ?? '' ); ?></h3>
            <button class="video-center__watch-btn" aria-label="<?php echo esc_attr( 'Watch video: ' . ( $card['title'] ?? '' ) ); ?>">
              <span>Watch Video</span>
              <img src="<?php echo esc_url( $block_assets_uri . '/icon-chevron-right.svg' ); ?>" alt="" aria-hidden="true" class="video-center__chevron" width="24" height="24">
            </button>
          </div>
        </article>
      </li>
      <?php endforeach; ?>

    </ul>
  </div>
</section>

<!-- Video Modal Overlay -->
<div class="video-center__modal" id="videoCenterModal" role="dialog" aria-modal="true" aria-label="Video player" hidden>
  <div class="video-center__modal-backdrop" id="videoCenterBackdrop"></div>
  <div class="video-center__modal-inner">
    <button class="video-center__modal-close" id="videoCenterClose" aria-label="Close video">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
        <line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <div class="video-center__modal-player" id="videoCenterPlayer"></div>
  </div>
</div>
