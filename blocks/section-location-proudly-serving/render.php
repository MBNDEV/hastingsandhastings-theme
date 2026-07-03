<?php
/**
 * Section Location - Proudly Serving block render template.
 *
 * @package MBN_Theme
 * @param array $attributes Block attributes.
 */

$serving_title   = $attributes['servingTitle'] ?? 'Proudly Serving Mesa, AZ and the Phoenix Area';
$serving_columns = ! empty( $attributes['servingColumns'] ) && is_array( $attributes['servingColumns'] ) ? $attributes['servingColumns'] : array();

$block_assets_uri = get_theme_file_uri( '/build/blocks/section-location-proudly-serving/assets/images' );
$chevron_icon     = $block_assets_uri . '/chevron-right.svg';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'ldp-serving',
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="ldp-container">
    <div class="ldp-serving__header">
      <h2 class="ldp-serving__title"><?php echo esc_html( $serving_title ); ?></h2>
    </div>
    <nav class="ldp-serving__columns" aria-label="<?php echo esc_attr( $serving_title ); ?>">
      <?php foreach ( $serving_columns as $column ) : ?>
        <?php
        if ( ! is_array( $column ) ) {
          continue;
        }
        ?>
        <div class="ldp-serving__col">
          <h4 class="ldp-serving__col-title"><?php echo esc_html( $column['title'] ?? '' ); ?></h4>
          <ul class="ldp-serving__links">
            <?php if ( ! empty( $column['links'] ) && is_array( $column['links'] ) ) : ?>
              <?php foreach ( $column['links'] as $column_link ) : ?>
                <?php
                if ( ! is_array( $column_link ) ) {
                  continue;
                }
                ?>
                <li>
                  <a href="<?php echo esc_url( $column_link['url'] ?? '#' ); ?>">
                    <img src="<?php echo esc_url( $chevron_icon ); ?>" alt="" aria-hidden="true">
                    <?php echo esc_html( $column_link['label'] ?? '' ); ?>
                  </a>
                </li>
              <?php endforeach; ?>
            <?php endif; ?>
          </ul>
        </div>
      <?php endforeach; ?>
    </nav>
  </div>
</section>
