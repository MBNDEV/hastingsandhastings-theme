<?php
/**
 * Auto Collision lander markup — the two columns inside <main>.
 *
 * Included by ./shell.php inside the loop.
 *
 * The seven design frames differ only in which page of the Gravity Form is on
 * screen, so everything here is rendered once and the form supplies the steps.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>
<div class="ac-layout">

	<div class="ac-pitch">
		<div class="ac-pitch__headline">
			<img
				class="ac-pitch__cash"
				src="<?php echo esc_url( mbn_ac_assets_url() . 'cash.png' ); ?>"
				alt=""
				width="144"
				height="106"
			>
			<h1 class="ac-pitch__title">
				<span class="ac-pitch__title-lead">FREE</span>
				<span class="ac-pitch__title-rest">Case Review</span>
			</h1>
			<img
				class="ac-pitch__badge"
				src="<?php echo esc_url( mbn_ac_assets_url() . 'badge-29-fee.svg' ); ?>"
				alt="<?php esc_attr_e( '29% fee — keep more of what you deserve', 'mbn-theme' ); ?>"
				width="180"
				height="180"
			>
		</div>

		<p class="ac-pitch__copy">
			Arizona injury victims have trusted us since 1979. Answer a few quick questions, and an attorney &mdash; not
			an intake person &mdash; will review your case. $0 upfront, $0 out of pocket, and a 29% fee that leaves more
			of your settlement with you.
		</p>

		<div class="ac-featured">
			<span class="ac-featured__label"><?php esc_html_e( 'As featured on:', 'mbn-theme' ); ?></span>
			<img
				class="ac-featured__logos"
				src="<?php echo esc_url( mbn_ac_assets_url() . 'featured-logos.svg' ); ?>"
				alt="<?php esc_attr_e( 'Arizona&rsquo;s Family, 3TV, CBS 5 and AZFamily Sports', 'mbn-theme' ); ?>"
				width="326"
				height="38"
			>
		</div>
	</div>

	<div class="ac-formcol">
		<?php
		if ( function_exists( 'mbn_ac_render_form' ) ) {
			mbn_ac_render_form();
		}
		?>
	</div>

</div>
