import { useEffect, useCallback, useState } from 'react';
import { Point } from '../types';
import { getMousePosition } from '../utils/mouse';

export function useMousePosition(active?: boolean) {
  const track = active === undefined || active;
  const [position, setPosition] = useState<Point>(getMousePosition());

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
