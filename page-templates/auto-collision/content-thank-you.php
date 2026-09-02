<?php
/**
 * Auto Collision thank-you markup — the single column inside <main>.
 *
 * Included by ./shell.php inside the loop.
 *
 * Unlike the lander, this page's editor content is rendered when it has any,
 * so the confirmation copy can be reworded without a deploy. The design's copy
 * is the fallback.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mbn_ac_editor_content = trim( (string) get_the_content() );

/**
 * Filters the thank-you headline.
 *
 * Not the page title: that reads "Auto Collision - Thank You" so it is findable
 * in the pages list, while the design shows a plain "Thank you!".
 *
 * @param string $heading Displayed heading.
 * @param int    $post_id Current page ID.
 */
$mbn_ac_heading = (string) apply_filters( 'mbn_ac_thank_you_heading', __( 'Thank you!', 'mbn-theme' ), get_the_ID() );

?>
<div class="ac-thanks">
	<h1 class="ac-thanks__title"><?php echo esc_html( $mbn_ac_heading ); ?></h1>

	<?php if ( '' !== $mbn_ac_editor_content ) : ?>
		<div class="ac-thanks__copy">
			<?php the_content(); ?>
		</div>
	<?php else : ?>
		<div class="ac-thanks__copy">
			<p>
				We&rsquo;ve received your information and a member of our team will review the details of your case. One
				of our experienced personal injury attorneys will contact you soon to discuss your situation, answer
				your questions, and help you understand your available options.
			</p>
			<p>
				Please keep your phone nearby and check your email for a follow-up from our team. We look forward to
				speaking with you and learning more about how we may be able to help.
			</p>
		</div>
	<?php endif; ?>
</div>
