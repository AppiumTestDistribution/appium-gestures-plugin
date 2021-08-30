import BasePlugin from '@appium/base-plugin';
import log from './logger';

export default class GesturesPlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
  }

  static newMethodMap = {
    '/session/:sessionId/dragAndDrop': {
      POST: { command: 'dragAndDrop', payloadParams: { required: ['data'] } },
    },
  };

  async dragAndDrop(next, driver, ...args) {
    log.info(driver, ...args);
    // implementation
  }
}
