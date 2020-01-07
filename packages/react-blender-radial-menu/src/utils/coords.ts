import { Point } from '../types';
import { degToRad, calcAngle } from './angle';
import { distanceSquared } from './distance';

export function polarToCartesian(
  center: Point,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = degToRad(angleInDegrees - 90);

  return [
    center[0] + radius * Math.cos(angleInRadians),
    center[1] + radius * Math.sin(angleInRadians),
  ] as Point;
}

export function cartesianToPolar(center: Point, end: Point) {
  const radiusSquared = distanceSquared(center, end);
  const angle = calcAngle(center, end);
  return [radiusSquared, angle] as Point;
}
