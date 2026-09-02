<?php
/**
 * Template Name: Auto Collision Lander
 * Template Post Type: page
 *
 * Single-screen conversion lander built around a seven-step Gravity Form.
 *
 * The markup is the template: the page's editor content is not rendered. Point
 * the 'mbn_ac_content_path' filter at another partial to build variants off the
 * same shell — page-templates/template-auto-collision-thank-you.php is one.
 *
 * Shell:   page-templates/auto-collision/shell.php
 * Markup:  page-templates/auto-collision/content.php
 * Assets:  inc/includes-auto-collision-template.php  (registration + enqueue)
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mbn_ac_variant = 'lander';

require get_theme_file_path( 'page-templates/auto-collision/shell.php' );
