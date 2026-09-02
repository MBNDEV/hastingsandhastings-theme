<?php
/**
 * Auto Collision template support.
 *
 * Registers what the Auto Collision lander and its thank-you page need: the
 * fonts and stylesheet the design is drawn with, the body classes the CSS is
 * scoped to, and the multi-step Gravity Form that supplies the seven steps.
 *
 * Both templates — page-templates/template-auto-collision.php and
 * page-templates/template-auto-collision-thank-you.php — share every asset
 * here. They differ only in which markup partial the shell renders.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'MBN_AC_TEMPLATE' ) ) {
	define( 'MBN_AC_TEMPLATE', 'page-templates/template-auto-collision.php' );
}

if ( ! defined( 'MBN_AC_TEMPLATE_THANK_YOU' ) ) {
	define( 'MBN_AC_TEMPLATE_THANK_YOU', 'page-templates/template-auto-collision-thank-you.php' );
}

if ( ! defined( 'MBN_AC_FORM_ID' ) ) {
	define( 'MBN_AC_FORM_ID', 8 );
}

if ( ! function_exists( 'mbn_ac_assets_url' ) ) {
	/**
	 * Base URL for the template's own asset folder, with trailing slash.
	 *
	 * @return string
	 */
  function mbn_ac_assets_url() {
      return trailingslashit( get_theme_file_uri( 'page-templates/auto-collision/assets' ) );
  }
}

if ( ! function_exists( 'mbn_ac_is_template' ) ) {
	/**
	 * Whether the current request renders either Auto Collision template.
	 *
	 * @return bool
	 */
  function mbn_ac_is_template() {
      return is_page_template( MBN_AC_TEMPLATE ) || is_page_template( MBN_AC_TEMPLATE_THANK_YOU );
  }
}

if ( ! function_exists( 'mbn_ac_variant' ) ) {
	/**
	 * Variant of the Auto Collision page being rendered.
	 *
	 * @return string 'thank-you' for the confirmation page, 'lander' otherwise.
	 */
  function mbn_ac_variant() {
      return is_page_template( MBN_AC_TEMPLATE_THANK_YOU ) ? 'thank-you' : 'lander';
  }
}

if ( ! function_exists( 'mbn_ac_asset_version' ) ) {
	/**
	 * Cache-busting version for a theme asset, falling back to the theme version.
	 *
	 * @param string $relative_path Path inside the theme.
	 * @return string
	 */
  function mbn_ac_asset_version( $relative_path ) {
      $path = get_theme_file_path( $relative_path );

      return file_exists( $path ) ? (string) filemtime( $path ) : (string) wp_get_theme()->get( 'Version' );
  }
}

/**
 * Enqueue the Auto Collision assets.
 *
 * @return void
 */
function mbn_ac_enqueue_assets() {
  if ( ! mbn_ac_is_template() ) {
      return;
  }

	wp_enqueue_style(
      'mbn-ac-fonts',
      'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=Noto+Serif:wght@600;700&display=swap',
      array(),
      null // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- Google Fonts versions its own URL.
	);

	$stylesheet = 'assets/css/auto-collision.css';

	wp_enqueue_style(
      'mbn-ac',
      get_theme_file_uri( $stylesheet ),
      array( 'mbn-ac-fonts' ),
      mbn_ac_asset_version( $stylesheet )
	);

	/**
	 * Filters whether the theme-wide scroll animation assets are dropped here.
	 * Nothing in the Auto Collision markup carries [data-animate].
	 *
	 * @param bool $dequeue Default true.
	 */
  if ( apply_filters( 'mbn_ac_dequeue_theme_assets', true ) ) {
      wp_dequeue_style( 'hastingsandhastings-scroll-animations' );
      wp_dequeue_script( 'hastingsandhastings-scroll-animations' );
  }
}
add_action( 'wp_enqueue_scripts', 'mbn_ac_enqueue_assets', 20 );

/**
 * Add the body classes the Auto Collision CSS is scoped against.
 *
 * @param string[] $classes Body classes.
 * @return string[]
 */
function mbn_ac_body_class( $classes ) {
  if ( ! mbn_ac_is_template() ) {
      return $classes;
  }

	$classes[] = 'mbn-ac';
	$classes[] = 'mbn-ac--' . mbn_ac_variant();

	return $classes;
}
add_filter( 'body_class', 'mbn_ac_body_class' );

if ( ! function_exists( 'mbn_ac_form_id' ) ) {
	/**
	 * Resolve which Gravity Form the lander should render.
	 *
	 * One form serves every Auto Collision lander, so this is a constant with a
	 * filter rather than a per-page setting.
	 *
	 * @return int
	 */
  function mbn_ac_form_id() {
      /**
       * Filters the Gravity Forms form ID used by the Auto Collision lander.
       *
       * @param int $form_id Default MBN_AC_FORM_ID.
       * @param int $page_id Current page ID.
       */
      return (int) apply_filters( 'mbn_ac_form_id', MBN_AC_FORM_ID, get_the_ID() );
  }
}

if ( ! function_exists( 'mbn_ac_render_form' ) ) {
	/**
	 * Render the Auto Collision multi-step form.
	 *
	 * AJAX is on so the seven steps advance without a full page load, which is
	 * what the design's single non-scrolling screen assumes. The styling is
	 * scoped to the .ac-formcol wrapper this renders inside rather than to a
	 * form ID, so whichever form is pointed at picks up the design.
	 *
	 * If the form cannot be rendered nothing is output to visitors; editors get
	 * a short notice in its place rather than a silent hole in the page.
	 *
	 * @return void
	 */
  function mbn_ac_render_form() {
      $form_id = mbn_ac_form_id();

    if ( $form_id > 0 && function_exists( 'gravity_form' ) && class_exists( 'GFAPI' ) ) {
        $form = GFAPI::get_form( $form_id );

      if ( $form && ! is_wp_error( $form ) ) {
        gravity_form( $form_id, false, false, false, null, true );

        return;
      }
    }

    if ( ! current_user_can( 'edit_posts' ) ) {
        return;
    }

      printf(
        '<p class="ac-form-notice">%s</p>',
        esc_html(
          sprintf(
                  /* translators: %d: Gravity Forms form ID. */
            __( 'Gravity Forms form %d is not available. Activate Gravity Forms, or point the mbn_ac_form_id filter at an existing form.', 'mbn-theme' ),
            $form_id
          )
        )
      );
  }
}
