/**
 * Builds a `data-*` attribute selector, optionally scoped to a value.
 * @example attributeSelector('toc') // '[data-toc]'
 * @example attributeSelector('toc', 'link') // '[data-toc="link"]'
 */
export const attributeSelector = (name: string, value?: string): string => {
  const attribute = `data-${name}`;
  return value === undefined ? `[${attribute}]` : `[${attribute}="${value}"]`;
};

/**
 * Reads a `data-*` attribute value, returning a fallback when it is absent.
 */
export const getAttribute = (element: HTMLElement, name: string, fallback = ''): string =>
  element.getAttribute(`data-${name}`) ?? fallback;

/**
 * Reads a `data-*` attribute as a number, returning a fallback when absent or not numeric.
 */
export const getNumberAttribute = (element: HTMLElement, name: string, fallback = 0): number => {
  const value = Number(element.getAttribute(`data-${name}`));
  return Number.isNaN(value) ? fallback : value;
};

/**
 * Reads a `data-*` attribute as a boolean. Present with `"true"`/empty string is `true`.
 */
export const getBooleanAttribute = (element: HTMLElement, name: string): boolean => {
  const value = element.getAttribute(`data-${name}`);
  return value === '' || value === 'true';
};
