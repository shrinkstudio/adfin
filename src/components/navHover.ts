import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const log = createLogger('navHover');

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    gsap?: any;
  }
}

const LIST = '.nav_links_list';
const ITEM = '.nav_links_item';
const LINK = '.nav_links_link';
const PILL_CLASS = 'nav_hover_pill';

/**
 * Travelling hover highlight for the desktop nav. A single pill element is
 * created at runtime inside the links list and slides between the top-level
 * items (dropdown toggles and plain links alike) as the pointer moves, fading
 * out when the pointer leaves the list. Visual styling lives on the
 * `nav_hover_pill` class in the site's global CSS embed; this module only
 * handles the mechanics. Needs the page's global GSAP and a hover-capable
 * pointer, and quietly does nothing without them.
 */
export const navHover = (): void => {
  const { gsap } = window;
  const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!gsap || !hoverable) return;

  const lists = document.querySelectorAll<HTMLElement>(LIST);

  lists.forEach((list) => {
    const items = [...list.querySelectorAll<HTMLElement>(ITEM)];
    if (!items.length) return;

    const pill = document.createElement('div');
    pill.className = PILL_CLASS;
    pill.setAttribute('aria-hidden', 'true');
    list.prepend(pill);

    // The list must NOT be given position: relative — it has overflow: auto,
    // and becoming the containing block clips the nav's absolutely positioned
    // mega dropdown panels into it (took the nav down on 2026-10-21). The pill
    // is measured against whatever positioned ancestor it naturally lands in.
    gsap.set(pill, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      opacity: 0,
      scale: 0.8,
      pointerEvents: 'none',
      // Above the list background, below the links (they sit at z-index 2).
      // Needs the links transparent at rest or they paint over the pill.
      zIndex: 1,
    });

    // Tracks whether the pointer is travelling between items (slide) or
    // arriving fresh (jump into place, then fade in).
    let hoverBetween = false;

    const fade = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        hoverBetween = false;
      },
    });
    fade.to(pill, { scale: 1, opacity: 1, duration: 0.2 });

    const slideTo = (item: HTMLElement) => {
      const target = item.querySelector<HTMLElement>(LINK) || item;
      const anchor = (pill.offsetParent as HTMLElement | null) || list;
      const box = target.getBoundingClientRect();
      const root = anchor.getBoundingClientRect();
      const to = {
        x: box.left - root.left - anchor.clientLeft,
        y: box.top - root.top - anchor.clientTop,
        width: box.width,
        height: box.height,
      };
      if (hoverBetween) gsap.to(pill, { ...to, duration: 0.3, ease: 'power1.inOut' });
      else gsap.set(pill, to);
    };

    items.forEach((item) => {
      on(item, 'mouseenter', () => {
        slideTo(item);
        hoverBetween = true;
        fade.play();
      });
    });

    on(list, 'mouseleave', () => fade.reverse());
  });

  log('armed', { lists: lists.length });
};
