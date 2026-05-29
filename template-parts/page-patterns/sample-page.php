<?php
/**
 * Page Pattern: Homepage
 *
 * This file contains the complete page data for the 'Homepage' page.
 * It can be imported to create/update the page on other environments.
 *
 * Includes: Content, Featured Image, Status, Attributes, Custom Fields
 *
 * To use: Tools → Page Content Sync → Import All Pages from Files
 *
 * @package CustomTheme
 */

return array(
	'title'               => 'Homepage',
	'slug'                => 'sample-page',
	'status'              => 'publish',
	'excerpt'             => '',
	'parent_slug'         => '',
	'menu_order'          => 0,
	'template'            => 'page-templates\/template-sample.php',
	'featured_image_url'  => '',
	'featured_image_path' => '', // Theme assets path (ships via Git)
	'custom_fields'       => array( '_wp_page_template' => 'page-templates\/template-sample.php' ),
	'content'             => <<<'EOD'
<!-- wp:image {"id":63,"sizeSlug":"full","linkDestination":"none","align":"full"} -->
<figure class="wp-block-image alignfull size-full"><img src="http://hastingsandhastings.dev.local/wp-content/uploads/2026/05/img-homepage-hero.png" alt="" class="wp-image-63"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":65,"sizeSlug":"full","linkDestination":"none","align":"full"} -->
<figure class="wp-block-image alignfull size-full"><img src="http://hastingsandhastings.dev.local/wp-content/uploads/2026/05/img-homepage-section-1.png" alt="" class="wp-image-65"/></figure>
<!-- /wp:image -->
EOD
	,
);
