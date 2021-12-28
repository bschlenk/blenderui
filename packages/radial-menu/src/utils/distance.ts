import { Point } from '../types';

export function distanceSquared(start: Point, end: Point) {
  return Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2);
}

export function distance(start: Point, end: Point) {
  return Math.sqrt(distanceSquared(start, end));
}
