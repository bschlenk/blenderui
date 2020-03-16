import React, { useMemo } from 'react';
import { describeArc, getCenterPointsAroundCircle } from '../utils/arc';
import {
  AbsolutePoint,
  AnimatedAbsolutePoint,
  Button,
} from './radial-menu.styles';
import { useMouseAngle } from '../hooks/use-mouse-angle';
import { RadialMenuDisplayProps } from './radial-menu.types';
import {
  CENTER_DIAMETER,
  CENTER_RADIUS,
  MENU_RADIUS,
  CENTER_RING_WIDTH,
} from './radial-menu.constants';
import { getClosestItem } from './radial-menu.utils';

/**
 * Render options in a circle, starting from the top, evenly.
 */
export const RadialMenuDisplay: React.FC<RadialMenuDisplayProps> = ({
  center,
  label,
  items,
  active,
}) => {
  const polar = useMouseAngle(center);
  const points = useMemo(
    () => getCenterPointsAroundCircle(items, MENU_RADIUS),
    [items],
  );

  const [, angle] = polar;
  const closest = getClosestItem(polar, items, CENTER_RADIUS);

  const pointThings = points.map(([[x, y], item]) => {
    const top = -1 * y;
    const left = x;
    const hover = item === closest;
    const isActive = item.value === active;

    return (
      <AnimatedAbsolutePoint key={item.value} center={[left, top]}>
        <Button active={isActive} hover={hover}>
          {item.label}
        </Button>
      </AnimatedAbsolutePoint>
    );
  });

  return (
    <AbsolutePoint center={center}>
      <div style={{ position: 'absolute', top: '-30px', color: 'white' }}>
        {label}
      </div>
      <svg width={CENTER_DIAMETER} height={CENTER_DIAMETER}>
        <circle
          cx={CENTER_RADIUS}
          cy={CENTER_RADIUS}
          r={(CENTER_DIAMETER - CENTER_RING_WIDTH) / 2}
          stroke="#1a1a1a"
          strokeWidth={CENTER_RING_WIDTH}
          fill="none"
        />
        {closest && (
          <path
            strokeWidth={CENTER_RING_WIDTH}
            stroke="#405FA8"
            fill="none"
            d={describeArc(
              [CENTER_RADIUS, CENTER_RADIUS],
              (CENTER_DIAMETER - CENTER_RING_WIDTH) / 2,
              angle - 40,
              angle + 40,
            )}
          />
        )}
      </svg>
      {pointThings}
    </AbsolutePoint>
  );
};
