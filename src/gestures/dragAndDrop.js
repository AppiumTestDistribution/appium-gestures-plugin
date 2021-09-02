import * as Element from '../element';
import { post } from '../Api';
import log from '../logger';

export default async function dragAndDrop(body, sessionInfo) {
  const [[sourceLocation, sourceSize], [destinationLocation, destinationSize]] =
    await Promise.all([
      Element.locationAndSizeOfElement(
        Object.assign({}, sessionInfo, { elementId: body.sourceId })
      ),
      Element.locationAndSizeOfElement(
        Object.assign({}, sessionInfo, { elementId: body.destinationId })
      ),
    ]);

  const [{ x: sourceX, y: sourceY }, { x: destinationX, y: destinationY }] =
    await Promise.all([
      Element.getCenter(sourceLocation, sourceSize),
      Element.getCenter(destinationLocation, destinationSize),
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

  let url = `${sessionInfo.url}/session/${sessionInfo.jwProxySessionId}/actions`;
  log.info(
    `Performing Drag and Drop ${url} with ${JSON.stringify(actionsData)}`
  );

  if (sessionInfo.automationName === 'XCuiTest') {
    await post({
      url,
      data: actionsData,
    });
  } else {
    const androidActions = actionsData;
    androidActions.actions[0].actions.unshift(androidPauseAction);
    await post({
      url,
      data: androidActions,
    });
  }
}
