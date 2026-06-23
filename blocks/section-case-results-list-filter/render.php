<?php
/**
 * Section: Case Results List Filter - Server-side rendering.
 *
 * @package MBN_Theme
 * @param array $attributes Block attributes.
 */

$filter_label        = $attributes['filterLabel'] ?? 'Filter Cases:';
$filter_default_text = $attributes['filterDefaultText'] ?? 'All Cases';
$filter_title        = $attributes['filterTitle'] ?? 'Select topics to filter articles';
$filter_subtitle     = $attributes['filterSubtitle'] ?? 'Choose one or more topics below, then apply your selection.';
$clear_button_text   = $attributes['clearButtonText'] ?? 'Clear Filters';
$apply_button_text   = $attributes['applyButtonText'] ?? 'Apply Filters';
$no_results_text     = $attributes['noResultsText'] ?? 'No case results match the selected filters.';

$all_case_terms = get_terms(
  array(
	  'taxonomy'   => 'case_result_category',
	  'hide_empty' => false,
	  'orderby'    => 'name',
	  'order'      => 'DESC',
  )
);

$term_map = array();
if ( ! is_wp_error( $all_case_terms ) ) {
  foreach ( $all_case_terms as $term_item ) {
    $term_map[ $term_item->term_id ] = array(
		'term'     => $term_item,
		'children' => array(),
    );
  }

  foreach ( $all_case_terms as $term_item ) {
    if ( $term_item->parent > 0 && isset( $term_map[ $term_item->parent ] ) ) {
      $term_map[ $term_item->parent ]['children'][] = $term_item;
    }
  }

  foreach ( $term_map as &$term_data ) {
    if ( empty( $term_data['children'] ) ) {
      continue;
    }

    usort(
      $term_data['children'],
      static function ( $left_term, $right_term ) {
        return $left_term->term_id <=> $right_term->term_id;
      }
    );
  }
  unset( $term_data );
}

$filter_groups = array();
foreach ( $term_map as $term_data ) {
  if ( $term_data['term']->parent > 0 ) {
    continue;
  }

  $child_terms = $term_data['children'];

  if ( empty( $child_terms ) ) {
    $child_terms = array( $term_data['term'] );
  }

  $filter_groups[] = array(
	  'title' => $term_data['term']->name,
	  'items' => $child_terms,
  );
}

$columns = array( array(), array(), array() );

$group_column_map = array(
	'vehicle-accidents'                 => 0,
	'serious-catastrophic-injuries'     => 1,
	'serious-and-catastrophic-injuries' => 1,
	'property-negligence-claims'        => 1,
	'property-and-negligence-claims'    => 1,
	'additional-injury-claims'          => 2,
	'more-topics'                       => 2,
);

$unmapped_groups = array();

foreach ( $filter_groups as $group ) {
  $group_key = sanitize_title( wp_strip_all_tags( $group['title'] ) );

  if ( isset( $group_column_map[ $group_key ] ) ) {
    $target_column               = $group_column_map[ $group_key ];
    $columns[ $target_column ][] = $group;
    continue;
  }

  $unmapped_groups[] = $group;
}

if ( ! empty( $unmapped_groups ) ) {
  $column_index = 0;
  foreach ( $unmapped_groups as $group ) {
    $columns[ $column_index ][] = $group;
    ++$column_index;
    if ( $column_index > 2 ) {
      $column_index = 0;
    }
  }
}

$third_column_priority = array(
	'additional-injury-claims' => 0,
	'more-topics'              => 1,
);

if ( ! empty( $columns[2] ) ) {
  usort(
    $columns[2],
    static function ( $left_group, $right_group ) use ( $third_column_priority ) {
      $left_key  = sanitize_title( wp_strip_all_tags( $left_group['title'] ) );
      $right_key = sanitize_title( wp_strip_all_tags( $right_group['title'] ) );

      $left_priority  = $third_column_priority[ $left_key ] ?? 99;
      $right_priority = $third_column_priority[ $right_key ] ?? 99;

      if ( $left_priority === $right_priority ) {
        return strcmp( $left_group['title'], $right_group['title'] );
      }

      return $left_priority <=> $right_priority;
    }
  );
}

$case_results_query = new WP_Query(
  array(
	  'post_type'      => 'case_result',
	  'post_status'    => 'publish',
	  'posts_per_page' => -1,
	  'orderby'        => 'date',
	  'order'          => 'ASC',
	  'no_found_rows'  => true,
  )
);

$instance_id = wp_unique_id( 'case-results-filter-' );

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class'              => 'case-results-filter case-results-filter-block',
	  'data-default-label' => $filter_default_text,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="case-results-filter__inner">

    <div class="case-results-filter__bar">
      <span class="case-results-filter__bar-label"><?php echo esc_html( $filter_label ); ?></span>
      <button
        id="<?php echo esc_attr( $instance_id ); ?>-toggle"
        class="case-results-filter__dropdown"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="<?php echo esc_attr( $instance_id ); ?>-dropdown"
      >
        <span class="case-results-filter__dropdown-text"><?php echo esc_html( $filter_default_text ); ?></span>
        <svg class="case-results-filter__dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg>
      </button>

      <div
        id="<?php echo esc_attr( $instance_id ); ?>-dropdown"
        class="dropdown-filter"
        role="dialog"
        aria-label="<?php echo esc_attr( $filter_title ); ?>"
      >

        <div class="dropdown-filter__header">
          <p class="dropdown-filter__title"><?php echo esc_html( $filter_title ); ?></p>
          <p class="dropdown-filter__subtitle"><?php echo esc_html( $filter_subtitle ); ?></p>
          <div class="dropdown-filter__actions">
            <button type="button" class="dropdown-filter__btn-clear"><?php echo esc_html( $clear_button_text ); ?></button>
            <button type="button" class="dropdown-filter__btn-apply">
              <span class="dropdown-filter__btn-apply-text"><?php echo esc_html( $apply_button_text ); ?></span>
            </button>
          </div>
        </div>

        <div class="dropdown-filter__columns">
          <?php foreach ( $columns as $column_groups ) : ?>
            <div class="dropdown-filter__column">
              <?php foreach ( $column_groups as $group ) : ?>
                <div class="dropdown-filter__sub-group">
                  <p class="dropdown-filter__section-title"><?php echo esc_html( $group['title'] ); ?></p>
                  <ul class="dropdown-filter__option-list">
                    <?php foreach ( $group['items'] as $term_item ) : ?>
                      <li>
                        <label class="dropdown-filter__option" for="<?php echo esc_attr( $instance_id . '-term-' . $term_item->term_id ); ?>">
                          <input
                            id="<?php echo esc_attr( $instance_id . '-term-' . $term_item->term_id ); ?>"
                            type="checkbox"
                            class="dropdown-filter__checkbox"
                            value="<?php echo esc_attr( $term_item->slug ); ?>"
                            data-label="<?php echo esc_attr( $term_item->name ); ?>"
                          >
                          <span class="dropdown-filter__option-text"><?php echo esc_html( $term_item->name ); ?></span>
                        </label>
                      </li>
                    <?php endforeach; ?>
                  </ul>
                </div>
              <?php endforeach; ?>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>

    <ul class="case-results-filter__grid" role="list">
      <?php if ( $case_results_query->have_posts() ) : ?>
        <?php
        while ( $case_results_query->have_posts() ) :
          $case_results_query->the_post();

          $current_post_id = get_the_ID();
          $case_amount     = (string) get_post_meta( $current_post_id, '_case_result_amount', true );
          $case_title      = (string) get_post_meta( $current_post_id, '_case_result_case_title', true );
          $case_desc       = (string) get_post_meta( $current_post_id, '_case_result_description', true );
          $title_output    = '' !== $case_title ? $case_title : get_the_title();

          $terms      = get_the_terms( $current_post_id, 'case_result_category' );
          $term_label = '';
          $term_slugs = array();

          if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
            foreach ( $terms as $term_item ) {
              $term_slugs[] = $term_item->slug;
            }
            $term_label = $terms[0]->name;
          }
          ?>
          <li class="case-results-filter__item" data-case-categories="<?php echo esc_attr( implode( ',', $term_slugs ) ); ?>">
            <article class="case-results-filter__card">
              <header class="case-results-filter__card-header">
                <span class="case-results-filter__tag"><?php echo esc_html( $term_label ); ?></span>
              </header>
              <p class="case-results-filter__amount"><?php echo esc_html( $case_amount ); ?></p>
              <h3 class="case-results-filter__case-title"><?php echo esc_html( $title_output ); ?></h3>
              <p class="case-results-filter__description"><?php echo wp_kses_post( $case_desc ); ?></p>
            </article>
          </li>
        <?php endwhile; ?>
      <?php endif; ?>
      <?php wp_reset_postdata(); ?>
    </ul>

    <p class="case-results-filter__empty" hidden><?php echo wp_kses_post( $no_results_text ); ?></p>

  </div>
</section>
