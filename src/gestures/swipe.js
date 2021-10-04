import sessionInfo from '../sessionInfo';
import * as Element from '../element';
import log from '../logger';
import { post } from '../Api';

export default function SwipeBuilder(body, driver) {
  const driverInfo = sessionInfo(driver);
  return {
    horizontal: swipe(body, driverInfo),
  };
}

async function swipe(body, driverInfo) {
  const url = `${driverInfo.driverUrl}/element/${body.elementId}`;
  const { x, y, width } = await Element.getElementRect(url);
  const destinationX = x + (body.percentage * width) / 100;
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
          {
            duration: 0,
            x,
            y,
            type: 'pointerMove',
            origin: 'viewport',
          },
          { button: 1, type: 'pointerDown' },
          { duration: 600, type: 'pause' },
          {
            duration: 600,
            x: destinationX,
            y,
            type: 'pointerMove',
            origin: 'viewport',
          },
          { button: 1, type: 'pointerUp' },
        ],
      },
    ],
  };
  let actionsUrl = `${driverInfo.driverUrl}/actions`;
  log.info(
    `Performing Swipe ${actionsUrl} with ${JSON.stringify(actionsData)}`
  );

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
