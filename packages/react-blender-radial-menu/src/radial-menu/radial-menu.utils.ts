import { Point } from '../types';
import { RadialMenuItem } from './radial-menu.types';
import { nearestAngle } from '../utils/arc';

export const getClosestItem = (
  polar: Point,
  items: RadialMenuItem[],
  threshold: number,
) => {
  if (polar[0] < threshold) {
    return undefined;
  }

  return nearestAngle(polar[1], items);
};
