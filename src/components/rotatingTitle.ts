import { attributeSelector } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { createLogger } from '$utils/log';
import { watchMedia } from '$utils/mediaQuery';

const TITLE = attributeSelector('rotating-title');
const WORDS_ATTR = 'data-rotating-words';

const DEFAULT_STEP = 1.75;
const IN_DURATION = 750;
const OUT_DURATION = 600;
/** power4.inOut */
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

const log = createLogger('rotatingTitle');

/**
 * Rotating word inside a heading: `[data-rotating-title]` holds a span with
 * `data-rotating-words="one, two, three"`. The span's content is replaced by
 * a stacked word list that cycles on a timer — old word up and out, next word
 * in from below, wrapper width morphing between them.
 *
 * Layout/clipping lives in Webflow on `.rotating-text__inner` (overflow clip)
 * and `.rotating-text__word` (absolute stack); this module only animates
 * transform, opacity and width. Tuning: `data-step-duration` (seconds, 1.75).
 * Reduced motion pins the first word. The cycle pauses while the tab is
 * hidden rather than racking up queued animations.
 */
const createRotatingTitle = (heading: HTMLElement): Destroyable | null => {
  const span = heading.querySelector<HTMLElement>(`[${WORDS_ATTR}]`);
  if (!span) return null;

  const words = (span.getAttribute(WORDS_ATTR) ?? '')
    .split(',')
    .map((word) => word.trim())
    .filter(Boolean);
  if (!words.length) return null;

  const stepRaw = Number(heading.getAttribute('data-step-duration') ?? NaN);
  const stepMs = (Number.isFinite(stepRaw) && stepRaw > 0 ? stepRaw : DEFAULT_STEP) * 1000;

  const originalText = span.textContent;
  const wrapper = document.createElement('span');
  wrapper.className = 'rotating-text__inner';
  const wordEls = words.map((word) => {
    const el = document.createElement('span');
    el.className = 'rotating-text__word';
    el.textContent = word;
    wrapper.appendChild(el);
    return el;
  });
  span.textContent = '';
  span.appendChild(wrapper);

  const cleanup = createCleanup();
  let activeIndex = 0;
  let timer = 0;

  const setStatic = (index: number) => {
    wordEls.forEach((el, i) => {
      el.style.transform = i === index ? 'translateY(0%)' : 'translateY(150%)';
      el.style.opacity = i === index ? '1' : '0';
    });
    wrapper.style.width = `${wordEls[index].getBoundingClientRect().width}px`;
  };

  const showNext = () => {
    const nextIndex = (activeIndex + 1) % wordEls.length;
    const prev = wordEls[activeIndex];
    const current = wordEls[nextIndex];

    wrapper.animate([{ width: `${current.getBoundingClientRect().width}px` }], {
      duration: IN_DURATION,
      easing: EASE,
      fill: 'forwards',
    });
    prev.animate(
      [
        { transform: 'translateY(0%)', opacity: 1 },
        { transform: 'translateY(-150%)', opacity: 0 },
      ],
      { duration: OUT_DURATION, easing: EASE, fill: 'forwards' }
    );
    current.animate(
      [
        { transform: 'translateY(150%)', opacity: 0 },
        { transform: 'translateY(0%)', opacity: 1 },
      ],
      { duration: IN_DURATION, easing: EASE, fill: 'forwards' }
    );

    activeIndex = nextIndex;
  };

  const tick = () => {
    // A hidden tab skips the swap instead of queueing a backlog of them.
    if (!document.hidden) showNext();
    timer = window.setTimeout(tick, stepMs);
  };

  const start = () => {
    setStatic(activeIndex);
    if (wordEls.length > 1) timer = window.setTimeout(tick, stepMs);
  };

  const stop = () => {
    window.clearTimeout(timer);
    timer = 0;
    wordEls.forEach((el) => el.getAnimations().forEach((animation) => animation.cancel()));
    wrapper.getAnimations().forEach((animation) => animation.cancel());
    setStatic(0);
    activeIndex = 0;
  };

  cleanup.add(
    watchMedia('(prefers-reduced-motion: reduce)', (reduced) => {
      stop();
      if (!reduced) start();
    })
  );

  log('init', { words: words.length, stepMs });

  return {
    destroy: () => {
      cleanup.run();
      window.clearTimeout(timer);
      span.textContent = originalText;
    },
  };
};

export const rotatingTitle = (): void => {
  const instances = createInstances(TITLE, createRotatingTitle).filter(
    (instance): instance is Destroyable => instance !== null
  );
  log('instances', instances.length);
};
