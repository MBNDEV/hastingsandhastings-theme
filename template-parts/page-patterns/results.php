<?php
/**
 * Page Pattern: Case Results
 *
 * This file contains the complete page data for the 'Case Results' page.
 * It can be imported to create/update the page on other environments.
 *
 * Includes: Content, Featured Image, Status, Attributes, Custom Fields
 *
 * To use: Tools → Page Content Sync → Import All Pages from Files
 *
 * @package CustomTheme
 */

return array(
	'title'               => 'Case Results',
	'slug'                => 'results',
	'status'              => 'publish',
	'excerpt'             => '',
	'parent_slug'         => '',
	'menu_order'          => 0,
	'template'            => '',
	'featured_image_url'  => '',
	'featured_image_path' => '', // Theme assets path (ships via Git)
	'custom_fields'       => array(),
	'content'             => <<<'EOD'
<!-- wp:mbn-theme/hero-section {"eyebrowText":"Case Results","mainHeading":"Proven outcomes backed by experience","subheading":"Explore a selection of case results Hastings & Hastings has secured for injury victims across Arizona. Every case is different, but these outcomes reflect the firm’s experience, commitment, and long-standing work on behalf of clients.","videoMp4Url":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-arizona-highway-at-dusk.mp4","videoMp4Id":10061,"overlayImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-fg-video-overlay-1.webp","overlayImageId":9912,"showCtaBar":false,"heroButtonText":"","heroButtonUrl":"","contentJustify":"justify-start","contentVerticalAlign":"items-end","textMaxWidth":"max-w-3xl"} /-->

<!-- wp:mbn-theme/section-case-results-list-filter {"align":"full"} /-->

<!-- wp:mbn-theme/section-video-bg-form {"videoMp4Url":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-breathtaking-and-beautiful-view-of-phoenix-az.mp4","videoWebmUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-breathtaking-and-beautiful-view-of-phoenix-az.webm","gravityFormId":"1","align":"full"} /-->
EOD
	,
);
