type FinsweetAttributesCallback = (instances: unknown[]) => void;
type FinsweetAttributesItem = [solution: string, callback: FinsweetAttributesCallback];

declare global {
  interface Window {
    FinsweetAttributes?: FinsweetAttributesItem[];
  }
}

/**
 * Runs `callback` once the given Finsweet Attributes solution has finished
 * loading, passing that solution's instances. Safe to call before the Finsweet
 * script itself loads — calls are queued and flushed when it's ready.
 * @see https://github.com/finsweet/attributes/blob/master/packages/attributes/README.md#api-reference
 * @example onFinsweetAttribute('toc', () => { ... });
 */
export const onFinsweetAttribute = (
  solution: string,
  callback: FinsweetAttributesCallback
): void => {
  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([solution, callback]);
};
