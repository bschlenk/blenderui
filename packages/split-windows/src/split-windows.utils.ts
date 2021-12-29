import { MouseEvent, ReactNode } from 'react';
import {
  ComponentPane,
  Cursor,
  Direction,
  Pane,
  Region,
  SplitPane,
} from './split-windows.types';

const CORNER_THRESHOLD = 10;
const EDGE_THRESHOLD = 4;

export function checkRegion(el: HTMLElement, e: MouseEvent<HTMLElement>) {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // check corners
  const isTop = y < CORNER_THRESHOLD;
  const isBottom = y > rect.height - CORNER_THRESHOLD;
  const isLeft = x < CORNER_THRESHOLD;
  const isRight = x > rect.width - CORNER_THRESHOLD;

  if (isTop && isLeft) return Region.TOP_LEFT;
  if (isTop && isRight) return Region.TOP_RIGHT;
  if (isBottom && isLeft) return Region.BOTTOM_LEFT;
  if (isBottom && isRight) return Region.BOTTOM_RIGHT;

  // check edges
  if (y < EDGE_THRESHOLD) return Region.TOP;
  if (y > rect.height - EDGE_THRESHOLD) return Region.BOTTOM;
  if (x < EDGE_THRESHOLD) return Region.LEFT;
  if (x > rect.width - EDGE_THRESHOLD) return Region.RIGHT;

  return undefined;
}

export function isEdgeRegion(region: Region) {
  return region >= 4;
}

export function directionForRegion(region: Region): Direction {
  return [Region.TOP, Region.BOTTOM].includes(region) ? 'column' : 'row';
}

export function offsetForRegion(region: Region): number {
  return [Region.TOP, Region.LEFT].includes(region) ? -1 : 1;
}

export function cursorForRegion(region?: Region): Cursor | undefined {
  if (region == null) return undefined;

  switch (region) {
    case Region.TOP:
    case Region.BOTTOM:
      return 'row-resize';
    case Region.LEFT:
    case Region.RIGHT:
      return 'col-resize';
    default:
      return 'crosshair';
  }
}

export function isComponentPane(pane: Pane): pane is ComponentPane {
  return 'component' in pane;
}

export function resizePane(
  pane: Pane,
  path: string,
  delta: number,
  region: Region,
) {
  const paths = parsePath(path);
  if (paths.length === 0) {
    // the outer part cannot be resized
    return pane;
  }

  const paneClone = { ...pane };

  let parent = paneClone;
  while (paths.length > 1) {
    parent = (parent as SplitPane).splits[paths.shift()];
  }

  const childArray = (parent as SplitPane).splits;
  const childIndex = paths[0];
  const child = childArray[childIndex];
  let sibling;

  switch (region) {
    case Region.TOP:
    case Region.LEFT:
      sibling = childArray[childIndex - 1];
      break;
    case Region.BOTTOM:
    case Region.RIGHT:
      sibling = childArray[childIndex + 1];
      break;
    default:
      // we shouldn't get here for corners
      return pane;
  }

  if (!sibling) {
    // we're trying to resize the edge, we can't do that
  }
}

export function parsePath(path: string) {
  const paths = path.split('.');
  // first part is always an empty string
  paths.shift();

  return paths.map((p) => parseInt(p));
}

export function getNode(pane: Pane, path: string) {
  const paths = parsePath(path);
  let node = pane;
  for (const p of paths) {
    node = (node as SplitPane).splits[p];
  }
  return node;
}
