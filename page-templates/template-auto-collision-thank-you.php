<?php
/**
 * Template Name: Auto Collision Thank You
 * Template Post Type: page
 *
 * Confirmation page for the Auto Collision lander — Gravity Form 8 redirects
 * here on submit. Same shell as the lander, minus the footer badges and terms.
 *
 * Shell:   page-templates/auto-collision/shell.php
 * Markup:  page-templates/auto-collision/content-thank-you.php
 * Assets:  inc/includes-auto-collision-template.php  (registration + enqueue)
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mbn_ac_variant = 'thank-you';

require get_theme_file_path( 'page-templates/auto-collision/shell.php' );
