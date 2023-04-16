import * as Element from '../element';
import log from '../logger';

export default async function longPress(elementId, pressure, duration, driver) {
  const elementRect = await driver.getElementRect(elementId);
  log.info(
    `Performing a long press on element ${elementId} with pressure ${pressure}% and duration ${duration}ms`
  );
  const { x, y } = Element.getCenter(elementRect);

  const actionsData = {
    id: 'finger',
    type: 'pointer',
    parameters: { pointerType: 'touch' },
    actions: [
      { duration: 0, x, y, type: 'pointerMove', origin: 'viewport' },
      { button: 1, pressure, type: 'pointerDown' },
      { duration, type: 'pause' },
      { button: 1, type: 'pointerUp' },
    ],
  };

  if (driver.caps.automationName !== 'XCuiTest') {
    actionsData.actions.unshift({ duration: 0, type: 'pause' });
  }

  await driver.performActions([actionsData]);
}
