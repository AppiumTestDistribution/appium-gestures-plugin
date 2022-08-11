import * as Element from '../element';
import log from '../logger';

export default function longPressBuilder(elementId, pressure, duration, driver) {
  return {
    longPress: longPress(elementId, pressure, duration, driver),
  };
}

async function longPress(elementId, pressure, duration, driver) {
  const value = await driver.getElementRect(elementId);
  log.info(`LongPress at a pressure ${pressure}% of the element ${elementId}`);
  const { x, y } = Element.getCenter(value);
  const androidPauseAction = {
    duration: 0,
    type: 'pause',
  };
  const actionsData = [
    {
      id: 'finger',
      type: 'pointer',
      parameters: { pointerType: 'touch' },
      actions: [
        { duration: 0, type: 'pause' },
        { duration: 0, x, y, type: 'pointerMove', origin: 'viewport' },
        { button: 1, pressure, type: 'pointerDown' },
        { duration, type: 'pause' },
        { button: 1, type: 'pointerUp' },
      ],
    },
  ];

  if (driver.caps.automationName === 'XCuiTest') {
    await driver.performActions(actionsData);
  } else {
    const androidActions = actionsData;
    androidActions[0].actions.unshift(androidPauseAction);
    await driver.performActions(actionsData);
  }
}
