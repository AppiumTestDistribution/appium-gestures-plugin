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
    const rect = await getElementRect(url);
    return [rect, rect];
  } else {
    return await Promise.all([getElementLocation(url), getElementSize(url)]);
  }
}

async function getElementSize(elementUrl) {
  return await get({
    url: `${elementUrl}/size`,
  });
}

export async function getElementLocation(elementUrl) {
  console.log({
    url: `${elementUrl}/location`,
  });
  return await get({
    url: `${elementUrl}/location`,
  });
}

export async function getElementRect(elementUrl) {
  return (
    await get({
      url: `${elementUrl}/rect`,
    })
  ).value;
}
