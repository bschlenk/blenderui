import { Point } from '../types';

export function degToRad(angle: number): number {
  return (angle * Math.PI) / 180.0;
}

export function radToDeg(angle: number): number {
  return (angle * 180.0) / Math.PI;
}

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

export function calcAngle(start: Point, end: Point) {
  const angle = 90 + radToDeg(Math.atan2(end[1] - start[0], end[1] - start[0]));
  if (angle < 0) {
    return 360 + angle;
  }
  return angle;
}

export function getCenterPointsAroundCircle(count: number, radius: number) {
  const arcStep = 360 / count;
  const points = [];

  for (let i = 0; i < count; ++i) {
    const angle = i * arcStep;
    const rad = degToRad(angle);
    const x = round(radius * Math.sin(rad), 2);
    const y = round(radius * Math.cos(rad), 2);
    points.push([x, y]);
    console.log('Got angle %d: %d (%d, %d)', i, angle, x, y);
  }

  return points;
}

function round(num: number, decimals: number): number {
  const mult = Math.pow(10, decimals);
  return Math.round(num * mult) / mult;
}

export function nearestAngle(angle: number, count: number): number {
  const arcStep = 360 / count;
  const halfArcStep = arcStep / 2;

  for (let i = 0; i < count; ++i) {
    const target = arcStep * i;
    if (Math.abs(target - angle) <= halfArcStep) {
      return i;
    }
    if (target === 0 && 360 - angle <= halfArcStep) {
      return i;
    }
  }

  return undefined as never;
}
