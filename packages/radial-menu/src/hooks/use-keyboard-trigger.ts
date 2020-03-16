import { useCallback, useEffect, useState, useRef } from 'react';

const TIMEOUT = 300;

/**
 * Set up `key` to be used as a trigger. When triggered, `active` will be
 * `true`. If `key` is held for more than `timeout` ms, then releasing `key`
 * will set `active` to `false` and call `onTrigger`. If `key` is released
 * before `timeout` ms, then it will remain active. In this case, call the
 * second return value to manually deactivate.
 *
 * @param key The key that should activate.
 * @param onTrigger Called if `key` is released after `timeout` ms.
 * @param timeout How long the user has to release `key` before
 *     it would call `onTrigger`. Defaults to 300 ms.
 *
 * @return An array to be destructured. First value is whether this is currently
 *     active. The second is a function to manually deactivate.
 */
export const useKeyboardTrigger = (
  key: string,
  onTrigger: () => void,
  timeout = TIMEOUT,
) => {
  const [active, setActive] = useState(false);
  const timestamp = useRef<number>(0);
  const down = useRef(false);

  const deactivate = () => {
    setActive(false);
  };

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (!active && e.key === key && !down.current) {
        timestamp.current = Date.now();
        down.current = true;
        return setActive(true);
      }

      if (e.key === 'Escape') {
        setActive(false);
      }
    },
    [active, key],
  );

  const handleKeyup = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === key && down.current) {
        down.current = false;
        if (active) {
          const delta = Date.now() - timestamp.current;
          if (delta > timeout) {
            onTrigger();
            setActive(false);
          }
        }
      }
    },
    [key, active, onTrigger, timeout],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
    };
  }, [handleKeydown, handleKeyup]);

  return [active, deactivate] as const;
};
