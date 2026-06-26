# Section: Location – Intro (Why Choose)

**Block Name:** `mbn-theme/section-location-intro`  
**Category:** MBN Blocks  
**Type:** Dynamic Block (PHP Rendering)

## Overview

This block is used for location detail pages to highlight "Why Choose" reasons. It features a flexible section system with three optional section types that can be added in any order.

## Features

- **Header Section**: Title and intro paragraph with rich text formatting (links, bold, italic, underline, strikethrough)
- **Repeatable Section Types**:
  - **Track Record**: Subtitle, paragraph (with formatting), nested stats repeater (number + label), and column swap (text left/right)
  - **Fee Structure**: Badge image, subtitle, paragraph (with formatting), and column swap (badge left/right)
  - **Attorneys**: Subtitle, paragraph (with formatting), team image, and column swap (text/image left/right)
- **Optional Subheader**: Centered subheader text with rich text formatting
- **CTA Card**: Background image, logo, title (with formatting), description (with formatting), button, and phone number
- **Reorderable Sections**: Move sections up/down to change display order
- **Rich Text Editing**: All content fields support inline formatting with toolbar (bold, italic, links, underline, strikethrough)
- **Interchangeable Columns**: Each section type allows swapping left/right column positions

## Block Attributes

### Header
- `title` (string): Main section title (default: "Why Choose Hastings and Hastings...")
- `introParagraph` (string): Intro paragraph with HTML support

### Sections (Array)
Each section has a `type` field and type-specific fields:

#### Track Record Type
- `columnPosition` (string) - 'text-left' (default) or 'text-right'
- `subtitle` (string)
- `paragraph` (string) - supports HTML
- `stats` (array) - nested repeater
  - `number` (string) - e.g., "600+"
  - `label` (string) - e.g., "Real, Handwritten Reviews"

#### Fee Structure Type
- `columnPosition` (string) - 'badge-left' (default) or 'badge-right'
- `badgeImageUrl` (string)
- `badgeImageId` (number)
- `subtitle` (string)
- `paragraph` (string) - supports HTML

#### Attorneys Type
- `columnPosition` (string) - 'text-left' (default) or 'image-left'
- `subtitle` (string)
- `paragraph` (string) - supports HTML
- `teamImageUrl` (string)
- `teamImageId` (number)

### Subheader
- `subheaderTitle` (string): Optional centered subheader

### CTA Card
- `ctaBackgroundImageUrl` (string)
- `ctaBackgroundImageId` (number)
- `ctaLogoUrl` (string)
- `ctaLogoId` (number)
- `ctaTitle` (string)
- `ctaDescription` (string)
- `ctaButtonText` (string)
- `ctaPhoneNumber` (string)

## Assets

### Fallback Images
- `assets/images/badge-no-fee.svg` - Default badge for fee structure section
- `assets/images/img-team.png` - Default team image for attorneys section

## Styling

Styles are defined in:
- `style.css` - Block-specific styles
- `hastingsandhastings-location-blocks-shared` - Shared location block styles (CSS variables, typography, buttons)

### Responsive Design

- **Above 1024px**: All sections display in two-column grid layout
- **Below 1024px**: All sections stack vertically (single column)
  - Track Record: Text and stats stack
  - Fee Structure: Badge and text stack
  - Attorneys: Text and image stack
  - Column order modifiers are removed on mobile for natural stacking
  - Gaps reduced from 48px/60px to 32px
  - Attorney image height reduced from 492px to 350px

### CSS Classes

```
.ldp-why-choose                    - Section wrapper
.ldp-why-choose__header            - Header section
.ldp-why-choose__title             - Main title (h2)
.ldp-why-choose__intro             - Intro paragraph

.ldp-why-choose__track-record      - Track record section
.ldp-why-choose__track-record--reversed - Reversed column layout (stats left)
.ldp-why-choose__track-record-text - Text container
.ldp-why-choose__stats             - Stats wrapper
.ldp-why-choose__stat              - Individual stat
.ldp-why-choose__stat-number       - Stat number (large, blue)
.ldp-why-choose__stat-label        - Stat label

.ldp-why-choose__fee-structure     - Fee structure section
.ldp-why-choose__fee-structure--reversed - Reversed column layout (badge right)
.ldp-why-choose__badge             - Badge image wrapper
.ldp-why-choose__fee-text          - Fee text container

.ldp-why-choose__attorneys         - Attorneys section
.ldp-why-choose__attorneys--reversed - Reversed column layout (image left)
.ldp-why-choose__attorneys-text    - Attorneys text container
.ldp-why-choose__attorneys-img     - Attorneys image wrapper
.ldp-why-choose__img-team          - Team photo

.ldp-why-choose__subheader         - Subheader section
.ldp-why-choose__subtitle          - Section subtitles (h3)

.ldp-cta-card                      - CTA card at bottom
```

## Editor Interface

### Rich Text Formatting

All content fields (title, paragraphs, subtitles, CTA text) use Gutenberg's `RichText` component with a formatting toolbar that supports:

- **Bold** - `core/bold`
- **Italic** - `core/italic`
- **Link** - `core/link` (add/edit/remove links with full URL controls)
- **Underline** - `core/underline`
- **Strikethrough** - `core/strikethrough`

The formatting toolbar appears when you select text within any content field, allowing you to apply inline formatting and insert links.

### InspectorControls Panels

1. **Header**: Title and intro paragraph with rich text formatting
2. **Sections (Repeater)**: Add/remove/reorder sections
   - Click section card to expand and edit
   - **Column Layout** dropdown to swap left/right positioning
   - Each section type has conditional fields with rich text support
   - Track record has nested stats repeater
   - Use up/down arrows to reorder
3. **Subheader**: Optional subheader title with rich text formatting
4. **CTA Card**: Background, logo, title (with formatting), description (with formatting), button, phone

### Preview

The editor shows a simplified preview card with:
- Title
- Intro excerpt
- Section count and types
- Subheader
- CTA title

## Usage Example

```php
<!-- wp:mbn-theme/section-location-intro {"align":"full"} /-->
```

## Development

### Build Command
```bash
npm run build
```

### Lint Command
```bash
composer run lint -- blocks/section-location-intro/render.php
composer run lint:fix -- blocks/section-location-intro/render.php
```

## Notes

- Sections are completely optional and can be added in any order
- All content fields use RichText component for visual editing with formatting toolbar
- Rich text content is stored as HTML and rendered with `wp_kses_post()` for security
- Link formatting in RichText allows full URL editing, target (_blank), and rel attributes
- Each section type supports column swapping via the **Column Layout** dropdown:
  - **Track Record**: Text left/right (swaps text and stats columns)
  - **Fee Structure**: Badge left/right (swaps badge and text columns)
  - **Attorneys**: Text left or Image left (swaps text and image columns)
- Column swap is achieved using CSS Grid `order` property with `--reversed` modifier classes
- **Responsive behavior**: All sections automatically stack to single column below 1024px breakpoint
- Image fallbacks are automatically applied if no image is selected
- Phone numbers are sanitized to preserve international `+` prefix
- Block requires `hastingsandhastings-location-blocks-shared` stylesheet
