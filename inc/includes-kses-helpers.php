<?php
/**
 * Shared kses sanitization helpers for block rich-text/HTML fields.
 *
 * Used by block render templates (practice-area-details, location-detailed-page)
 * to sanitize editor-supplied HTML while preserving inline layout styles.
 *
 * @package MBN_Theme
 */

/**
 * Extend the CSS properties `wp_kses` permits in inline style attributes.
 *
 * By default `safecss_filter_attr()` drops declarations such as `list-style`,
 * so styles editors add to rich-text fields silently disappear on the front
 * end. This adds the layout/list properties that editors commonly need.
 *
 * @param string[] $styles Allowed CSS property names.
 * @return string[]
 */
function mbn_pad_allow_inline_styles( $styles ) {
  return array_merge(
    $styles,
    array(
		'list-style',
		'list-style-type',
		'list-style-position',
		'display',
		'gap',
		'flex-direction',
		'flex-wrap',
		'align-items',
		'justify-content',
		'grid-template-columns',
		'column-count',
		'column-gap',
		'white-space',
    )
  );
}
add_filter( 'safe_style_css', 'mbn_pad_allow_inline_styles' );

/**
 * Sanitize rich-text field HTML while preserving editor-supplied inline styles.
 *
 * Same allowlist as wp_kses_post() (which already permits the `style`
 * attribute, and whose safe CSS property set is expanded via the
 * `safe_style_css` filter above). Unclosed/misnested tags are balanced so
 * malformed field HTML cannot break the surrounding page layout.
 *
 * @param string $html Raw field HTML.
 * @return string Sanitized HTML.
 */
function mbn_pad_kses( $html ) {
  return balanceTags( wp_kses_post( (string) $html ), true );
}
