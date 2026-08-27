(() => {
  // ../../Users/benjaminhammond/adfin/src/utils/attributes.ts
  var attributeSelector = (name, value) => {
    const attribute = `data-${name}`;
    return value === void 0 ? `[${attribute}]` : `[${attribute}="${value}"]`;
  };

  // ../../Users/benjaminhammond/adfin/src/utils/cleanup.ts
  var createCleanup = () => {
    const fns = /* @__PURE__ */ new Set();
    return {
      add: (fn) => {
        fns.add(fn);
        return fn;
      },
      run: () => {
        fns.forEach((fn) => fn());
        fns.clear();
      }
    };
  };

  // ../../Users/benjaminhammond/adfin/src/utils/queryElements.ts
  var queryElements = (query, parent = document) => {
    const elements = parent.querySelectorAll(query);
    return elements.length ? [...elements] : [];
  };

  // ../../Users/benjaminhammond/adfin/src/utils/createInstances.ts
  var createInstances = (selector, factory, parent = document) => queryElements(selector, parent).map(factory);

  // ../../Users/benjaminhammond/adfin/src/utils/debounce.ts
  var debounce = (callback, delay = 100) => {
    let timer;
    const debounced = (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
    debounced.cancel = () => {
      if (timer) clearTimeout(timer);
      timer = void 0;
    };
    return debounced;
  };

  // ../../Users/benjaminhammond/adfin/src/utils/events.ts
  var on = (target, type, handler, options) => {
    const listener = handler;
    target.addEventListener(type, listener, options);
    return () => target.removeEventListener(type, listener, options);
  };

  // ../../Users/benjaminhammond/adfin/src/utils/log.ts
  var enabled = true;
  var createLogger = (namespace) => (...args) => {
    if (enabled) console.error(`[${namespace}]`, ...args);
  };

  // ../../Users/benjaminhammond/adfin/src/utils/mediaQuery.ts
  var watchMedia = (query, onChange, { immediate = true } = {}) => {
    const list = window.matchMedia(query);
    const listener = (event) => onChange(event.matches, list);
    list.addEventListener("change", listener);
    if (immediate) onChange(list.matches, list);
    return () => list.removeEventListener("change", listener);
  };

  // ../../Users/benjaminhammond/adfin/src/components/transition.ts
  var WRAP = attributeSelector("transition");
  var DEFAULT_RANGE = 0.5;
  var BLOCK_FADE = 0.12;
  var ROW_WEIGHT = 50;
  var NOISE_WEIGHT = 300;
  var WAVE_WEIGHT = 30;
  var log = createLogger("transition");
  var createTransition = (wrap) => {
    if (wrap.querySelector(WRAP)) return null;
    const blockElements = [...wrap.children].filter(
      (child) => child instanceof HTMLElement
    );
    if (!blockElements.length) return null;
    const mode = wrap.getAttribute("data-transition") === "leading" ? "reveal" : "cover";
    const rangeRaw = Number(wrap.getAttribute("data-transition-range") ?? NaN);
    const range = Number.isFinite(rangeRaw) && rangeRaw > 0 ? rangeRaw : DEFAULT_RANGE;
    const cleanup = createCleanup();
    let blocks = [];
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
        const priority = row * ROW_WEIGHT + Math.random() * NOISE_WEIGHT + Math.sin(col * 0.3) * WAVE_WEIGHT;
        return { element, priority };
      });
      prioritised.sort((a, b) => a.priority - b.priority);
      const span = Math.max(1, prioritised.length - 1);
      blocks = prioritised.map(({ element }, rank) => ({
        element,
        threshold: rank / span * (1 - BLOCK_FADE)
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
        const opacity = mode === "cover" ? local : 1 - local;
        element.style.opacity = String(opacity);
        element.style.visibility = opacity === 0 ? "hidden" : "";
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const start = () => {
      measure();
      lastProgress = -1;
      schedule();
      cleanup.add(on(window, "scroll", schedule, { passive: true }));
      cleanup.add(
        on(
          window,
          "resize",
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
        element.style.opacity = "";
        element.style.visibility = "";
      }
    };
    const stopWatching = watchMedia("(prefers-reduced-motion: reduce)", (reduced) => {
      stop();
      if (!reduced) start();
    });
    log("init", { mode, blocks: blockElements.length });
    return {
      destroy: () => {
        stopWatching();
        stop();
      }
    };
  };
  var transition = () => {
    const instances = createInstances(WRAP, createTransition).filter(
      (instance) => instance !== null
    );
    log("instances", instances.length);
  };

  // transition-entry.ts
  document.addEventListener("DOMContentLoaded", () => transition());
})();
