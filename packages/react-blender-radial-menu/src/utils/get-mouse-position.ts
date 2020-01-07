let x = 0;
let y = 0;

export function getMousePosition() {
  return [x, y] as const;
}

document.addEventListener('mousemove', e => {
  x = e.clientX;
  y = e.clientY;
});
