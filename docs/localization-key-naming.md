# Localization Key Naming Guide

This project uses locale namespaces to keep translatable content organized and scalable.

## Namespaces

- `custom_marketing.*`  
  Use for homepage/landing marketing copy, notices, and generic CTA text not tied to a specific product model.

- `product_faq.*`  
  Use for product tabs and FAQ headings/answers used in product templates.

## Naming Rules

1. Use `snake_case` keys.
2. Prefer semantic names (`q1_heading`, `q1_answer`, `tab_1_label`) for grouped content.
3. Keep paired keys consistent:
   - `*_label` / `*_content`
   - `q*_heading` / `q*_answer`
4. Avoid embedding language in key names (`*_en`, `*_es`); language belongs in locale files.
5. Keep HTML minimal and purposeful inside translation values.

## Example

- `custom_marketing.atelier_notice`
- `custom_marketing.coming_soon_cta`
- `product_faq.tab_2_content`
- `product_faq.q5_answer`

## Workflow for New Copy

1. Add key in `locales/en.default.json`.
2. Add equivalent key in `locales/es.json`.
3. Reference it in templates/sections using:
   - JSON templates: `"t:namespace.key"`
   - Liquid: `{{ 'namespace.key' | t }}`
4. QA both EN/ES in Theme Editor preview.
