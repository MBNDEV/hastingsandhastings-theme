<?php
/**
 * Practice Area ACF field groups.
 *
 * @package CustomTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

/**
 * Build a default "link" sub-field row.
 *
 * @param string $text Link text.
 * @param string $url  Relative URL, or '#' when no matching page exists yet.
 * @return array
 */
function custom_theme_practice_area_default_link( string $text, string $url = '#' ): array {
  return array(
	  'link' => array(
		  'title'  => $text,
		  'url'    => $url,
		  'target' => '',
	  ),
  );
}

/**
 * Build a default "Related Information" group row.
 *
 * @param string $title Group title.
 * @param array  $links Array of custom_theme_practice_area_default_link() rows.
 * @return array
 */
function custom_theme_practice_area_default_group( string $title, array $links ): array {
  return array(
	  'group_title' => $title,
	  'links'       => $links,
  );
}

/**
 * Default "Related Information" groups, seeded from the Figma design.
 *
 * @return array
 */
function custom_theme_practice_area_default_related_information_groups(): array {
  return array(
	  custom_theme_practice_area_default_group(
        'Car Accident Injuries',
        array(
			custom_theme_practice_area_default_link( 'Car Accident Injuries', '/practice-areas/auto-accident-injuries/' ),
			custom_theme_practice_area_default_link( 'Airbag Injuries' ),
			custom_theme_practice_area_default_link( 'Fatal Injuries' ),
			custom_theme_practice_area_default_link( 'Internal Injuries' ),
			custom_theme_practice_area_default_link( 'Nerve Injuries' ),
			custom_theme_practice_area_default_link( 'Seatbelt Injuries' ),
			custom_theme_practice_area_default_link( 'Spinal Cord Injuries', '/phoenix-spinal-cord-injury-attorney/' ),
			custom_theme_practice_area_default_link( 'Traumatic Brain Injuries', '/phoenix-brain-injury-lawyer/' ),
		)
	  ),
	  custom_theme_practice_area_default_group(
        'Causes of Car Accidents',
        array(
			custom_theme_practice_area_default_link( 'Defective Tire Accidents' ),
			custom_theme_practice_area_default_link( 'Reckless Driving Accidents' ),
			custom_theme_practice_area_default_link( 'Road Debris Accidents' ),
			custom_theme_practice_area_default_link( 'Unsafe Lane Change Accidents' ),
			custom_theme_practice_area_default_link( 'Unsecured Cargo Truck Accidents' ),
		)
	  ),
	  custom_theme_practice_area_default_group(
        'Types of Car Accidents',
        array(
			custom_theme_practice_area_default_link( 'Bicycle Accidents', '/practice-areas/bicycle-accidents/' ),
			custom_theme_practice_area_default_link( 'Bus Accidents', '/phoenix-bus-accident-attorney/' ),
			custom_theme_practice_area_default_link( 'Delivery Driver Accidents' ),
			custom_theme_practice_area_default_link( 'Distracted Driving Accidents', '/practice-areas/phoenix-distracted-driving-lawyer/' ),
			custom_theme_practice_area_default_link( 'Drunk Driving Accidents', '/phoenix-dui-accident-attorney/' ),
			custom_theme_practice_area_default_link( 'Head-On Collisions' ),
			custom_theme_practice_area_default_link( 'Motorcycle Accidents', '/practice-areas/motorcycle-accidents/' ),
			custom_theme_practice_area_default_link( 'Parking Lot Accidents' ),
			custom_theme_practice_area_default_link( 'Pedestrian Accidents', '/practice-areas/phoenix-pedestrian-accident-attorney/' ),
			custom_theme_practice_area_default_link( 'Rear-End Accidents' ),
			custom_theme_practice_area_default_link( 'RV Accidents' ),
			custom_theme_practice_area_default_link( 'Side Impact Accidents' ),
			custom_theme_practice_area_default_link( 'Truck Accidents', '/practice-areas/truck-accident-lawyer/' ),
			custom_theme_practice_area_default_link( 'Uber & Lyft Accidents', '/phoenix-uber-lyft-accident-lawyer/' ),
		)
	  ),
	  custom_theme_practice_area_default_group(
        'Claim Information',
        array(
			custom_theme_practice_area_default_link( 'How Much Does a Car Accident Lawyer Cost?' ),
			custom_theme_practice_area_default_link( 'Dealing With Insurance Companies' ),
			custom_theme_practice_area_default_link( 'Do I Have a Valid Case?' ),
			custom_theme_practice_area_default_link( 'Determining Fault' ),
			custom_theme_practice_area_default_link( 'What Damages Can Be Recovered?' ),
			custom_theme_practice_area_default_link( 'Time Limits' ),
			custom_theme_practice_area_default_link( 'Will My Car Accident Case Go To Trial?' ),
			custom_theme_practice_area_default_link( 'How a Settlement is Negotiated' ),
		)
	  ),
  );
}

/**
 * Register local ACF fields for the Practice Area post type.
 *
 * @return void
 */
function custom_theme_register_practice_area_acf_fields(): void {
  if ( ! function_exists( 'acf_add_local_field_group' ) ) {
    return;
  }

  acf_add_local_field_group(
    array(
		'key'                   => 'group_practice_area_related_information',
		'title'                 => __( 'Related Information', 'mbn-theme' ),
		'fields'                => array(
			array(
				'key'           => 'field_practice_area_related_information_groups',
				'label'         => __( 'Related Information Groups', 'mbn-theme' ),
				'name'          => 'related_information_groups',
				'type'          => 'repeater',
				'layout'        => 'block',
				'button_label'  => __( 'Add Group', 'mbn-theme' ),
				'default_value' => custom_theme_practice_area_default_related_information_groups(),
				'sub_fields'    => array(
					array(
						'key'   => 'field_practice_area_group_title',
						'label' => __( 'Group Title', 'mbn-theme' ),
						'name'  => 'group_title',
						'type'  => 'text',
					),
					array(
						'key'          => 'field_practice_area_group_links',
						'label'        => __( 'Links', 'mbn-theme' ),
						'name'         => 'links',
						'type'         => 'repeater',
						'layout'       => 'table',
						'button_label' => __( 'Add Link', 'mbn-theme' ),
						'sub_fields'   => array(
							array(
								'key'           => 'field_practice_area_link',
								'label'         => __( 'Link', 'mbn-theme' ),
								'name'          => 'link',
								'type'          => 'link',
								'return_format' => 'array',
							),
						),
					),
				),
			),
		),
		'location'              => array(
			array(
				array(
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'practice_area',
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
add_action( 'acf/init', 'custom_theme_register_practice_area_acf_fields' );
