import { ThemeEvents } from '@theme/events';

const DEFAULT_ACCENT = 'var(--color-primary-button-background)';

function normalizeColor(value) {
  if (!value) return '';

  const sample = document.createElement('span');
  sample.style.color = value;
  if (!sample.style.color) return '';

  sample.style.display = 'none';
  document.body.append(sample);
  const parsed = getComputedStyle(sample).color;
  sample.remove();

  return parsed;
}

function extractSwatchColor(input) {
  if (!(input instanceof HTMLInputElement)) return '';

  const label = input.closest('label');
  const swatch = label?.querySelector('.swatch');
  if (!swatch) return '';

  const swatchColor = getComputedStyle(swatch).backgroundColor;
  if (!swatchColor || swatchColor === 'rgba(0, 0, 0, 0)' || swatchColor === 'transparent') {
    return '';
  }

  return swatchColor;
}

function colorToRgb(color) {
  const sample = document.createElement('span');
  sample.style.color = color;
  sample.style.display = 'none';
  document.body.append(sample);
  const parsed = getComputedStyle(sample).color;
  sample.remove();

  const matches = parsed.match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 3) return null;

  return matches.slice(0, 3).map((value) => Number.parseFloat(value));
}

function getAccentForeground(color) {
  const rgb = colorToRgb(color);
  if (!rgb) return 'rgb(var(--color-primary-button-text-rgb))';

  const [r, g, b] = rgb.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.42 ? 'rgb(var(--color-background-rgb))' : 'rgb(var(--color-foreground-rgb))';
}

function extractVariantColor(picker) {
  const selectedInputs = [...picker.querySelectorAll('fieldset input:checked')];

  for (const selectedInput of selectedInputs) {
    const swatchColor = extractSwatchColor(selectedInput);
    if (swatchColor) return swatchColor;
  }

  for (const selectedInput of selectedInputs) {
    if (selectedInput instanceof HTMLInputElement) {
      const normalized = normalizeColor(selectedInput.value);
      if (normalized) return normalized;
    }
  }

  const selectedOptions = [...picker.querySelectorAll('select')]
    .map((select) => select.selectedOptions?.[0])
    .filter((option) => option instanceof HTMLOptionElement);

  for (const selectedOption of selectedOptions) {
    const normalized = normalizeColor(selectedOption.value);
    if (normalized) return normalized;
  }

  return '';
}

function applyAccentFromPicker(picker) {
  const productSection = picker.closest('.product-information');
  if (!productSection) return;

  const color = extractVariantColor(picker);
  if (!color) {
    productSection.removeAttribute('data-dynamic-accent');
    productSection.style.setProperty('--product-accent-color', DEFAULT_ACCENT);
    productSection.style.setProperty('--product-accent-soft-color', 'color-mix(in srgb, var(--product-accent-color) 14%, white)');
    productSection.style.setProperty('--product-accent-foreground', 'rgb(var(--color-primary-button-text-rgb))');
    return;
  }

  productSection.dataset.dynamicAccent = 'true';
  productSection.style.setProperty('--product-accent-color', color);
  productSection.style.setProperty('--product-accent-soft-color', `color-mix(in srgb, ${color} 14%, white)`);
  productSection.style.setProperty('--product-accent-foreground', getAccentForeground(color));
}

function initializeProductAccents(scope = document) {
  const pickers = scope.querySelectorAll('.product-information variant-picker');
  pickers.forEach((picker) => applyAccentFromPicker(picker));
}

document.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const picker = target.closest('.product-information variant-picker');
  if (!picker) return;

  applyAccentFromPicker(picker);
});

document.addEventListener(ThemeEvents.variantUpdate, (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const picker = target.closest('.product-information')?.querySelector('variant-picker');
  if (!picker) return;

  applyAccentFromPicker(picker);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initializeProductAccents());
} else {
  initializeProductAccents();
}
