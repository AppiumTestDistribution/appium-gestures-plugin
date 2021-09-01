import * as Element from '../element';
import { post } from '../Api';
import log from '../logger';

export default async function dragAndDrop(body, sessionInfo) {
  console.log(sessionInfo);
  const [sourceLocation, sourceSize] = await Element.locationAndSizeOfElement(
    sessionInfo.url,
    sessionInfo.jwProxySessionId,
    body.sourceId,
    sessionInfo.automationName
  );

  const [destinationLocation, destinationSize] =
    await Element.locationAndSizeOfElement(
      sessionInfo.url,
      sessionInfo.jwProxySessionId,
      body.destinationId,
      sessionInfo.automationName
    );

  const { x: sourceX, y: sourceY } = Element.getCenter(
    sourceLocation,
    sourceSize
  );
  const { x: destinationX, y: destinationY } = Element.getCenter(
    destinationLocation,
    destinationSize
  );

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

  log.info(`Performing Drag and Drop with ${JSON.stringify(actionsData)}`);
  if (sessionInfo.automationName === 'XCuiTest') {
    await post({
      url: `${sessionInfo.url}/session/${sessionInfo.jwProxySessionId}/actions`,
      data: actionsData,
    });
  } else {
    const androidActions = actionsData;
    androidActions.actions[0].actions.unshift(androidPauseAction);
    await post({
      url: `${sessionInfo.url}/wd/hub/session/${sessionInfo.jwProxySessionId}/actions`,
      data: androidActions,
    });
  }
}
