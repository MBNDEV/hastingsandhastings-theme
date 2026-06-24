<?php
/**
 * Page Pattern: Video Center
 *
 * This file contains the complete page data for the 'Video Center' page.
 * It can be imported to create/update the page on other environments.
 *
 * Includes: Content, Featured Image, Status, Attributes, Custom Fields
 *
 * To use: Tools → Page Content Sync → Import All Pages from Files
 *
 * @package CustomTheme
 */

return array(
	'title'               => 'Video Center',
	'slug'                => 'video-center',
	'status'              => 'publish',
	'excerpt'             => '',
	'parent_slug'         => '',
	'menu_order'          => 0,
	'template'            => '',
	'featured_image_url'  => '',
	'featured_image_path' => '', // Theme assets path (ships via Git)
	'custom_fields'       => array(),
	'content'             => <<<'EOD'
<!-- wp:mbn-theme/hero-section {"eyebrowText":"Video Center","mainHeading":"Video guidance for injury victims across Arizona","subheading":"Explore videos from Hastings & Hastings covering accident claims, legal guidance, case-related questions, and helpful information for people navigating injuries in Arizona.","overlayImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-fg-video-overlay-1.webp","overlayImageId":9912,"showCtaBar":false,"heroButtonText":"","heroButtonUrl":"","backgroundImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-hero-bg-video-center.jpg","backgroundImageId":10098,"contentJustify":"justify-start","contentVerticalAlign":"items-end"} /-->

<!-- wp:mbn-theme/video-center /-->

<!-- wp:mbn-theme/section-video-bg-form {"videoMp4Url":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-breathtaking-and-beautiful-view-of-phoenix-az.mp4","videoWebmUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-breathtaking-and-beautiful-view-of-phoenix-az.webm","gravityFormId":"1","align":"full"} /-->
EOD
	,
);
