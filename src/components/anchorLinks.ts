import { attributeSelector, getBooleanAttribute } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { debounce } from '$utils/debounce';
import { on } from '$utils/events';
import { createLogger } from '$utils/log';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

/** The wrapper Webflow renders; individual in-page links live inside it. */
const ANCHOR_LINKS = attributeSelector('component', 'anchor-links');
const ANCHOR_LINK = attributeSelector('component', 'anchor-link');
/** The single moving border element that slides to the active link. */
const ANCHOR_BORDER = attributeSelector('component', 'anchor-border');

/** Opt-in on the wrapper: strip the #hash from the URL after a click. */
const HIDE_HASH_ATTRIBUTE = 'anchor-links-hide-hash';

const ACTIVE_CLASS = 'is-active';
/** On the wrapper while the strip scrolls — CSS uses it to kill the border transition. */
const SCROLLING_CLASS = 'is-scrolling';

/** The moving border's geometry, both relative to the wrapper's left edge. */
const BORDER_WIDTH_VAR = '--anchor-border-width';
const BORDER_X_VAR = '--anchor-border-x';

const log = createLogger('anchor-links');

interface AnchorItem {
  link: HTMLAnchorElement;
  section: HTMLElement;
}

/**
 * Walks up from a link to find the scrollable strip (the list with
 * `overflow: auto`) between it and the wrapper, so we can keep the border
 * aligned as the strip scrolls. Returns null when nothing scrolls.
 */
const getScrollContainer = (link: HTMLElement, boundary: HTMLElement): HTMLElement | null => {
  let node = link.parentElement;
  while (node) {
    const { overflowX } = getComputedStyle(node);
    if (overflowX === 'auto' || overflowX === 'scroll') return node;
    if (node === boundary) break;
    node = node.parentElement;
  }
  return null;
};

/**
 * Stops Webflow's JS smooth-scroll from hijacking in-page anchor clicks (so
 * scroll-margin-top / scroll-padding-top / scroll-behavior are respected),
 * tracks which section is in view to highlight the matching link, and drives a
 * moving border that slides to the active link.
 *
 * The active link is the last section whose top has passed the bottom edge of
 * the links component — so the first link stays active until the second
 * section's top scrolls up past the component, and so on.
 */
const createAnchorLinks = (wrapper: HTMLElement): Destroyable => {
  const cleanup = createCleanup();

  // Enable smooth scrolling for native anchor jumps (what Webflow otherwise does in JS).
  document.documentElement.style.scrollBehavior = 'smooth';

  const hideHash = getBooleanAttribute(wrapper, HIDE_HASH_ATTRIBUTE);

  // Pair each link with the section its href points at, dropping any dead links.
  const items = queryElements<HTMLAnchorElement>(ANCHOR_LINK, wrapper)
    .map((link): AnchorItem | null => {
      const section = link.hash ? document.getElementById(link.hash.slice(1)) : null;
      return section ? { link, section } : null;
    })
    .filter((item): item is AnchorItem => item !== null);

  log(
    `init: hideHash=${hideHash}, paired ${items.length} link(s):`,
    items.map((item) => `${item.link.hash} -> #${item.section.id}`)
  );

  const handleClick = (event: MouseEvent): void => {
    const target = event.target as Element | null;
    const link = target?.closest<HTMLAnchorElement>(ANCHOR_LINK);
    if (!link || !wrapper.contains(link)) return;

    // Stop Webflow's document-level handler from running its broken scroll.
    event.stopPropagation();

    // If the link's hash doesn't resolve to a section on the page, don't scroll anywhere.
    const section = link.hash ? document.getElementById(link.hash.slice(1)) : null;
    if (!section) {
      event.preventDefault();
      log(`no section for ${link.hash || '(no hash)'} — staying put`);
      return;
    }

    if (!hideHash) return;

    // Defer so native navigation resolves the hash first, then wipe it from the URL.
    window.setTimeout(() => {
      const { origin, pathname, search } = window.location;
      history.replaceState('', document.title, origin + pathname + search);
    });
  };

  cleanup.add(on<MouseEvent>(wrapper, 'click', handleClick));

  const scrollContainer = getScrollContainer(items[0]?.link ?? wrapper, wrapper);
  const border = queryElement<HTMLElement>(ANCHOR_BORDER, wrapper);

  // Aligns the border to the active link: width matches, x is the link's left
  // relative to the wrapper. getBoundingClientRect already reflects the strip's
  // scroll, so this stays correct however far the strip is scrolled.
  const positionBorder = (): void => {
    const link = items[activeIndex]?.link;
    if (!border || !link) return;

    const wrapperLeft = wrapper.getBoundingClientRect().left;
    const rect = link.getBoundingClientRect();
    border.style.setProperty(BORDER_WIDTH_VAR, `${rect.width}px`);
    border.style.setProperty(BORDER_X_VAR, `${rect.left - wrapperLeft}px`);
  };

  // Coalesce reposition requests (strip scroll / resize) into one per frame.
  let borderFrame = 0;
  const requestBorder = (): void => {
    if (borderFrame) return;
    borderFrame = requestAnimationFrame(() => {
      borderFrame = 0;
      positionBorder();
    });
  };

  // Restore the transition once the strip settles, so the next active change slides.
  const endScrolling = debounce(() => border?.classList.remove(SCROLLING_CLASS), 100);

  // While the strip scrolls the border must track instantly, or it lags the finger.
  const handleStripScroll = (): void => {
    border?.classList.add(SCROLLING_CLASS);
    requestBorder();
    endScrolling();
  };

  let activeIndex = -1;

  const setActive = (index: number): void => {
    if (index === activeIndex) return;

    items[activeIndex]?.link.classList.remove(ACTIVE_CLASS);
    items[activeIndex]?.link.removeAttribute('aria-current');

    activeIndex = index;

    const current = items[index]?.link;
    current?.classList.add(ACTIVE_CLASS);
    current?.setAttribute('aria-current', 'true');

    // Active changed via page scroll — let the border slide (transition on).
    requestBorder();

    log(`active -> [${index}] ${current?.textContent?.trim() ?? '?'}`);
  };

  const update = (): void => {
    // Threshold is the component's own bottom edge (read live — it moves while
    // sticky settles and on resize). Active = the last section whose top has
    // crossed it; the first link stays active until section 1's top passes.
    const threshold = wrapper.getBoundingClientRect().bottom;

    let next = 0;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].section.getBoundingClientRect().top <= threshold) {
        next = i;
      } else {
        break;
      }
    }

    setActive(next);
  };

  // Coalesce scroll bursts into one measurement per frame.
  let frame = 0;
  const requestUpdate = (): void => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  };

  // Resize can shift link widths/positions — reposition instantly (no slide).
  const handleResize = (): void => {
    requestUpdate();
    handleStripScroll();
  };

  if (items.length) {
    cleanup.add(on(window, 'scroll', requestUpdate, { passive: true }));
    cleanup.add(on(window, 'resize', handleResize));
    if (scrollContainer)
      cleanup.add(on(scrollContainer, 'scroll', handleStripScroll, { passive: true }));
    cleanup.add(() => frame && cancelAnimationFrame(frame));
    cleanup.add(() => borderFrame && cancelAnimationFrame(borderFrame));
    cleanup.add(() => endScrolling.cancel());

    // Place the border on the first link without an opening slide from x=0.
    border?.classList.add(SCROLLING_CLASS);
    update();
    endScrolling();
  }

  return {
    destroy: () => {
      cleanup.run();
      border?.classList.remove(SCROLLING_CLASS);
      border?.style.removeProperty(BORDER_WIDTH_VAR);
      border?.style.removeProperty(BORDER_X_VAR);
      items.forEach(({ link }) => {
        link.classList.remove(ACTIVE_CLASS);
        link.removeAttribute('aria-current');
      });
    },
  };
};

/**
 * Initialises every anchor-links wrapper on the page (one instance each).
 */
export const anchorLinks = (): void => {
  const instances = createInstances(ANCHOR_LINKS, createAnchorLinks);
  log(`found ${instances.length} "${ANCHOR_LINKS}" on page`);
};
