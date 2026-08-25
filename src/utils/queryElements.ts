/**
 * Retrieves the DOM elements based on the provided query and returns them in an array
 */
export const queryElements = <T extends HTMLElement | SVGElement>(
  query: string,
  parent: Element | Document = document
): T[] => {
  const elements = parent.querySelectorAll<T>(query);
  return elements.length ? [...elements] : [];
};
