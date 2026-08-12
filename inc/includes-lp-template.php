<?php
/**
 * Landing Page (LP) template support.
 *
 * Registers what the landing page templates need: the stylesheets and fonts
 * extracted from the captured LP snapshot, the sliders it depends on, the body
 * classes its CSS is written against, and the lead form.
 *
 * Both language variants — page-templates/template-lp.php and
 * page-templates/template-lp-es.php — share every asset here. They differ only
 * in which markup partial they render and which Gravity Form they submit to.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'MBN_LP_TEMPLATE' ) ) {
	define( 'MBN_LP_TEMPLATE', 'page-templates/template-lp.php' );
}

if ( ! defined( 'MBN_LP_TEMPLATE_ES' ) ) {
	define( 'MBN_LP_TEMPLATE_ES', 'page-templates/template-lp-es.php' );
}

if ( ! function_exists( 'mbn_lp_assets_url' ) ) {
	/**
	 * Base URL for the landing page's own asset folder, with trailing slash.
	 *
	 * @return string
	 */
	function mbn_lp_assets_url() {
		return trailingslashit( get_theme_file_uri( 'page-templates/lp/assets' ) );
	}
}

if ( ! function_exists( 'mbn_lp_routed' ) ) {
	/**
	 * Flag set when a legacy-assigned page has been routed to the LP template.
	 *
	 * Core has no filter on get_page_template_slug(), so is_page_template()
	 * cannot see the rerouting — this remembers it instead.
	 *
	 * @param bool|null $set Pass true to raise the flag.
	 * @return bool
	 */
	function mbn_lp_routed( $set = null ) {
		static $routed = false;

		if ( true === $set ) {
			$routed = true;
		}

		return $routed;
	}
}

if ( ! function_exists( 'mbn_lp_is_template' ) ) {
	/**
	 * Whether the current request renders either landing page template.
	 *
	 * @return bool
	 */
	function mbn_lp_is_template() {
		return mbn_lp_routed()
			|| is_page_template( MBN_LP_TEMPLATE )
			|| is_page_template( MBN_LP_TEMPLATE_ES );
	}
}

if ( ! function_exists( 'mbn_lp_variant' ) ) {
	/**
	 * Language variant of the landing page being rendered.
	 *
	 * @return string 'es' for the Spanish template, 'en' otherwise.
	 */
	function mbn_lp_variant() {
		return is_page_template( MBN_LP_TEMPLATE_ES ) ? 'es' : 'en';
	}
}

if ( ! function_exists( 'mbn_lp_asset_version' ) ) {
	/**
	 * Cache-busting version for an LP asset, falling back to the theme version.
	 *
	 * @param string $file File name inside page-templates/lp/assets.
	 * @return string
	 */
	function mbn_lp_asset_version( $file ) {
		$path = get_theme_file_path( 'page-templates/lp/assets/' . $file );

		return file_exists( $path ) ? (string) filemtime( $path ) : (string) wp_get_theme()->get( 'Version' );
	}
}

/**
 * Stylesheets, in the order the captured page loaded them.
 *
 * Each entry depends on the previous handle so wp_enqueue_style() cannot
 * reorder them — the Elementor kit variables in lp-theme.css have to win over
 * the bundle, and the fonts have to land last.
 *
 * @return array<string, string> Handle suffix => file name.
 */
function mbn_lp_stylesheets() {
	return array(
		'base'     => 'lp-base.css',
		'bundle'   => 'nitro-min-noimport-495239f0b081bfaee91bf3938fcfef1c-stylesheet-08e3385f.css',
		'theme'    => 'lp-theme.css',
		'vendor'   => 'nitro-min-noimport-3f1eb593692db866bf2dc2d3b8ed1801-stylesheet-9c34e7a0.css',
		'fonts'    => 'lp-fonts.css',
	);
}

/**
 * Enqueue the landing page assets.
 *
 * @return void
 */
function mbn_lp_enqueue_assets() {
	if ( ! mbn_lp_is_template() ) {
		return;
	}

	$base     = mbn_lp_assets_url();
	$previous = array();

	foreach ( mbn_lp_stylesheets() as $suffix => $file ) {
		$handle = 'mbn-lp-' . $suffix;

		wp_enqueue_style( $handle, $base . $file, $previous, mbn_lp_asset_version( $file ) );

		$previous = array( $handle );
	}

	wp_enqueue_script( 'jquery' );

	wp_enqueue_script(
		'mbn-lp-slick',
		$base . 'slick.min-61364aaa.js',
		array( 'jquery' ),
		mbn_lp_asset_version( 'slick.min-61364aaa.js' ),
		true
	);

	/*
	 * Every slider on the page is initialised here — the snapshot's lander.js
	 * is not loaded, its awards carousel and custom arrows having been folded
	 * into lp-custom.js. See page-templates/lp/README.md.
	 */
	wp_enqueue_script(
		'mbn-lp-custom',
		$base . 'lp-custom.js',
		array( 'jquery', 'mbn-lp-slick' ),
		mbn_lp_asset_version( 'lp-custom.js' ),
		true
	);

	/**
	 * Filters whether the theme-wide scroll animation assets are dropped on the
	 * LP. Nothing in the landing page markup carries [data-animate].
	 *
	 * @param bool $dequeue Default true.
	 */
	if ( apply_filters( 'mbn_lp_dequeue_theme_assets', true ) ) {
		wp_dequeue_style( 'hastingsandhastings-scroll-animations' );
		wp_dequeue_script( 'hastingsandhastings-scroll-animations' );
	}
}
add_action( 'wp_enqueue_scripts', 'mbn_lp_enqueue_assets', 20 );

if ( ! function_exists( 'mbn_lp_set_testimonials' ) ) {
	/**
	 * Hand the slider its quotes.
	 *
	 * lp-custom.js rebuilds #testimonials_lp on load, so whatever is in the
	 * markup would otherwise be replaced by the English set baked into the
	 * script. content-es.php calls this with the Spanish quotes while it
	 * renders; calling it with nothing leaves the script's own set in place.
	 *
	 * @param array<int, array<string, string>> $testimonials Each with 'intro' and 'text'.
	 * @return void
	 */
	function mbn_lp_set_testimonials( $testimonials = array() ) {
		static $done = false;

		if ( $done || ! is_array( $testimonials ) || ! $testimonials ) {
			return;
		}

		$done = true;

		wp_localize_script( 'mbn-lp-custom', 'mbnLpData', array( 'testimonials' => array_values( $testimonials ) ) );
	}
}

/**
 * Serve the Spanish landing page as Spanish to browsers and crawlers.
 *
 * @param string $output Language attributes for the <html> tag.
 * @return string
 */
function mbn_lp_language_attributes( $output ) {
	if ( ! is_page_template( MBN_LP_TEMPLATE_ES ) ) {
		return $output;
	}

	/**
	 * Filters the locale advertised by the Spanish landing page.
	 *
	 * @param string $locale BCP 47 language tag.
	 */
	$locale = (string) apply_filters( 'mbn_lp_es_locale', 'es' );

	return preg_replace( '/lang="[^"]*"/', 'lang="' . esc_attr( $locale ) . '"', $output );
}
add_filter( 'language_attributes', 'mbn_lp_language_attributes' );

/**
 * Add the body classes the captured CSS is scoped to.
 *
 * The stylesheet bundle targets .elementor-kit-8830 for its CSS custom
 * properties and .landing-page for layout overrides, so both have to be on
 * <body> for the page to render as designed.
 *
 * @param string[] $classes Body classes.
 * @return string[]
 */
function mbn_lp_body_class( $classes ) {
	if ( ! mbn_lp_is_template() ) {
		return $classes;
	}

	$classes = array_merge(
		$classes,
		array(
			'mbn-lp',
			'page-lp',
			'landing-page',
			'elementor-page',
			'elementor-kit-8830',
		)
	);

	if ( 'es' === mbn_lp_variant() ) {
		$classes[] = 'mbn-lp-es';
	}

	return $classes;
}
add_filter( 'body_class', 'mbn_lp_body_class' );

/**
 * Keep pages assigned to the retired "Hastings LP (Static)" template working.
 *
 * Those pages still carry _wp_page_template = page-templates/template-hastings-lp.php.
 * Rather than rewrite post meta, route them at render time — and make
 * is_page_template() agree, so the asset enqueue and body classes fire too.
 *
 * @param string $template Resolved template path.
 * @return string
 */
function mbn_lp_legacy_template( $template ) {
	if ( ! is_page() ) {
		return $template;
	}

	$assigned = get_page_template_slug( get_queried_object_id() );

	if ( 'page-templates/template-hastings-lp.php' !== $assigned ) {
		return $template;
	}

	$new = get_theme_file_path( MBN_LP_TEMPLATE );

	if ( ! is_readable( $new ) ) {
		return $template;
	}

	mbn_lp_routed( true );

	return $new;
}
add_filter( 'template_include', 'mbn_lp_legacy_template', 5 );

if ( ! function_exists( 'mbn_lp_render_form' ) ) {
	/**
	 * Render the landing page lead form.
	 *
	 * Always the live Gravity Form, so submissions, notifications and spam
	 * protection work. The LP's form styling is scoped to the .lp-form wrapper
	 * this renders inside, not to any particular form ID, so whichever form is
	 * pointed at picks up the design.
	 *
	 * If the form cannot be rendered nothing is output to visitors; editors get
	 * a short notice in its place rather than a silent hole in the page.
	 *
	 * @return void
	 */
	function mbn_lp_render_form() {
		// Form IDs as used on the client's own pages: 10 on /lp/, 12 on /smm-spanish/.
		$default = 'es' === mbn_lp_variant() ? 12 : 10;

		/**
		 * Filters the Gravity Forms form ID used by the landing page.
		 *
		 * @param int    $form_id Default for this variant.
		 * @param string $variant Language variant ('en' or 'es').
		 */
		$form_id = (int) apply_filters( 'mbn_lp_form_id', $default, mbn_lp_variant() );

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
			'<p class="mbn-lp-form-notice">%s</p>',
			esc_html(
				sprintf(
					/* translators: %d: Gravity Forms form ID. */
					__( 'Gravity Forms form %d is not available. Activate Gravity Forms, or point the mbn_lp_form_id filter at an existing form.', 'mbn-theme' ),
					$form_id
				)
			)
		);
	}
}
