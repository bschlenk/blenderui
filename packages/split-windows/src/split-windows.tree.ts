import { last } from '../../utils/last';
import { Point } from '../../utils/types';
import { Direction, Pane, Region, SplitPane } from './split-windows.types';
import {
  getNode,
  parsePath,
  directionForRegion,
  offsetForRegion,
} from './split-windows.utils';

const filter: NodeFilter = (node: Node) => {
  // our filter guarantees we'll only get elements here
  const el = node as Element;

  if (el.hasAttribute('data-path')) {
    // traverse nodes in the path and their children
    return NodeFilter.FILTER_ACCEPT;
  }

  if (el.parentElement.hasAttribute('data-node')) {
    // stop traversing children of leaf nodes
    return NodeFilter.FILTER_REJECT;
  }

  // skip extra dom nodes that are not marked as paths, but check their children
  return NodeFilter.FILTER_SKIP;
};

export class TreeCache {
  private sizes: Record<string, Point>;
  private readonly pane: Pane;

  constructor(pane: Pane) {
    this.pane = pane;
    this.sizes = {};
  }

  addNode(el: HTMLElement) {
    const { path } = el.dataset;
    const { width, height } = el.getBoundingClientRect();

    this.sizes[path] = [width, height];
  }

  getSiblingsForResize(path: string, region: Region): [string, string] {
    const paths = parsePath(path);
    if (paths.length === 0) {
      // can't resize the root pane
      return null;
    }

    const direction = directionForRegion(region);
    const offset = offsetForRegion(region);

    const panes: Pane[] = [];

    let node = this.pane;
    for (const p of paths) {
      panes.push(node);
      node = (node as SplitPane).splits[p];
    }

    while (true) {
      const parent = last(panes) as SplitPane;
      if (!parent) return null;

      const nodeDir = parent.direction;
      const siblingIndex = last(paths) + offset;
      const sibling = parent.splits[siblingIndex];

      if (nodeDir === direction && sibling) {
        const nodePath = '.' + paths.join('.');
        paths[paths.length - 1] = siblingIndex;
        const siblingPath = '.' + paths.join('.');
        return offset === 1 ? [nodePath, siblingPath] : [siblingPath, nodePath];
      }

      node = panes.pop();
      paths.pop();
    }
  }

  resize(path: string, delta: number, direction: Direction) {
    const frac = getNode(this.pane, path).size;
    const size = this.sizes[path][direction === 'row' ? 0 : 1];
    const newSize = size + delta;

    return (newSize * frac) / size;
  }
}

// size/frac = newsize/newfrac
// newfrac * size/frac = newsize
// newfrac * size = newsize * frac
// newfrac = newsize * frac / size

/**
 * Walks the dom and builds up a representation of our tree. Includes all the computed
 * sizes of all the regions so that we can calculate new sizes on resize.
 *
 * Should be able to answer questions like for a given resize delta, what should the new
 * flex percentage be? For a given node and region, are we resizing that node or the parent?
 */
export function buildTreeCache(root: Element, pane: Pane) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    filter,
  );

  const cache = new TreeCache(pane);

  let currentNode = walker.currentNode as HTMLElement;
  while (currentNode) {
    cache.addNode(currentNode);
    currentNode = walker.nextNode() as HTMLElement;
  }

  return cache;
}
