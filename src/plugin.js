import BasePlugin from '@appium/base-plugin';
import dragAndDrop from './gestures/dragAndDrop';

const SOURCE_URL_RE = new RegExp('/session/[^/]+/plugin/actions/');

export default class GesturesPlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
  }

  static newMethodMap = {
    '/session/:sessionId/plugin/actions/dragAndDrop': {
      POST: {
        command: 'dragAndDrop',
        payloadParams: { required: ['sourceId', 'destinationId'] },
      },
    },
  };

  shouldAvoidProxy(method, route, body) {
    this.body = body;
    return SOURCE_URL_RE.test(route);
  }

  async dragAndDrop(next, driver) {
    await dragAndDrop(this.body, this._constructSessionUrl(driver));
  }

  _constructSessionUrl(driver) {
    const automationName = driver.caps.automationName;

    if (automationName === 'XCuiTest') {
      return {
        url: `${driver.wda.wdaBaseUrl}:${driver.wda.wdaRemotePort}`,
        jwProxySessionId: driver.wda.jwproxy.sessionId,
        automationName,
      };
    } else {
      return {
        url: `http://${driver.uiautomator2.host}:${driver.uiautomator2.systemPort}`,
        jwProxySessionId: driver.uiautomator2.jwproxy.sessionId,
        automationName,
      };
    }
  }
}
