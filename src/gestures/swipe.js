import * as Element from '../element';
import log from '../logger';

export default function SwipeBuilder(actions, driver) {
  return {
    swipe: swipe(actions, driver),
  };
}

async function swipe(actions, driver) {
  log.info(`Actions are: ${JSON.stringify(actions, null, 2)}`);
  let swipeAction = [];
  for (const action of actions) {
    if (action.elementId !== undefined) {
      const value = await driver.getElementRect(action.elementId);
      log.info(
        `Swiping ${action.direction} at ${action.percentage}% of the element ${action.elementId}`
      );
      const { x, y } = Element.getCenter(value);
      let sourceX, sourceY, destinationX, destinationY;
      if (action.direction === 'left') {
        sourceX = x + (value.width * 49) / 100;
        sourceY = y;
        destinationX = (sourceX * action.percentage) / 100;
        destinationY = y;
      } else if (action.direction === 'right') {
        sourceX = x - (value.width * 49) / 100;
        sourceY = y;
        destinationX = sourceX + (sourceX * action.percentage) / 100;
        destinationY = y;
      } else if (action.direction === 'up') {
        sourceX = x;
        sourceY = y + (value.height * 49) / 100;
        destinationX = x;
        destinationY = (sourceY * action.percentage) / 100;
      } else if (action.direction === 'down') {
        sourceX = x;
        sourceY = y - (value.height * 49) / 100;
        destinationX = x;
        destinationY = sourceY + (sourceY * action.percentage) / 100;
      }
      const androidPauseAction = {
        duration: 0,
        type: 'pause',
      };
      const actionsData = {
        id: `${action.elementId}`,
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
      };
      if (driver.caps.automationName !== 'XCuiTest') {
        const androidActions = actionsData;
        androidActions.actions.unshift(androidPauseAction);
      }
      swipeAction.push(actionsData);
    }
  }
  await driver.performActions(swipeAction);
}
