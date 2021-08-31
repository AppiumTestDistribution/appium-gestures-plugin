import * as Element from '../element';
import { post } from '../Api';
import log from '../logger';

export default async function dragAndDrop(driver, body) {
  const host = `http://${driver.uiautomator2.host}:${driver.uiautomator2.systemPort}`;
  const jwproxySession = driver.uiautomator2.jwproxy.sessionId;

  const [sourceLocation, sourceSize] = await Element.locationAndSizeOfElement(
    host,
    jwproxySession,
    body.sourceId
  );

  const [destinationLocation, destinationSize] =
    await Element.locationAndSizeOfElement(
      host,
      jwproxySession,
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
    url: `${host}/wd/hub/session/${jwproxySession}/actions`,
    data: actionsData,
  });
}
