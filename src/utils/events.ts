/**
 * Adds an event listener and returns a function that removes it again.
 * Pair with a cleanup collector so components can tear listeners down on destroy.
 * @example on<MouseEvent>(button, 'click', (event) => { ... });
 */
export const on = <E extends Event = Event>(
  target: EventTarget,
  type: string,
  handler: (event: E) => void,
  options?: AddEventListenerOptions | boolean
): (() => void) => {
  const listener = handler as EventListener;
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
};
