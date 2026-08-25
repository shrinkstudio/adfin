/**
 * Retrieves the DOM element based on the provided query and returns them in an array
 */
export const queryElement = <T extends HTMLElement>(
  query: string,
  parent: Element | Document = document
): T | undefined => {
  const element = parent.querySelector<T>(query);
  return element ?? undefined;
};
