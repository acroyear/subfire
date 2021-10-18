import { useRef, useCallback } from 'react';

// a variant of https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780

export interface RefCallbackHandler {
  (node: HTMLElement): void
}

export function useRefCallbackHandler(handler: RefCallbackHandler) {
  const ref = useRef(null);
  const setRef = useCallback(
    (node: HTMLElement) => {
      if (ref.current) {
        // Make sure to cleanup any events/references added to the last instance
      }

      if (node && handler) {
        handler(node);
      }

      // Save a reference to the node
      ref.current = node;
    },
    [handler]
  );

  return [setRef];
}

export default useRefCallbackHandler;
