/**
 * Anything with a `destroy` method — the contract every component should meet.
 */
export interface Destroyable {
  destroy(): void;
}

export interface Cleanup {
  /** Registers a cleanup function and returns it unchanged. */
  add: (fn: () => void) => () => void;
  /** Runs every registered cleanup function, then clears the collector. */
  run: () => void;
}

/**
 * Collects cleanup functions (listener removers, observers, timers) so a
 * component can tear everything down in one call inside `destroy()`.
 * @example
 * const cleanup = createCleanup();
 * cleanup.add(on(button, 'click', handleClick));
 * // later
 * cleanup.run();
 */
export const createCleanup = (): Cleanup => {
  const fns = new Set<() => void>();

  return {
    add: (fn) => {
      fns.add(fn);
      return fn;
    },
    run: () => {
      fns.forEach((fn) => fn());
      fns.clear();
    },
  };
};
