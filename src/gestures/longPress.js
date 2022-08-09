import sessionInfo from '../sessionInfo';
import * as Element from '../element';
import log from '../logger';
import { post } from '../Api';

export default function longPressBuilder(elementId, pressure, duration, driver) {
  const driverInfo = sessionInfo(driver);
  return {
    longPress: longPress(elementId, pressure, duration, driverInfo),
  };
}

async function longPress(elementId, pressure, duration, driverInfo) {
  const url = `${driverInfo.driverUrl}/element/${elementId}`;
  const value = await Element.getElementRect(url);
  log.info(`LongPress at a pressure ${pressure}% of the element ${elementId}`);
  const { x, y } = Element.getCenter(value);
  const androidPauseAction = {
    duration: 0,
    type: 'pause',
  };
  const actionsData = {
    actions: [
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
    ],
  };
  let actionsUrl = `${driverInfo.driverUrl}/actions`;
  log.info(`Performing LongPress ${actionsUrl} with ${JSON.stringify(actionsData)}`);

  if (driverInfo.automationName === 'XCuiTest') {
    await post({
      url: actionsUrl,
      data: actionsData,
    });
  } else {
    const androidActions = actionsData;
    androidActions.actions[0].actions.unshift(androidPauseAction);
    await post({
      url: actionsUrl,
      data: actionsData,
    });
  }
}
