# Landing Page (LP)

A standalone, conversion-focused landing page. It was captured from the live
Hastings & Hastings `/lp/` page — an Elementor Canvas page served through
NitroPack — and converted into a normal WordPress page template.

There are two language variants. They are the same page — same shell, layout,
images and stylesheets — differing only in copy and which Gravity Form they
submit to.

| Template | Copy | Gravity Form | `<html lang>` |
| --- | --- | --- | --- |
| **Landing Page (LP)** | English | 10 | site default |
| **Landing Page (LP — Español)** | Spanish | 12 | `es` |

## Using it

1. Pages → Add New (or edit an existing page).
2. Page Attributes → Template → **Landing Page (LP)** or **Landing Page (LP — Español)**.
3. Publish. The page renders the design below regardless of editor content.

Pages still assigned to the retired **Hastings LP (Static)** template
(`page-templates/template-hastings-lp.php`) are routed to the English one
automatically — see `mbn_lp_legacy_template()` — so no post meta needs
rewriting.

## Files

| Path | What it is |
| --- | --- |
| `../template-lp.php` | English template. Thin — sets the variant and loads the shell. |
| `../template-lp-es.php` | Spanish template. Same, with `$mbn_lp_variant = 'es'`. |
| `shell.php` | The document shell both templates share: own `<html>`/`<head>`/`<body>`, no site header or footer, `wp_head()`/`wp_footer()` intact. |
| `content.php` | **Generated.** The page markup, ~10 Elementor containers. |
| `content-es.php` | **Generated.** The same markup with Spanish copy. |
| `assets/lp-base.css` | **Generated.** WordPress core + global styles from the snapshot's first inline block. |
| `assets/lp-theme.css` | **Generated.** Elementor kit variables, page CSS, Additional CSS. |
| `assets/lp-fonts.css` | **Generated.** `@font-face` rules, pointing at the self-hosted woff2 files here. |
| `assets/lp-custom.js` | **Generated.** The page's own behaviour: fee calculator, testimonial slider, box slider, awards carousel. |
| `assets/nitro-min-noimport-*.css` | Captured Elementor/plugin stylesheet bundles, with CDN URLs rewritten to local files. |
| `assets/*` (rest) | Images, fonts, `slick.min-*.js` — everything the page loads. |
| `page.php` | **Archive.** The original captured snapshot. Nothing loads it; it is the input to the build script. |

Registration, enqueueing and the lead form live in
[`inc/includes-lp-template.php`](../../inc/includes-lp-template.php). The Spanish
copy lives in [`scripts/lp-es-strings.js`](../../scripts/lp-es-strings.js).

## The Spanish variant

The client's reference page — <https://www.hastingsandhastings.com/smm-spanish/> —
is a duplicate of the English LP: the same ten containers and the same seventy
Elementor widget IDs, with translated text. So Spanish is built as a text swap
over the shared markup, keyed by widget ID, rather than as a second capture.
There is no second copy of the layout, the images or the 600KB of CSS.

To change Spanish wording, edit `scripts/lp-es-strings.js` and re-run the build.
Widgets whose content is identical in both languages — icons, images, the "33%"
and "29%" figures — are simply absent from that map and pass through untouched.

Four things were **still in English on the reference page** and are translated
here, so the Spanish page reads as one language. Revert them in
`lp-es-strings.js` if the client wants the reference copied exactly:

| Widget | Reference | Here |
| --- | --- | --- |
| `871ed64` | Other Accident Attorneys | Otros abogados de accidentes |
| `a43c8bc`, `8ddd23c` | Settlement fee | Tarifa del acuerdo |
| `d47700e` | Get my FREE case review | Obtén tu evaluación GRATIS |
| `f5af63c` | six English reviews | translations of the same six |

The reference page also serves as `<html lang="en-US">`; this template serves
`lang="es"` (filterable via `mbn_lp_es_locale`).

Testimonials are the one piece of copy that has to reach JavaScript, because
`lp-custom.js` rebuilds the slider on load. `content-es.php` renders the Spanish
quotes into the markup *and* hands the same list to the script through
`mbn_lp_set_testimonials()`, so the slider never flashes English first.

## What changed from the snapshot

- **Third-party tracking removed** — HubSpot, Google Tag Manager, GA4, Google
  Ads, Facebook Pixel, Microsoft Clarity, CallRail and reCAPTCHA loaders. Add
  these back through the site's tag manager or a plugin, not the template.
- **NitroPack runtime removed** — the `NPRL` resource loader, lazy-loading
  shims and web worker. Lazy `nitro-lazy-src`/`nitro-lazy-srcset` attributes
  were resolved to real `src`/`srcset`, including six images that were left
  holding inline SVG placeholders.
- **Nothing loads off-site.** All 76 asset references in the markup and all 490
  local `url()` references in the CSS resolve inside `assets/`.
- **Slick's runtime DOM was stripped back out.** The snapshot was taken after
  the sliders had initialised, so `.slick-list`/`.slick-track` wrappers, 23
  cloned slides and generated dots were baked into the HTML. Re-initialising
  over that duplicated slides and threw on `unslick()`.
- **`lander.js` is no longer loaded.** It initialised the same three sliders
  that the page's own inline scripts then unslicked and re-initialised. The two
  things it alone owned — the `.logo-award` carousel and the `.custom-arrows`
  bindings — were folded into `lp-custom.js`, so every slider now initialises
  exactly once.
- **Elementor's frontend JS is not loaded.** Every widget on the page is static
  (image, heading, text, button, icon, icon-list, html); nothing carries an
  entrance animation, motion effect or background video.
- **The lead form is a real Gravity Form.** The captured `<form>` markup was
  discarded — it posted nowhere. `mbn_lp_render_form()` renders form 10; change
  that with the `mbn_lp_form_id` filter. The styling still applies to whatever
  form is used, because the LP's form CSS is scoped to the `.lp-form` wrapper
  the form renders inside, not to the captured form's IDs. If the form cannot be
  rendered, visitors see nothing and editors see a short notice in its place.
- **The sliders were repaired, not just re-hosted.** Four things were wrong in
  the captured state and are fixed in the build:
  - The testimonials had been dropped to a single column. They run two-up on
    desktop and one-up under 768px again, as the design calls for.
  - The awards carousel could never move: only four badges, and slick was asked
    to show four. `lp-custom.js` now repeats the set until it outnumbers the
    visible slides, so it rotates while looking identical at rest.
  - The box slider had `autoplay: false` and drew slick's own arrows on top of
    the design's `.custom-arrows`. Autoplay is restored (2s, as `lander.js` had
    it) and the default arrows are off.
  - `.logo-award` had been initialised without `rows: 0`, so slick's wrapper
    `<div>`s were baked into the snapshot and re-nested on every load. The
    converter unwraps them.

## Known follow-ups

- **Gravity Forms is not active on this local site**, so the hero's form area
  renders empty on both variants. Activate it and make sure the form IDs match —
  10 for English, 12 for Spanish, or whatever `mbn_lp_form_id` returns — and the
  hero fills in. The Spanish form needs Spanish field labels; that is form
  configuration in Gravity Forms, not something this template can supply.
- The translated testimonials are exactly that — translations of the English
  reviews, not quotes those clients gave in Spanish. Worth swapping for genuine
  Spanish-language reviews when the client has them.
- 20 `url()` targets in the captured CSS bundles still point at the NitroPack
  CDN: Gravity Forms admin icons, Font Awesome fallbacks, Chosen sprites, the
  slick ajax loader, and a few Typekit weights. None of them are used by
  anything visible on this page. Drop the files into `assets/` and re-run the
  build if that changes.
- Body classes `landing-page` and `elementor-kit-8830` are added by
  `mbn_lp_body_class()` — the captured CSS is scoped to them. Do not remove them
  without re-scoping the CSS.

## Regenerating

`content.php`, `content-es.php` and the generated `assets/lp-*.css|js` are build
output. Edit the converter or `scripts/lp-es-strings.js`, not the output:

```sh
node scripts/build-lp-template.js      # from the theme root
```

It reads `page.php` and rewrites everything marked **Generated** above. It needs
`jsdom` (`npm install --no-save jsdom`) for the un-slicking pass.
