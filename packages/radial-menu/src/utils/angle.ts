import { Point } from '../types';

export function degToRad(angle: number): number {
  return (angle * Math.PI) / 180.0;
}

export function radToDeg(angle: number): number {
  return (angle * 180.0) / Math.PI;
}

/**
 * Calculates the angle in degrees between the `start` and `end` points,
 * from 0 to 360. An angle of 0 is vertical.
 */
export function calcAngle(start: Point, end: Point) {
  const angle = 90 + radToDeg(Math.atan2(end[1] - start[1], end[0] - start[0]));
  if (angle < 0) {
    return 360 + angle;
  }
  return angle;
}
