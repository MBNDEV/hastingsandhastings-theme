# Section: Location – Office Location

A Gutenberg block for displaying office locations with a map embed. This block shows a grid of office locations organized in three columns, with individual office contact information and an embedded Google Map.

## Features

- **Office Locations Grid**: Display multiple office locations in a responsive 3-column layout
- **Office Information**: Each office includes:
  - Office name
  - Address (with optional Google Maps link)
  - Phone number (with tel: link)
  - "By Appointment Only" flag
- **Embedded Map**: Google Maps iframe embed to show all locations
- **Responsive Design**: Adapts to tablet (2-column) and mobile (1-column) layouts
- **Accessibility**: Proper semantic HTML with ARIA labels

## Block Attributes

### `locationsHeading` (string)
- Default: "Office Locations"
- The main heading for the section

### `officeLocations` (array)
Array of office location objects, each containing:
- `name` (string): Office name
- `address` (string): Full address
- `addressUrl` (string): Optional Google Maps URL for the address
- `phoneNumber` (string): Display phone number (e.g., "(480) 706-1100")
- `phoneUrl` (string): Tel link (e.g., "tel:4807061100")
- `byAppointmentOnly` (boolean): Whether office requires appointment

### `mapIframeUrl` (string)
- Default: Google Maps embed URL
- Full URL for the Google Maps iframe embed

### `mapTitle` (string)
- Default: "Map showing Hastings & Hastings office locations across Arizona"
- Accessibility title for the map iframe

## Usage

### In Block Editor
1. Add the "Section: Location – Office Location" block
2. Configure office locations in the Inspector Controls:
   - Add/remove office locations
   - Set office name, address, phone
   - Mark as "By Appointment Only" if needed
3. Configure map embed URL in the Map Embed panel
4. Preview updates live in the editor

### Programmatically
```php
<!-- wp:mbn-theme/section-location-office-location {
  "locationsHeading":"Our Offices",
  "officeLocations":[{
    "name":"Phoenix Office",
    "address":"123 Main St, Phoenix, AZ 85001",
    "addressUrl":"https://maps.google.com/...",
    "phoneNumber":"(480) 123-4567",
    "phoneUrl":"tel:4801234567",
    "byAppointmentOnly":false
  }]
} /-->
```

## Styling

The block uses the following CSS classes:
- `.contact-locations` - Main section wrapper
- `.contact-locations__container` - Inner container
- `.contact-locations__heading` - Section heading
- `.contact-locations__offices-grid` - Grid wrapper
- `.contact-locations__offices-col` - Column wrapper
- `.contact-locations__office` - Individual office card
- `.contact-locations__office-header` - Office name/note wrapper
- `.contact-locations__office-name` - Office name
- `.contact-locations__office-note` - "By Appointment Only" note
- `.contact-locations__office-links` - Links list
- `.contact-locations__office-link` - Individual link item
- `.contact-locations__office-link--address` - Address link modifier
- `.contact-locations__office-link--phone` - Phone link modifier
- `.contact-locations__map` - Map figure wrapper
- `.contact-locations__map-iframe` - Map iframe element

## Responsive Breakpoints

- **Desktop (1024px+)**: 3-column grid layout
- **Tablet (768px-1023px)**: 2-column grid, last column wraps
- **Mobile (< 768px)**: Single column stack layout

## Assets

Required icon files (included in `assets/images/`):
- `icon-location-pin.svg` - Address icon
- `icon-phone-chevron.svg` - Phone icon

## Alignment Support

Supports `wide` and `full` alignment options.

## Version History

- **1.0.0** - Initial release
  - Office locations grid with 3-column layout
  - Google Maps embed
  - Responsive design
  - Accessibility features
