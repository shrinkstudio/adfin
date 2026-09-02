import { attributeSelector, getNumberAttribute } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { createLogger } from '$utils/log';
import { queryElements } from '$utils/queryElements';

const CUSTOMER_LOGOS = attributeSelector('component', 'customer-logos');
const CUSTOMER_LOGOS_ITEM = attributeSelector('customer-logos', 'item');
/**
 * The 1-based `nth-child(n + X)` index the CSS hides from, so the number of
 * logos actually shown is this value minus one.
 */
const SHOW_ATTRIBUTE = 'customer-logos-show';

/** How long each set of logos stays before a swap. */
const CYCLE_MS = 5000;
/** Cross-fade duration when swapping a logo out for another. */
const FADE_MS = 400;
/** Delay added per item so a multi-logo swap ripples rather than moving as one. */
const STAGGER_MS = 100;

const log = createLogger('customer-logos');

const randomIndex = (length: number): number => Math.floor(Math.random() * length);

/** Fisher–Yates shuffle of a copy — leaves the source array untouched. */
const shuffled = <T>(items: T[]): T[] => {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Exchanges two elements' positions in the DOM, leaving every other node put. */
const swapPositions = (a: Element, b: Element): void => {
  const marker = document.createComment('');
  a.replaceWith(marker);
  b.replaceWith(a);
  marker.replaceWith(b);
};

/**
 * Cycles a set of customer logos: every 5s it swaps visible logos for random
 * ones that aren't currently on show. `data-customer-logos-show` sets how many
 * are visible at once.
 *
 * How much changes per tick depends on how many spare logos there are:
 *  - total ≤ show          → nothing to cycle, leave them all showing.
 *  - show < total < 2×show → too few spares to refresh the whole row, so swap
 *                            one slot at a time.
 *  - total ≥ 2×show        → refresh every slot with a fresh, non-overlapping set.
 *
 * A swap exchanges the outgoing and incoming elements' DOM positions, so the new
 * logo drops into the exact slot the old one left — only the intended slots move.
 */
const createCustomerLogos = (component: HTMLElement): Destroyable => {
  const cleanup = createCleanup();

  const items = queryElements<HTMLElement>(CUSTOMER_LOGOS_ITEM, component);
  const total = items.length;

  // The attribute is the CSS hide index (nth-child(n + X)), so shown = X − 1.
  // Absent/invalid → treat as "show everything" (which then cycles nothing).
  let show = Math.floor(getNumberAttribute(component, SHOW_ATTRIBUTE, 0)) - 1;
  if (!(show >= 1)) show = total;

  log(`init: ${total} logo(s), show ${show}`);

  if (total <= show) {
    log('nothing to cycle');
    return { destroy: () => cleanup.run() };
  }

  // Benched logos sit out of the layout (display:none) and transparent.
  const bench = (el: HTMLElement): void => {
    el.style.display = 'none';
    el.style.opacity = '0';
  };

  items.forEach((el) => {
    el.style.transition = `opacity ${FADE_MS}ms ease`;
  });

  // Start with the first `show` items visible and the rest benched.
  let visible = items.slice(0, show);
  let hidden = items.slice(show);
  visible.forEach((el) => {
    el.style.opacity = '1';
  });
  hidden.forEach(bench);

  // The incoming logo is positioned absolutely over the outgoing one's slot, so
  // those coordinates need a positioned ancestor to resolve against.
  const parent = items[0].parentElement ?? component;
  const parentWasStatic = getComputedStyle(parent).position === 'static';
  if (parentWasStatic) parent.style.position = 'relative';

  const pending = new Set<number>();
  const schedule = (delay: number, run: () => void): void => {
    const id = window.setTimeout(() => {
      pending.delete(id);
      run();
    }, delay);
    pending.add(id);
  };

  // Cross-fade: drop the incoming logo in on top of the outgoing one — absolutely
  // positioned over its slot — and fade it up while the outgoing fades away. Once
  // faded, settle the incoming into the slot (back into flow) and bench the
  // outgoing. Measuring the slot live means each fade starts from wherever the
  // row currently sits, even mid-ripple.
  const crossfade = (out: HTMLElement, inn: HTMLElement): void => {
    inn.style.position = 'absolute';
    inn.style.left = `${out.offsetLeft}px`;
    inn.style.top = `${out.offsetTop}px`;
    inn.style.zIndex = '1';
    inn.style.display = '';
    inn.style.opacity = '0';
    void inn.offsetWidth; // reflow so the fade runs from 0, not instantly
    inn.style.opacity = '1';
    out.style.opacity = '0';

    schedule(FADE_MS, () => {
      inn.style.removeProperty('position');
      inn.style.removeProperty('left');
      inn.style.removeProperty('top');
      inn.style.removeProperty('z-index');
      swapPositions(out, inn);
      bench(out);
    });
  };

  // Each pair is offset by STAGGER_MS so a full-row swap ripples across.
  const runSwap = (pairs: { out: HTMLElement; inn: HTMLElement }[]): void => {
    pairs.forEach(({ out, inn }, i) => {
      schedule(i * STAGGER_MS, () => crossfade(out, inn));
    });
  };
  cleanup.add(() => {
    pending.forEach((id) => window.clearTimeout(id));
    pending.clear();
  });

  // Swap one visible logo for a random benched one, in place.
  const cycleOne = (): void => {
    const outIndex = randomIndex(visible.length);
    const inIndex = randomIndex(hidden.length);
    const out = visible[outIndex];
    const inn = hidden[inIndex];

    visible[outIndex] = inn;
    hidden[inIndex] = out;
    runSwap([{ out, inn }]);
  };

  // Replace the whole row with a fresh, non-overlapping set of benched logos.
  const cycleAll = (): void => {
    const incoming = shuffled(hidden).slice(0, visible.length);
    const outgoing = visible;
    const pairs = outgoing.map((out, i) => ({ out, inn: incoming[i] }));

    const incomingSet = new Set(incoming);
    hidden = hidden.filter((el) => !incomingSet.has(el)).concat(outgoing);
    visible = incoming;
    runSwap(pairs);
  };

  const cycle = total >= 2 * show ? cycleAll : cycleOne;

  const tick = (): void => {
    // Don't churn logos (or fight the browser's throttling) while backgrounded.
    if (document.hidden) return;
    cycle();
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    const timer = window.setInterval(tick, CYCLE_MS);
    cleanup.add(() => window.clearInterval(timer));
    log(`cycling ${cycle === cycleAll ? 'all' : 'one'} every ${CYCLE_MS}ms`);
  }

  return {
    destroy: () => {
      cleanup.run();
      items.forEach((el) => {
        ['display', 'opacity', 'transition', 'position', 'left', 'top', 'z-index'].forEach(
          (property) => el.style.removeProperty(property)
        );
      });
      if (parentWasStatic) parent.style.removeProperty('position');
    },
  };
};

/**
 * Initialises every customer-logos component on the page (one instance each).
 */
export const customerLogos = (): void => {
  const instances = createInstances(CUSTOMER_LOGOS, createCustomerLogos);
  log(`found ${instances.length} "${CUSTOMER_LOGOS}" on page`);
};
