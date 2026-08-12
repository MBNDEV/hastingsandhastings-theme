<?php
/**
 * Template Name: Landing Page (LP — Español)
 * Template Post Type: page
 *
 * The Spanish landing page. Same shell, layout, images and stylesheets as
 * page-templates/template-lp.php — only the copy differs, and it comes from the
 * client's reference page at https://www.hastingsandhastings.com/smm-spanish/.
 *
 * Shell:   page-templates/lp/shell.php
 * Markup:  page-templates/lp/content-es.php (generated — see lp/README.md)
 * Copy:    scripts/lp-es-strings.js
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mbn_lp_variant = 'es';

require get_theme_file_path( 'page-templates/lp/shell.php' );
