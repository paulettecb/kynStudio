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

function getOriginalMarkup(headline) {
  if (!headline.dataset.typingOriginalMarkup) {
    headline.dataset.typingOriginalMarkup = headline.innerHTML;
  }

  return headline.dataset.typingOriginalMarkup;
}

function typeHeadline(headline) {
  const originalMarkup = getOriginalMarkup(headline);
  const originalText = headline.innerText;

  if (!originalText.trim()) return;

  if (headline._typingTimeoutId) {
    clearTimeout(headline._typingTimeoutId);
  }

  headline.innerHTML = originalMarkup;
  const typingText = headline.innerText;
  headline.innerHTML = '';

  let characterIndex = 0;

  const revealNextCharacter = () => {
    if (characterIndex >= typingText.length) return;

    const nextCharacter = typingText[characterIndex];
    if (nextCharacter === '\n') {
      headline.append(document.createElement('br'));
    } else {
      headline.append(document.createTextNode(nextCharacter));
    }

    characterIndex += 1;
    headline._typingTimeoutId = setTimeout(revealNextCharacter, TYPING_DELAY_MS);
  };

  revealNextCharacter();
}

function initializeTypingAnimation() {
  const headlines = [...document.querySelectorAll('.text-block h2')].filter(shouldAnimateHeadline);

  if (!headlines.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const headline = entry.target;

        if (entry.isIntersecting) {
          if (headline.dataset.typingInView !== 'true') {
            headline.dataset.typingInView = 'true';
            typeHeadline(headline);
          }
        } else {
          headline.dataset.typingInView = 'false';
        }
      });
    },
    {
      threshold: 0.45,
    },
  );

  headlines.forEach((headline) => {
    getOriginalMarkup(headline);
    observer.observe(headline);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTypingAnimation);
} else {
  initializeTypingAnimation();
}
