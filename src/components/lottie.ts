import { createLogger } from '$utils/log';

const log = createLogger('lottie');

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    lottie?: any;
    fflate?: any;
  }
}

const SOURCE = '[data-lottie]';
const PLAYER_URL =
  'https://cdn.jsdelivr.net/npm/lottie-web@5.13.0/build/player/lottie_light.min.js';
const UNZIP_URL = 'https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js';
/* fetch players this far before they scroll into view */
const LOAD_MARGIN = '50% 0px';

const scripts = new Map<string, Promise<void>>();

/* third-party scripts load once, and only when a page has a Lottie */
const loadScript = (src: string): Promise<void> => {
  let pending = scripts.get(src);
  if (!pending) {
    pending = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`${src} failed to load`));
      document.head.appendChild(script);
    });
    scripts.set(src, pending);
  }
  return pending;
};

const toBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
};

/**
 * A .lottie file is a zip: manifest.json, animations/<id>.json and any
 * images/. Unpack the first animation and inline its images, so lottie-web
 * can play it like a plain .json.
 */
const readDotLottie = async (url: string): Promise<any> => {
  await loadScript(UNZIP_URL);
  const { unzipSync, strFromU8 } = window.fflate;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const files = unzipSync(new Uint8Array(await res.arrayBuffer()));
  const manifest = JSON.parse(strFromU8(files['manifest.json']));
  const id = manifest.animations?.[0]?.id;
  const data = JSON.parse(strFromU8(files[`animations/${id}.json`]));
  for (const asset of data.assets || []) {
    const file = asset.p && files[`images/${asset.p}`];
    if (!file) continue;
    const ext = asset.p.split('.').pop()?.toLowerCase();
    const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    asset.u = '';
    asset.p = `data:${mime};base64,${toBase64(file)}`;
    asset.e = 1;
  }
  return data;
};

const isDotLottie = (src: string): boolean => /\.lottie$/i.test(src.split(/[?#]/)[0]);

interface LottieAnim {
  play(): void;
  pause(): void;
  goToAndStop(value: number, isFrame?: boolean): void;
  addEventListener(name: string, cb: () => void): void;
}

/**
 * Lottie animations from plain Webflow markup. Each `[data-lottie]` element
 * carries a .json or .lottie URL in `data-lottie-src` (empty = skipped, so a card can
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
    const src = (el.getAttribute('data-lottie-src') || '').trim();
    Promise.all([
      loadScript(PLAYER_URL),
      isDotLottie(src) ? readDotLottie(src) : Promise.resolve(null),
    ])
      .then(([, animationData]) => {
        const anim: LottieAnim = window.lottie.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: el.getAttribute('data-lottie-loop') !== 'false',
          autoplay: false,
          ...(animationData ? { animationData } : { path: src }),
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
