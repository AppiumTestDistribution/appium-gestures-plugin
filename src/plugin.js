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
    console.log('--------', method, route, body);
    this.body = body;
    return SOURCE_URL_RE.test(route);
  }

  async dragAndDrop(next, driver) {
    await dragAndDrop(driver, this.body);
  }
}
