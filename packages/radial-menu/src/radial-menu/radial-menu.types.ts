import { Point } from '../types';

export interface RadialMenuItem {
  /** The text shown in the inner part. */
  label: React.ReactNode;
  /** The value of the menu item. */
  value: string;
}

interface Common {
  /** The label shown above the center dial. */
  label: React.ReactNode;
  /** An array of items shown radially. */
  items: RadialMenuItem[];
  /** The value of the active menu item, or undefined. */
  active?: string;
}

export interface RadialMenuDisplayProps extends Common {
  /** The center point of the menu. */
  center: Point;
}

export interface RadialMenuProps extends Common {
  /** The keyboard key to activate on. */
  trigger: string;
  /** Called when the menu changes. */
  onChange: (value: string) => void;
}
