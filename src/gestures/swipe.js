import sessionInfo from '../sessionInfo';
import * as Element from '../element';
import log from '../logger';
import { post } from '../Api';

export default function SwipeBuilder(elementId, percentage, direction, driver) {
  const driverInfo = sessionInfo(driver);
  return {
    swipe: swipe(elementId, percentage, direction, driverInfo),
  };
}

async function swipe(elementId, percentage, direction, driverInfo) {
  const url = `${driverInfo.driverUrl}/element/${elementId}`;
  const value = await Element.getElementRect(url);
  log.info(`Swiping ${direction} at ${percentage}% of the element ${elementId}`);
  const { x, y } = Element.getCenter(value);
  let sourceX, sourceY, destinationX, destinationY;
  if (direction === 'left') {
    sourceX = x + (value.width * 49) / 100;
    sourceY = y;
    destinationX = (sourceX * percentage) / 100;
    destinationY = y;
  } else if (direction === 'right') {
    sourceX = x - (value.width * 49) / 100;
    sourceY = y;
    destinationX = sourceX + (sourceX * percentage) / 100;
    destinationY = y;
  } else if (direction === 'up') {
    sourceX = x;
    sourceY = y + (value.height * 49) / 100;
    destinationX = x;
    destinationY = (sourceY * percentage) / 100;
  } else if (direction === 'down') {
    sourceX = x;
    sourceY = y - (value.height * 49) / 100;
    destinationX = x;
    destinationY = sourceY + (sourceY * percentage) / 100;
  }
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
            x: sourceX,
            y: sourceY,
            type: 'pointerMove',
            origin: 'viewport',
          },
          { button: 1, type: 'pointerDown' },
          { duration: 600, type: 'pause' },
          {
            duration: 600,
            x: destinationX,
            y: destinationY,
            type: 'pointerMove',
            origin: 'viewport',
          },
          { button: 1, type: 'pointerUp' },
        ],
      },
    ],
  };
  let actionsUrl = `${driverInfo.driverUrl}/actions`;
  log.info(`Performing Swipe ${actionsUrl} with ${JSON.stringify(actionsData)}`);

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
