import * as Element from '../element';
import log from '../logger';

export default async function swipe(elementId, percentage, direction, driver) {
  {
    const swipeAction = [];

    const value = await driver.getElementRect(elementId);

    log.info(`Swiping ${direction} at ${percentage}% of the element ${elementId}`);

    const { x, y } = Element.getCenter(value);

    const directionActions = {
      left: {
        sourceX: x + (value.width * 49) / 100,
        sourceY: y,
        destinationX: (x + (value.width * 49) / 100) * (percentage / 100),
        destinationY: y,
      },
      right: {
        sourceX: x - (value.width * 49) / 100,
        sourceY: y,
        destinationX:
          x - (value.width * 49) / 100 + (x - (value.width * 49) / 100) * (percentage / 100),
        destinationY: y,
      },
      up: {
        sourceX: x,
        sourceY: y + (value.height * 49) / 100,
        destinationX: x,
        destinationY: (y + (value.height * 49) / 100) * (percentage / 100),
      },
      down: {
        sourceX: x,
        sourceY: y - (value.height * 49) / 100,
        destinationX: x,
        destinationY:
          y - (value.height * 49) / 100 + (y - (value.height * 49) / 100) * (percentage / 100),
      },
    };

    const { sourceX, sourceY, destinationX, destinationY } = directionActions[direction];

    const actionsData = {
      id: `${elementId}`,
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
      actionsData.actions.unshift({ duration: 0, type: 'pause' });
    }

    swipeAction.push(actionsData);

    await driver.performActions(swipeAction);
  }
}
