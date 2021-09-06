import { get } from './Api';

export function getCenter(value) {
  return {
    x: value.x + value.width / 2,
    y: value.y + value.height / 2,
  };
}

export async function getElementRect(elementUrl) {
  return (
    await get({
      url: `${elementUrl}/rect`,
    })
  ).value;
}
