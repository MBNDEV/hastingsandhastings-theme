<?php
/**
 * Page Pattern: Contact Us
 *
 * This file contains the complete page data for the 'Contact Us' page.
 * It can be imported to create/update the page on other environments.
 *
 * Includes: Content, Featured Image, Status, Attributes, Custom Fields
 *
 * To use: Tools → Page Content Sync → Import All Pages from Files
 *
 * @package CustomTheme
 */

return array(
	'title'               => 'Contact Us',
	'slug'                => 'contact-us',
	'status'              => 'publish',
	'excerpt'             => '',
	'parent_slug'         => '',
	'menu_order'          => 0,
	'template'            => '',
	'featured_image_url'  => '',
	'featured_image_path' => '', // Theme assets path (ships via Git)
	'custom_fields'       => array(),
	'content'             => <<<'EOD'
<!-- wp:mbn-theme/contact-us-page {"gravityFormId":"2","align":"full"} /-->
EOD
	,
);
