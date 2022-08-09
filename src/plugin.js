import { BasePlugin } from 'appium/plugin';
import dragAndDrop from './gestures/dragAndDrop';
import SwipeBuilder from './gestures/swipe';
import doubleTapBuilder from './gestures/doubleTap';
import longPressBuilder from './gestures/longPress';

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
        payloadParams: { required: ['elementId', 'percentage', 'direction'] },
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
    '/session/:sessionId/plugin/actions/longPress': {
      POST: {
        command: 'longPress',
        payloadParams: { required: ['elementId', 'pressure', 'duration'] },
        neverProxy: true,
      },
    },
  };

  async swipe(next, driver, elementId, percentage, direction) {
    const builder = SwipeBuilder(elementId, percentage, direction, driver);
    await builder.swipe;
  }

  async dragAndDrop(next, driver, sourceId, destinationId) {
    const builder = dragAndDrop(sourceId, destinationId, driver);
    await builder.dragAndDrop;
  }

  async doubleTap(next, driver, elementId) {
    const builder = doubleTapBuilder(elementId, driver);
    await builder.doubleTap;
  }

  async longPress(next, driver, elementId, pressure, duration) {
    const builder = longPressBuilder(elementId, pressure, duration, driver);
    await builder.longPress;
  }
}
