import BasePlugin from "@appium/base-plugin";
import dragAndDrop from "./gestures/dragAndDrop";
import SwipeBuilder from "./gestures/swipe";
import log from "../src/logger";

const SOURCE_URL_RE = new RegExp("/session/[^/]+/plugin/actions/");

export default class GesturesPlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
  }

  static newMethodMap = {
    "/session/:sessionId/plugin/actions/dragAndDrop": {
      POST: {
        command: "dragAndDrop",
        payloadParams: { required: ["sourceId", "destinationId"] },
        neverProxy: true,
      },
    },
    "/session/:sessionId/plugin/actions/swipe": {
      POST: {
        command: "swipe",
        payloadParams: { required: ["elementId", "percentage"] },
        neverProxy: true,
      },
    },
  };

  // shouldAvoidProxy(method, route, body) {
  //   console.log(`shouldAvoidProxy: ${method} ${route} ${body}`);
  //   this.body = body;
  //   return SOURCE_URL_RE.test(route);
  // }

  async swipe(next, driver, ...args) {
    const builder = SwipeBuilder(...args, driver);
    await builder.horizontal;
  }

  async dragAndDrop(next, driver, ...args) {
    console.log("dragAndDrop", JSON.stringify(driver));
    const builder = dragAndDrop(...args, driver);
    await builder.dragAndDrop;
  }
}
