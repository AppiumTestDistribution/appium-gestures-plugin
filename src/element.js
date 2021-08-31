import { get } from './Api';

export function getCenter(location, size) {
  return {
    x: location.value.x + size.value.width / 2,
    y: location.value.y + size.value.height / 2,
  };
}

export async function locationAndSizeOfElement(host, jwproxySession, target) {
  return await Promise.all([
    this.getElementLocation(host, jwproxySession, target),
    this.getElementSize(host, jwproxySession, target),
  ]);
}

export async function getElementSize(host, jwproxySession, target) {
  return await get({
    url: `${host}/wd/hub/session/${jwproxySession}/element/${target}/size`,
  });
}

export async function getElementLocation(host, jwproxySession, target) {
  return await get({
    url: `${host}/wd/hub/session/${jwproxySession}/element/${target}/location`,
  });
}
