<?php
/**
 * Attorney ACF field groups.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

/**
 * Register local ACF fields for Attorney post type.
 *
 * @return void
 */
function custom_theme_register_attorney_acf_fields(): void {
  if ( ! function_exists( 'acf_add_local_field_group' ) ) {
    return;
  }

  acf_add_local_field_group(
    array(
		'key'                   => 'group_attorney_profile',
		'title'                 => __( 'Attorney Profile Fields', 'mbn-theme' ),
		'fields'                => array(
			array(
				'key'        => 'field_attorney_profile_group',
				'label'      => __( 'Profile', 'mbn-theme' ),
				'name'       => 'attorney_profile',
				'type'       => 'group',
				'layout'     => 'block',
				'sub_fields' => array(
					array(
						'key'      => 'field_attorney_name',
						'label'    => __( 'Name', 'mbn-theme' ),
						'name'     => 'attorney_name',
						'type'     => 'text',
						'required' => 1,
					),
					array(
						'key'   => 'field_attorney_type',
						'label' => __( 'Attorney Type', 'mbn-theme' ),
						'name'  => 'attorney_type',
						'type'  => 'text',
					),
					array(
						'key'   => 'field_attorney_position',
						'label' => __( 'Position', 'mbn-theme' ),
						'name'  => 'attorney_position',
						'type'  => 'text',
					),
					array(
						'key'           => 'field_attorney_profile_image',
						'label'         => __( 'Profile Image', 'mbn-theme' ),
						'name'          => 'attorney_profile_image',
						'type'          => 'image',
						'return_format' => 'array',
						'preview_size'  => 'medium',
						'library'       => 'all',
					),
				),
			),
			array(
				'key'        => 'field_attorney_personal_information_group',
				'label'      => __( 'Personal Information', 'mbn-theme' ),
				'name'       => 'attorney_personal_information',
				'type'       => 'group',
				'layout'     => 'block',
				'sub_fields' => array(
					array(
						'key'          => 'field_attorney_education',
						'label'        => __( 'Education', 'mbn-theme' ),
						'name'         => 'attorney_education',
						'type'         => 'repeater',
						'layout'       => 'block',
						'button_label' => __( 'Add Education', 'mbn-theme' ),
						'sub_fields'   => array(
							array(
								'key'   => 'field_attorney_school_name',
								'label' => __( 'School Name', 'mbn-theme' ),
								'name'  => 'school_name',
								'type'  => 'text',
							),
							array(
								'key'          => 'field_attorney_achievements',
								'label'        => __( 'Achievements', 'mbn-theme' ),
								'name'         => 'achievements',
								'type'         => 'wysiwyg',
								'tabs'         => 'all',
								'toolbar'      => 'full',
								'media_upload' => 1,
							),
						),
					),
					array(
						'key'        => 'field_attorney_contact_information_group',
						'label'      => __( 'Contact Information', 'mbn-theme' ),
						'name'       => 'attorney_contact_information',
						'type'       => 'group',
						'layout'     => 'block',
						'sub_fields' => array(
							array(
								'key'   => 'field_attorney_office_name',
								'label' => __( 'Office Name', 'mbn-theme' ),
								'name'  => 'office_name',
								'type'  => 'text',
							),
							array(
								'key'           => 'field_attorney_office_link',
								'label'         => __( 'Office Link', 'mbn-theme' ),
								'name'          => 'office_link',
								'type'          => 'link',
								'return_format' => 'array',
							),
							array(
								'key'   => 'field_attorney_phone_number',
								'label' => __( 'Phone Number', 'mbn-theme' ),
								'name'  => 'phone_number',
								'type'  => 'text',
							),
							array(
								'key'   => 'field_attorney_office_address',
								'label' => __( 'Office Address', 'mbn-theme' ),
								'name'  => 'office_address',
								'type'  => 'text',
							),
						),
					),
					array(
						'key'          => 'field_attorney_main_content',
						'label'        => __( 'Main Content', 'mbn-theme' ),
						'name'         => 'attorney_main_content',
						'type'         => 'wysiwyg',
						'tabs'         => 'all',
						'toolbar'      => 'full',
						'media_upload' => 1,
					),
					array(
						'key'           => 'field_attorney_active',
						'label'         => __( 'Active', 'mbn-theme' ),
						'name'          => 'attorney_active',
						'type'          => 'true_false',
						'default_value' => 1,
						'ui'            => 1,
						'ui_on_text'    => __( 'Active', 'mbn-theme' ),
						'ui_off_text'   => __( 'Inactive', 'mbn-theme' ),
					),
				),
			),
		),
		'location'              => array(
			array(
				array(
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'attorney',
				),
			),
		),
		'position'              => 'normal',
		'style'                 => 'default',
		'label_placement'       => 'top',
		'instruction_placement' => 'label',
		'active'                => true,
		'show_in_rest'          => 0,
    )
  );
}
add_action( 'acf/init', 'custom_theme_register_attorney_acf_fields' );
