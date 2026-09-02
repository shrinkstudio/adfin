import { attributeSelector } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { debounce } from '$utils/debounce';
import { on } from '$utils/events';
import { onFinsweetAttribute } from '$utils/finsweet';
import { createLogger } from '$utils/log';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';
import { isStacked } from '$utils/responsive';
import { getStyleValue } from '$utils/style';

/** Finsweet builds this markup — we only add the active-on-scroll behaviour. */
const TOC_COMPONENT = '.toc_component';
const TOC_LINK = '[fs-toc-element="link"]';
const ACTIVE_CLASS = 'is-active';

/**
 * The hand-authored variant: same component, but links are added manually and
 * Finsweet isn't in play — so it inits immediately and owns its own click scroll.
 */
const MANUAL_VARIANT = '[data-wf--table-of-contents--variant="manual"]';
/** Auto TOCs are everything Finsweet builds — i.e. not the manual variant. */
const AUTO_TOC_COMPONENT = `${TOC_COMPONENT}:not(${MANUAL_VARIANT})`;

/** Opacity ramp: the active link is fully opaque, the furthest is faded. */
const ACTIVE_OPACITY = 1;
const FURTHEST_OPACITY = 0.2;

/** Set per link so only the text consumes the fade, not the whole link box. */
const OPACITY_VAR = '--toc-opacity';

/**
 * The gradient rail (desktop only — hidden on mobile in CSS). The wrap slides to
 * the active item; each border scales from the item height across the link count.
 */
const HEIGHT_VAR = '--toc-active-height';
const OFFSET_VAR = '--toc-border-offset';
const LENGTH_VAR = '--toc-links-length';

/** Absorbs sub-pixel rounding between a click's resting scroll and our measure. */
const REACH_TOLERANCE = 2;

const log = createLogger('toc');

/** Elements already wired, so the manual and Finsweet paths never double-init one. */
const initialised = new WeakSet<HTMLElement>();

interface TocItem {
  link: HTMLAnchorElement;
  item: HTMLElement;
  section: HTMLElement;
}

/**
 * Highlights the TOC link for whichever section currently sits at its resting
 * scroll line (scroll-padding-top + the section's scroll-margin-top) — i.e. the
 * exact spot a click scrolls it to, so tapping a link highlights it immediately.
 * Works on both the desktop sidebar and the stacked mobile tab bar.
 */
const createToc = (component: HTMLElement): Destroyable => {
  // Guard against double-init — the manual and Finsweet paths could both reach
  // the same element depending on how the variant attribute is placed.
  if (initialised.has(component)) return { destroy: () => undefined };
  initialised.add(component);

  const cleanup = createCleanup();
  const manual = component.matches(MANUAL_VARIANT);

  // Pair each link with the section its href points at, dropping any dead links.
  const items = queryElements<HTMLAnchorElement>(TOC_LINK, component)
    .map((link): TocItem | null => {
      const section = link.hash ? document.getElementById(link.hash.slice(1)) : null;
      const item = link.closest<HTMLElement>('.toc_item') ?? link;
      return section ? { link, item, section } : null;
    })
    .filter((item): item is TocItem => item !== null);

  log(
    `paired ${items.length} link(s):`,
    items.map((item) => `${item.link.hash} -> #${item.section.id}`)
  );

  if (!items.length) {
    log('no links resolved to sections — nothing to track');
    return { destroy: () => cleanup.run() };
  }

  // Scrollable container of the links (horizontal tab strip on mobile).
  const linksList = queryElement<HTMLElement>(attributeSelector('toc', 'links'), component);

  let activeIndex = -1;
  let stacked = false;
  // Viewport Y where each section rests when navigated to. Recomputed on resize
  // (nav height, section spacing and the breakpoint can all change).
  let thresholds: number[] = [];

  // The rail's gradient falloff is derived from the link count in CSS; set once.
  component.style.setProperty(LENGTH_VAR, `${items.length}`);

  const step = items.length > 1 ? (ACTIVE_OPACITY - FURTHEST_OPACITY) / (items.length - 1) : 0;

  const measure = (): void => {
    const padding = parseFloat(getStyleValue(document.documentElement, 'scroll-padding-top')) || 0;
    thresholds = items.map(({ section }) => {
      const margin = parseFloat(getStyleValue(section, 'scroll-margin-top')) || 0;
      return padding + margin;
    });
    stacked = isStacked(component);
  };

  const applyOpacities = (index: number): void => {
    items.forEach(({ link }, i) => {
      const opacity = ACTIVE_OPACITY - Math.abs(i - index) * step;
      link.style.setProperty(OPACITY_VAR, `${Number(opacity.toFixed(3))}`);
    });
  };

  // Slides the rail to the active item: its height is the unit the borders scale
  // from, its top offset is how far to translate the wrap. Cached so we only
  // touch the DOM when the geometry moves (active change or reflow), not per frame.
  let borderKey = '';
  const applyBorder = (index: number): void => {
    const item = items[index]?.item;
    if (!item) return;

    const offset = item.offsetTop;
    const height = item.offsetHeight;
    const key = `${offset}/${height}`;
    if (key === borderKey) return;

    borderKey = key;
    component.style.setProperty(OFFSET_VAR, `${offset}px`);
    component.style.setProperty(HEIGHT_VAR, `${height}px`);
  };

  // Brings the active link into view in the horizontal strip: aligned to the
  // left, or to the end for the last item. No-op when there's no overflow.
  const scrollLinkIntoView = (index: number): void => {
    if (!linksList) return;

    const link = items[index]?.link;
    if (!link) return;

    const listRect = linksList.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const offsetLeft = linkRect.left - listRect.left + linksList.scrollLeft;

    const isLast = index === items.length - 1;
    const left = isLast ? offsetLeft + linkRect.width - linksList.clientWidth : offsetLeft;

    log(`scrolling link [${index}] into view in the strip (left=${Math.round(left)})`);
    linksList.scrollTo({ left, behavior: 'smooth' });
  };

  // Scrolls the target section to its resting line. scrollIntoView honours the
  // section's scroll-margin-top, so it lands exactly where active-tracking expects.
  const scrollSectionIntoView = (index: number): void => {
    const section = items[index]?.section;
    if (!section) return;

    log(`scrolling section #${section.id} into view`);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setActive = (index: number): void => {
    if (index === activeIndex) return;

    items[activeIndex]?.link.classList.remove(ACTIVE_CLASS);
    items[activeIndex]?.link.removeAttribute('aria-current');

    activeIndex = index;

    const current = items[index]?.link;
    current?.classList.add(ACTIVE_CLASS);
    current?.setAttribute('aria-current', 'true');

    applyOpacities(index);
    if (stacked) scrollLinkIntoView(index);

    log(`active -> [${index}] ${current?.textContent?.trim() ?? '?'}`);
  };

  const update = (): void => {
    // Active = the last section whose top has passed its resting line. While in
    // the gap after a section, the next section's top hasn't reached its own
    // line yet, so the previous section stays active.
    let next = 0;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].section.getBoundingClientRect().top <= thresholds[i] + REACH_TOLERANCE) {
        next = i;
      } else {
        break;
      }
    }

    setActive(next);
    // Keep the rail aligned even when the active link is unchanged (e.g. reflow
    // on resize shifts the link positions). Cached internally, so this is cheap.
    applyBorder(next);
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

  // Re-measure layout-derived values (scroll padding/margins, breakpoint) after
  // a resize, then re-evaluate. Debounced — these read computed styles.
  const refresh = debounce((): void => {
    measure();
    update();
  }, 150);

  // Log clicks on a TOC link. For auto TOCs the page scroll is the browser's
  // native anchor jump; the manual variant isn't wired to that, so we take the
  // click over (and stop Webflow's smooth-scroll handler) and scroll ourselves.
  const handleClick = (event: MouseEvent): void => {
    const target = event.target as Element | null;
    const link = target?.closest<HTMLAnchorElement>(TOC_LINK);
    if (!link || !component.contains(link)) return;

    const index = items.findIndex((item) => item.link === link);
    log(
      `link clicked -> [${index}] ${link.textContent?.trim() ?? '?'} (${link.hash || 'no hash'})`
    );

    if (manual && index >= 0) {
      event.preventDefault();
      event.stopPropagation();
      scrollSectionIntoView(index);
    }
  };

  cleanup.add(on<MouseEvent>(component, 'click', handleClick));
  cleanup.add(on(window, 'scroll', requestUpdate, { passive: true }));
  cleanup.add(on(window, 'resize', refresh));
  cleanup.add(() => frame && cancelAnimationFrame(frame));
  cleanup.add(() => refresh.cancel());

  measure();
  log(
    `thresholds=[${thresholds.map((t) => t.toFixed(0)).join(', ')}] stacked=${stacked} manual=${manual}`
  );
  update();

  return {
    destroy: () => {
      cleanup.run();
      items.forEach(({ link }) => {
        link.classList.remove(ACTIVE_CLASS);
        link.removeAttribute('aria-current');
        link.style.removeProperty(OPACITY_VAR);
      });
      component.style.removeProperty(LENGTH_VAR);
      component.style.removeProperty(HEIGHT_VAR);
      component.style.removeProperty(OFFSET_VAR);
    },
  };
};

/**
 * Waits for the Finsweet TOC solution to build the markup, then initialises
 * every TOC on the page (one instance each).
 */
export const toc = (): void => {
  // Manual TOCs are hand-authored, already in the DOM, and don't depend on
  // Finsweet (which may not even be present) — initialise them immediately.
  const manual = createInstances(MANUAL_VARIANT, createToc);
  log(`found ${manual.length} manual TOC(s)`);

  // Auto TOCs get their links injected by Finsweet; wait for it, then init the
  // rest. The WeakSet guard keeps this from re-initialising anything above.
  log('waiting for finsweet toc…');
  onFinsweetAttribute('toc', () => {
    const found = queryElements(AUTO_TOC_COMPONENT);
    log(`finsweet toc ready: found ${found.length} auto TOC(s)`);
    createInstances(AUTO_TOC_COMPONENT, createToc);
  });
};
