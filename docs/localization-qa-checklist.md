# Localization Visual QA Checklist (Theme Editor)

Use this checklist after copy key changes:

## Setup
1. Open Shopify Theme Editor preview.
2. Test in both languages:
   - English (EN)
   - Spanish (ES)

## Pages to Validate
- Home (`templates/index.json`)
- Product (`templates/product.json`, `templates/product.kyn-product.json`)
- Why BioThane page (`templates/page.porque-biothane.json`)

## Checks
- No missing key output (`t:...` should never render literally).
- Rich text line breaks render correctly (`<br/>`, paragraph spacing).
- FAQ accordion headings and body text are readable in both languages.
- Buttons/CTAs remain inside containers (no overflow).
- Marquee/banner notice text remains legible at mobile and desktop widths.

## Responsive breakpoints
- Mobile ~390px
- Tablet ~768px
- Desktop ~1280px+

## Sign-off
- [ ] EN pass
- [ ] ES pass
- [ ] Mobile pass
- [ ] Desktop pass
