# Section Location - CTA Card with Badges Block

A reusable Gutenberg block for displaying a call-to-action card with background image, logo, phone number, button, and badge images.

## Features

- **CTA Card Content**: Editable title, description, and button text
- **Phone Number**: Customizable label, display text, and tel: URL
- **Background Image**: Upload custom background with Media Library
- **Logo Image**: Upload company logo via Media Library
- **Text Paragraphs**: Add multiple paragraphs above badges (drag-and-drop reordering)
- **Badge Images**: Upload multiple badge/award images (drag-and-drop reordering)
- **Duplicate Function**: Quickly duplicate paragraphs or badges
- **Responsive Design**: Mobile-friendly layout

## Block Structure

### Attributes

#### CTA Card Attributes
- `ctaTitle` (string): Main heading (default: "Start Your Free Consultation")
- `ctaDescription` (string): Description text
- `ctaButtonText` (string): Button label (default: "CONTACT US TODAY")
- `ctaPhoneLabel` (string): Phone label (default: "CALL TODAY")
- `ctaPhoneText` (string): Display phone number (default: "(480) 605-3939")
- `ctaPhoneUrl` (string): tel: URL (default: "tel:4806053939")

#### Image Attributes
- `ctaBackgroundImageUrl` (string): Background image URL
- `ctaBackgroundImageId` (number): Media Library attachment ID
- `ctaBackgroundImageFallback` (string): Fallback filename (default: "column-bg-faq.jpg")
- `ctaLogoImageUrl` (string): Logo image URL
- `ctaLogoImageId` (number): Logo attachment ID
- `ctaLogoImageFallback` (string): Fallback logo filename (default: "logo-hh.svg")

#### Content Arrays
- `badgesTextParagraphs` (array): Array of paragraph objects with:
  - `id` (number): Unique identifier
  - `text` (string): Paragraph content
  
- `badgesItems` (array): Array of badge objects with:
  - `id` (number): Unique identifier
  - `imageUrl` (string): Badge image URL
  - `imageId` (number): Media Library attachment ID
  - `imageFallback` (string): Fallback image path
  - `imageAlt` (string): Alt text for accessibility
  - `imageWidth` (number): Image width (default: 303)
  - `imageHeight` (number): Image height (default: 303)

## Usage

### In WordPress Editor

1. Add the **"Section Location - CTA Card with Badges"** block to your page
2. Configure in the sidebar panels:
   - **CTA Card Content**: Edit title, description, button text
   - **Phone Number**: Set label, text, and tel: URL
   - **Background Image**: Upload CTA background
   - **Logo Image**: Upload company logo
   - **Badges Text Paragraphs**: Add/reorder text paragraphs
   - **Badge Images**: Upload/reorder badge images

### Default Content

The block comes pre-configured with:
- Default CTA text and phone number
- 1 sample text paragraph
- 1 placeholder badge slot

## Technical Details

- **Type**: Dynamic block (server-side rendered via `render.php`)
- **Category**: mbn-blocks
- **Icon**: awards
- **Dependencies**: @dnd-kit for drag-and-drop functionality
- **Alt Text**: Automatically retrieves from Media Library when available

## Files

- `block.json` - Block metadata and attributes schema
- `index.js` - Block registration
- `edit.js` - Editor component with drag-and-drop UI
- `render.php` - Frontend rendering template
- `style.css` - Block styles
- `assets/images/` - Fallback images directory

## Styling

The block uses semantic CSS with the `.ldp-cta-card-badges-wrapper` namespace:

- **CTA Card**: Gradient background with overlay image
- **Logo**: Centered above content
- **Button**: Yellow gradient with hover effects
- **Badges**: Centered flex layout with gap
- **Responsive**: Adjusts layout for mobile devices

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
composer run lint -- blocks/section-location-cta-card-badges/render.php
```

## Accessibility

- Phone links use proper `tel:` protocol
- Images include alt text from Media Library
- Semantic HTML structure
- ARIA attributes where appropriate
