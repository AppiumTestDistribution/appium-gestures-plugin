import * as Element from '../element';

export default async function doubleTap(elementId, driver) {
  {
    const value = await driver.getElementRect(elementId);
    const { x, y } = await Element.getCenter(value);

    const androidPauseAction = {
      duration: 0,
      type: 'pause',
    };

    const actionsData = [
      {
        id: 'finger1',
        type: 'pointer',
        parameters: { pointerType: 'touch' },
        actions: [
          { duration: 0, x, y, type: 'pointerMove', origin: 'viewport' },
          { button: 0, type: 'pointerDown' },
          { duration: 200, type: 'pause' },
          { button: 0, type: 'pointerUp' },
          { duration: 40, type: 'pause' },
          { button: 0, type: 'pointerDown' },
          { duration: 200, type: 'pause' },
          { button: 0, type: 'pointerUp' },
        ],
      },
    ];

    if (driver.caps.automationName !== 'XCuiTest') {
      actionsData[0].actions.unshift(androidPauseAction);
    }

    await driver.performActions(actionsData);
  }
}
