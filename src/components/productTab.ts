import { attributeSelector } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { on } from '$utils/events';
import { createLogger } from '$utils/log';
import { queryElements } from '$utils/queryElements';
import { isStacked } from '$utils/responsive';

/** The grid wrapper; buttons and visuals are interleaved children, paired by index. */
const PRODUCT_TAB = attributeSelector('component', 'product-tab');
const PRODUCT_TAB_BUTTON = attributeSelector('component', 'product-tab-button');
const PRODUCT_TAB_VISUAL = attributeSelector('component', 'product-tab-visual');

const ACTIVE_CLASS = 'is-active';

const log = createLogger('product-tab');

/**
 * Hovering (or focusing) a button or visual activates the button *and* visual
 * that share its index. Only runs while Lumos is unstacked (`--_responsive---stack`
 * is 0) — on mobile the tabs stack and there's no hover to drive.
 */
const createProductTab = (component: HTMLElement): Destroyable => {
  const cleanup = createCleanup();

  const buttons = queryElements<HTMLElement>(PRODUCT_TAB_BUTTON, component);
  const visuals = queryElements<HTMLElement>(PRODUCT_TAB_VISUAL, component);
  const count = Math.min(buttons.length, visuals.length);

  log(`init: ${buttons.length} button(s), ${visuals.length} visual(s)`);

  if (!count) return { destroy: () => cleanup.run() };

  // Start from whichever pair ships with is-active (the markup defaults to 0).
  let activeIndex = Math.max(
    0,
    buttons.findIndex((button) => button.classList.contains(ACTIVE_CLASS))
  );

  const setActive = (index: number): void => {
    if (index === activeIndex) return;

    buttons[activeIndex]?.classList.remove(ACTIVE_CLASS);
    visuals[activeIndex]?.classList.remove(ACTIVE_CLASS);

    activeIndex = index;

    buttons[index].classList.add(ACTIVE_CLASS);
    visuals[index].classList.add(ACTIVE_CLASS);

    log(`active -> [${index}]`);
  };

  const activate = (index: number) => (): void => {
    // Hover behaviour is desktop-only; stacked (mobile) leaves the tabs alone.
    if (isStacked(component)) return;
    setActive(index);
  };

  // pointerenter/focusin don't bubble, so bind per element rather than delegate.
  for (let i = 0; i < count; i += 1) {
    const enter = activate(i);
    cleanup.add(on(buttons[i], 'pointerenter', enter));
    cleanup.add(on(visuals[i], 'pointerenter', enter));
    cleanup.add(on(buttons[i], 'focusin', enter));
    cleanup.add(on(visuals[i], 'focusin', enter));
  }

  return { destroy: () => cleanup.run() };
};

/**
 * Initialises every product-tab grid on the page (one instance each).
 */
export const productTab = (): void => {
  const instances = createInstances(PRODUCT_TAB, createProductTab);
  log(`found ${instances.length} "${PRODUCT_TAB}" on page`);
};
