<?php
/**
 * Page Pattern: Thank You
 *
 * This file contains the complete page data for the 'Thank You' page.
 * It can be imported to create/update the page on other environments.
 *
 * Includes: Content, Featured Image, Status, Attributes, Custom Fields
 *
 * To use: Tools -> Page Content Sync -> Import All Pages from Files
 *
 * @package CustomTheme
 */

return array(
	'title'               => 'Thank You',
	'slug'                => 'thank-you',
	'status'              => 'publish',
	'excerpt'             => '',
	'parent_slug'         => '',
	'menu_order'          => 0,
	'template'            => '',
	'featured_image_url'  => '',
	'featured_image_path' => '', // Theme assets path (ships via Git).
	'custom_fields'       => array(
		'_wp_page_template' => 'page-templates/template-blank.php',
	),
	'content'             => <<<'EOD'
<!-- wp:mbn-theme/hero-section {"eyebrowText":"","mainHeading":"THANK YOU","subheading":"Thank you for your submission, we will contact you shortly.<br>If you have an urgent request, please call us at <a href=\"tel:4807061100\">(480) 706-1100</a>.","overlayImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-hero-overlay.png","overlayImageId":394,"showCtaBar":false,"backgroundImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-mini-hero-poster.jpg","backgroundImageId":445} /-->
EOD
	,
);
