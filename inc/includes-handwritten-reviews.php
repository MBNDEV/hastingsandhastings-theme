<?php
/**
 * Handwritten Reviews CPT, meta box, and REST endpoint.
 *
 * Registers the `mbn_review_month` custom post type so editors
 * can manage review months and their images directly from wp-admin without
 * any third-party plugins.
 *
 * @package MBN_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// 1. Custom Post Type
// ---------------------------------------------------------------------------

/**
 * Register the Handwritten Review Month post type.
 *
 * @return void
 */
function mbn_register_review_month_cpt(): void {
	$labels = array(
		'name'               => __( 'Review Months', 'mbn-theme' ),
		'singular_name'      => __( 'Review Month', 'mbn-theme' ),
		'add_new'            => __( 'Add New', 'mbn-theme' ),
		'add_new_item'       => __( 'Add New Review Month', 'mbn-theme' ),
		'edit_item'          => __( 'Edit Review Month', 'mbn-theme' ),
		'new_item'           => __( 'New Review Month', 'mbn-theme' ),
		'view_item'          => __( 'View Review Month', 'mbn-theme' ),
		'search_items'       => __( 'Search Review Months', 'mbn-theme' ),
		'not_found'          => __( 'No review months found.', 'mbn-theme' ),
		'not_found_in_trash' => __( 'No review months found in Trash.', 'mbn-theme' ),
		'all_items'          => __( 'All Review Months', 'mbn-theme' ),
		'menu_name'          => __( 'Review Months', 'mbn-theme' ),
	);

	register_post_type(
      'mbn_review_month',
      array(
		  'labels'             => $labels,
		  'public'             => false,
		  'publicly_queryable' => false,
		  'show_ui'            => true,
		  'show_in_menu'       => true,
		  'show_in_rest'       => true,
		  'query_var'          => false,
		  'rewrite'            => false,
		  'capability_type'    => 'post',
		  'has_archive'        => false,
		  'hierarchical'       => false,
		  'menu_position'      => 25,
		  'menu_icon'          => 'dashicons-images-alt2',
		  'supports'           => array( 'title' ),
	  )
	);
}
add_action( 'init', 'mbn_register_review_month_cpt' );

// ---------------------------------------------------------------------------
// 2. Meta Box — Review Images
// ---------------------------------------------------------------------------

/**
 * Add the Review Images meta box to the mbn_review_month edit screen.
 *
 * @return void
 */
function mbn_review_month_add_meta_box(): void {
	add_meta_box(
      'mbn_review_images',
      __( 'Review Images', 'mbn-theme' ),
      'mbn_review_month_meta_box_render',
      'mbn_review_month',
      'normal',
      'high'
	);
}
add_action( 'add_meta_boxes', 'mbn_review_month_add_meta_box' );

/**
 * Enqueue the WP media uploader on the Review Month edit screen.
 *
 * @param string $hook_suffix Current admin page hook suffix.
 * @return void
 */
function mbn_review_month_enqueue_media( string $hook_suffix ): void {
  if ( ! in_array( $hook_suffix, array( 'post.php', 'post-new.php' ), true ) ) {
      return;
  }
	$screen = get_current_screen();
  if ( ! $screen || 'mbn_review_month' !== $screen->post_type ) {
      return;
  }
	wp_enqueue_media();
}
add_action( 'admin_enqueue_scripts', 'mbn_review_month_enqueue_media' );

/**
 * Render the Review Images meta box HTML.
 *
 * @param WP_Post $post Current post object.
 * @return void
 */
function mbn_review_month_meta_box_render( WP_Post $post ): void {
	wp_nonce_field( 'mbn_review_images_save', 'mbn_review_images_nonce' );

	$image_ids = get_post_meta( $post->ID, '_mbn_review_image_ids', true );
  if ( ! is_array( $image_ids ) ) {
      $image_ids = array();
  }

	$image_ids_json = esc_attr( wp_json_encode( $image_ids ) );
  ?>
	<div id="mbn-review-images-wrap">
		<input
			type="hidden"
			id="mbn_review_image_ids"
			name="mbn_review_image_ids"
			value="<?php echo esc_attr( $image_ids_json ); ?>"
		>

		<ul id="mbn-review-image-list" style="display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:0 0 12px;padding:0;">
			<?php foreach ( $image_ids as $attachment_id ) : ?>
				<?php
				$thumb = wp_get_attachment_image_url( (int) $attachment_id, 'thumbnail' );
				if ( ! $thumb ) {
					continue;
				}
				?>
				<li data-id="<?php echo esc_attr( $attachment_id ); ?>" style="position:relative;">
					<img
						src="<?php echo esc_url( $thumb ); ?>"
						width="80"
						height="80"
						style="object-fit:cover;border:1px solid #ddd;border-radius:3px;"
						alt=""
					>
					<button
						type="button"
						class="mbn-remove-image"
						data-id="<?php echo esc_attr( $attachment_id ); ?>"
						style="position:absolute;top:2px;right:2px;background:#cc1818;color:#fff;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:12px;line-height:1;padding:0;"
						aria-label="<?php esc_attr_e( 'Remove image', 'mbn-theme' ); ?>"
					>&times;</button>
				</li>
			<?php endforeach; ?>
		</ul>

		<button type="button" id="mbn-add-images" class="button button-secondary">
			<?php esc_html_e( 'Add / Edit Images', 'mbn-theme' ); ?>
		</button>
		<p class="description" style="margin-top:6px;">
			<?php esc_html_e( 'Upload or select images from the media library. Images display in the order shown — drag to reorder (coming soon).', 'mbn-theme' ); ?>
		</p>
	</div>

	<script>
	(function () {
		var frame;
		var imageIds = <?php echo wp_json_encode( $image_ids ); ?>;
		var hiddenInput = document.getElementById('mbn_review_image_ids');
		var list        = document.getElementById('mbn-review-image-list');

		function syncInput() {
			hiddenInput.value = JSON.stringify(imageIds);
		}

		function renderList() {
			list.innerHTML = '';
			imageIds.forEach(function (id) {
				// We rely on wp.media to give us the attachment, but for already-saved
				// IDs we already rendered via PHP above; this handles newly added ones.
				var li = document.createElement('li');
				li.setAttribute('data-id', id);
				li.style.cssText = 'position:relative;';

				var img = document.createElement('img');
				img.width  = 80;
				img.height = 80;
				img.style.cssText = 'object-fit:cover;border:1px solid #ddd;border-radius:3px;';
				img.alt = '';

				// Fetch thumbnail URL via wp.media attachment model.
				if (window.wp && wp.media) {
					var att = wp.media.attachment(id);
					att.fetch().then(function () {
						var sizes = att.get('sizes') || {};
						img.src = (sizes.thumbnail && sizes.thumbnail.url) || att.get('url') || '';
					});
				}

				var btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'mbn-remove-image';
				btn.setAttribute('data-id', id);
				btn.setAttribute('aria-label', 'Remove image');
				btn.style.cssText = 'position:absolute;top:2px;right:2px;background:#cc1818;color:#fff;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:12px;line-height:1;padding:0;';
				btn.innerHTML = '&times;';
				btn.addEventListener('click', function () {
					removeImage(parseInt(this.getAttribute('data-id'), 10));
				});

				li.appendChild(img);
				li.appendChild(btn);
				list.appendChild(li);
			});
		}

		function removeImage(id) {
			imageIds = imageIds.filter(function (i) { return i !== id; });
			syncInput();
			// Remove just this li.
			var li = list.querySelector('[data-id="' + id + '"]');
			if (li) { li.parentNode.removeChild(li); }
		}

		// Delegated remove on PHP-rendered items.
		list.addEventListener('click', function (e) {
			var btn = e.target.closest('.mbn-remove-image');
			if (!btn) { return; }
			removeImage(parseInt(btn.getAttribute('data-id'), 10));
		});

		document.getElementById('mbn-add-images').addEventListener('click', function () {
			if (frame) {
				frame.open();
				return;
			}
			frame = wp.media({
				title: '<?php echo esc_js( __( 'Select Review Images', 'mbn-theme' ) ); ?>',
				button: { text: '<?php echo esc_js( __( 'Use these images', 'mbn-theme' ) ); ?>' },
				multiple: true,
			});

			frame.on('select', function () {
				var selection = frame.state().get('selection');
				var newIds = [];
				selection.each(function (attachment) {
					newIds.push(attachment.id);
				});
				// Merge: keep existing, append newly selected (deduplicated).
				newIds.forEach(function (id) {
					if (imageIds.indexOf(id) === -1) {
						imageIds.push(id);
					}
				});
				syncInput();
				renderList();
			});

			frame.open();
		});
	}());
	</script>
	<?php
}

// ---------------------------------------------------------------------------
// 3. Save Meta
// ---------------------------------------------------------------------------

/**
 * Save the review image IDs when a review month post is saved.
 *
 * @param int $post_id Post ID being saved.
 * @return void
 */
function mbn_review_month_save_meta( int $post_id ): void {
	// Verify nonce.
  if (
		! isset( $_POST['mbn_review_images_nonce'] ) ||
		! wp_verify_nonce( sanitize_key( $_POST['mbn_review_images_nonce'] ), 'mbn_review_images_save' )
	) {
      return;
  }

	// Skip autosave and revisions.
  if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
      return;
  }
  if ( wp_is_post_revision( $post_id ) ) {
      return;
  }

	// Capability check.
  if ( ! current_user_can( 'edit_post', $post_id ) ) {
      return;
  }

  if ( ! isset( $_POST['mbn_review_image_ids'] ) ) {
      return;
  }

	$raw = sanitize_text_field( wp_unslash( $_POST['mbn_review_image_ids'] ) );

	$decoded = json_decode( $raw, true );
  if ( ! is_array( $decoded ) ) {
      $decoded = array();
  }

	// Sanitize: keep only positive integers that correspond to real attachments.
	$clean_ids = array();
  foreach ( $decoded as $id ) {
      $id = absint( $id );
    if ( $id > 0 && 'attachment' === get_post_type( $id ) ) {
        $clean_ids[] = $id;
    }
  }

	update_post_meta( $post_id, '_mbn_review_image_ids', $clean_ids );
}
add_action( 'save_post_mbn_review_month', 'mbn_review_month_save_meta' );

// ---------------------------------------------------------------------------
// 4. REST API Endpoint
// ---------------------------------------------------------------------------

/**
 * Register the REST endpoint used by the block's render.php.
 *
 * GET /wp-json/mbn/v1/review-months
 *
 * Returns an array of objects:
 *   { id, title, year, images: [ { id, url, alt } ] }
 * ordered by post_date descending (newest month first).
 *
 * @return void
 */
function mbn_register_review_months_endpoint(): void {
	register_rest_route(
      'mbn/v1',
      '/review-months',
      array(
		  'methods'             => WP_REST_Server::READABLE,
		  'callback'            => 'mbn_review_months_endpoint_handler',
		  'permission_callback' => '__return_true',
	  )
	);
}
add_action( 'rest_api_init', 'mbn_register_review_months_endpoint' );

/**
 * Handler for GET /wp-json/mbn/v1/review-months.
 *
 * @return WP_REST_Response
 */
function mbn_review_months_endpoint_handler(): WP_REST_Response {
	$posts = get_posts(
      array(
		  'post_type'      => 'mbn_review_month',
		  'post_status'    => 'publish',
		  'posts_per_page' => -1,
		  'orderby'        => 'date',
		  'order'          => 'DESC',
	  )
	);

	$data = array();
  foreach ( $posts as $post ) {
      $image_ids = get_post_meta( $post->ID, '_mbn_review_image_ids', true );
    if ( ! is_array( $image_ids ) ) {
        $image_ids = array();
    }

      $images = array();
    foreach ( $image_ids as $attachment_id ) {
        $attachment_id = absint( $attachment_id );
        $url           = wp_get_attachment_url( $attachment_id );
      if ( ! $url ) {
          continue;
      }
        $alt      = get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
        $images[] = array(
            'id'  => $attachment_id,
            'url' => $url,
            'alt' => (string) $alt,
        );
    }

      $data[] = array(
          'id'     => $post->ID,
          'title'  => get_the_title( $post ),
          'year'   => get_the_date( 'Y', $post ),
          'images' => $images,
      );
  }

	return new WP_REST_Response( $data, 200 );
}

// ---------------------------------------------------------------------------
// 5. Helper — fetch review months for render.php (server-side, no HTTP)
// ---------------------------------------------------------------------------

/**
 * Retrieve all published review months with their images.
 *
 * Used directly by the block's render.php to avoid an HTTP round-trip.
 *
 * @return array<int, array{ id: int, title: string, year: string, images: list<array{id: int, url: string, alt: string}> }>
 */
function mbn_get_review_months(): array {
	$posts = get_posts(
      array(
		  'post_type'      => 'mbn_review_month',
		  'post_status'    => 'publish',
		  'posts_per_page' => -1,
		  'orderby'        => 'date',
		  'order'          => 'DESC',
	  )
	);

	$months = array();
  foreach ( $posts as $post ) {
      $image_ids = get_post_meta( $post->ID, '_mbn_review_image_ids', true );
    if ( ! is_array( $image_ids ) ) {
        $image_ids = array();
    }

      $images = array();
    foreach ( $image_ids as $attachment_id ) {
        $attachment_id = absint( $attachment_id );
        $url           = wp_get_attachment_url( $attachment_id );
      if ( ! $url ) {
          continue;
      }
        $alt      = get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
        $images[] = array(
            'id'  => $attachment_id,
            'url' => $url,
            'alt' => (string) $alt,
        );
    }

      $months[] = array(
          'id'     => $post->ID,
          'title'  => get_the_title( $post ),
          'year'   => get_the_date( 'Y', $post ),
          'images' => $images,
      );
  }

	return $months;
}
