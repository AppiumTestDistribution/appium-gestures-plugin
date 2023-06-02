import * as Element from '../element';
import log from '../logger';

const magicNumber = 49;

function getDirectionActions(direction, value, percentage) {
  const { x, y } = Element.getCenter(value);
  const directionActions = {
    left: {
      sourceX: x + (value.width * magicNumber) / 100,
      sourceY: y,
      destinationX: (x + (value.width * magicNumber) / 100) * (percentage / 100),
      destinationY: y,
    },
    right: {
      sourceX: x - (value.width * magicNumber) / 100,
      sourceY: y,
      destinationX:
        x -
        (value.width * magicNumber) / 100 +
        (x - (value.width * magicNumber) / 100) * (percentage / 100),
      destinationY: y,
    },
    up: {
      sourceX: x,
      sourceY: y + (value.height * magicNumber) / 100,
      destinationX: x,
      destinationY: (y + (value.height * magicNumber) / 100) * (percentage / 100),
    },
    down: {
      sourceX: x,
      sourceY: y - (value.height * magicNumber) / 100,
      destinationX: x,
      destinationY:
        y -
        (value.height * magicNumber) / 100 +
        (y - (value.height * magicNumber) / 100) * (percentage / 100),
    },
  };
  const pointer = directionActions[direction];

  return pointer;
}

function getActionsData(elementId, pointer, driver) {
  const actionsData = {
    id: `${elementId}`,
    type: 'pointer',
    parameters: { pointerType: 'touch' },
    actions: [
      {
        duration: 0,
        x: pointer.sourceX,
        y: pointer.sourceY,
        type: 'pointerMove',
        origin: 'viewport',
      },
      { button: 1, type: 'pointerDown' },
      { duration: 600, type: 'pause' },
      {
        duration: 600,
        x: pointer.destinationX,
        y: pointer.destinationY,
        type: 'pointerMove',
        origin: 'viewport',
      },
      { button: 1, type: 'pointerUp' },
    ],
  };

  if (driver.caps.automationName !== 'XCuiTest') {
    actionsData.actions.unshift({ duration: 0, type: 'pause' });
  }

  return actionsData;
}

async function isElementFound(driver, strategy, selector) {
  try {
    log.info(`Checking if element ${selector} ${strategy} is found`);
    await driver.findElement(strategy, selector);
    return true;
  } catch (e) {
    return false;
  }
}

export async function swipe(elementId, percentage, direction, driver) {
  {
    const swipeAction = [];

    const value = await driver.getElementRect(elementId);

    log.info(`Swiping ${direction} at ${percentage}% of the element ${elementId}`);

    const pointer = getDirectionActions(direction, value, percentage);

    const actionsData = getActionsData(elementId, pointer, driver);

    swipeAction.push(actionsData);

    await driver.performActions(swipeAction);
  }
}

export async function swipeUntilElementExist(
  scrollableView,
  strategy,
  selector,
  percentage,
  direction,
  maxCount = 5,
  driver
) {
  {
    let count = 0;
    let isElement = await isElementFound(driver, strategy, selector);
    while (count < maxCount && !isElement) {
      swipe(scrollableView, percentage, direction, driver);
      count++;
      isElement = await isElementFound(driver, strategy, selector);
    }
  }
}
