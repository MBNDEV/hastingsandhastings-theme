<?php
/**
 * Case Results custom post type, taxonomy sync, and admin fields.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

/**
 * Register Case Results taxonomy.
 *
 * @return void
 */
function custom_theme_register_case_result_category_taxonomy(): void {
  $labels = array(
	  'name'              => __( 'Case Results Categories', 'mbn-theme' ),
	  'singular_name'     => __( 'Case Results Category', 'mbn-theme' ),
	  'search_items'      => __( 'Search Case Results Categories', 'mbn-theme' ),
	  'all_items'         => __( 'All Case Results Categories', 'mbn-theme' ),
	  'parent_item'       => __( 'Parent Case Results Category', 'mbn-theme' ),
	  'parent_item_colon' => __( 'Parent Case Results Category:', 'mbn-theme' ),
	  'edit_item'         => __( 'Edit Case Results Category', 'mbn-theme' ),
	  'update_item'       => __( 'Update Case Results Category', 'mbn-theme' ),
	  'add_new_item'      => __( 'Add New Case Results Category', 'mbn-theme' ),
	  'new_item_name'     => __( 'New Case Results Category Name', 'mbn-theme' ),
	  'menu_name'         => __( 'Case Results Categories', 'mbn-theme' ),
  );

  register_taxonomy(
    'case_result_category',
    array( 'case_result' ),
    array(
		'labels'            => $labels,
		'public'            => false,
		'show_ui'           => true,
		'show_admin_column' => true,
		'show_in_rest'      => false,
		'hierarchical'      => true,
		'rewrite'           => false,
		'query_var'         => false,
		'meta_box_cb'       => false,
    )
  );
}
add_action( 'init', 'custom_theme_register_case_result_category_taxonomy', 6 );

/**
 * Register Case Results post type.
 *
 * @return void
 */
function custom_theme_register_case_results_post_type(): void {
  $labels = array(
	  'name'               => __( 'Case Results', 'mbn-theme' ),
	  'singular_name'      => __( 'Case Result', 'mbn-theme' ),
	  'add_new'            => __( 'Add New', 'mbn-theme' ),
	  'add_new_item'       => __( 'Add New Case Result', 'mbn-theme' ),
	  'edit_item'          => __( 'Edit Case Result', 'mbn-theme' ),
	  'new_item'           => __( 'New Case Result', 'mbn-theme' ),
	  'view_item'          => __( 'View Case Result', 'mbn-theme' ),
	  'search_items'       => __( 'Search Case Results', 'mbn-theme' ),
	  'not_found'          => __( 'No case results found.', 'mbn-theme' ),
	  'not_found_in_trash' => __( 'No case results found in Trash.', 'mbn-theme' ),
	  'all_items'          => __( 'Case Results', 'mbn-theme' ),
	  'menu_name'          => __( 'Case Results', 'mbn-theme' ),
  );

  register_post_type(
    'case_result',
    array(
		'labels'              => $labels,
		'public'              => false,
		'publicly_queryable'  => false,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_admin_bar'   => true,
		'exclude_from_search' => true,
		'show_in_nav_menus'   => false,
		'query_var'           => false,
		'rewrite'             => false,
		'capability_type'     => 'post',
		'has_archive'         => false,
		'hierarchical'        => false,
		'show_in_rest'        => false,
		'menu_position'       => 23,
		'menu_icon'           => 'dashicons-awards',
		'supports'            => array( 'title', 'revisions' ),
		'taxonomies'          => array( 'case_result_category' ),
    )
  );
}
add_action( 'init', 'custom_theme_register_case_results_post_type', 7 );

/**
 * Keep case result categories aligned with post categories hierarchy.
 *
 * @return void
 */
function custom_theme_sync_case_result_categories(): void { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.TooHigh,Generic.Metrics.NestingLevel.TooHigh -- Sync routine intentionally handles full taxonomy tree copy.
  $source_categories = get_terms(
    array(
		'taxonomy'   => 'category',
		'hide_empty' => false,
		'orderby'    => 'term_id',
		'order'      => 'ASC',
    )
  );

  if ( is_wp_error( $source_categories ) ) {
    return;
  }

  $category_payload = array();
  foreach ( $source_categories as $source_category ) {
    $category_payload[] = array(
		'term_id'     => (int) $source_category->term_id,
		'parent'      => (int) $source_category->parent,
		'name'        => (string) $source_category->name,
		'slug'        => (string) $source_category->slug,
		'description' => (string) $source_category->description,
    );
  }

  $sync_hash   = md5( wp_json_encode( $category_payload ) );
  $stored_hash = (string) get_option( 'custom_theme_case_result_category_sync_hash', '' );

  if ( $sync_hash === $stored_hash ) {
    return;
  }

  $source_to_target_map = array();

  // Pass 1: create/update all terms with parent = 0.
  foreach ( $source_categories as $source_category ) {
    if ( 0 !== (int) $source_category->parent ) {
      continue;
    }

    $existing_target = get_term_by( 'slug', $source_category->slug, 'case_result_category' );

    if ( $existing_target instanceof WP_Term ) {
      wp_update_term(
        $existing_target->term_id,
        'case_result_category',
        array(
			'name'        => $source_category->name,
			'description' => $source_category->description,
			'slug'        => $source_category->slug,
			'parent'      => 0,
        )
      );
      $source_to_target_map[ $source_category->term_id ] = (int) $existing_target->term_id;
      continue;
    }

    $inserted = wp_insert_term(
      $source_category->name,
      'case_result_category',
      array(
		  'description' => $source_category->description,
		  'slug'        => $source_category->slug,
		  'parent'      => 0,
      )
    );

    if ( ! is_wp_error( $inserted ) && isset( $inserted['term_id'] ) ) {
      $source_to_target_map[ $source_category->term_id ] = (int) $inserted['term_id'];
    }
  }

  // Pass 2: create/update child terms and preserve hierarchy.
  foreach ( $source_categories as $source_category ) {
    if ( 0 === (int) $source_category->parent ) {
      continue;
    }

    if ( ! isset( $source_to_target_map[ $source_category->parent ] ) ) {
      continue;
    }

    $target_parent  = $source_to_target_map[ $source_category->parent ];
    $existing_child = get_term_by( 'slug', $source_category->slug, 'case_result_category' );

    if ( $existing_child instanceof WP_Term ) {
      wp_update_term(
        $existing_child->term_id,
        'case_result_category',
        array(
			'name'        => $source_category->name,
			'description' => $source_category->description,
			'slug'        => $source_category->slug,
			'parent'      => $target_parent,
        )
      );
      $source_to_target_map[ $source_category->term_id ] = (int) $existing_child->term_id;
      continue;
    }

    $inserted_child = wp_insert_term(
      $source_category->name,
      'case_result_category',
      array(
		  'description' => $source_category->description,
		  'slug'        => $source_category->slug,
		  'parent'      => $target_parent,
      )
    );

    if ( ! is_wp_error( $inserted_child ) && isset( $inserted_child['term_id'] ) ) {
      $source_to_target_map[ $source_category->term_id ] = (int) $inserted_child['term_id'];
    }
  }

  update_option( 'custom_theme_case_result_category_sync_hash', $sync_hash, false );
}
add_action( 'created_category', 'custom_theme_sync_case_result_categories', 10, 0 );
add_action( 'edited_category', 'custom_theme_sync_case_result_categories', 10, 0 );
add_action( 'delete_category', 'custom_theme_sync_case_result_categories', 10, 0 );

/**
 * Add custom fields meta box for Case Results.
 *
 * @return void
 */
function custom_theme_add_case_results_meta_box(): void {
  add_meta_box(
    'custom-theme-case-result-fields',
    __( 'Case Result Fields', 'mbn-theme' ),
    'custom_theme_render_case_results_meta_box',
    'case_result',
    'normal',
    'high'
  );
}
add_action( 'add_meta_boxes_case_result', 'custom_theme_add_case_results_meta_box' );

/**
 * Render Case Results fields.
 *
 * @param WP_Post $post Current post object.
 * @return void
 */
function custom_theme_render_case_results_meta_box( WP_Post $post ): void { // phpcs:ignore Generic.Metrics.NestingLevel.TooHigh -- Meta box renders taxonomy optgroups with nested loops.
  wp_nonce_field( 'custom_theme_case_result_save', 'custom_theme_case_result_nonce' );

  $amount      = (string) get_post_meta( $post->ID, '_case_result_amount', true );
  $case_title  = (string) get_post_meta( $post->ID, '_case_result_case_title', true );
  $description = (string) get_post_meta( $post->ID, '_case_result_description', true );

  $assigned_terms = wp_get_post_terms(
    $post->ID,
    'case_result_category',
    array(
		'fields' => 'ids',
    )
  );

  $selected_term_id = ! is_wp_error( $assigned_terms ) && ! empty( $assigned_terms ) ? (int) $assigned_terms[0] : 0;

  $parent_terms = get_terms(
    array(
		'taxonomy'   => 'case_result_category',
		'hide_empty' => false,
		'parent'     => 0,
		'order'      => 'DESC',
    )
  );
  ?>
  <p>
    <label for="custom-theme-case-result-category"><strong><?php esc_html_e( 'Case Category', 'mbn-theme' ); ?></strong></label><br>
    <select id="custom-theme-case-result-category" name="custom_theme_case_result_category" style="min-width: 340px; max-width: 100%;">
      <option value="0"><?php esc_html_e( 'Select a category', 'mbn-theme' ); ?></option>
      <?php if ( ! is_wp_error( $parent_terms ) ) : ?>
        <?php foreach ( $parent_terms as $parent_term ) : ?>
          <?php
          $child_terms = get_terms(
            array(
                'taxonomy'   => 'case_result_category',
                'hide_empty' => false,
                'parent'     => (int) $parent_term->term_id,
                'orderby'    => 'ID',
                'order'      => 'ASC',
            )
          );
          ?>

          <?php if ( ! is_wp_error( $child_terms ) && ! empty( $child_terms ) ) : ?>
            <optgroup label="<?php echo esc_attr( $parent_term->name ); ?>">
              <?php foreach ( $child_terms as $child_term ) : ?>
                <option value="<?php echo esc_attr( $child_term->term_id ); ?>" <?php selected( $selected_term_id, (int) $child_term->term_id ); ?>>
                  <?php echo esc_html( $child_term->name ); ?>
                </option>
              <?php endforeach; ?>
            </optgroup>
          <?php else : ?>
            <option value="<?php echo esc_attr( $parent_term->term_id ); ?>" <?php selected( $selected_term_id, (int) $parent_term->term_id ); ?>>
              <?php echo esc_html( $parent_term->name ); ?>
            </option>
          <?php endif; ?>
        <?php endforeach; ?>
      <?php endif; ?>
    </select>
  </p>

  <p>
    <label for="custom-theme-case-result-amount"><strong><?php esc_html_e( 'Amount', 'mbn-theme' ); ?></strong></label><br>
    <input type="text" id="custom-theme-case-result-amount" name="custom_theme_case_result_amount" value="<?php echo esc_attr( $amount ); ?>" style="min-width: 340px; max-width: 100%;">
  </p>

  <p>
    <label for="custom-theme-case-result-case-title"><strong><?php esc_html_e( 'Case Title', 'mbn-theme' ); ?></strong></label><br>
    <input type="text" id="custom-theme-case-result-case-title" name="custom_theme_case_result_case_title" value="<?php echo esc_attr( $case_title ); ?>" style="min-width: 340px; max-width: 100%;">
  </p>

  <p>
    <strong><?php esc_html_e( 'Description', 'mbn-theme' ); ?></strong>
  </p>
  <?php
  wp_editor(
    $description,
    'custom_theme_case_result_description',
    array(
		'textarea_name' => 'custom_theme_case_result_description',
		'textarea_rows' => 8,
		'media_buttons' => false,
		'teeny'         => false,
    )
  );
}

/**
 * Save Case Results custom fields.
 *
 * @param int $post_id Post ID.
 * @return void
 */
function custom_theme_save_case_results_meta_box( int $post_id ): void {
  if ( ! isset( $_POST['custom_theme_case_result_nonce'] ) ) {
    return;
  }

  if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['custom_theme_case_result_nonce'] ) ), 'custom_theme_case_result_save' ) ) {
    return;
  }

  if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
    return;
  }

  if ( ! current_user_can( 'edit_post', $post_id ) ) {
    return;
  }

  if ( isset( $_POST['custom_theme_case_result_amount'] ) ) {
    update_post_meta(
      $post_id,
      '_case_result_amount',
      sanitize_text_field( wp_unslash( $_POST['custom_theme_case_result_amount'] ) )
    );
  }

  if ( isset( $_POST['custom_theme_case_result_case_title'] ) ) {
    update_post_meta(
      $post_id,
      '_case_result_case_title',
      sanitize_text_field( wp_unslash( $_POST['custom_theme_case_result_case_title'] ) )
    );
  }

  if ( isset( $_POST['custom_theme_case_result_description'] ) ) {
    update_post_meta(
      $post_id,
      '_case_result_description',
      wp_kses_post( wp_unslash( $_POST['custom_theme_case_result_description'] ) )
    );
  }

  $term_id = isset( $_POST['custom_theme_case_result_category'] ) ? absint( wp_unslash( $_POST['custom_theme_case_result_category'] ) ) : 0;

  if ( $term_id > 0 ) {
    wp_set_post_terms( $post_id, array( $term_id ), 'case_result_category', false );
  } else {
    wp_set_post_terms( $post_id, array(), 'case_result_category', false );
  }
}
add_action( 'save_post_case_result', 'custom_theme_save_case_results_meta_box' );

/**
 * Flush rewrite rules on theme switch for CPT registration consistency.
 *
 * @return void
 */
function custom_theme_case_results_flush_rewrite_on_switch_theme(): void {
  custom_theme_register_case_result_category_taxonomy();
  custom_theme_register_case_results_post_type();
  flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'custom_theme_case_results_flush_rewrite_on_switch_theme' );
