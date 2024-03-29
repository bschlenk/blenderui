import styled, { keyframes } from 'styled-components';
import { Point } from '../types';
import { ANIMATION_DURATION } from './radial-menu.constants';

/**
 * Animate *from* the given point to zero.
 *
 * @param x The x position to start from.
 * @param y The y position to start from.
 */
const moveIn = (x: number, y: number) => keyframes`
  0% {
    transform: translate(${x}px, ${y}px);
    opacity: 0;
  }

  80% {
    opacity: 1;
  }

  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
`;

/**
 * A single point to be positioned absolute. Contents will be centered around
 * the point.
 */
export const AbsolutePoint = styled.div.attrs<{ center: Point }>((p) => ({
  style: {
    left: `${p.center[0]}px`,
    top: `${p.center[1]}px`,
  },
}))<{ center: Point }>`
  position: absolute;

  width: 0px;
  height: 0px;

  & > * {
    transform: translate(-50%, -50%);
  }
`;

/**
 * An `AbsolutePoint` that will be animated into position from its relative
 * [0, 0] point.
 */
export const AnimatedAbsolutePoint = styled(AbsolutePoint)`
  animation: ${(p) => moveIn(-1 * p.center[0], -1 * p.center[1])}
    ${ANIMATION_DURATION}ms linear forwards;
`;

export const Button = styled.button<{ hover?: boolean; active?: boolean }>`
  color: #ebedf3;
  cursor: pointer;
  white-space: nowrap;
  background: ${(props) => {
    if (props.active) {
      return '#438fe6';
    }
    if (props.hover) {
      return '#545454';
    }
    return '#181818';
  }};
  border: 1px solid #242424;
  border-radius: 4px;
  position: absolute;
  padding: 8px;
  text-shadow: 0px 0px 2px #242424;

  display: flex;
  align-items: center;

  margin: 0;
  text-decoration: none;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;
`;
