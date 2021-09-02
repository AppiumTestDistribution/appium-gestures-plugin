import { get } from './Api';

export function getCenter(location, size) {
  return {
    x: location.value.x + size.value.width / 2,
    y: location.value.y + size.value.height / 2,
  };
}
const elementUrl = (options) =>
  `${options.url}/session/${options.jwProxySessionId}/element/${options.elementId}`;

export async function locationAndSizeOfElement(options) {
  const url = elementUrl(options);
  if (options.automationName === 'XCuiTest') {
    const rect = await this.getElementRect(url);
    return [rect, rect];
  } else {
    return await Promise.all([
      this.getElementLocation(url),
      this.getElementSize(url),
    ]);
  }
}

export async function getElementSize(elUrl) {
  return await get({
    url: `${elUrl}/size`,
  });
}

export async function getElementLocation(elUrl) {
  return await get({
    url: `${elUrl}/location`,
  });
}

export async function getElementRect(elUrl) {
  return await get({
    url: `${elUrl}/rect`,
  });
}
