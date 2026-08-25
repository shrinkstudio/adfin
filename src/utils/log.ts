let enabled = true;

/** Turns all debug logging on or off at runtime (e.g. from the console). */
export const setDebug = (value: boolean): void => {
  enabled = value;
};

/**
 * Creates a namespaced debug logger.
 * Uses `console.error` because the project's ESLint config only permits it.
 * @example
 * const log = createLogger('toc');
 * log('ready', instances);
 */
export const createLogger =
  (namespace: string) =>
  (...args: unknown[]): void => {
    if (enabled) console.error(`[${namespace}]`, ...args);
  };
