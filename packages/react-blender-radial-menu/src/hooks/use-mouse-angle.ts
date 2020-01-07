import { Point } from '../types';
import { useMousePosition } from './use-mouse-position';
import { calcAngle } from '../utils/arc';
import { distanceSquared } from '../utils/distance';

export const useMouseAngle = (center: Point) => {
  const mouse = useMousePosition();

  const angle = calcAngle(center, mouse);
  const radiusSquared = distanceSquared(center, mouse);

  return [angle, radiusSquared];
};
