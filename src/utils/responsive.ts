import { getStyleValue } from './style';

/** Lumos exposes its responsive state as numeric flags: "1" active, "0" inactive. */
const STACK_VAR = '--_responsive---stack';

/**
 * Whether Lumos is in its stacked (mobile) state, read from the
 * `--_responsive---stack` flag. Defaults to the document root, but accepts an
 * element to read the value as resolved on that element instead.
 */
export const isStacked = (element: Element = document.documentElement): boolean =>
  getStyleValue(element, STACK_VAR) === '1';
