import BasePlugin from '@appium/base-plugin';
import dragAndDrop from './gestures/dragAndDrop';
import SwipeBuilder from './gestures/swipe';

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
    '/session/:sessionId/plugin/actions/swipe': {
      POST: {
        command: 'swipe',
        payloadParams: { required: ['elementId', 'percentage'] },
      },
    },
  };

  shouldAvoidProxy(method, route, body) {
    this.body = body;
    return SOURCE_URL_RE.test(route);
  }

  async swipe(next, driver) {
    const builder = SwipeBuilder(this.body, driver);
    await builder.horizontal;
  }

  async dragAndDrop(next, driver) {
    const builder = dragAndDrop(this.body, driver);
    await builder.dragAndDrop;
  }
}
