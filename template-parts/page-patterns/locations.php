<?php
/**
 * Page Pattern: Locations
 *
 * This file contains the complete page data for the 'Locations' page.
 * It can be imported to create/update the page on other environments.
 *
 * Includes: Content, Featured Image, Status, Attributes, Custom Fields
 *
 * To use: Tools → Page Content Sync → Import All Pages from Files
 *
 * @package CustomTheme
 */

return array(
	'title'               => 'Locations',
	'slug'                => 'locations',
	'status'              => 'publish',
	'excerpt'             => '',
	'parent_slug'         => '',
	'menu_order'          => 0,
	'template'            => '',
	'featured_image_url'  => '',
	'featured_image_path' => '', // Theme assets path (ships via Git)
	'custom_fields'       => array(),
	'content'             => <<<'EOD'
<!-- wp:mbn-theme/hero-section {"eyebrowText":"Locations","mainHeading":"Trusted legal help across the Phoenix Valley","subheading":"With multiple office locations across the Valley, Hastings & Hastings makes it easier to connect with experienced legal support closer to where you live.","badgeImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/badge-90-plus-combined-legal-experience.svg","badgeImageId":9897,"videoMp4Url":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-section-more-affordable-way.mp4","videoMp4Id":417,"videoWebmUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-section-more-affordable-way.webm","videoWebmId":416,"overlayImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-fg-video-overlay-1.webp","overlayImageId":9912,"showCtaBar":false,"paddingBottom":"pb-32","contentJustify":"justify-between","contentVerticalAlign":"items-end","textMaxWidth":"max-w-3xl"} /-->

<!-- wp:mbn-theme/locations-directory /-->

<!-- wp:mbn-theme/section-video-bg-form {"videoMp4Url":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-breathtaking-and-beautiful-view-of-phoenix-az.mp4","videoWebmUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-breathtaking-and-beautiful-view-of-phoenix-az.webm","gravityFormId":"1","align":"full"} /-->
EOD
	,
);
