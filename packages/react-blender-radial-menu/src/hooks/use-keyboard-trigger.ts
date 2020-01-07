import { useCallback, useEffect, useState, useRef } from 'react';

const TIMEOUT = 300;

export const useKeyboardTrigger = (key: string, onTrigger: () => void) => {
  const [active, setActive] = useState(false);
  const timestamp = useRef<number>();

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (!active && e.key === key) {
        timestamp.current = Date.now();
        return setActive(true);
      }

      if (e.key === 'Escape') {
        timestamp.current = undefined;
        setActive(false);
      }
    },
    [active, key],
  );

  const handleKeyup = useCallback(
    (e: KeyboardEvent) => {
      if (active && e.key === key && timestamp.current) {
        const delta = Date.now() - timestamp.current;
        if (delta > TIMEOUT) {
          onTrigger();
          setActive(false);
        } else {
          timestamp.current = undefined;
        }
      }
    },
    [key, active, onTrigger],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
    };
  }, [handleKeydown, handleKeyup]);

  return active;
};
