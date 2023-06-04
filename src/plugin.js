import { BasePlugin } from 'appium/plugin';
import dragAndDrop from './gestures/dragAndDrop';
import { swipe, scrollElementIntoView } from './gestures/swipe';
import doubleTap from './gestures/doubleTap';
import longPress from './gestures/longPress';

export default class GesturesPlugin extends BasePlugin {
  static executeMethodMap = {
    'gesture: dragAndDrop': {
      command: 'dragAndDrop',
      params: { required: ['sourceId', 'destinationId'] },
    },
    'gesture: swipe': {
      command: 'swipe',
      params: {
        required: ['elementId', 'percentage', 'direction'],
      },
    },
    'gesture: scrollElementIntoView': {
      command: 'scrollElementIntoView',
      params: {
        required: ['scrollableView', 'strategy', 'selector', 'percentage', 'direction', 'maxCount'],
      },
    },
    'gesture: doubleTap': {
      command: 'doubleTap',
      params: { required: ['elementId'] },
    },
    'gesture: longPress': {
      command: 'longPress',
      params: { required: ['elementId', 'pressure', 'duration'] },
    },
  };

  constructor(pluginName) {
    super(pluginName);
  }

  async execute(next, driver, script, args) {
    return await this.executeMethod(next, driver, script, args);
  }

  async swipe(next, driver, elementId, percentage, direction) {
    await swipe(elementId, percentage, direction, driver);
  }

  async scrollElementIntoView(
    next,
    driver,
    scrollableView,
    strategy,
    selector,
    percentage,
    direction,
    maxCount
  ) {
    await scrollElementIntoView({
      scrollableView,
      strategy,
      selector,
      percentage,
      direction,
      maxCount,
      driver,
    });
  }

  async dragAndDrop(next, driver, sourceId, destinationId) {
    await dragAndDrop(sourceId, destinationId, driver);
  }

  async doubleTap(next, driver, elementId) {
    await doubleTap(elementId, driver);
  }

  async longPress(next, driver, elementId, pressure, duration) {
    await longPress(elementId, pressure, duration, driver);
  }
}
