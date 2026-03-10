import { ThemeEvents } from '@theme/events';

const COLOR_MAP = {
  periwinkle: 'rgb(195 205 255)',
};

function normalizeColor(value) {
  if (!value) return '';
  const lowered = value.trim().toLowerCase();
  if (COLOR_MAP[lowered]) return COLOR_MAP[lowered];

  const sample = document.createElement('span');
  sample.style.color = value;
  if (!sample.style.color) return '';
  sample.style.display = 'none';
  document.body.append(sample);
  const parsed = getComputedStyle(sample).color;
  sample.remove();
  return parsed;
}

function extractVariantColor(picker) {
  const selectedInput = picker.querySelector('fieldset input:checked');
  if (selectedInput instanceof HTMLInputElement) {
    const label = selectedInput.closest('label');
    const swatch = label?.querySelector('.swatch');

    if (swatch) {
      const swatchColor = getComputedStyle(swatch).backgroundColor;
      if (swatchColor && swatchColor !== 'rgba(0, 0, 0, 0)' && swatchColor !== 'transparent') {
        return swatchColor;
      }
    }

    return normalizeColor(selectedInput.value);
  }

  const selectedOption = picker.querySelector('select option[selected]');
  if (selectedOption instanceof HTMLOptionElement) {
    return normalizeColor(selectedOption.value);
  }

  return '';
}

function applyAccentFromPicker(picker) {
  const productSection = picker.closest('.product-information');
  if (!productSection) return;

  const color = extractVariantColor(picker);
  if (!color) {
    productSection.removeAttribute('data-dynamic-accent');
    productSection.style.removeProperty('--dynamic-accent');
    productSection.style.removeProperty('--dynamic-accent-soft');
    return;
  }

  productSection.dataset.dynamicAccent = 'true';
  productSection.style.setProperty('--dynamic-accent', color);
  productSection.style.setProperty('--dynamic-accent-soft', `color-mix(in srgb, ${color} 16%, white)`);
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
