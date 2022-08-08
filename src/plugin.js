import BasePlugin from '@appium/base-plugin';
import dragAndDrop from './gestures/dragAndDrop';
import SwipeBuilder from './gestures/swipe';
import doubleTapBuilder from './gestures/doubleTap';

export default class GesturesPlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
  }

  static newMethodMap = {
    '/session/:sessionId/plugin/actions/dragAndDrop': {
      POST: {
        command: 'dragAndDrop',
        payloadParams: { required: ['sourceId', 'destinationId'] },
        neverProxy: true,
      },
    },
    '/session/:sessionId/plugin/actions/swipe': {
      POST: {
        command: 'swipe',
        payloadParams: { required: ['elementId', 'percentage'] },
        neverProxy: true,
      },
    },
    '/session/:sessionId/plugin/actions/doubleTap': {
      POST: {
        command: 'doubleTap',
        payloadParams: { required: ['elementId'] },
        neverProxy: true,
      },
    },
  };

  async swipe(next, driver, elementId, percentage) {
    const builder = SwipeBuilder(elementId, percentage, driver);
    await builder.horizontal;
  }

  async dragAndDrop(next, driver, sourceId, destinationId) {
    const builder = dragAndDrop(sourceId, destinationId, driver);
    await builder.dragAndDrop;
  }

  async doubleTap(next, driver, elementId) {
    const builder = doubleTapBuilder(elementId, driver);
    await builder.doubleTap;
  }
}
