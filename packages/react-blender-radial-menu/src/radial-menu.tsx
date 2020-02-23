import React, { useCallback, useEffect, useMemo } from 'react';
import { useKeyboardTrigger } from './hooks/use-keyboard-trigger';
import { getMousePosition } from './utils/mouse';
import { RadialMenuProps } from './radial-menu/radial-menu.types';
import { RadialMenuDisplay } from './radial-menu/radial-menu.display';
import { CENTER_RADIUS } from './radial-menu/radial-menu.constants';
import { cartesianToPolar } from './utils/coords';
import { getClosestItem } from './radial-menu/radial-menu.utils';

export const RadialMenu: React.FC<RadialMenuProps> = ({
  trigger,
  onChange,
  items,
  active,
  label,
}) => {
  const [visible, hide] = useKeyboardTrigger(trigger, () => {
    triggerChange();
  });

  const center = useMemo(getMousePosition, [visible]);

  const triggerChange = useCallback(() => {
    const mouse = getMousePosition();
    const polar = cartesianToPolar(center, mouse);
    const closest = getClosestItem(polar, items, CENTER_RADIUS);
    if (closest && active !== closest.value) {
      // only change if the mouse is far enough
      onChange(closest.value);
    }
    hide();
  }, [hide, items, active, center, onChange]);

  useEffect(() => {
    if (visible) {
      const handleClick = (e: MouseEvent) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        triggerChange();
      };

      document.addEventListener('click', handleClick, true);
      return () => {
        document.removeEventListener('click', handleClick, true);
      };
    }
  }, [visible, triggerChange]);

  if (!visible) {
    return null;
  }

  return (
    <RadialMenuDisplay
      {...{
        items,
        active,
        label,
        center,
      }}
    />
  );
};
