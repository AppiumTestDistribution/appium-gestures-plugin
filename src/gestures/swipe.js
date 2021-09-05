import sessionInfo from '../sessionInfo';
import * as Element from '../element';
import log from '../logger';
import { post } from '../Api';

export default function SwipeBuilder(body, driver) {
  const driverInfo = sessionInfo(driver);
  return {
    horizontal: swipe(body, driverInfo),
  };
}

async function swipe(body, driverInfo) {
  console.log('Inside swipe', body, driverInfo);
  const url = `${driverInfo.driverUrl}/element/${body.elementId}`;
  console.log('----', url);
  const { value } = await Element.getElementLocation(url);
  console.log('*(*****', value.x, value.y);
  const destinationX = value.x + (body.percentage * value.x) / 100;
  const actionsData = {
    actions: [
      {
        id: 'finger',
        type: 'pointer',
        parameters: { pointerType: 'touch' },
        actions: [
          { duration: 0, type: 'pause' },
          {
            duration: 0,
            x: value.x,
            y: value.y,
            type: 'pointerMove',
            origin: 'viewport',
          },
          { button: 1, type: 'pointerDown' },
          { duration: 600, type: 'pause' },
          {
            duration: 600,
            x: destinationX,
            y: value.y,
            type: 'pointerMove',
            origin: 'viewport',
          },
          { button: 1, type: 'pointerUp' },
        ],
      },
    ],
  };
  let actionsUrl = `${driverInfo.driverUrl}/actions`;
  log.info(
    `Performing Swipe ${actionsUrl} with ${JSON.stringify(actionsData)}`
  );

  if (driverInfo.automationName === 'XCuiTest') {
    await post({
      url,
      data: actionsData,
    });
  } else {
    await post({
      url,
      data: actionsData,
    });
  }
}
