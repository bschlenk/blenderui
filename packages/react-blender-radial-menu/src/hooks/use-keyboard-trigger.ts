import { useCallback, useEffect, useState, useRef } from 'react';

const TIMEOUT = 300;

export const useKeyboardTrigger = (key: string, onTrigger: () => void) => {
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
          if (delta > TIMEOUT) {
            onTrigger();
            setActive(false);
          }
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

  return [active, deactivate] as const;
};
