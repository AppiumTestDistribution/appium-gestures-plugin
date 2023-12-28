import { remote } from 'webdriverio';

const APPIUM_HOST = '127.0.0.1';
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/wd/hub/',
  logLevel: 'info',
};
const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UIAutomator2',
  'appium:deviceName': 'emulator-5555',
  'appium:app':
    'https://github.com/AppiumTestDistribution/appium-demo/blob/main/VodQA.apk?raw=true',
};
let driver;
describe('Plugin Test', () => {
  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities });
  });

  xit('Horizontal swipe test', async () => {
    console.log(await driver.capabilities.deviceUDID);
    await driver.$('~login').click();
    await driver.$('~slider1').click();
    const slider = await driver.$('~slider');
    await driver.executeScript('gesture: swipe', [
      {
        elementId: slider.elementId,
        percentage: 50,
        direction: 'right',
      },
    ]);
  });

  it('Drag & Drop test', async () => {
    console.log(await driver.capabilities.deviceUDID);
    await driver.$('~login').click();
    await driver.$('~dragAndDrop').click();
    const dragMe = await driver.$('~dragMe');
    const dropzone = await driver.$('~dropzone');
    await driver.executeScript('gesture: dragAndDrop', [
      {
        sourceId: dragMe.elementId,
        destinationId: dropzone.elementId,
      },
    ]);
  });

  afterEach(async () => await driver.deleteSession());
});
