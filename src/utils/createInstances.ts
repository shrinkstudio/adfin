import { queryElements } from './queryElements';

/**
 * Runs a factory for every element matching `selector`, returning the instances.
 * Lets a component initialise once per occurrence when it appears multiple times
 * on a page. Collect the returned instances to destroy them later.
 * @example
 * const tocs = createInstances('[data-toc]', (element) => createToc(element));
 */
export const createInstances = <T>(
  selector: string,
  factory: (element: HTMLElement, index: number) => T,
  parent: Element | Document = document
): T[] => queryElements<HTMLElement>(selector, parent).map(factory);
