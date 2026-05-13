const TYPING_DELAY_MS = 50;
const TARGET_HEADLINES = [
  'Diseño Modular',
  'Urbano',
  'Durabilidad y comodidad en cada elemento',
];

function shouldAnimateHeadline(headline) {
  const normalizedText = headline.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  return TARGET_HEADLINES.some((target) => normalizedText.includes(target));
}

function typeHeadline(headline) {
  if (headline.dataset.typingAnimationInitialized === 'true') return;

  const originalText = headline.innerText;
  if (!originalText.trim()) return;

  headline.dataset.typingAnimationInitialized = 'true';
  headline.innerHTML = '';

  let characterIndex = 0;

  const revealNextCharacter = () => {
    if (characterIndex >= originalText.length) return;

    const nextCharacter = originalText[characterIndex];
    if (nextCharacter === '\n') {
      headline.append(document.createElement('br'));
    } else {
      headline.append(document.createTextNode(nextCharacter));
    }

    characterIndex += 1;
    setTimeout(revealNextCharacter, TYPING_DELAY_MS);
  };

  revealNextCharacter();
}

function initializeTypingAnimation() {
  const headlines = document.querySelectorAll('.text-block h2');

  headlines.forEach((headline) => {
    if (shouldAnimateHeadline(headline)) {
      typeHeadline(headline);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTypingAnimation);
} else {
  initializeTypingAnimation();
}
