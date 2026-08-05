# Section Location - Proudly Serving Block

A reusable Gutenberg block for displaying service areas with multiple columns of location links.

## Features

- **Editable Section Title**: Customize the main heading (default: "Proudly Serving Mesa, AZ and the Phoenix Area")
- **Multiple Columns**: Add unlimited columns for organizing locations
- **Link Management**: Each column can contain multiple location links
- **Drag & Drop Reordering**: Reorder both columns and links within columns
- **Duplicate Function**: Quickly duplicate columns or links
- **Responsive Design**: Mobile-friendly grid layout
- **Modern UI**: Card-based design with hover effects and smooth transitions

## Design Implementation

### Visual Features

- **Clean, Minimal Layout**: Simple column layout without cards or borders
- **Blue Column Headings**: Column titles styled in brand blue for visual hierarchy
- **Simple Link Styling**: Clean links with chevron icons and subtle hover effects
- **Typography**: Uses Noto Serif for headings and Heebo for body text
- **Spacing**: Balanced grid layout with clean gaps between columns
- **Responsive**: Adapts from 4-column desktop to single-column mobile

### Design Tokens

The block uses the LDP (Location Detailed Page) design system:

```css
--ldp-blue-600: #286fb7       /* Column titles and link hover */
--ldp-text-heading: #13263e   /* Main heading color */
--ldp-text-body: #53585f      /* Link text color */
--ldp-white: #ffffff          /* Background */
```

## Block Structure

### Attributes

#### `servingTitle` (string)
- The main section heading
- Default: "Proudly Serving Mesa, AZ and the Phoenix Area"

#### `servingColumns` (array)
Array of column objects, each containing:
- `id` (number): Unique identifier for drag-and-drop
- `title` (string): Column heading
- `links` (array): Array of link objects with:
  - `id` (number): Unique identifier
  - `label` (string): Link text
  - `url` (string): Link destination

## Usage

### In WordPress Editor

1. Add the **"Section Location - Proudly Serving"** block to your page
2. Edit the section title in the **Settings** panel
3. Manage columns in the **Service Area Columns** panel:
   - Click **"+ Add Column"** to create new columns
   - Drag the menu icon to reorder columns
   - Use duplicate/trash icons to manage columns
4. Within each column:
   - Set the column title
   - Add links using **"+ Add Link"**
   - Drag links to reorder
   - Set label and URL for each link

### Default Content

The block comes with 2 sample columns:
- **Mesa Neighborhoods**: Downtown Mesa, East Mesa, West Mesa
- **Nearby Cities**: Phoenix, Tempe, Chandler

## Technical Details

- **Type**: Dynamic block (server-side rendered via `render.php`)
- **Category**: mbn-blocks
- **Icon**: location-alt
- **Dependencies**: @dnd-kit for drag-and-drop functionality

## Files

- `block.json` - Block metadata and attributes schema
- `index.js` - Block registration
- `edit.js` - Editor component with drag-and-drop UI
- `render.php` - Frontend rendering template
- `style.css` - Block styles with design tokens
- `assets/images/chevron-right.svg` - Chevron icon for links

## Styling

The block uses semantic CSS with the `.ldp-serving` namespace:

### Key CSS Features

- **Grid Layout**: CSS Grid with responsive auto-fit columns
- **Clean Design**: No card backgrounds or borders for minimal aesthetic
- **Simple Transitions**: Subtle color changes on link hover
- **Responsive Breakpoints**:
  - Desktop (1024px+): Multi-column grid (4 columns)
  - Tablet (768-1024px): 2 columns
  - Mobile (<768px): Single column

### CSS Architecture

```css
.ldp-serving                 /* Section wrapper */
  .ldp-container            /* Max-width container */
    .ldp-serving__header    /* Title section */
      .ldp-serving__title   /* Main heading */
    .ldp-serving__columns   /* Grid container */
      .ldp-serving__col     /* Individual column (no styling) */
        .ldp-serving__col-title  /* Column heading (blue) */
        .ldp-serving__links      /* Links list */
          a                      /* Individual link */
            img                  /* Chevron icon */
```

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run start
```

### Lint PHP

```bash
composer run lint -- blocks/section-location-proudly-serving/render.php
```

## Accessibility

- Semantic HTML structure with `<nav>` and proper ARIA labels
- Focus states for keyboard navigation
- Sufficient color contrast ratios
- Screen reader friendly link text
- Responsive design for all viewport sizes
