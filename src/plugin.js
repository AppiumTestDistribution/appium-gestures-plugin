import { BasePlugin } from 'appium/plugin';
import dragAndDrop from './gestures/dragAndDrop';
import SwipeBuilder from './gestures/swipe';
import doubleTapBuilder from './gestures/doubleTap';
import longPressBuilder from './gestures/longPress';
import { util } from 'appium/support';

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
        payloadParams: {
          validate: (jsonObj) => {
            for (const value of Object.values(jsonObj)) {
              if (
                !util.hasValue(value.elementId) &&
                !util.hasValue(value.percentage) &&
                !util.hasValue(value.direction)
              ) {
                return 'W3C protocol expects elementId, percentage and direction';
              }
            }
          },
          makeArgs: (jsonObj) => {
            const args = [];
            for (const value of Object.values(jsonObj)) {
              args.push(value);
            }
            return args;
          },
        },
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

  async swipe(next, driver, ...args) {
    const builder = SwipeBuilder(args, driver);
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
