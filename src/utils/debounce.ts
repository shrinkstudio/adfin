/**
 * Delays invoking `callback` until `delay` ms have passed since the last call.
 * Useful for resize handlers and input. The returned function exposes `cancel()`.
 */
export const debounce = <A extends unknown[]>(
  callback: (...args: A) => void,
  delay = 100
): ((...args: A) => void) & { cancel: () => void } => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: A): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };

  debounced.cancel = (): void => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };

  return debounced;
};
