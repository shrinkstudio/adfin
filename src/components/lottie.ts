import { createLogger } from '$utils/log';

const log = createLogger('lottie');

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    lottie?: any;
  }
}

const SOURCE = '[data-lottie]';
const PLAYER_URL =
  'https://cdn.jsdelivr.net/npm/lottie-web@5.13.0/build/player/lottie_light.min.js';
/* fetch players this far before they scroll into view */
const LOAD_MARGIN = '50% 0px';

let playerLoading: Promise<any> | null = null;

/** lottie-web (SVG-only build) is pulled in only when a page has a Lottie. */
const loadPlayer = (): Promise<any> => {
  if (window.lottie) return Promise.resolve(window.lottie);
  if (playerLoading) return playerLoading;
  playerLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = PLAYER_URL;
    script.onload = () => resolve(window.lottie);
    script.onerror = () => reject(new Error('lottie-web failed to load'));
    document.head.appendChild(script);
  });
  return playerLoading;
};

interface LottieAnim {
  play(): void;
  pause(): void;
  goToAndStop(value: number, isFrame?: boolean): void;
  addEventListener(name: string, cb: () => void): void;
}

/**
 * Lottie animations from plain Webflow markup. Each `[data-lottie]` element
 * carries the JSON URL in `data-lottie-src` (empty = skipped, so a card can
 * hold the element unused). The player loads once near the viewport; the
 * animation loops while on screen and pauses off it. Reduced motion holds a
 * still frame: `data-lottie-frame` (default 0). `data-lottie-loop="false"`
 * plays once.
 */
export const lottie = (): void => {
  const targets = Array.from(document.querySelectorAll<HTMLElement>(SOURCE)).filter((el) =>
    (el.getAttribute('data-lottie-src') || '').trim()
  );
  if (!targets.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anims = new Map<Element, LottieAnim>();
  const onScreen = new Set<Element>();

  const sync = (el: Element): void => {
    const anim = anims.get(el);
    if (!anim || reducedMotion) return;
    if (onScreen.has(el)) anim.play();
    else anim.pause();
  };

  const create = (el: HTMLElement): void => {
    if (el.hasAttribute('data-lottie-fired')) return;
    el.setAttribute('data-lottie-fired', '');
    loadPlayer()
      .then((player) => {
        const anim: LottieAnim = player.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: el.getAttribute('data-lottie-loop') !== 'false',
          autoplay: false,
          path: (el.getAttribute('data-lottie-src') || '').trim(),
        });
        anim.addEventListener('DOMLoaded', () => {
          anims.set(el, anim);
          if (reducedMotion)
            anim.goToAndStop(Number(el.getAttribute('data-lottie-frame')) || 0, true);
          else sync(el);
        });
      })
      .catch((err) => log(err));
  };

  const near = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        near.unobserve(target);
        create(target as HTMLElement);
      });
    },
    { rootMargin: LOAD_MARGIN }
  );
  const visible = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) onScreen.add(target);
      else onScreen.delete(target);
      sync(target);
    });
  });

  targets.forEach((el) => {
    near.observe(el);
    visible.observe(el);
  });
  log('armed', { lotties: targets.length });
};
