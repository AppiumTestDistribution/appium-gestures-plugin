import sessionInfo from '../sessionInfo';
import * as Element from '../element';
import log from '../logger';
import { post } from '../Api';

export default function DoubleTapBuilder(elementId, driver) {
  const driverInfo = sessionInfo(driver);
  return {
    doubleTap: doubleTap(elementId, driverInfo),
  };
}

async function doubleTap(elementId, driverInfo) {
  const url = `${driverInfo.driverUrl}/element/${elementId}`;
  const value = await Element.getElementRect(url);
  const { x, y } = await Element.getCenter(value);
  const androidPauseAction = {
    duration: 0,
    type: 'pause',
  };
  const actionsData = {
    actions: [
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
    ],
  };
  let actionsUrl = `${driverInfo.driverUrl}/actions`;
  log.info(`Performing doubleTap ${actionsUrl} with ${JSON.stringify(actionsData)}`);

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
