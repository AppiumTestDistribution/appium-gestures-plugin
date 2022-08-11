import * as Element from '../element';
import log from '../logger';

export default function SwipeBuilder(elementId, percentage, direction, driver) {
  return {
    swipe: swipe(elementId, percentage, direction, driver),
  };
}

async function swipe(elementId, percentage, direction, driver) {
  const value = await driver.getElementRect(elementId);
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
  const actionsData = [
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
  ];
  if (driver.caps.automationName === 'XCuiTest') {
    await driver.performActions(actionsData);
  } else {
    const androidActions = actionsData;
    androidActions[0].actions.unshift(androidPauseAction);
    await driver.performActions(actionsData);
  }
}
