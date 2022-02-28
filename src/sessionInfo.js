export default function sessionInfo(driver) {
  console.log(`sessionInfo: ${driver.uiautomator2.host}`);
  console.log(`sessionInfo: ${driver.uiautomator2.systemPort}`);
  const automationName = driver.caps['appium:automationName'];

  const baseUrl = `http://${driver.uiautomator2.host}:${driver.uiautomator2.systemPort}/wd/hub`;
  const jwProxySessionId = driver.uiautomator2.jwproxy.sessionId;
  return {
    baseUrl,
    jwProxySessionId,
    automationName,
    driverUrl: `${baseUrl}/session/${jwProxySessionId}`,
  };
}
