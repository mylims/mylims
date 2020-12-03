import { useEffect, useRef } from 'react';

let __COMPONENTS_LOCK_BODY_COUNT__ = 0;

// Inspired from https://usehooks.com/useLockBodyScroll/
export function useLockBodyScroll(active: boolean) {
  const ref = useRef(active);

  // handle initial state and cleanup
  useEffect(() => {
    if (!ref.current) {
      // if initially false, need to compensate for second effect which is decrementing the counter
      __COMPONENTS_LOCK_BODY_COUNT__++;
    }
    return () => {
      if (ref.current) {
        __COMPONENTS_LOCK_BODY_COUNT__--;
      }
      if (__COMPONENTS_LOCK_BODY_COUNT__ === 0) {
        document.body.style.overflow = 'visible';
      }
    };
  }, []);

  useEffect(() => {
    ref.current = active;
    if (active) {
      __COMPONENTS_LOCK_BODY_COUNT__++;
      document.body.style.overflow = 'hidden';
    } else {
      __COMPONENTS_LOCK_BODY_COUNT__--;
      if (__COMPONENTS_LOCK_BODY_COUNT__ === 0) {
        document.body.style.overflow = 'visible';
      }
    }
  }, [active]);
}
