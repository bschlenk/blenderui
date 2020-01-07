import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMousePosition } from './hooks/use-mouse-position';
import {
  describeArc,
  calcAngle,
  getCenterPointsAroundCircle,
  nearestAngle,
} from './utils/arc';
import {
  AbsolutePoint,
  AnimatedAbsolutePoint,
  Button,
} from './radial-menu/radial-menu.styles';

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
  const mouse = useMousePosition();
  const [location, setLocation] = useState<readonly [number, number]>();

  const handleClick = useCallback(
    (e: MouseEvent) => {
      // figure out which one to click, call it's onClick, and close
      if (!location) {
        // can this happen?
        return;
      }

      const [x, y] = location;
      const [mouseX, mouseY] = mouse;

      const angle = calcAngle(x, y, mouseX, mouseY);
      const nearest = nearestAngle(angle, items.length);

      items[nearest].onClick();
      setLocation(undefined);
      document.removeEventListener('click', handleClick);
    },
    [items, mouse, location],
  );

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLocation(undefined);
        document.removeEventListener('click', handleClick);
      } else if (e.key === 'z' && !location) {
        setLocation(mouse);
        document.addEventListener('click', handleClick);
      }
    },
    [handleClick, mouse, location],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown, true);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  const points = useMemo(() => getCenterPointsAroundCircle(items.length, 115), [
    items,
  ]);

  if (!location) {
    return null;
  }

  const [x, y] = location;

  const angle = calcAngle(x, y, mouse[0], mouse[1]);
  const mouseFromCenter = Math.pow(mouse[0] - x, 2) + Math.pow(mouse[1] - y, 2);
  const isMouseFar = mouseFromCenter >= Math.pow(CENTER_SIZE_HALF - 3, 2);
  const nearest = nearestAngle(angle, items.length);

  const pointThings = points.map(([x, y], i) => {
    const top = -1 * y;
    const left = x;
    const hover = isMouseFar && i === nearest;
    const activeItem = items[i];

    return (
      <AnimatedAbsolutePoint key={i} left={left} top={top}>
        <Button active={activeItem.active} hover={hover}>
          {activeItem.label}
        </Button>
      </AnimatedAbsolutePoint>
    );
  });

  return (
    <AbsolutePoint left={x} top={y}>
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
              CENTER_SIZE_HALF,
              CENTER_SIZE_HALF,
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
