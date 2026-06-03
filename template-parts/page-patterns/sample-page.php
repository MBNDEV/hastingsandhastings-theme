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
<!-- wp:mbn-theme/hero-section {"badgeImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/05/badge-29-percent-fee.svg","badgeImageId":56,"videoMp4Url":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-hero-homepage-opt.mp4","videoMp4Id":389,"videoWebmUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/vid-hero-homepage-opt.webm","videoWebmId":390,"posterImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-hero.jpg","posterImageId":392,"overlayImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-hero-overlay.png","overlayImageId":394} /-->

<!-- wp:mbn-theme/section-intro-homepage {"backgroundImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-intro-bg-homepage.jpg","backgroundImageId":399,"awards":[{"id":"mpxasj0jom49168du4","imageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/awards_state-bar-of-az.svg","imageId":400},{"id":"mpxat02w3y86l2a1ogk","imageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/awards_american-association-for-justice.svg","imageId":401},{"id":"mpxat86qq7z70ibicxk","imageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/awards_expertise-best-personal-injury-lawyers-in-phx-2022.svg","imageId":403},{"id":"mpxate7p88a58psnq5c","imageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/awards_elite-lawyer.svg","imageId":402}]} /-->

<!-- wp:mbn-theme/section-testimonial-badges {"testimonials":[{"id":"mpxs72khlcsuond393j","starRating":5,"content":"..their office handle pretty much everything... I could focus on getting my life back to normal. It was great to not have to worry about anything...","author":"Verified Client"},{"id":"mpxs7qxd6iw0egigh9v","starRating":5,"content":"The team was incredibly professional and guided me through every step. Their expertise made a difficult situation much easier to handle. I'm grateful for their support.","author":"Verified Client"},{"id":"mpxs84k0whdxeyey47q","starRating":5,"content":"From our first consultation to the final settlement, communication was clear and consistent. They truly cared about my case and fought hard for the best outcome possible.","author":"Verified Client"}],"badges":[{"id":"mpxsbt1l16rfreofube","iconUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/workspace_premium.svg","iconId":410,"primaryText":"Serving Arizona","secondaryText":"Since 1979"},{"id":"mpxsczbwjs52nccay4c","iconUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/verified.svg","iconId":412,"primaryText":"One of Arizona’s Long-Standing","secondaryText":"Personal Injury Firms"},{"id":"mpxsdef8m34vugh2hhj","iconUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/location_on.svg","iconId":411,"primaryText":"Serving Clients Across","secondaryText":"10 Valley Locations"}]} /-->
EOD
	,
);
