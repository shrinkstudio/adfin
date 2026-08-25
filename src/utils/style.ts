/**
 * Reads a resolved computed-style value — works for both standard properties
 * (e.g. `scroll-margin-top`) and CSS custom properties (e.g. `--_responsive---stack`).
 * Returns a trimmed string; parse with `parseFloat` when you need a number.
 */
export const getStyleValue = (element: Element, property: string): string =>
  getComputedStyle(element).getPropertyValue(property).trim();
