import React, { useEffect, useCallback, useMemo } from 'react';
import {
  describeArc,
  getCenterPointsAroundCircle,
  nearestAngle,
  calcAngle,
} from './utils/arc';
import {
  AbsolutePoint,
  AnimatedAbsolutePoint,
  Button,
} from './radial-menu/radial-menu.styles';
import { getMousePosition } from './utils/get-mouse-position';
import { useMouseAngle } from './hooks/use-mouse-angle';

const CENTER_SIZE = 40;
const CENTER_SIZE_HALF = CENTER_SIZE / 2;

interface Props {
  /** The label shown above the center dial. */
  label: React.ReactNode;
  /** An array of items shown radially. */
  items: {
    /** The text shown in the inner part. */
    label: React.ReactNode;
    /**
     * Whether the item is currently active.
     * Only 1 should be active at a time.
     */
    active?: boolean;
    /** The action to perform when clicked. */
    onClick: () => void;
  }[];
}

/**
 * Should render options in a circle, starting from the top, evenly.
 * @param props
 */
export const RadialMenu: React.FC<Props> = ({ label, items }) => {
  const location = useMemo(getMousePosition, []);
  const [angle, radiusSquared] = useMouseAngle(location);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopImmediatePropagation();
      e.preventDefault();

      const angle = calcAngle(location, getMousePosition());
      const nearest = nearestAngle(angle, items.length);
      items[nearest].onClick();
    },
    [location, items],
  );

  useEffect(() => {
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  const points = useMemo(() => getCenterPointsAroundCircle(items.length, 115), [
    items,
  ]);

  const isMouseFar = radiusSquared >= Math.pow(CENTER_SIZE_HALF - 3, 2);
  const nearest = nearestAngle(angle, items.length);

  const pointThings = points.map(([x, y], i) => {
    const top = -1 * y;
    const left = x;
    const hover = isMouseFar && i === nearest;
    const activeItem = items[i];

    return (
      <AnimatedAbsolutePoint key={i} center={[left, top]}>
        <Button active={activeItem.active} hover={hover}>
          {activeItem.label}
        </Button>
      </AnimatedAbsolutePoint>
    );
  });

  return (
    <AbsolutePoint center={location}>
      <div style={{ position: 'absolute', top: '-30px', color: 'white' }}>
        {label}
      </div>
      <svg width={CENTER_SIZE} height={CENTER_SIZE}>
        <circle
          cx={CENTER_SIZE_HALF}
          cy={CENTER_SIZE_HALF}
          r={(CENTER_SIZE - 6) / 2}
          stroke="#1a1a1a"
          strokeWidth="6"
          fill="none"
        />
        {isMouseFar && (
          <path
            strokeWidth="6"
            stroke="#405FA8"
            fill="none"
            d={describeArc(
              [CENTER_SIZE_HALF, CENTER_SIZE_HALF],
              (CENTER_SIZE - 6) / 2,
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
