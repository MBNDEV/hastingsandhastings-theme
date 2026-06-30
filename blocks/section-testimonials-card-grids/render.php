<?php
/**
 * Section: Testimonials Card Grid - Server-side rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$cards        = $attributes['cards'] ?? array();
$star_icon    = get_theme_file_uri( '/assets/icons/icn-single-star-no-shadow.svg' );
$wrapper_attr = get_block_wrapper_attributes( array( 'class' => 'tfcards' ) );
?>

<section <?php echo $wrapper_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="tfcards__container">
		<div class="tfcards__grid">

			<?php foreach ( $cards as $card ) : ?>
				<?php $star_count = max( 1, min( 5, intval( $card['starRating'] ?? 5 ) ) ); ?>
				<article class="tfcards__card">
					<div class="tfcards__card-content">

						<div class="tfcards__stars" aria-label="<?php echo esc_attr( $star_count ); ?> out of 5 stars">
							<?php for ( $i = 0; $i < $star_count; $i++ ) : ?>
								<img src="<?php echo esc_url( $star_icon ); ?>" alt="" aria-hidden="true">
							<?php endfor; ?>
						</div>

						<div class="tfcards__card-text">
							<?php if ( ! empty( $card['headline'] ) ) : ?>
								<h2 class="tfcards__card-headline"><?php echo wp_kses_post( $card['headline'] ); ?></h2>
							<?php endif; ?>
							<?php if ( ! empty( $card['quote'] ) ) : ?>
								<p class="tfcards__card-quote"><?php echo wp_kses_post( $card['quote'] ); ?></p>
							<?php endif; ?>
						</div>

					</div>
					<footer class="tfcards__card-footer">
						<p class="tfcards__card-author"><?php echo esc_html( $card['author'] ?? 'Verified Client' ); ?></p>
					</footer>
				</article>
			<?php endforeach; ?>

		</div>
	</div>
</section>
