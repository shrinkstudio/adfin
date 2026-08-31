import { attributeSelector } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { debounce } from '$utils/debounce';
import { on } from '$utils/events';
import { createLogger } from '$utils/log';
import { watchMedia } from '$utils/mediaQuery';

const WRAP = attributeSelector('transition');

/** Fraction of the viewport the scrub plays out over, beyond the band's own height. */
const DEFAULT_RANGE = 0.5;
/** How much of the scrub a single block spends fading (the rest is stagger). */
const BLOCK_FADE = 0.12;
/** Priority weights, matching the Osmo pixelated-scroll feel: rows resolve
 * bottom-to-top, with enough noise that the wave never reads as a straight line. */
const ROW_WEIGHT = 50;
const NOISE_WEIGHT = 300;
const WAVE_WEIGHT = 30;

const log = createLogger('transition');

interface Block {
  element: HTMLElement;
  /** 0 → 1 point in the scrub where this block flips. */
  threshold: number;
}

/**
 * Scroll-scrubbed stagger for the framed-section transition bands.
 *
 * The markup is Greg's: `.frame_transition_wrap[data-transition]` holding a
 * custom grid of `.frame_transition_block` divs, shown by the section's
 * Leading/Trailing props. This component only animates what is already there —
 * it never builds or recolours blocks, so the static checker remains the
 * no-JS and reduced-motion fallback.
 *
 * `data-transition="trailing"` (bottom edge) plays cover: blocks start clear
 * and fill in bottom-up as the band approaches, handing the eye to the next
 * section's palette. `data-transition="leading"` (top edge) plays reveal:
 * blocks start solid and dissolve bottom-up as the band scrolls in.
 *
 * Tuning attributes on the wrap, all optional:
 * - `data-transition-range`  viewport fraction the scrub spans (default 0.5)
 */
const createTransition = (wrap: HTMLElement): Destroyable | null => {
  // The outer `.frame_outer.is-transition` carries the same attribute as the
  // wrap; only the element that directly holds the blocks should instantiate.
  if (wrap.querySelector(WRAP)) return null;

  const blockElements = [...wrap.children].filter(
    (child): child is HTMLElement => child instanceof HTMLElement
  );
  if (!blockElements.length) return null;

  const mode = wrap.getAttribute('data-transition') === 'leading' ? 'reveal' : 'cover';
  // Not getNumberAttribute: that helper coerces an ABSENT attribute to 0
  // (Number(null) === 0), which would collapse the scrub window entirely.
  const rangeRaw = Number(wrap.getAttribute('data-transition-range') ?? NaN);
  const range = Number.isFinite(rangeRaw) && rangeRaw > 0 ? rangeRaw : DEFAULT_RANGE;

  const cleanup = createCleanup();
  let blocks: Block[] = [];
  let frame = 0;
  let lastProgress = -1;

  const measure = () => {
    const wrapRect = wrap.getBoundingClientRect();
    const rects = blockElements.map((element) => element.getBoundingClientRect());
    const rowHeight = Math.max(1, Math.min(...rects.map((r) => r.height)));
    const colWidth = Math.max(1, Math.min(...rects.map((r) => r.width)));
    const maxTop = Math.max(...rects.map((r) => r.top));

    const prioritised = blockElements.map((element, i) => {
      const rect = rects[i];
      const row = Math.round((maxTop - rect.top) / rowHeight);
      const col = Math.round((rect.left - wrapRect.left) / colWidth);
      const priority =
        row * ROW_WEIGHT + Math.random() * NOISE_WEIGHT + Math.sin(col * 0.3) * WAVE_WEIGHT;
      return { element, priority };
    });

    prioritised.sort((a, b) => a.priority - b.priority);
    const span = Math.max(1, prioritised.length - 1);
    blocks = prioritised.map(({ element }, rank) => ({
      element,
      threshold: (rank / span) * (1 - BLOCK_FADE),
    }));
  };

  const progress = () => {
    const rect = wrap.getBoundingClientRect();
    const viewport = window.innerHeight;
    const travelled = viewport - rect.top;
    const total = viewport * range + rect.height;
    return Math.min(1, Math.max(0, travelled / total));
  };

  const render = () => {
    frame = 0;
    const p = progress();
    if (p === lastProgress) return;
    lastProgress = p;

    for (const { element, threshold } of blocks) {
      const local = Math.min(1, Math.max(0, (p - threshold) / BLOCK_FADE));
      const opacity = mode === 'cover' ? local : 1 - local;
      element.style.opacity = String(opacity);
      element.style.visibility = opacity === 0 ? 'hidden' : '';
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const start = () => {
    measure();
    lastProgress = -1;
    schedule();
    cleanup.add(on(window, 'scroll', schedule, { passive: true }));
    cleanup.add(
      on(
        window,
        'resize',
        debounce(() => {
          measure();
          lastProgress = -1;
          schedule();
        }, 150)
      )
    );
  };

  const stop = () => {
    cleanup.run();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    for (const element of blockElements) {
      element.style.opacity = '';
      element.style.visibility = '';
    }
  };

  // Reduced motion keeps Greg's static checker exactly as designed.
  const stopWatching = watchMedia('(prefers-reduced-motion: reduce)', (reduced) => {
    stop();
    if (!reduced) start();
  });

  log('init', { mode, blocks: blockElements.length });

  return {
    destroy: () => {
      stopWatching();
      stop();
    },
  };
};

export const transition = (): void => {
  const instances = createInstances(WRAP, createTransition).filter(
    (instance): instance is Destroyable => instance !== null
  );
  log('instances', instances.length);
};
