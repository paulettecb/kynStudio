const LETTER_STAGGER_MS = 35;
const TARGET_HEADLINES = [
  'Diseño Modular',
  'Urbano',
  'Durabilidad y comodidad en cada elemento',
  'Text component styled with Tailwind CSS.',
  'Includes responsive font sizing, tight letter tracking, and smooth color transitions—ideal for hero banners, section headers.',
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

function splitTextToAnimatedNodes(headline) {
  const sourceText = headline.textContent ?? '';
  if (!sourceText.trim()) return;

  const fragment = document.createDocumentFragment();
  let letterIndex = 0;

  for (const character of sourceText) {
    if (character === '\n') {
      fragment.append(document.createElement('br'));
      continue;
    }

    if (character === ' ') {
      fragment.append(document.createTextNode(' '));
      continue;
    }

    const letter = document.createElement('span');
    letter.className = 'headline-letter-reveal';
    letter.textContent = character;
    letter.style.setProperty('--letter-reveal-delay', `${letterIndex * LETTER_STAGGER_MS}ms`);
    fragment.append(letter);
    letterIndex += 1;
  }

  headline.innerHTML = '';
  headline.append(fragment);
}

function animateHeadline(headline) {
  const originalMarkup = getOriginalMarkup(headline);
  headline.innerHTML = originalMarkup;
  splitTextToAnimatedNodes(headline);
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
            animateHeadline(headline);
          }
        } else {
          headline.dataset.typingInView = 'false';
        }
      });
    },
    {
      threshold: 0.35,
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
