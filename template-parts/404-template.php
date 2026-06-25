<?php
/**
 * 404 Error Page Template Block Template.
 * 
 * Syncs with "404 Error Page Template" Block Template post.
 * Edit in WordPress admin, then export using Block Templates → Sync Tools.
 * 
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:mbn-theme/hero-section {"eyebrowText":"Error 404","mainHeading":"PAGE NOT FOUND","subheading":"Sorry, the page you are looking for does not exist or has been moved.\u003cbr\u003eLet us help you find what you need.","overlayImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-hero-overlay.png","overlayImageId":394,"showCtaBar":false,"backgroundImageUrl":"http://hastingsandhastings.dev.local/wp-content/uploads/2026/06/img-mini-hero-poster.jpg","backgroundImageId":445} /-->

<!-- wp:html -->
<section class="error-404-content container mx-auto px-4 py-12 lg:py-16">
	<div class="max-w-3xl mx-auto text-center">
		<h2 class="text-2xl font-bold mb-6">Here are some helpful links instead:</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h3 class="text-xl font-bold mb-3">🏠 Go Home</h3>
				<p class="text-gray-600 mb-4">Return to our homepage</p>
				<a href="/" class="btn-primary btn-cta">Go back to Homepage</a>
			</div>

			<div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h3 class="text-xl font-bold mb-3">📍 Our Locations</h3>
				<p class="text-gray-600 mb-4">Find an office near you</p>
				<a href="/locations/" class="btn-secondary btn-cta">View Locations</a>
			</div>

			<div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h3 class="text-xl font-bold mb-3">⚖️ Practice Areas</h3>
				<p class="text-gray-600 mb-4">Learn about our legal services</p>
				<a href="/practice-areas/" class="btn-secondary btn-cta">View Practice Areas</a>
			</div>

			<div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
				<h3 class="text-xl font-bold mb-3">📞 Contact Us</h3>
				<p class="text-gray-600 mb-4">Get in touch with our team</p>
				<a href="/contact-us/" class="btn-secondary btn-cta">Contact Us</a>
			</div>
		</div>
	</div>
</section>
<!-- /wp:html -->