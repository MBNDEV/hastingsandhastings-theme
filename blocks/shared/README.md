# Shared Block Components

This directory contains reusable components and utilities shared across multiple Gutenberg blocks.

## Files

### `tailwind-colors.js`
Global Tailwind color palette constant used for consistent theming across all blocks.

**Export:**
```javascript
export const TAILWIND_COLORS = [
  { name: 'White', color: '#FFFFFF', class: 'bg-white' },
  { name: 'Primary Yellow', color: '#FFF24C', class: 'bg-primary' },
  // ... more colors
];
```

**Usage:**
```javascript
import { TAILWIND_COLORS } from '../shared/tailwind-colors';

// Use in your block
const myColor = TAILWIND_COLORS[0]; // { name: 'White', color: '#FFFFFF', class: 'bg-white' }
```

### `BackgroundColorControl.js`
Reusable color picker component for section background colors. Combines Tailwind preset colors with WordPress ColorPalette.

**Props:**
- `value` (string) - Current background color value (Tailwind class or hex)
- `onChange` (function) - Callback when color changes
- `defaultValue` (string) - Default color to use when cleared (default: 'bg-white')
- `label` (string) - Optional custom label (default: 'Background Color')
- `help` (string) - Optional custom help text

**Usage:**
```javascript
import BackgroundColorControl from '../shared/BackgroundColorControl';

// In your Edit component
<BackgroundColorControl
  value={backgroundColor}
  onChange={(value) => setAttributes({ backgroundColor: value })}
  defaultValue="bg-light-blue"
/>
```

## Currently Used In

- `section-case-results` - Case results section block
- `section-practice-areas` - Practice areas grid block

## Adding New Shared Components

When creating new shared components:

1. **Create the file** in this directory
2. **Export** the component/constant as default or named export
3. **Import** in blocks using relative path: `import Component from '../shared/Component'`
4. **Document** the component in this README
5. **Rebuild** blocks with `npm run build`

## Benefits

- ✅ **Consistency** - Same UI/UX across all blocks
- ✅ **Maintainability** - Update once, applies everywhere
- ✅ **Reusability** - Easy to add to new blocks
- ✅ **DRY Principle** - Don't Repeat Yourself
