import styled, { keyframes } from 'styled-components/macro';

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
export const DivPoint = styled.div`
  width: 0px;
  height: 0px;

  & > * {
    transform: translate(-50%, -50%);
  }
`;

export const AbsolutePoint = styled(DivPoint)<{ top: number; left: number }>`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
`;

export const AnimatedAbsolutePoint = styled(AbsolutePoint)`
  animation: ${props => moveIn(-1 * props.left, -1 * props.top)} 75ms linear
    forwards;
`;

export const Button = styled.button<{ hover?: boolean; active?: boolean }>`
  color: #ebedf3;
  cursor: pointer;
  white-space: nowrap;
  background: ${props => {
    if (props.active) {
      return '#4262ac';
    }
    if (props.hover) {
      return '#464646';
    }
    return '#1a1a1a';
  }};
  border-radius: 6px;
  position: absolute;
  padding: 8px;

  border: none;
  margin: 0;
  text-decoration: none;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;
`;
