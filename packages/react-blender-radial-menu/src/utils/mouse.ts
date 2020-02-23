import { Point } from '../types';

let x = 0;
let y = 0;

/**
 * Get the current mouse position at any time. Relies on a background event
 * listener that will be attached automatically, keeping the mouse position up
 * to date.
 */
export function getMousePosition() {
  return [x, y] as Point;
}

document.addEventListener('mousemove', e => {
  x = e.clientX;
  y = e.clientY;
});
