# Site Footer Block

A dynamic WordPress Gutenberg block for creating a complete site footer with customizable menus, logo, social media links, and copyright information.

## Features

- **Dynamic Menu Integration**: Select WordPress menus for three footer sections
  - Locations Menu (hierarchical structure with parent-child relationships)
  - Practice Areas Menu (hierarchical structure)
  - Main Footer Menu (for About Us, Stay Informed, Connect With Us, etc.)
  
- **Logo & Tagline**: Upload custom footer logo and set tagline text

- **Social Media Repeater**: Add unlimited social media links with custom icons
  - Drag-and-drop reordering
  - Duplicate functionality
  - Custom icon upload
  - URL field for each social link

- **Copyright Text**: Customizable copyright message

## Setup Instructions

### 1. Create WordPress Menus

Go to **Appearance > Menus** and create three menus:

#### Locations Menu
Create a hierarchical menu structure:
- **Phoenix Area** (parent)
  - Phoenix (child)
  - Paradise Valley (child)
  - Scottsdale (child)
- **East Valley** (parent)
  - Mesa (child)
  - Chandler (child)
  - etc.

#### Practice Areas Menu
Similar hierarchical structure:
- **Vehicle Accidents** (parent)
  - Car Accidents (child)
  - Truck Accidents (child)
  - etc.

#### Main Footer Menu
Flat or hierarchical menu for footer navigation:
- **About Us** (parent)
  - About Our Firm (child)
  - Attorneys & Counsel (child)
- **Stay Informed** (parent)
  - Blogs (child)
  - Video Center (child)

### 2. Add Block to Template

1. Go to **Appearance > Editor**
2. Select the template where you want the footer (e.g., Footer template part)
3. Click **+** to add a block
4. Search for "Site Footer"
5. Insert the block

### 3. Configure Block Settings

In the block sidebar (Inspector Controls):

#### Menu Settings
- Select the menu for each section from the dropdown

#### Footer Logo & Tagline
- Upload footer logo image
- Enter tagline text (e.g., "Serving Arizona injury victims since 1979...")

#### Social Media Links
- Click "Add Social Media"
- Enter label (e.g., "LinkedIn")
- Enter URL
- Upload icon (24x24px SVG recommended)
- Drag to reorder
- Use duplicate button to copy existing items
- Use trash icon to remove

#### Copyright
- Enter copyright text (e.g., "© 2026 Your Company. All rights reserved.")

## Styling

The block uses Tailwind CSS classes from `tailwind.config.js`:

### Colors Used
- `footer-bg`: #13263E (dark blue background)
- `footer-text`: #FFFFFF (white text)
- `footer-link-blue`: #599BD7 (light blue for section headers)
- `secondary`: #3480C3 (hover color for links)

### Custom CSS
The block includes minimal custom CSS for:
- Chevron icons before links (::before pseudo-element)
- Phone icon override
- Responsive column flex adjustments

## Development

### File Structure
```
blocks/footer/
├── block.json          # Block metadata and attributes
├── index.js            # Block registration
├── edit.js             # Editor component (React)
├── render.php          # Server-side rendering
├── style.css           # Frontend styles
└── README.md           # Documentation
```

### Build Command
```bash
npm run build
```

### Dependencies
- `@dnd-kit/core`: Drag-and-drop functionality
- `@dnd-kit/sortable`: Sortable lists
- `@dnd-kit/utilities`: DnD utilities

## Menu Structure Requirements

### Hierarchical Menu Format
The block expects menus with parent-child relationships:
- **Parent items** = Column headers (e.g., "Phoenix Area", "Vehicle Accidents")
- **Child items** = Links within that column

### Non-hierarchical Alternative
If using a flat menu, all items will be rendered as links without column headers.

## Responsive Behavior

- **Desktop (lg)**: 4-column grid for Locations/Practice Areas, 3-column for Main Footer
- **Tablet (sm)**: 2-column grid
- **Mobile**: Single column stack
- **CTA Buttons**: Hidden on mobile, visible on desktop

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `locationsMenuId` | number | 0 | WordPress menu ID for locations |
| `practiceAreasMenuId` | number | 0 | WordPress menu ID for practice areas |
| `mainFooterMenuId` | number | 0 | WordPress menu ID for main footer |
| `footerLogoUrl` | string | "" | URL of footer logo image |
| `footerLogoId` | number | 0 | Media ID of footer logo |
| `footerTagline` | string | "..." | Tagline text below logo |
| `socialMedia` | array | [] | Array of social media objects |
| `copyrightText` | string | "..." | Copyright notice text |

### Social Media Object Structure
```json
{
  "id": "unique-uuid",
  "label": "LinkedIn",
  "url": "https://linkedin.com/company/...",
  "iconUrl": "https://site.com/icon.svg",
  "iconId": 123
}
```

## Troubleshooting

### Menus Not Appearing
- Ensure menus are published in **Appearance > Menus**
- Check that menu items have parent-child relationships set correctly
- Verify the correct menu is selected in block settings

### Social Icons Not Showing
- Check that both URL and icon are set for each social media item
- Recommended icon size: 24x24px
- Supported formats: SVG, PNG, JPG

### Styles Not Applied
- Run `npm run build` to compile block assets
- Clear browser cache
- Check that Tailwind CSS is properly configured

## Best Practices

1. **Menu Organization**: Keep menu structures organized with clear parent-child relationships
2. **Icon Consistency**: Use consistent icon style (all outline or all filled)
3. **Link Testing**: Test all menu links after configuration
4. **Mobile Testing**: Preview footer on mobile devices
5. **Performance**: Use SVG icons for better performance and scalability
