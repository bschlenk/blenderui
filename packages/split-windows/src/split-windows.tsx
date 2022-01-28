import React, {
  MouseEvent,
  Ref,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import styled from 'styled-components';
import produce from 'immer';
import { Point } from '../../utils/types';
import { buildTreeCache, type TreeCache } from './split-windows.tree';
import { Cursor, Direction, Pane, Region } from './split-windows.types';
import {
  checkRegion,
  cursorForRegion,
  directionForRegion,
  getNode,
  isComponentPane,
  isEdgeRegion,
} from './split-windows.utils';

const MIN_VERTICAL = 24;
const MIN_HORIZONTAL = 14;

interface SplitWindowsProps {
  pane: Pane;
  onResize: (path: string, size: number) => void;
  onSplit: (path: string, fraction: number) => void;
  onJoin: (srcPath: string, dstPath: string) => void;
  /** Called with the new pane layout when the panes have changed. */
  onChange: (pane: Pane) => void;
}

/**
 * Window management system. Split and join windows, resize, etc.
 * Each section is either vertical or horizontal, can have any number of children.
 */
export function SplitWindows({ pane, onResize, onChange }: SplitWindowsProps) {
  const rootRef = useRef<HTMLDivElement>();
  const dragging = useRef(false);
  const mouseStart = useRef<Point>([0, 0]);
  const treeCache = useRef<TreeCache | undefined>();
  const resizing = useRef<[string, string, Direction] | undefined>(undefined);

  const [region, setRegion] = useState<Region | undefined>(undefined);

  function updateMouseStart(e: MouseEvent) {
    const { clientX, clientY } = e;
    mouseStart.current = [clientX, clientY];
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const el = nearestNode(e);
      if (!el) return;

      const path = el.dataset.path;

      if (!resizing.current) {
        const newRegion = checkRegion(el, e);
        setRegion(newRegion);
        return;
      }

      let delta: number | undefined;
      const { clientX, clientY } = e;

      switch (region) {
        case Region.TOP:
        case Region.BOTTOM:
          delta = clientY - mouseStart.current[1];
          break;
        case Region.LEFT:
        case Region.RIGHT:
          delta = clientX - mouseStart.current[0];
          break;

        // for corners, movement in any of the 4 cardinal directions triggers a different action
        // but doesn't trigger until the mouse has moved past a threshold
      }

      if (delta != null) {
        updateMouseStart(e);

        // prevent selecting text and stuff
        e.preventDefault();
        // onResize(path, delta);

        const [s1, s2, direction] = resizing.current;

        const s1s = treeCache.current!.resize(s1, delta, direction);
        const s2s = treeCache.current!.resize(s2, -1 * delta, direction);

        const newPane = produce(pane, (draft) => {
          getNode(draft, s1).size = s1s;
          getNode(draft, s2).size = s2s;
        });

        onChange(newPane);
      }
    },
    [onChange, pane, region],
  );

  const handleMouseDown = useCallback((e: MouseEvent<HTMLElement>) => {
    dragging.current = true;
    updateMouseStart(e);

    const el = nearestNode(e);
    if (!el) return;

    const region = checkRegion(el, e);
    if (isEdgeRegion(region)) {
      const siblings = treeCache.current!.getSiblingsForResize(
        el.dataset.path,
        region,
      );
      resizing.current = [...siblings, directionForRegion(region)];
    }
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent<HTMLElement>) => {
    dragging.current = false;
    resizing.current = undefined;
  }, []);

  useEffect(() => {
    treeCache.current = buildTreeCache(rootRef.current, pane);
  }, [pane]);

  return (
    <Wrapper
      cursor={cursorForRegion(region)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <WrapperInner>
        <SplitWindowsPane {...pane} root path="" elRef={rootRef} />
      </WrapperInner>
    </Wrapper>
  );
}

function SplitWindowsPane({
  root,
  path,
  elRef,
  ...props
}: Pane & {
  root?: boolean;
  path: string;
  elRef?: Ref<HTMLDivElement>;
}) {
  const ref = root ? elRef : undefined;

  if (isComponentPane(props)) {
    return (
      <ComponentWrapper
        size={props.size ?? 1}
        data-path={path}
        data-node
        ref={ref}
      >
        <ComponentWrapperInner>{props.component}</ComponentWrapperInner>
      </ComponentWrapper>
    );
  }

  const children = props.splits.map((split, i) => (
    <SplitWindowsPane key={i} {...split} path={path + '.' + i} />
  ));

  return (
    <SplitWrapper
      root={root}
      direction={props.direction}
      size={props.size ?? 1}
      data-path={path}
      ref={ref}
    >
      {children}
    </SplitWrapper>
  );
}

function nearestNode(e: MouseEvent<HTMLElement>) {
  let el = e.target as HTMLElement;
  // not sure why, but sometimes this is null
  if (!el) return null;

  while (!el.dataset.path) {
    el = el.parentElement;
  }
  return el;
}

const Wrapper = styled.div<{ cursor: Cursor }>`
  height: 100%;
  background: #161616;
  cursor: ${(p) => p.cursor};
  overflow: hidden;
`;

const WrapperInner = styled.div`
  margin: -2px;
  height: 100%;
`;

const ComponentWrapper = styled.div.attrs<{ size: number }>((p) => ({
  style: { flex: `0 0 ${p.size}%` },
}))`
  background: #161616;
  padding: 2px;
  display: flex;
  overflow: hidden;
`;

const ComponentWrapperInner = styled.div`
  border-radius: 5px;
  background: #303030;
  flex: 1;
`;

const SplitWrapper = styled.div<{
  direction: Direction;
  size: number;
  root: boolean;
}>`
  display: flex;
  flex-direction: ${(p) => p.direction};
  flex: 0 0 ${(p) => p.size}%;
  ${(p) => p.root && `height: 100%;`}
`;
