<?php
/**
 * Template Name: Landing Page (LP)
 * Template Post Type: page
 *
 * Standalone conversion-focused landing page, in English.
 *
 * The markup is the template: the page's editor content is not rendered. Point
 * the 'mbn_lp_content_path' filter at another partial to build LP variants off
 * the same shell — page-templates/template-lp-es.php is one.
 *
 * Shell:   page-templates/lp/shell.php
 * Markup:  page-templates/lp/content.php   (generated — see lp/README.md)
 * Assets:  inc/includes-lp-template.php    (registration + enqueue)
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mbn_lp_variant = 'en';

require get_theme_file_path( 'page-templates/lp/shell.php' );
