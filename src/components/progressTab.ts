import { attributeSelector, getAttribute, getNumberAttribute } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { on } from '$utils/events';
import { createLogger } from '$utils/log';
import { queryElements } from '$utils/queryElements';

const PROGRESS_TAB = attributeSelector('component', 'progress-tab');
const PROGRESS_TAB_ITEM = attributeSelector('progress-tab', 'item');

/** How long a single item takes to play through, in seconds (override per component). */
const DEFAULT_ITEM_SECONDS = 5;
/** Duration of the eased retarget when a user hovers a different item. */
const SEEK_MS = 350;
/** Each item after the active one drops to this fraction of the one before. */
const OPACITY_FALLOFF = 0.5;
/** Fraction of the component that must be visible before it starts playing. */
const VISIBLE_THRESHOLD = 0.2;

const PROGRESS_VAR = '--progress';
const OPACITY_VAR = '--opacity';

const log = createLogger('progress-tab');

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** GSAP `power2.inOut` — quadratic ease-in-out, for the hover retarget only. */
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/**
 * A vertical stack of tabs that play through in turn. The whole thing is driven
 * by one continuous `playhead` in [0, count]:
 *
 *   --progress of item i = clamp(playhead − i, 0, 1)
 *
 * so the item at floor(playhead) is the one currently filling. Auto-play walks
 * the playhead forward at a fixed rate (no easing); hovering an item retargets
 * the playhead to it with power2.inOut easing, filling any items in between on
 * the way. Opacity is a separate, stepped signal — it only changes when a new
 * item becomes active — and CSS owns its transition.
 */
const createProgressTab = (component: HTMLElement): Destroyable => {
  const cleanup = createCleanup();

  const items = queryElements<HTMLElement>(PROGRESS_TAB_ITEM, component);
  const count = items.length;

  log(`init: ${count} item(s)`);

  if (!count) return { destroy: () => cleanup.run() };

  // getNumberAttribute reads an absent attribute as 0, so fall back on anything <= 0.
  const seconds = getNumberAttribute(component, 'duration', DEFAULT_ITEM_SECONDS);
  const itemMs = (seconds > 0 ? seconds : DEFAULT_ITEM_SECONDS) * 1000;
  // Webflow writes booleans capitalised ("True"/"False"); default to looping.
  const loop = getAttribute(component, 'loop', 'True').toLowerCase() !== 'false';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let playhead = 0;
  let activeIndex = 0; // item the opacity cascade centres on (decoupled from progress)
  let lastActive = -1;
  let visible = false; // on-screen, per the IntersectionObserver
  let interacting = false; // pointer/focus is on an item — auto-play is paused

  // Hover retarget: an eased tween of the playhead that briefly overrides auto-play.
  let seeking = false;
  let seekFrom = 0;
  let seekTo = 0;
  let seekElapsed = 0;

  const paintProgress = (): void => {
    for (let i = 0; i < count; i += 1) {
      items[i].style.setProperty(PROGRESS_VAR, `${clamp(playhead - i, 0, 1)}`);
    }
  };

  // Stepped opacity: recomputed only when the active item changes. The active
  // item and everything before it stay full; each item after halves in turn.
  const paintOpacity = (): void => {
    if (activeIndex === lastActive) return;
    lastActive = activeIndex;

    for (let i = 0; i < count; i += 1) {
      const step = i - activeIndex;
      const opacity = step <= 0 ? 1 : Math.pow(OPACITY_FALLOFF, step);
      items[i].style.setProperty(OPACITY_VAR, `${opacity}`);
    }
    log(`active -> [${activeIndex}]`);
  };

  let raf = 0;
  let last = 0;

  const frame = (now: number): void => {
    const dt = last ? now - last : 0;
    last = now;

    if (seeking) {
      seekElapsed += dt;
      const t = clamp(seekElapsed / SEEK_MS, 0, 1);
      playhead = seekFrom + (seekTo - seekFrom) * easeInOutQuad(t);
      if (t >= 1) {
        seeking = false;
        playhead = seekTo;
      }
    } else if (interacting) {
      // Paused on the hovered/focused item. The target is already painted, so
      // idle the loop entirely until resume() restarts it.
      stop();
      return;
    } else {
      playhead += dt / itemMs;
      if (playhead >= count) {
        if (loop) {
          playhead -= count; // wrap back to the first item
        } else {
          playhead = count; // settle fully filled on the last item and stop
          activeIndex = count - 1;
          paintProgress();
          paintOpacity();
          stop();
          return;
        }
      }
      // During auto-play the active item is simply the one currently filling.
      activeIndex = Math.min(count - 1, Math.floor(playhead));
    }

    paintProgress();
    paintOpacity();
    raf = requestAnimationFrame(frame);
  };

  const start = (): void => {
    if (raf || reduceMotion || !visible) return;
    last = 0; // freeze-safe: don't count time spent paused/off-screen
    raf = requestAnimationFrame(frame);
  };

  const stop = (): void => {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const seek = (target: number): void => {
    if (reduceMotion) {
      // Reduced motion: jump straight there, no tween, no auto-play.
      seeking = false;
      playhead = target;
      paintProgress();
      paintOpacity();
      return;
    }
    seekFrom = playhead;
    seekTo = target;
    seekElapsed = 0;
    seeking = true;
    start(); // make sure the loop is live to animate the seek
  };

  // Leaving the component clears the pause and picks auto-play back up where it rested.
  const resume = (): void => {
    interacting = false;
    start();
  };

  // pointerenter/focusin don't bubble, so bind per item rather than delegate.
  // Any hover/focus pauses auto-play; what happens next depends on which item:
  items.forEach((item, index) => {
    const enter = (): void => {
      interacting = true;
      // The item that's currently playing just freezes where it is.
      if (index === activeIndex) return;
      // A different item plays through to its end (filling any in between), then
      // holds there until the pointer moves to another item or leaves.
      activeIndex = index;
      seek(index + 1);
    };
    cleanup.add(on(item, 'pointerenter', enter));
    cleanup.add(on(item, 'focusin', enter));
  });

  // pointerleave (non-bubbling) and focusout fire on the root only once the
  // pointer/focus has left the component as a whole — the cue to resume.
  cleanup.add(on(component, 'pointerleave', resume));
  cleanup.add(on(component, 'focusout', resume));

  // Play only while on screen; freeze (and resume where it left off) otherwise.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      }
    },
    { threshold: VISIBLE_THRESHOLD }
  );
  observer.observe(component);
  cleanup.add(() => observer.disconnect());
  cleanup.add(stop);

  // Resting state before it scrolls into view (and the final state under reduced motion).
  paintProgress();
  paintOpacity();

  return {
    destroy: () => {
      cleanup.run();
      items.forEach((item) => {
        item.style.removeProperty(PROGRESS_VAR);
        item.style.removeProperty(OPACITY_VAR);
      });
    },
  };
};

/**
 * Initialises every progress-tab on the page (one instance each).
 */
export const progressTab = (): void => {
  const instances = createInstances(PROGRESS_TAB, createProgressTab);
  log(`found ${instances.length} "${PROGRESS_TAB}" on page`);
};
