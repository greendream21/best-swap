import { useRef, useEffect } from 'react';

export const INACTIVE_INTERVAL = NaN;

/**
 * Custom hook for using `setTimeout`
 * Based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * @param callback Callback called on each timeout
 * @param delay  Delay in ms
 */
const useTimeout = (
  callback: () => void,
  delay: number = INACTIVE_INTERVAL,
) => {
  const savedCallback = useRef(callback);

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (!Number.isNaN(delay)) {
      const id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

export default useTimeout;
