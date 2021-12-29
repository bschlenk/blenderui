import { ReactNode } from 'react';

export type Direction = 'row' | 'column';
export type Cursor = 'row-resize' | 'col-resize' | 'crosshair';

export enum Region {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}

interface BasePane {
  /** The % of the parent this pane should take up. Should be a number between 0 and 100. */
  size: number;
}

export interface SplitPane extends BasePane {
  /** Child panes. */
  splits: Pane[];
  /** Is this pane a row or column. */
  direction: Direction;
}

export interface ComponentPane extends BasePane {
  /** The react component to display in this pane. */
  component: ReactNode;
}

export type Pane = SplitPane | ComponentPane;
