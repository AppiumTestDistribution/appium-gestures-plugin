import * as Element from '../element';
import { post } from '../Api';
import log from '../logger';

export default async function dragAndDrop(body, sessionInfo) {
  console.log(sessionInfo);
  const [sourceLocation, sourceSize] = await Element.locationAndSizeOfElement(
    sessionInfo.url,
    sessionInfo.jwProxySessionId,
    body.sourceId
  );

  const [destinationLocation, destinationSize] =
    await Element.locationAndSizeOfElement(
      sessionInfo.url,
      sessionInfo.jwProxySessionId,
      body.destinationId
    );

  const { x: sourceX, y: sourceY } = Element.getCenter(
    await sourceLocation,
    await sourceSize
  );
  const { x: destinationX, y: destinationY } = Element.getCenter(
    await destinationLocation,
    await destinationSize
  );

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
            type: 'pause',
          },
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
  await post({
    url: `${sessionInfo.url}/wd/hub/session/${sessionInfo.jwProxySessionId}/actions`,
    data: actionsData,
  });
}
