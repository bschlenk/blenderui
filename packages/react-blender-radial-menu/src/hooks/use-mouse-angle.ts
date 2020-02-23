import { Point } from '../types';
import { useMousePosition } from './use-mouse-position';
import { cartesianToPolar } from '../utils/coords';

/**
 * Return the polar coordinate of the angle from the given `center` to the
 * current mouse position, updating whenever the mouse moves.
 *
 * @param center The center to calculate the angle from.
 *
 * @return The polar coordinate.
 */
export const useMouseAngle = (center: Point) => {
  const mouse = useMousePosition();
  return cartesianToPolar(center, mouse);
};
