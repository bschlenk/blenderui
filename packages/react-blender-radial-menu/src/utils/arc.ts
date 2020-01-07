import { Point } from '../types';
import { degToRad } from './angle';

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

export function describeArc(
  center: Point,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(center, radius, endAngle);
  const end = polarToCartesian(center, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    start[0],
    start[1],
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end[0],
    end[1],
  ].join(' ');
}

export function getCenterPointsAroundCircle<T>(
  items: T[],
  radius: number,
): [Point, T][] {
  const count = items.length;
  const arcStep = 360 / count;

  return items.map((item, i) => {
    const angle = i * arcStep;
    const rad = degToRad(angle);
    const x = radius * Math.sin(rad);
    const y = radius * Math.cos(rad);
    return [[x, y], item];
  });
}

export function nearestAngle<T>(angle: number, items: T[]): T {
  const count = items.length;
  const arcStep = 360 / count;
  const halfArcStep = arcStep / 2;

  for (let i = 0; i < count; ++i) {
    const target = arcStep * i;
    if (Math.abs(target - angle) <= halfArcStep) {
      return items[i];
    }
    if (target === 0 && 360 - angle <= halfArcStep) {
      return items[i];
    }
  }

  return undefined as never;
}
