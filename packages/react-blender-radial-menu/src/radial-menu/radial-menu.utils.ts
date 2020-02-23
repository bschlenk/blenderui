import { Point } from '../types';
import { RadialMenuItem } from './radial-menu.types';
import { nearestAngle } from '../utils/arc';

/**
 * Laying out the given items evenly around a circle, return the one that is
 * closest to the angle of the given polar coordinate. If the point is not more
 * than `threshold` past the center, then undefined is returned.
 *
 * @param polar
 * @param items
 * @param threshold
 */
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
