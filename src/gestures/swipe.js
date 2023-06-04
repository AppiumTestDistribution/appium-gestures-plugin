import * as Element from '../element';
import log from '../logger';

const MAGIC_NUMBER = 49;

export async function swipe(elementId, percentage, direction, driver) {
  const swipeActions = [];
  const value = await driver.getElementRect(elementId);
  log.info(`Swiping ${direction} at ${percentage}% of the element ${elementId}`);
  const pointer = getDirectionActions(direction, value, percentage);
  const actionsData = getActionsData(elementId, pointer, driver);
  swipeActions.push(actionsData);
  await driver.performActions(swipeActions);
}

export async function scrollElementIntoView(config) {
  const {
    scrollableView,
    strategy,
    selector,
    percentage,
    direction,
    maxCount = 5,
    driver,
  } = config;

  for (
    let count = 0;
    count < maxCount && !(await isElementFound(driver, strategy, selector));
    count++
  ) {
    log.info('Swiping now...');
    await swipe(scrollableView, percentage, direction, driver);
  }
}

function getDirectionActions(direction, value, percentage) {
  const { x, y } = Element.getCenter(value);
  const directionActions = {
    left: {
      sourceX: x + (value.width * MAGIC_NUMBER) / 100,
      sourceY: y,
      destinationX: (x + (value.width * MAGIC_NUMBER) / 100) * (percentage / 100),
      destinationY: y,
    },
    right: {
      sourceX: (x + (value.width * MAGIC_NUMBER) / 100) * (percentage / 100),
      sourceY: y,
      destinationX: x + (value.width * MAGIC_NUMBER) / 100,
      destinationY: y,
    },
    up: {
      sourceX: x,
      sourceY: y + (value.height * MAGIC_NUMBER) / 100,
      destinationX: x,
      destinationY: y - percentage / 100,
    },
    down: {
      sourceX: x,
      sourceY: y - percentage / 100,
      destinationX: x,
      destinationY: y + (value.height * MAGIC_NUMBER) / 100,
    },
  };
  return directionActions[direction];
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
    log.info(`Checking if ${strategy} element '${selector}' is present`);
    await driver.findElement(strategy, selector);
    log.info(`Element '${selector}' is found`);
    return true;
  } catch (e) {
    log.info(`Element '${selector}' is not found`);
    return false;
  }
}
