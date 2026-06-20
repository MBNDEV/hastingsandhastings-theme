<?php
/**
 * Section - Practice Area Lists
 * Dynamic block rendering
 *
 * @package MBN_Theme
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

// Get attributes
$categories = $attributes['categories'] ?? array();

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'pal-practice-area',
	  'id'    => 'cases-we-handle',
  )
);

// Block assets URI for fallback images
$block_assets_uri = get_theme_file_uri( '/build/blocks/section-practice-area-lists/assets/images' );

// Default fallback images
$default_images = array(
	'vehicle-accidents.jpg',
	'serious-injuries.jpg',
	'property-claims.jpg',
	'additional-claims.jpg',
);

// Enqueue stylesheet
wp_enqueue_style(
  'section-practice-area-lists',
  get_theme_file_uri( '/build/blocks/section-practice-area-lists/style.css' ),
  array(),
  filemtime( get_theme_file_path( '/build/blocks/section-practice-area-lists/style.css' ) )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="pal-container">

		<?php if ( ! empty( $categories ) ) : ?>
			<?php foreach ( $categories as $index => $category ) : ?>
				<?php
				// Determine row layout class (alternate between text-left and img-left)
				$row_class = ( 0 === $index % 2 ) ? 'pal-practice-area__row--text-left' : 'pal-practice-area__row--img-left';

				// Get category image or fallback
				$category_image = ! empty( $category['imageUrl'] )
					? $category['imageUrl']
					: $block_assets_uri . '/' . $default_images[ $index % count( $default_images ) ];

				// Get alt text if image ID exists
				$image_alt = '';
				if ( ! empty( $category['imageId'] ) ) {
					$image_alt = get_post_meta( $category['imageId'], '_wp_attachment_image_alt', true );
				}
				if ( empty( $image_alt ) ) {
					$image_alt = esc_attr( $category['title'] ?? '' ) . ' image';
				}
				?>

				<div class="pal-practice-area__row <?php echo esc_attr( $row_class ); ?>">
					<div class="pal-practice-area__text">
						<?php if ( ! empty( $category['title'] ) ) : ?>
							<h4 class="pal-practice-area__cat-title">
								<?php echo esc_html( $category['title'] ); ?>
							</h4>
						<?php endif; ?>

						<?php if ( ! empty( $category['description'] ) ) : ?>
							<p><?php echo esc_html( $category['description'] ); ?></p>
						<?php endif; ?>

						<?php if ( ! empty( $category['links'] ) ) : ?>
							<ul class="pal-link-grid">
							<?php foreach ( $category['links'] as $link_item ) : ?>
								<?php if ( ! empty( $link_item['text'] ) ) : ?>
									<li>
										<a href="<?php echo esc_url( $link_item['url'] ?? '#' ); ?>">
											<img 
												src="<?php echo esc_url( $block_assets_uri . '/chevron-right.svg' ); ?>" 
												alt="" 
												aria-hidden="true"
											>
											<?php echo esc_html( $link_item['text'] ); ?>
											</a>
										</li>
									<?php endif; ?>
								<?php endforeach; ?>
							</ul>
						<?php endif; ?>
					</div>

					<figure class="pal-practice-area__img">
						<img 
							src="<?php echo esc_url( $category_image ); ?>" 
							alt="<?php echo esc_attr( $image_alt ); ?>" 
							loading="lazy"
						>
					</figure>
				</div>

			<?php endforeach; ?>
		<?php endif; ?>

	</div>
</section>
