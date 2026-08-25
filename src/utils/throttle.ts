/**
 * Invokes `callback` at most once every `limit` ms, with a trailing call for the
 * final invocation. Useful for scroll handlers. The returned function exposes `cancel()`.
 */
export const throttle = <A extends unknown[]>(
  callback: (...args: A) => void,
  limit = 100
): ((...args: A) => void) & { cancel: () => void } => {
  let lastRun = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const throttled = (...args: A): void => {
    const now = Date.now();
    const remaining = limit - (now - lastRun);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      lastRun = now;
      callback(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastRun = Date.now();
        timer = undefined;
        callback(...args);
      }, remaining);
    }
  };

  throttled.cancel = (): void => {
    if (timer) clearTimeout(timer);
    timer = undefined;
    lastRun = 0;
  };

  return throttled;
};
