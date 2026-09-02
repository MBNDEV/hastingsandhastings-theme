<?php
/**
 * Single post template.
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

      $current_post_id = (int) get_the_ID();
      $post_title      = get_the_title();
      $post_url        = get_permalink();
      $posts_page_id   = (int) get_option( 'page_for_posts' );
      $posts_page_url  = $posts_page_id > 0 ? get_permalink( $posts_page_id ) : '';
      if ( ! is_string( $posts_page_url ) || '' === $posts_page_url ) {
        $posts_page_url = home_url( '/blog/' );
      }

      $categories = get_the_category( $current_post_id );

      $share_links = array(
		  'x'        => 'https://x.com/intent/post?text=' . rawurlencode( $post_title ) . '&url=' . rawurlencode( $post_url ),
		  'facebook' => 'https://www.facebook.com/sharer/sharer.php?u=' . rawurlencode( $post_url ),
		  'linkedin' => 'https://www.linkedin.com/sharing/share-offsite/?url=' . rawurlencode( $post_url ),
		  'email'    => 'mailto:?subject=' . rawurlencode( $post_title ) . '&body=' . rawurlencode( $post_url ),
      );
      ?>

      <section class="blog-hero">
        <div class="blog-hero__container">

          <nav class="blog-hero__breadcrumb" aria-label="<?php esc_attr_e( 'Breadcrumb', 'mbn-theme' ); ?>">
            <ol>
              <li class="blog-hero__breadcrumb-blog">
                <a href="<?php echo esc_url( $posts_page_url ); ?>"><?php esc_html_e( 'Blog', 'mbn-theme' ); ?></a>
              </li>
              <?php if ( ! empty( $categories ) ) : ?>
                <?php foreach ( $categories as $index => $category ) : ?>
                  <li<?php echo ( ( count( $categories ) - 1 ) === $index ) ? ' aria-current="page"' : ''; ?>>
                    <div class="blog-hero__category-tag">
                      <?php echo esc_html( $category->name ); ?>
                    </div>
                  </li>
                <?php endforeach; ?>
              <?php endif; ?>
            </ol>
          </nav>

          <header class="blog-hero__header">
            <h1 class="blog-hero__title"><?php echo esc_html( $post_title ); ?></h1>
          </header>

          <div class="blog-hero__meta">
            <div class="blog-hero__share">
              <span class="blog-hero__share-label"><?php esc_html_e( 'Share on:', 'mbn-theme' ); ?></span>
              <ul class="blog-hero__share-icons" aria-label="<?php esc_attr_e( 'Share on social media', 'mbn-theme' ); ?>">
                <li>
                  <a href="<?php echo esc_url( $share_links['x'] ); ?>" aria-label="<?php esc_attr_e( 'Share on X (Twitter)', 'mbn-theme' ); ?>" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </li>
                <li>
                  <a href="<?php echo esc_url( $share_links['facebook'] ); ?>" aria-label="<?php esc_attr_e( 'Share on Facebook', 'mbn-theme' ); ?>" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                </li>
                <li>
                  <a href="<?php echo esc_url( $share_links['linkedin'] ); ?>" aria-label="<?php esc_attr_e( 'Share on LinkedIn', 'mbn-theme' ); ?>" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </li>
                <li>
                  <a href="<?php echo esc_url( $share_links['email'] ); ?>" aria-label="<?php esc_attr_e( 'Share via Email', 'mbn-theme' ); ?>">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </a>
                </li>
              </ul>
            </div>

            <div class="blog-hero__actions">
              <button class="blog-hero__action-btn blog-hero__action-btn--light" aria-label="<?php esc_attr_e( 'Switch to light mode', 'mbn-theme' ); ?>" data-theme-toggle="light" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M11.9953 4.8158C11.7538 4.8158 11.5522 4.73397 11.3906 4.5703C11.2289 4.40663 11.1481 4.20463 11.1481 3.9643V1.7143C11.1481 1.4738 11.2304 1.27172 11.3951 1.10805C11.5596 0.944382 11.7626 0.862549 12.0043 0.862549C12.2458 0.862549 12.4474 0.944382 12.6091 1.10805C12.7707 1.27172 12.8516 1.4738 12.8516 1.7143V3.9643C12.8516 4.20463 12.7692 4.40663 12.6046 4.5703C12.4401 4.73397 12.237 4.8158 11.9953 4.8158ZM17.0771 6.9228C16.9071 6.75296 16.8221 6.55322 16.8221 6.32355C16.8221 6.09405 16.9071 5.89597 17.0771 5.7293L18.6521 4.1293C18.8231 3.95947 19.0264 3.87455 19.2621 3.87455C19.4977 3.87455 19.7006 3.95947 19.8706 4.1293C20.0404 4.2993 20.1253 4.49821 20.1253 4.72605C20.1253 4.95405 20.0404 5.15297 19.8706 5.3228L18.2706 6.9228C18.1006 7.0928 17.9016 7.1778 17.6738 7.1778C17.4458 7.1778 17.2469 7.0928 17.0771 6.9228ZM20.0356 12.8518C19.7952 12.8518 19.5932 12.7695 19.4296 12.6048C19.2659 12.4403 19.1841 12.2372 19.1841 11.9955C19.1841 11.754 19.2659 11.5525 19.4296 11.3908C19.5932 11.2291 19.7952 11.1483 20.0356 11.1483H22.2856C22.5261 11.1483 22.7281 11.2306 22.8918 11.3953C23.0555 11.5598 23.1373 11.7629 23.1373 12.0045C23.1373 12.246 23.0555 12.4476 22.8918 12.6093C22.7281 12.771 22.5261 12.8518 22.2856 12.8518H20.0356ZM11.9953 23.1375C11.7538 23.1375 11.5522 23.0557 11.3906 22.892C11.2289 22.7284 11.1481 22.5263 11.1481 22.2858V20.0358C11.1481 19.7955 11.2304 19.5935 11.3951 19.4298C11.5596 19.2661 11.7626 19.1843 12.0043 19.1843C12.2458 19.1843 12.4474 19.2661 12.6091 19.4298C12.7707 19.5935 12.8516 19.7955 12.8516 20.0358V22.2858C12.8516 22.5263 12.7692 22.7284 12.6046 22.892C12.4401 23.0557 12.237 23.1375 11.9953 23.1375ZM5.72905 6.9228L4.12905 5.3478C3.95922 5.18413 3.8743 4.98363 3.8743 4.7463C3.8743 4.50897 3.96255 4.3033 4.13906 4.1293C4.30639 3.95947 4.50297 3.87455 4.7288 3.87455C4.9548 3.87455 5.15272 3.95947 5.32256 4.1293L6.92255 5.7293C7.09655 5.9033 7.18356 6.10422 7.18356 6.33205C7.18356 6.56005 7.09655 6.75897 6.92255 6.9288C6.74805 7.08213 6.54389 7.1588 6.31005 7.1588C6.07606 7.1588 5.88239 7.08013 5.72905 6.9228ZM18.6711 19.8708L17.0711 18.2708C16.9011 18.1041 16.8171 17.905 16.8191 17.6735C16.8211 17.4419 16.9071 17.2411 17.0771 17.0713C17.2344 16.918 17.4301 16.8413 17.6643 16.8413C17.8985 16.8413 18.1006 16.918 18.2706 17.0713L19.8956 18.6463C20.0654 18.8161 20.1472 19.0201 20.1411 19.258C20.1349 19.496 20.0539 19.7011 19.8981 19.8733C19.7299 20.0415 19.5268 20.1255 19.2888 20.1255C19.0508 20.1255 18.8449 20.0406 18.6711 19.8708ZM1.71405 12.8518C1.47355 12.8518 1.27147 12.7695 1.1078 12.6048C0.944138 12.4403 0.862305 12.2372 0.862305 11.9955C0.862305 11.754 0.944138 11.5525 1.1078 11.3908C1.27147 11.2291 1.47355 11.1483 1.71405 11.1483H3.96405C4.20439 11.1483 4.40639 11.2306 4.57005 11.3953C4.73372 11.5598 4.81555 11.7629 4.81555 12.0045C4.81555 12.246 4.73372 12.4476 4.57005 12.6093C4.40639 12.771 4.20439 12.8518 3.96405 12.8518H1.71405ZM4.12905 19.8608C3.95922 19.6935 3.8743 19.4969 3.8743 19.271C3.8743 19.045 3.95922 18.8451 4.12905 18.6713L5.72905 17.0713C5.89055 16.918 6.08839 16.8413 6.32256 16.8413C6.55672 16.8413 6.75872 16.92 6.92855 17.0775C7.09855 17.2474 7.18356 17.4504 7.18356 17.6866C7.18356 17.9227 7.09855 18.1258 6.92855 18.2958L5.35355 19.8708C5.18589 20.0406 4.98339 20.1255 4.74605 20.1255C4.50872 20.1255 4.30305 20.0373 4.12905 19.8608ZM11.9998 17.9643C10.3411 17.9643 8.93247 17.3849 7.7738 16.2261C6.61497 15.0674 6.03555 13.6587 6.03555 12C6.03555 10.3414 6.61497 8.93272 7.7738 7.77405C8.93247 6.61522 10.3411 6.0358 11.9998 6.0358C13.6585 6.0358 15.0671 6.61522 16.2258 7.77405C17.3846 8.93272 17.9641 10.3414 17.9641 12C17.9641 13.6587 17.3846 15.0674 16.2258 16.2261C15.0671 17.3849 13.6585 17.9643 11.9998 17.9643ZM11.9998 16.255C13.182 16.255 14.1876 15.8415 15.0168 15.0143C15.846 14.187 16.2606 13.1822 16.2606 12C16.2606 10.8179 15.846 9.81222 15.0168 8.98305C14.1876 8.15388 13.182 7.7393 11.9998 7.7393C10.8176 7.7393 9.81289 8.15388 8.98555 8.98305C8.15839 9.81222 7.7448 10.8179 7.7448 12C7.7448 13.1822 8.15839 14.187 8.98555 15.0143C9.81289 15.8415 10.8176 16.255 11.9998 16.255Z" fill="currentColor"/>
            </svg>
              </button>
              <button class="blog-hero__action-btn blog-hero__action-btn--dark" aria-label="<?php esc_attr_e( 'Switch to dark mode', 'mbn-theme' ); ?>" data-theme-toggle="dark" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14.747 22.1496C13.2608 22.1496 11.8535 21.8841 10.525 21.3531C9.19646 20.8221 8.03154 20.0907 7.03021 19.1591C6.02871 18.2274 5.23538 17.1316 4.65021 15.8718C4.06504 14.6121 3.77246 13.2547 3.77246 11.7996C3.77246 10.3427 4.06396 8.9813 4.64696 7.7153C5.22996 6.4493 6.02329 5.35106 7.02696 4.42056C8.03046 3.48989 9.19646 2.75706 10.525 2.22206C11.8535 1.68706 13.2608 1.41956 14.747 1.41956C15.2733 1.41956 15.7976 1.47239 16.32 1.57805C16.8423 1.68372 17.3573 1.82889 17.865 2.01355C18.0471 2.07339 18.188 2.17956 18.2877 2.33206C18.3874 2.48472 18.4372 2.64089 18.4372 2.80056C18.4372 2.91822 18.4137 3.03122 18.3667 3.13956C18.3197 3.24806 18.246 3.34814 18.1455 3.43981C16.9161 4.52381 15.9225 5.77864 15.1645 7.2043C14.4065 8.63014 14.0275 10.1611 14.0275 11.7973C14.0275 13.4151 14.4021 14.9365 15.1515 16.3613C15.9006 17.786 16.8883 19.044 18.1145 20.1353C18.2131 20.225 18.2875 20.3243 18.3375 20.4333C18.3873 20.5425 18.4122 20.6548 18.4122 20.7703C18.4122 20.9378 18.3655 21.1007 18.2722 21.2591C18.1789 21.4176 18.0411 21.5267 17.859 21.5866C17.3513 21.7712 16.8385 21.9112 16.3205 22.0066C15.8025 22.1019 15.278 22.1496 14.747 22.1496ZM14.747 20.4463C14.9605 20.4463 15.1684 20.4453 15.3707 20.4433C15.573 20.4413 15.7369 20.436 15.8622 20.4273C14.7742 19.2058 13.9115 17.8627 13.2742 16.3981C12.6369 14.9334 12.3182 13.3997 12.3182 11.7971C12.3182 10.1944 12.6369 8.66172 13.2742 7.19906C13.9115 5.73639 14.7742 4.38597 15.8622 3.1478C15.7369 3.13914 15.572 3.13381 15.3677 3.13181C15.1634 3.12981 14.9565 3.12881 14.747 3.12881C12.216 3.12881 10.038 3.97314 8.21321 5.6618C6.38821 7.35047 5.47571 9.39589 5.47571 11.7981C5.47571 14.2001 6.38821 16.242 8.21321 17.9238C10.038 19.6055 12.216 20.4463 14.747 20.4463Z" fill="currentColor"/>
            </svg>
              </button>
            </div>
          </div>

        </div>
      </section>

      <article class="blog-content">
        <div class="blog-content__container">

          <div class="blog-content__body">
            <?php the_content(); ?>
          </div>

          <div class="blog-content__share-bar">
            <span class="blog-content__share-label"><?php esc_html_e( 'Share on', 'mbn-theme' ); ?></span>
            <ul class="blog-content__share-icons" aria-label="<?php esc_attr_e( 'Share article on social media', 'mbn-theme' ); ?>">
              <li>
                <a href="<?php echo esc_url( $share_links['x'] ); ?>" aria-label="<?php esc_attr_e( 'Share on X (Twitter)', 'mbn-theme' ); ?>" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </li>
              <li>
                <a href="<?php echo esc_url( $share_links['facebook'] ); ?>" aria-label="<?php esc_attr_e( 'Share on Facebook', 'mbn-theme' ); ?>" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </li>
              <li>
                <a href="<?php echo esc_url( $share_links['linkedin'] ); ?>" aria-label="<?php esc_attr_e( 'Share on LinkedIn', 'mbn-theme' ); ?>" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </li>
              <li>
                <a href="<?php echo esc_url( $share_links['email'] ); ?>" aria-label="<?php esc_attr_e( 'Share via Email', 'mbn-theme' ); ?>">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </article>

      <div class="blog-content__cta-container">
        <aside class="blog-content__cta" aria-label="<?php esc_attr_e( 'Free consultation call to action', 'mbn-theme' ); ?>">
          <div class="blog-content__cta-logo" aria-hidden="true">
            <img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/logo-mark.svg' ) ); ?>" alt="<?php esc_attr_e( 'Hastings & Hastings', 'mbn-theme' ); ?>" />
          </div>
          <h4 class="blog-content__cta-title"><?php esc_html_e( 'Start Your Free Consultation', 'mbn-theme' ); ?></h4>
          <p class="blog-content__cta-text"><?php esc_html_e( 'If you are unsure where to start or how to manage these different payment options, talking with an experienced brain injury attorney can help you determine the best path forward.', 'mbn-theme' ); ?></p>
          <div class="blog-content__cta-actions">
            <a href="/contact-us/" class="blog-content__cta-btn"><?php esc_html_e( 'CONTACT US TODAY TO SCHEDULE A FREE CONSULTATION', 'mbn-theme' ); ?></a>
            <p class="blog-content__cta-phone"><span><?php esc_html_e( 'CALL TODAY', 'mbn-theme' ); ?></span> <a href="tel:4806053939">(480) 605-3939</a></p>
          </div>
        </aside>
      </div>

        <?php
        $recent_posts_query = new WP_Query(
          array(
			  'post_type'           => 'post',
			  'post_status'         => 'publish',
			  'posts_per_page'      => 3,
			  'post__not_in'        => array( $current_post_id ),
			  'ignore_sticky_posts' => true,
          )
        );

        if ( $recent_posts_query->have_posts() ) :
          ?>
          <section class="recent-articles">
            <div class="recent-articles__container">
              <div class="blog-content__divider" aria-hidden="true"></div>

              <h2 class="recent-articles__heading"><?php esc_html_e( 'Recent Articles', 'mbn-theme' ); ?></h2>

              <ul class="recent-articles__grid">
                <?php
                while ( $recent_posts_query->have_posts() ) :
                  $recent_posts_query->the_post();

                  $recent_id        = (int) get_the_ID();
                  $recent_title     = get_the_title( $recent_id );
                  $recent_permalink = get_permalink( $recent_id );
                  $recent_excerpt   = wp_trim_words( get_the_excerpt( $recent_id ), 24 );
                  $recent_image_url = hastingsandhastings_get_recent_article_image_url( $recent_id );
                  ?>
                  <li class="recent-articles__item">
                    <article class="recent-articles__card">
                      <a href="<?php echo esc_url( $recent_permalink ); ?>" class="recent-articles__card-link" tabindex="-1" aria-hidden="true">
                        <figure class="recent-articles__card-figure">
                          <img src="<?php echo esc_url( $recent_image_url ); ?>" alt="<?php echo esc_attr( $recent_title ); ?>" class="recent-articles__card-img">
                        </figure>
                      </a>
                      <div class="recent-articles__card-body">
                        <h3 class="recent-articles__card-title">
                          <a href="<?php echo esc_url( $recent_permalink ); ?>"><?php echo esc_html( $recent_title ); ?></a>
                        </h3>
                        <p class="recent-articles__card-excerpt"><?php echo esc_html( $recent_excerpt ); ?></p>
                        <a href="<?php echo esc_url( $recent_permalink ); ?>" class="recent-articles__card-read-more">
                          <span class="recent-articles__card-read-more-label"><?php esc_html_e( 'Read More', 'mbn-theme' ); ?></span>
                          <span class="recent-articles__card-read-more-icon" aria-hidden="true">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </span>
                        </a>
                      </div>
                    </article>
                  </li>
                  <?php
                endwhile;
                ?>
              </ul>
            </div>
          </section>
          <?php
        endif;
        wp_reset_postdata();
        ?>

      <?php
    endwhile;
  else :
    get_template_part( 'template-parts/content', 'none' );
  endif;
  ?>
</main>

<?php
get_footer();
