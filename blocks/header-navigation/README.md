# Header Navigation Block - Usage Guide

## Overview
The Header Navigation block creates a sticky header that transforms from a large centered layout to a compact horizontal layout after scrolling 300px.

## Features
✅ **Sticky header** - Becomes fixed after 300px scroll
✅ **Two visual states** - Large default, compact sticky (CSS-only transition)
✅ **Dropdown menus** - Support for mega-menu dropdowns
✅ **Responsive** - Mobile-friendly design
✅ **CTA button** - Customizable call-to-action button

## WordPress Setup

### 1. Register Menus
Menus are already registered in functions.php:
- **Main Menu** - Primary navigation items (Practice Areas, Locations, About, Resources)
- **Contact Menu** - Contact dropdown menu

### 2. Create Menus in WordPress Admin
Go to **Appearance → Menus**:

#### Main Menu
Create a new menu called "Main Menu" and assign to **Main Menu** location:
- Practice Areas (with dropdown)
- Locations (with dropdown)
- About (with dropdown)
- Resources (with dropdown)

#### Contact Menu  
Create a new menu called "Contact Menu" and assign to **Contact Menu** location:
- Contact (parent item)
  - Phone Numbers (dropdown items)
  - Office Locations
  - Contact Form
  - etc.

### 3. Add Block to Header Template
1. Go to **Appearance → Editor → Header**
2. Add the **Header Navigation** block
3. Configure the button:
   - Button Text: "REQUEST A FREE CONSULTATION"
   - Button URL: Link to your contact form or phone number

## Block Settings

### Inspector Controls
- **Button Text**: Customize the CTA button text
- **Button URL**: Set the button destination URL

## Styling

### Colors Used (from tailwind.config.js)
- Primary Yellow: `#FFF24C` - CTA button background
- Secondary Blue: `#3480C3` - Logo color, hover states
- Text Heading: `#13263E` - Button text
- Text Body: `#53585F` - Menu text

### Fonts Used
- **Heebo** (sans-serif) - Navigation and button text
- Body font at 16px (14px sticky), 500 weight

## Behavior

### Default State (> 300px from top)
- Large centered logo (302x76px)
- Navigation below logo
- Generous spacing (2rem padding)

### Sticky State (< 300px from top)
- Compact logo (150x38px)
- Horizontal layout: Logo left | Nav center | Contact + Button right
- Reduced padding (1rem)
- Smooth 0.3s transition

## Customization

### Logo
Update the SVG in `blocks/header-navigation/render.php`:
```php
<svg class="logo-svg" width="302" height="76" viewBox="0 0 302 76">
  <!-- Replace with actual logo SVG -->
</svg>
```

### Scroll Threshold
Modify in `blocks/header-navigation/script.js`:
```javascript
const SCROLL_THRESHOLD = 300; // Change to desired pixel value
```

### Transition Speed
Modify in `blocks/header-navigation/style.css`:
```css
transition: all 0.3s ease-in-out; /* Change 0.3s to desired duration */
```

## Responsive Breakpoints

- **Desktop** (> 1024px): Full layout with all features
- **Tablet** (768px - 1024px): Reduced spacing, smaller fonts
- **Mobile** (< 768px): Stacked layout, hamburger menu recommended

## Development

### Build Block
```bash
npm run build
```

### Watch Mode (Development)
```bash
npm run start
```

## Files Structure
```
blocks/header-navigation/
├── block.json          # Block metadata
├── index.js            # Block registration
├── edit.js             # Editor component
├── save.js             # Returns null (dynamic block)
├── render.php          # PHP template with menus
├── style.css           # Frontend styles + sticky behavior
└── script.js           # Scroll listener for sticky class
```

## Troubleshooting

### Header not sticky
- Check if script.js is loading (inspect browser console)
- Verify header element has id="site-header-nav"

### Menus not showing
- Ensure menus are assigned to correct locations in WP Admin
- Check if menu locations exist: `has_nav_menu('main-menu')`

### Styling issues
- Run `npm run build` to recompile CSS
- Clear browser cache
- Check for CSS conflicts with other plugins

## Support
For issues or customizations, refer to the WordPress Gutenberg Block documentation.
