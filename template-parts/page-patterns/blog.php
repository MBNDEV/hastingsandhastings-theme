<?php
/**
 * Page Pattern: Blog
 *
 * This file contains the complete page data for the 'Blog' page.
 * It can be imported to create/update the page on other environments.
 *
 * Includes: Content, Featured Image, Status, Attributes, Custom Fields
 *
 * To use: Tools -> Page Content Sync -> Import All Pages from Files
 *
 * @package CustomTheme
 */

return array(
	'title'               => 'Blog',
	'slug'                => 'blog',
	'status'              => 'publish',
	'excerpt'             => '',
	'parent_slug'         => '',
	'menu_order'          => 0,
	'template'            => '',
	'featured_image_url'  => '',
	'featured_image_path' => '', // Theme assets path (ships via Git).
	'custom_fields'       => array(),
	'content'             => <<<'EOD'
<!-- wp:mbn-theme/hero-section {"eyebrowText":"BLOG","mainHeading":"Injury Law Insights","subheading":"Browse articles from Hastings & Hastings covering personal injury topics, accident-related questions, legal guidance, and helpful information for injury victims across Arizona.","posterImageId":0,"showCtaBar":false,"backgroundImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-bg-blog-listing.jpg","backgroundImageId":9856,"paddingTop":"pt-48","paddingBottom":"pb-32","contentJustify":"justify-start","contentVerticalAlign":"items-end","textMaxWidth":"max-w-3xl"} /-->

<!-- wp:mbn-theme/section-blog-listing-filter {"align":"full"} /-->

<!-- wp:mbn-theme/section-video-bg-form {"videoMp4Url":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-breathtaking-and-beautiful-view-of-phoenix-az.mp4","videoWebmUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-breathtaking-and-beautiful-view-of-phoenix-az.webm","gravityFormId":"1","align":"full"} /-->
EOD
	,
);
