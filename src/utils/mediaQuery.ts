/**
 * Watches a media query and runs a callback whenever it changes.
 * Fires immediately with the current state by default, and returns a cleanup function.
 * @example
 * const stop = watchMedia('(min-width: 768px)', (isDesktop) => { ... });
 */
export const watchMedia = (
  query: string,
  onChange: (matches: boolean, list: MediaQueryList) => void,
  { immediate = true }: { immediate?: boolean } = {}
): (() => void) => {
  const list = window.matchMedia(query);
  const listener = (event: MediaQueryListEvent) => onChange(event.matches, list);

  list.addEventListener('change', listener);
  if (immediate) onChange(list.matches, list);

  return () => list.removeEventListener('change', listener);
};
