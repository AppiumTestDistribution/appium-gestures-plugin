import BasePlugin from '@appium/base-plugin';
import log from './logger';
import { Eyes } from '@applitools/eyes-selenium';

export default class EyesPlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
    this.eyes = new Eyes();
  }

  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    this.eyes.setApiKey('API_KEY');
    this.eyes.open(driver, 'Contacts', 'My first Appium native JS test!');
    const session = await next();
    if (session.error) {
      log.info('session not created exception');
    }
    return session;
  }

  async deleteSession(next, driver, args) {
    this.eyes.close();
    await next();
  }
}
