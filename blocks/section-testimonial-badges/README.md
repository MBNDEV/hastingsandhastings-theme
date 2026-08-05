# Section: Testimonial Badges Block

A full-width WordPress Gutenberg block displaying testimonials slider with badges section.

## Features

- **Testimonials Repeater**: Drag-and-drop reorderable testimonials with:
  - Star rating (1-5 stars)
  - Testimonial content
  - Author name
  
- **Badges Repeater**: Drag-and-drop reorderable badges with:
  - Icon image upload
  - Primary text
  - Secondary text

- **Swiper Slider**: Auto-playing testimonials slider (2 second delay, looped)
- **Full-Width Support**: Displays full-width in editor and frontend
- **Responsive Layout**: 60/40 flex layout on desktop, stacked on mobile

## Block Configuration

### Testimonials
- Located in sidebar under "Testimonials" panel
- Each testimonial includes:
  - **Star Rating**: Slider control (1-5 stars)
  - **Testimonial Content**: Textarea for the quote
  - **Author**: Author name/attribution
- Drag-and-drop to reorder
- Duplicate/Remove buttons for each item

### Badges
- Located in sidebar under "Badges" panel
- Each badge includes:
  - **Icon**: Image upload (recommended: 56x56px SVG)
  - **Primary Text**: Main heading text
  - **Secondary Text**: Subheading text (displayed in secondary color)
- Drag-and-drop to reorder
- Duplicate/Remove buttons for each item

## Styling

- Background: Gradient from #1D456F to #13263E
- Left column (60%): Testimonials with blue left border
- Right column (40%): Badges with icons
- Testimonial text: Noto Serif font, large size
- Author attribution: Heebo font, secondary blue color

## Technical Details

- **Block Name**: `mbn-theme/section-testimonial-badges`
- **Category**: mbn-blocks
- **Render**: Dynamic (PHP render.php)
- **Dependencies**: Swiper.js v11 (loaded via CDN)
- **Star Icons Path**: `/assets/icons/icn-single-star.svg`

## Usage

1. Add block to page/post
2. Block will display at full-width by default
3. Configure testimonials and badges in the sidebar
4. Testimonials will auto-play in a slider on the frontend
5. Badges display as static content alongside testimonials

## Development

- Edit JS: `blocks/section-testimonial-badges/edit.js`
- Frontend render: `blocks/section-testimonial-badges/render.php`
- Styles: `blocks/section-testimonial-badges/style.css`
- Editor styles: `blocks/section-testimonial-badges/editor.css`

Build command:
```bash
npm run build
```
