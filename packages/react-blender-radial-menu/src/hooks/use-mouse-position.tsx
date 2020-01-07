import { useEffect, useCallback, useState } from 'react';
import { Point } from '../types';

export function useMousePosition(active?: boolean) {
  const track = active === undefined || active;
  const [position, setPosition] = useState<Point>([0, 0]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (track) {
        setPosition([e.clientX, e.clientY]);
      }
    },
    [track],
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return position;
}
