export default function sessionInfo(driver) {
  const automationName = driver.caps.automationName;

  if (automationName === 'XCuiTest') {
    const baseUrl = `${driver.wda.wdaBaseUrl}:${driver.wda.wdaRemotePort}`;
    const jwProxySessionId = driver.wda.jwproxy.sessionId;
    return {
      baseUrl,
      jwProxySessionId,
      automationName,
      driverUrl: `${baseUrl}/session/${jwProxySessionId}`,
    };
  } else {
    const baseUrl = `http://${driver.uiautomator2.host}:${driver.uiautomator2.systemPort}`;
    const jwProxySessionId = driver.uiautomator2.jwproxy.sessionId;
    return {
      baseUrl,
      jwProxySessionId,
      automationName,
      driverUrl: `${baseUrl}/session/${jwProxySessionId}`,
    };
  }
}
