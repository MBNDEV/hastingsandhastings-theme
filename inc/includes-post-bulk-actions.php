<?php
/**
 * Bulk actions on the Posts list screen to set or remove a single category
 * on checked posts without disturbing their other categories. Setting a
 * category also clears "Uncategorized" on any post it's successfully added
 * to.
 *
 * @package HastingsAndHastings
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the custom bulk actions on the Posts list "Bulk actions" dropdown.
 *
 * @param array $bulk_actions Existing bulk actions.
 * @return array
 */
function custom_bulk_set_category_register_action( $bulk_actions ) {
	$bulk_actions['custom_set_category']    = __( 'Set category…', 'mbn-theme' );
	$bulk_actions['custom_remove_category'] = __( 'Remove category…', 'mbn-theme' );
	return $bulk_actions;
}
add_filter( 'bulk_actions-edit-post', 'custom_bulk_set_category_register_action' );

/**
 * Render the category pickers in the "top" tablenav, next to the Bulk
 * Actions dropdowns (the standard placement for list-table filters).
 *
 * @param string $post_type Current post type.
 * @param string $which     'top' or 'bottom'.
 */
function custom_bulk_set_category_render_picker( $post_type, $which ) {
	if ( 'post' !== $post_type || 'top' !== $which ) {
		return;
	}
	?>
	<label for="custom-bulk-category-picker" class="screen-reader-text"><?php esc_html_e( 'Category to set', 'mbn-theme' ); ?></label>
	<?php
	wp_dropdown_categories(
		array(
			'id'               => 'custom-bulk-category-picker',
			'name'             => 'custom_bulk_category_picker',
			'show_option_none' => __( 'Choose category', 'mbn-theme' ),
			'hide_empty'       => false,
			'hierarchical'     => true,
		)
	);
	?>
	<label for="custom-bulk-category-remove-picker" class="screen-reader-text"><?php esc_html_e( 'Category to remove', 'mbn-theme' ); ?></label>
	<?php
	wp_dropdown_categories(
		array(
			'id'               => 'custom-bulk-category-remove-picker',
			'name'             => 'custom_bulk_category_remove_picker',
			'show_option_none' => __( 'Choose category', 'mbn-theme' ),
			'hide_empty'       => false,
			'hierarchical'     => true,
		)
	);
}
add_action( 'restrict_manage_posts', 'custom_bulk_set_category_render_picker', 10, 2 );

/**
 * Show/hide the relevant category picker based on the chosen bulk action,
 * and forward its value into the bulk-edit form submission.
 */
function custom_bulk_set_category_render_script() {
	global $typenow;

	if ( 'post' !== $typenow ) {
		return;
	}
	?>
	<script>
	( function() {
		var pickers = {
			custom_set_category: {
				select: document.getElementById( 'custom-bulk-category-picker' ),
				field: 'custom_bulk_category_id',
			},
			custom_remove_category: {
				select: document.getElementById( 'custom-bulk-category-remove-picker' ),
				field: 'custom_bulk_category_remove_id',
			},
		};

		function togglePickers() {
			var actionSelects = document.querySelectorAll( 'select[name="action"], select[name="action2"]' );
			var active = null;

			actionSelects.forEach( function( select ) {
				if ( pickers[ select.value ] ) {
					active = select.value;
				}
			} );

			Object.keys( pickers ).forEach( function( key ) {
				var picker = pickers[ key ].select;

				if ( picker ) {
					picker.style.display = ( key === active ) ? '' : 'none';
				}
			} );
		}

		document.querySelectorAll( 'select[name="action"], select[name="action2"]' ).forEach( function( select ) {
			select.addEventListener( 'change', togglePickers );
		} );

		var form = document.getElementById( 'posts-filter' );

		if ( form ) {
			form.addEventListener( 'submit', function() {
				Object.keys( pickers ).forEach( function( key ) {
					var picker = pickers[ key ].select;

					if ( ! picker ) {
						return;
					}

					var fieldName = pickers[ key ].field;
					var hidden    = form.querySelector( 'input[name="' + fieldName + '"]' );

					if ( ! hidden ) {
						hidden = document.createElement( 'input' );
						hidden.type = 'hidden';
						hidden.name = fieldName;
						form.appendChild( hidden );
					}

					hidden.value = picker.value;
				} );
			} );
		}

		togglePickers();
	} )();
	</script>
	<?php
}
add_action( 'admin_footer-edit.php', 'custom_bulk_set_category_render_script' );

/**
 * Handle the bulk action: add the chosen category to each checked post
 * (preserving its other categories) and clear "Uncategorized" on any post
 * the category was added to.
 *
 * @param string $redirect_to Redirect URL.
 * @param string $doaction    Action name.
 * @param array  $post_ids    Checked post IDs.
 * @return string
 */
function custom_bulk_set_category_handle( $redirect_to, $doaction, $post_ids ) {
	if ( 'custom_set_category' !== $doaction ) {
		return $redirect_to;
	}

	$term_id = isset( $_REQUEST['custom_bulk_category_id'] ) ? absint( $_REQUEST['custom_bulk_category_id'] ) : 0;

	if ( ! $term_id || ! get_term( $term_id, 'category' ) ) {
		return $redirect_to;
	}

	$uncategorized_id = get_option( 'default_category' );
	$updated          = 0;

	foreach ( $post_ids as $post_id ) {
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			continue;
		}

		$result = wp_set_object_terms( $post_id, $term_id, 'category', true );

		if ( is_wp_error( $result ) ) {
			continue;
		}

		++$updated;

		if ( $uncategorized_id && has_term( $uncategorized_id, 'category', $post_id ) ) {
			wp_remove_object_terms( $post_id, $uncategorized_id, 'category' );
		}
	}

	return add_query_arg( 'custom_bulk_category_updated', $updated, $redirect_to );
}
add_filter( 'handle_bulk_actions-edit-post', 'custom_bulk_set_category_handle', 10, 3 );

/**
 * Handle the bulk action: remove the chosen category from each checked
 * post that currently has it, leaving every other category untouched.
 *
 * @param string $redirect_to Redirect URL.
 * @param string $doaction    Action name.
 * @param array  $post_ids    Checked post IDs.
 * @return string
 */
function custom_bulk_remove_category_handle( $redirect_to, $doaction, $post_ids ) {
	if ( 'custom_remove_category' !== $doaction ) {
		return $redirect_to;
	}

	$term_id = isset( $_REQUEST['custom_bulk_category_remove_id'] ) ? absint( $_REQUEST['custom_bulk_category_remove_id'] ) : 0;

	if ( ! $term_id || ! get_term( $term_id, 'category' ) ) {
		return $redirect_to;
	}

	$updated = 0;

	foreach ( $post_ids as $post_id ) {
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			continue;
		}

		if ( ! has_term( $term_id, 'category', $post_id ) ) {
			continue;
		}

		$result = wp_remove_object_terms( $post_id, $term_id, 'category' );

		if ( is_wp_error( $result ) ) {
			continue;
		}

		++$updated;
	}

	return add_query_arg( 'custom_bulk_category_updated', $updated, $redirect_to );
}
add_filter( 'handle_bulk_actions-edit-post', 'custom_bulk_remove_category_handle', 10, 3 );

/**
 * Show an admin notice reporting how many posts were updated.
 */
function custom_bulk_set_category_admin_notice() {
	if ( empty( $_REQUEST['custom_bulk_category_updated'] ) ) {
		return;
	}

	$updated = absint( $_REQUEST['custom_bulk_category_updated'] );
	?>
	<div class="notice notice-success is-dismissible">
		<p>
			<?php
			printf(
				/* translators: %d: number of posts updated. */
				esc_html( _n( '%d post updated.', '%d posts updated.', $updated, 'mbn-theme' ) ),
				$updated
			);
			?>
		</p>
	</div>
	<?php
}
add_action( 'admin_notices', 'custom_bulk_set_category_admin_notice' );
