import { get } from './Api';

export function getCenter(location, size) {
  return {
    x: location.value.x + size.value.width / 2,
    y: location.value.y + size.value.height / 2,
  };
}

export async function locationAndSizeOfElement(
  url,
  jwProxySessionId,
  elementId,
  automationName
) {
  if (automationName === 'XCuiTest') {
    const rect = await this.getElementRect(url, jwProxySessionId, elementId);
    return [rect, rect];
  } else {
    return await Promise.all([
      this.getElementLocation(url, jwProxySessionId, elementId),
      this.getElementSize(url, jwProxySessionId, elementId),
    ]);
  }
}

export async function getElementSize(url, jwProxySessionId, elementId) {
  return await get({
    url: `${url}/wd/hub/session/${jwProxySessionId}/element/${elementId}/size`,
  });
}

export async function getElementLocation(url, jwProxySessionId, elementId) {
  return await get({
    url: `${url}/wd/hub/session/${jwProxySessionId}/element/${elementId}/location`,
  });
}

export async function getElementRect(url, jwProxySessionId, elementId) {
  return await get({
    url: `${url}/session/${jwProxySessionId}/element/${elementId}/rect`,
  });
}
