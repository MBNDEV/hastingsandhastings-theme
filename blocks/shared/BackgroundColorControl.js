/**
 * Background Color Control Component
 * 
 * Reusable color picker component for section background colors.
 * Combines Tailwind preset colors with custom color picker.
 * 
 * @package MBN_Theme
 */

import { ColorPalette, BaseControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { TAILWIND_COLORS } from './tailwind-colors';

/**
 * Background Color Control Component
 * 
 * @param {Object} props Component props
 * @param {string} props.value Current background color value (Tailwind class or hex)
 * @param {Function} props.onChange Callback when color changes
 * @param {string} props.defaultValue Default color to use when cleared
 * @param {string} props.label Optional custom label
 * @param {string} props.help Optional custom help text
 * @returns {JSX.Element} Background color control
 */
export default function BackgroundColorControl({
  value,
  onChange,
  defaultValue = 'bg-white',
  label = __('Background Color', 'mbn-theme'),
  help = __('Select a preset color or click the palette icon to choose custom colors', 'mbn-theme'),
}) {
  return (
    <BaseControl label={label} help={help}>
      <ColorPalette
        colors={TAILWIND_COLORS.map(c => ({ name: c.name, color: c.color }))}
        value={(() => {
          const found = TAILWIND_COLORS.find(c => c.class === value);
          return found ? found.color : value;
        })()}
        onChange={(color) => {
          if (!color) {
            onChange(defaultValue);
            return;
          }
          const found = TAILWIND_COLORS.find(c => c.color.toLowerCase() === color.toLowerCase());
          onChange(found ? found.class : color);
        }}
        clearable={false}
      />
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        {__('Current: ', 'mbn-theme')}
        <strong>{value}</strong>
      </div>
    </BaseControl>
  );
}
