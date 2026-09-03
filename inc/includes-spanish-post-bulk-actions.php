<?php
/**
 * Bulk action on the Spanish Posts list screen to move checked posts into
 * the regular Posts (blog) post type.
 *
 * @package HastingsAndHastings
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the "Move to Blog" bulk action on the Spanish Posts list screen.
 *
 * @param array $bulk_actions Existing bulk actions.
 * @return array
 */
function custom_spanish_post_move_to_blog_register_action( $bulk_actions ) {
	$bulk_actions['custom_move_to_blog'] = __( 'Move to Blog', 'mbn-theme' );
	return $bulk_actions;
}
add_filter( 'bulk_actions-edit-spanish_post', 'custom_spanish_post_move_to_blog_register_action' );

/**
 * Confirm before submitting the "Move to Blog" bulk action, since it changes
 * each post's post type (and therefore its permalink) and can't be undone
 * from the list screen.
 */
function custom_spanish_post_move_to_blog_render_script() {
	global $typenow;

  if ( 'spanish_post' !== $typenow ) {
      return;
  }
  ?>
	<script>
	( function() {
		var form = document.getElementById( 'posts-filter' );

		if ( ! form ) {
			return;
		}

		form.addEventListener( 'submit', function( event ) {
			var action  = document.querySelector( 'select[name="action"]' );
			var action2 = document.querySelector( 'select[name="action2"]' );

			if ( ( ! action || 'custom_move_to_blog' !== action.value ) && ( ! action2 || 'custom_move_to_blog' !== action2.value ) ) {
				return;
			}

			if ( ! window.confirm( '<?php echo esc_js( __( 'Move the selected posts to the Blog? Their Spanish Posts URLs will stop working.', 'mbn-theme' ) ); ?>' ) ) {
				event.preventDefault();
			}
		} );
	} )();
	</script>
	<?php
}
add_action( 'admin_footer-edit.php', 'custom_spanish_post_move_to_blog_render_script' );

/**
 * Handle the bulk action: change each checked post's post type from
 * spanish_post to post. Existing spanish_post_category term relationships
 * are left in place (regular posts don't use that taxonomy, so they simply
 * go unused rather than being remapped).
 *
 * @param string $redirect_to Redirect URL.
 * @param string $doaction    Action name.
 * @param array  $post_ids    Checked post IDs.
 * @return string
 */
function custom_spanish_post_move_to_blog_handle( $redirect_to, $doaction, $post_ids ) {
  if ( 'custom_move_to_blog' !== $doaction ) {
      return $redirect_to;
  }

	$moved_ids = array();

  foreach ( $post_ids as $post_id ) {
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        continue;
    }

    if ( 'spanish_post' !== get_post_type( $post_id ) ) {
        continue;
    }

      set_post_type( $post_id, 'post' );

      $moved_ids[] = $post_id;
  }

  if ( $moved_ids ) {
      custom_spanish_post_move_to_blog_sync_wpml();
  }

	$redirect_to = add_query_arg( 'custom_moved_to_blog', count( $moved_ids ), $redirect_to );

  if ( $moved_ids ) {
      $redirect_to = add_query_arg( 'custom_moved_to_blog_ids', implode( ',', $moved_ids ), $redirect_to );
  }

	return $redirect_to;
}
add_filter( 'handle_bulk_actions-edit-spanish_post', 'custom_spanish_post_move_to_blog_handle', 10, 3 );

/**
 * Resync WPML's translation-type records after set_post_type() changes a
 * post's type directly in the database.
 *
 * set_post_type() updates wp_posts.post_type without firing any hooks, so
 * WPML's own wp_icl_translations table keeps recording the post under its
 * old type (e.g. "post_spanish_post"). Every WPML-aware query joins against
 * that table and requires the type to match, so a stale row makes the moved
 * post invisible everywhere (front end and admin list alike) and can send
 * WPML's canonical-URL logic redirecting to the old, now-gone permalink.
 * WPML ships its own repair for exactly this drift (the "fix element type
 * assignments" troubleshooting tool) — reuse it here instead of writing a
 * bespoke query against WPML's internal table.
 */
function custom_spanish_post_move_to_blog_sync_wpml() {
	global $sitepress;

  if ( ! $sitepress || ! class_exists( 'WPML_Fix_Type_Assignments' ) ) {
      return;
  }

	( new WPML_Fix_Type_Assignments( $sitepress ) )->run();
}

/**
 * Show an admin notice reporting how many posts were moved, with Edit/View
 * links to each one, and warn that their old Spanish Posts URLs no longer
 * resolve.
 */
function custom_spanish_post_move_to_blog_admin_notice() {
  if ( empty( $_REQUEST['custom_moved_to_blog'] ) ) {
      return;
  }

	$updated  = absint( $_REQUEST['custom_moved_to_blog'] );
	$post_ids = array();

  if ( ! empty( $_REQUEST['custom_moved_to_blog_ids'] ) ) {
      $post_ids = array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_REQUEST['custom_moved_to_blog_ids'] ) ) ) ) );
  }
  ?>
	<div class="notice notice-success is-dismissible">
		<p>
			<?php
			printf(
				/* translators: %d: number of posts moved. */
              esc_html(
                _n(
                  '%d post moved to the Blog. Its old Spanish Posts URL no longer works.',
                  '%d posts moved to the Blog. Their old Spanish Posts URLs no longer work.',
                  $updated,
                  'mbn-theme'
                )
              ),
              $updated
			);
			?>
		</p>
		<?php if ( $post_ids ) : ?>
			<ul style="list-style: disc; margin-left: 1.5em;">
				<?php foreach ( $post_ids as $post_id ) : ?>
					<li>
						<?php echo esc_html( get_the_title( $post_id ) ); ?>
						&mdash;
						<a href="<?php echo esc_url( get_edit_post_link( $post_id ) ); ?>"><?php esc_html_e( 'Edit', 'mbn-theme' ); ?></a>
						|
						<a href="<?php echo esc_url( get_permalink( $post_id ) ); ?>"><?php esc_html_e( 'View', 'mbn-theme' ); ?></a>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>
	</div>
	<?php
}
add_action( 'admin_notices', 'custom_spanish_post_move_to_blog_admin_notice' );
