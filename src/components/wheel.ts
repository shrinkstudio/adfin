import { attributeSelector, getAttribute } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { debounce } from '$utils/debounce';
import { on } from '$utils/events';
import { createLogger } from '$utils/log';
import { queryElements } from '$utils/queryElements';

const WHEEL = attributeSelector('component', 'wheel');
const WHEEL_CIRCLE = attributeSelector('component', 'wheel-circle');
const WHEEL_ITEM = attributeSelector('component', 'wheel-item');

/** One full run of the progress driver (0 → 1) in time mode. */
const LOOP_MS = 20_000;
/** Where items rest when motion is reduced (mid-sweep reads as an arranged layout). */
const REDUCED_PROGRESS = 0.5;

/**
 * The driver variable. Everything an item's transform needs is a CSS variable,
 * and the visible angle is a pure function of this 0 → 1 value:
 *
 *   angle = (--wheel-progress − --wheel-lead) * --wheel-sweep
 *
 * Each item tops out (angle 0) when progress reaches its own --wheel-lead, so
 * spacing leads evenly across 0–1 staggers every item across the timeline. The
 * same markup can be driven by our time loop, a WAAPI scroll/view timeline, or a
 * pure-CSS `animation-timeline` — whatever sets --wheel-progress. --wheel-sweep
 * defaults to 360deg (a full spin); set it to 180deg in CSS to sweep the items
 * across the top half of the arc.
 */
const PROGRESS_VAR = '--wheel-progress';
const ANGLE_EXPR = `calc((var(${PROGRESS_VAR}, 0) - var(--wheel-lead, 0)) * var(--wheel-sweep, 360deg))`;
const ITEM_TRANSFORM =
  `translate(var(--wheel-x, 0px), var(--wheel-y, 0px)) ` +
  `rotate(${ANGLE_EXPR}) ` +
  `translate(0px, calc(-1 * var(--wheel-radius, 0px))) ` +
  `rotate(calc(-1 * (${ANGLE_EXPR})))`;

const log = createLogger('wheel');

interface Placement {
  circleIndex: number;
  /** 0–1 phase: the progress at which this item reaches the top of its ring. */
  lead: number;
}

/**
 * Registers --wheel-progress as an animatable `<number>` (once), so both WAAPI
 * and CSS can interpolate it. No-op where `@property` isn't supported — the
 * value still works, it just won't tween smoothly under a time driver.
 */
let progressRegistered = false;
const registerProgress = (): void => {
  if (progressRegistered) return;
  progressRegistered = true;
  if (typeof CSS === 'undefined' || !('registerProperty' in CSS)) return;
  try {
    CSS.registerProperty({
      name: PROGRESS_VAR,
      syntax: '<number>',
      inherits: true,
      initialValue: '0',
    });
  } catch {
    /* already registered — fine */
  }
};

/**
 * Builds a scroll/view timeline for `subject`, or null when the type isn't
 * requested or the browser lacks support (caller falls back to the time loop).
 */
const buildTimeline = (type: string, subject: HTMLElement): AnimationTimeline | null => {
  const scope = window as unknown as {
    ViewTimeline?: new (options: { subject: Element }) => AnimationTimeline;
    ScrollTimeline?: new (options: { source: Element | null }) => AnimationTimeline;
  };
  if (type === 'view' && scope.ViewTimeline) return new scope.ViewTimeline({ subject });
  if (type === 'scroll' && scope.ScrollTimeline)
    return new scope.ScrollTimeline({ source: document.scrollingElement });
  return null;
};

/**
 * Radius from the wheel centre to a ring's stroke line — measured live so it
 * tracks responsive resizing. Subtracts half the border so the item centres on
 * the drawn line rather than the box edge.
 */
const ringRadius = (circle: HTMLElement): number => {
  const { width } = circle.getBoundingClientRect();
  const border = parseFloat(getComputedStyle(circle).borderTopWidth) || 0;
  return (width - border) / 2;
};

/**
 * Assigns each item a ring (round-robin) and an evenly-spaced lead, so the items
 * are staggered across the whole timeline regardless of which ring they ride.
 */
const distribute = (count: number, circleCount: number): Placement[] =>
  Array.from({ length: count }, (_, i) => ({
    circleIndex: i % circleCount,
    lead: (i + 0.5) / count,
  }));

/**
 * Distributes every wheel item across the concentric rings and drives them via
 * a single `--wheel-progress` variable — animated on a shared time loop by
 * default, or by a scroll/view timeline when `data-wheel-timeline` opts in.
 */
const createWheel = (component: HTMLElement): Destroyable => {
  const cleanup = createCleanup();

  const circles = queryElements<HTMLElement>(WHEEL_CIRCLE, component);
  const items = queryElements<HTMLElement>(WHEEL_ITEM, component);
  const circleCount = circles.length;

  log(`init: ${items.length} item(s) across ${circleCount} ring(s)`);

  if (!items.length || !circleCount) return { destroy: () => cleanup.run() };

  registerProgress();

  // Even spread across the rings — however many items there are.
  const placements = distribute(items.length, circleCount);

  // Items are absolutely stacked; their transform (a function of the vars) orbits them.
  const parent = items[0].parentElement ?? component;
  const parentWasStatic = getComputedStyle(parent).position === 'static';
  if (parentWasStatic) parent.style.position = 'relative';

  items.forEach((item, i) => {
    item.style.position = 'absolute';
    item.style.left = '0px';
    item.style.top = '0px';
    item.style.margin = '0';
    item.style.willChange = 'transform';
    item.style.setProperty('--wheel-lead', `${placements[i].lead}`);
    item.style.transform = ITEM_TRANSFORM;
  });

  // Measure geometry into per-item vars. Just updates variables, so it's cheap to
  // re-run on resize and never disturbs the running progress animation.
  const layout = (): void => {
    const parentRect = parent.getBoundingClientRect();

    // Wheel centre = the rings' shared centre, measured live (in parent coords).
    const centres = circles.map((circle) => {
      const rect = circle.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - parentRect.left,
        y: rect.top + rect.height / 2 - parentRect.top,
      };
    });
    const centreX = centres.reduce((sum, centre) => sum + centre.x, 0) / centres.length;
    const centreY = centres.reduce((sum, centre) => sum + centre.y, 0) / centres.length;
    const radii = circles.map(ringRadius);

    items.forEach((item, i) => {
      const radius = radii[placements[i].circleIndex] ?? 0;
      // Pin the item's top-left so its own centre lands on the wheel centre.
      item.style.setProperty('--wheel-x', `${centreX - item.offsetWidth / 2}px`);
      item.style.setProperty('--wheel-y', `${centreY - item.offsetHeight / 2}px`);
      item.style.setProperty('--wheel-radius', `${radius}px`);
    });
  };

  layout();

  const onResize = debounce(layout, 150);
  cleanup.add(on(window, 'resize', onResize));
  cleanup.add(() => onResize.cancel());

  // Drive --wheel-progress. `data-wheel-timeline`: time (default) | scroll | view | css.
  // "css" leaves the variable for an author-defined `animation-timeline` to drive.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mode = getAttribute(component, 'wheel-timeline');
  let progress: Animation | undefined;

  if (reduceMotion) {
    component.style.setProperty(PROGRESS_VAR, `${REDUCED_PROGRESS}`);
  } else if (mode !== 'css') {
    const timeline = buildTimeline(mode, component);
    const timing = timeline
      ? { timeline, fill: 'both' as FillMode }
      : { duration: LOOP_MS, iterations: Infinity, easing: 'linear' };

    progress = component.animate(
      [{ [PROGRESS_VAR]: 0 }, { [PROGRESS_VAR]: 1 }],
      timing as KeyframeAnimationOptions
    );
    cleanup.add(() => progress?.cancel());
    log(`driver: ${timeline ? mode : 'time'}`);
  }

  return {
    destroy: () => {
      cleanup.run();
      component.style.removeProperty(PROGRESS_VAR);
      items.forEach((item) => {
        ['position', 'left', 'top', 'margin', 'transform', 'will-change'].forEach((property) =>
          item.style.removeProperty(property)
        );
        ['--wheel-lead', '--wheel-x', '--wheel-y', '--wheel-radius'].forEach((property) =>
          item.style.removeProperty(property)
        );
      });
      if (parentWasStatic) parent.style.removeProperty('position');
    },
  };
};

/**
 * Initialises every wheel on the page (one instance each).
 */
export const wheel = (): void => {
  const instances = createInstances(WHEEL, createWheel);
  log(`found ${instances.length} "${WHEEL}" on page`);
};
