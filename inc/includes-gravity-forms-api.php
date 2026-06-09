<?php
/**
 * Gravity Forms REST API Endpoint
 *
 * Provides a simple REST endpoint to fetch Gravity Forms
 * for use in Gutenberg blocks
 *
 * @package MBN_Theme
 */

// Register custom REST API endpoint for Gravity Forms
add_action(
  'rest_api_init',
  function () {
    register_rest_route(
      'hastingsandhastings/v1',
      '/gravity-forms',
      array(
		  'methods'             => 'GET',
		  'callback'            => 'hastingsandhastings_get_gravity_forms',
		  'permission_callback' => function () {
			  return current_user_can( 'edit_posts' );
		  },
      )
    );
  }
);

/**
 * Get all Gravity Forms
 *
 * @return WP_REST_Response|WP_Error
 */
function hastingsandhastings_get_gravity_forms() {
    // Check if Gravity Forms is active
  if ( ! class_exists( 'GFAPI' ) ) {
      return new WP_Error(
        'gravity_forms_not_active',
        __( 'Gravity Forms plugin is not active.', 'mbn-theme' ),
        array( 'status' => 404 )
      );
  }

    // Get all forms
    $forms = GFAPI::get_forms();

  if ( empty( $forms ) ) {
      return rest_ensure_response( array() );
  }

    // Format forms data
    $formatted_forms = array();
  foreach ( $forms as $form ) {
      $formatted_forms[] = array(
          'id'          => $form['id'],
          'title'       => $form['title'],
          'description' => isset( $form['description'] ) ? $form['description'] : '',
          'is_active'   => isset( $form['is_active'] ) ? $form['is_active'] : true,
      );
  }

    return rest_ensure_response( $formatted_forms );
}
