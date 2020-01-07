import { Point } from '../types';
import { useMousePosition } from './use-mouse-position';
import { cartesianToPolar } from '../utils/coords';

export const useMouseAngle = (center: Point) => {
  const mouse = useMousePosition();
  return cartesianToPolar(center, mouse);
};
