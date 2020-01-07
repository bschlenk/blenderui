import { Point } from '../types';

export const distanceSquared = (start: Point, end: Point) => {
  return Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2);
};
