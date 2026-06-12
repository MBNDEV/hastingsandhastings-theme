<?php
/**
 * Page Pattern: Attorneys
 *
 * This file contains the complete page data for the 'Attorneys' page.
 * It can be imported to create/update the page on other environments.
 *
 * Includes: Content, Featured Image, Status, Attributes, Custom Fields
 *
 * To use: Tools -> Page Content Sync -> Import All Pages from Files
 *
 * @package CustomTheme
 */

return array(
    'title'               => 'Attorneys',
    'slug'                => 'attorneys',
    'status'              => 'publish',
    'excerpt'             => '',
    'parent_slug'         => '',
    'menu_order'          => 0,
    'template'            => '',
    'featured_image_url'  => '',
    'featured_image_path' => '', // Theme assets path (ships via Git)
    'custom_fields'       => array(),
    'content'             => <<<'EOD'
<!-- wp:mbn-theme/hero-section {"eyebrowText":"Meet The Team","mainHeading":"The People Behind Hastings & Hastings","subheading":"Meet the attorneys and team members who help guide clients across Arizona with trusted legal support, local experience, and a client-first approach.","badgeImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/badge-90-plus-combined-legal-experience.svg","badgeImageId":9897,"overlayImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-fg-video-overlay-1.webp","overlayImageId":9912,"showCtaBar":false,"backgroundImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-bg-meet-the-team.jpg","backgroundImageId":9938,"contentVerticalAlign":"items-end","textMaxWidth":"max-w-3xl"} /-->

<!-- wp:mbn-theme/section-attorney-listing {"heading":"","description":""} /-->

<!-- wp:mbn-theme/section-video-bg-form {"videoMp4Url":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-breathtaking-and-beautiful-view-of-phoenix-az.mp4","videoWebmUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-breathtaking-and-beautiful-view-of-phoenix-az.webm","gravityFormId":"1","align":"full"} /-->
EOD
  ,
);
