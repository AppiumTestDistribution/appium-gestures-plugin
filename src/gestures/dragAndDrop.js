import * as Element from '../element';
import log from '../logger';

export default function DragAndDropBuilder(sourceId, destinationId, driver) {
  return {
    dragAndDrop: dragAndDrop(sourceId, destinationId, driver),
  };
}

async function dragAndDrop(sourceId, destinationId, driver) {
  const [source, destination] = await Promise.all([
    driver.getElementRect(sourceId),
    driver.getElementRect(destinationId),
  ]);

  const [{ x: sourceX, y: sourceY }, { x: destinationX, y: destinationY }] = await Promise.all([
    Element.getCenter(source),
    Element.getCenter(destination),
  ]);

  const androidPauseAction = {
    duration: 0,
    type: 'pause',
  };

  const actionsData = [
    {
      id: 'finger',
      type: 'pointer',
      parameters: {
        pointerType: 'touch',
      },
      actions: [
        {
          duration: 0,
          x: sourceX,
          y: sourceY,
          type: 'pointerMove',
          origin: 'viewport',
        },
        {
          button: 1,
          type: 'pointerDown',
        },
        {
          duration: 600,
          type: 'pause',
        },
        {
          duration: 600,
          x: destinationX,
          y: destinationY,
          type: 'pointerMove',
          origin: 'viewport',
        },
        {
          button: 1,
          type: 'pointerUp',
        },
      ],
    },
  ];

  if (driver.caps.automationName === 'XCuiTest') {
    await driver.performActions(actionsData);
  } else {
    log.info('Drag and Drop for android');
    const androidActions = actionsData;
    androidActions[0].actions.unshift(androidPauseAction);
    await driver.performActions(actionsData);
  }
}
