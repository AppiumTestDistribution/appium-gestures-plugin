import * as Element from '../element';
import { post } from '../Api';
import log from '../logger';
import sessionInfo from '../sessionInfo';

export default function DragAndDropBuilder(body, driver) {
  const driverInfo = sessionInfo(driver);
  return {
    dragAndDrop: dragAndDrop(body, driverInfo),
  };
}

async function dragAndDrop(body, driverInfo) {
  const sourceElementUrl = `${driverInfo.driverUrl}/element/${body.sourceId}`;
  const destinationElementUrl = `${driverInfo.driverUrl}/element/${body.destinationId}`;

  const [source, destination] = await Promise.all([
    Element.getElementRect(sourceElementUrl),
    Element.getElementRect(destinationElementUrl),
  ]);

  console.log('Source', source, 'Destination', destination);

  const [{ x: sourceX, y: sourceY }, { x: destinationX, y: destinationY }] =
    await Promise.all([
      Element.getCenter(source),
      Element.getCenter(destination),
    ]);

  const androidPauseAction = {
    duration: 0,
    type: 'pause',
  };

  const actionsData = {
    actions: [
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
    ],
  };

  let actionsUrl = `${driverInfo.driverUrl}/actions`;
  log.info(
    `Performing Drag and Drop ${actionsUrl} with ${JSON.stringify(actionsData)}`
  );

  if (driverInfo.automationName === 'XCuiTest') {
    await post({
      url: actionsUrl,
      data: actionsData,
    });
  } else {
    log.info('Drag and Drop for android');
    const androidActions = actionsData;
    androidActions.actions[0].actions.unshift(androidPauseAction);
    await post({
      url: actionsUrl,
      data: androidActions,
    });
  }
}
