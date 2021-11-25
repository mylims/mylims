import { useEffect, useRef } from 'react';

let COMPONENTS_LOCK_BODY_COUNT = 0;

// Inspired from https://usehooks.com/useLockBodyScroll/
export function useLockBodyScroll(active: boolean) {
  const ref = useRef(active);

  // handle initial state and cleanup
  useEffect(() => {
    if (!ref.current) {
      // if initially false, need to compensate for second effect which is decrementing the counter
      COMPONENTS_LOCK_BODY_COUNT++;
    }
    return () => {
      if (ref.current) {
        COMPONENTS_LOCK_BODY_COUNT--;
      }
      if (COMPONENTS_LOCK_BODY_COUNT === 0) {
        document.body.style.overflow = 'visible';
      }
    };
  }, []);

  useEffect(() => {
    ref.current = active;
    if (active) {
      COMPONENTS_LOCK_BODY_COUNT++;
      document.body.style.overflow = 'hidden';
    } else {
      COMPONENTS_LOCK_BODY_COUNT--;
      if (COMPONENTS_LOCK_BODY_COUNT === 0) {
        document.body.style.overflow = 'visible';
      }
    }
  }, [active]);
}
