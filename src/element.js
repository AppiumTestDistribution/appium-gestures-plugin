export function getCenter(value) {
  return {
    x: value.x + value.width / 2,
    y: value.y + value.height / 2,
  };
}
