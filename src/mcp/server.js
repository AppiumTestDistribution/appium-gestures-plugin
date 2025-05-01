import { createServer } from '@appium/mcp';
import { logger } from '@appium/support';
import dragAndDrop from '../gestures/dragAndDrop';
import { swipe, scrollElementIntoView } from '../gestures/swipe';
import doubleTap from '../gestures/doubleTap';
import longPress from '../gestures/longPress';

const log = logger.getLogger('gestures-mcp');

/**
 * Create an MCP server for the gestures plugin
 * @param {object} driver - The Appium driver instance
 * @param {string} mode - The server mode ('sse' or 'stdio')
 * @returns {object} The MCP server instance
 */
export function createMcpServer(driver, mode = 'sse') {
  log.info(`Creating MCP server in ${mode} mode`);

  const server = createServer({
    name: 'appium-gestures-plugin',
    version: '1.0.0',
    mode,
  });

  // Register tools
  server.registerTool({
    name: 'dragAndDrop',
    description: 'Drag and drop from source element to destination element',
    inputSchema: {
      type: 'object',
      properties: {
        sourceId: {
          type: 'string',
          description: 'ID of the source element',
        },
        destinationId: {
          type: 'string',
          description: 'ID of the destination element',
        },
      },
      required: ['sourceId', 'destinationId'],
    },
    execute: async ({ sourceId, destinationId }) => {
      log.info(`Executing dragAndDrop from ${sourceId} to ${destinationId}`);
      await dragAndDrop(sourceId, destinationId, driver);
      return { success: true, message: 'Drag and drop completed successfully' };
    },
  });

  server.registerTool({
    name: 'swipe',
    description: 'Swipe on an element in a specific direction',
    inputSchema: {
      type: 'object',
      properties: {
        elementId: {
          type: 'string',
          description: 'ID of the element to swipe on',
        },
        percentage: {
          type: 'number',
          description: 'Percentage of the element to swipe',
        },
        direction: {
          type: 'string',
          enum: ['up', 'down', 'left', 'right'],
          description: 'Direction to swipe',
        },
      },
      required: ['elementId', 'percentage', 'direction'],
    },
    execute: async ({ elementId, percentage, direction }) => {
      log.info(`Executing swipe on ${elementId} with ${percentage}% in ${direction} direction`);
      await swipe(elementId, percentage, direction, driver);
      return { success: true, message: 'Swipe completed successfully' };
    },
  });

  server.registerTool({
    name: 'scrollElementIntoView',
    description: 'Scroll until an element is found',
    inputSchema: {
      type: 'object',
      properties: {
        scrollableView: {
          type: 'string',
          description: 'ID of the scrollable container element',
        },
        strategy: {
          type: 'string',
          description: 'Locator strategy (e.g., id, xpath, etc.)',
        },
        selector: {
          type: 'string',
          description: 'Selector to find the element',
        },
        percentage: {
          type: 'number',
          description: 'Percentage of the scrollable view to scroll',
        },
        direction: {
          type: 'string',
          enum: ['up', 'down', 'left', 'right'],
          description: 'Direction to scroll',
        },
        maxCount: {
          type: 'number',
          description: 'Maximum number of scroll attempts',
          default: 5,
        },
      },
      required: ['scrollableView', 'strategy', 'selector', 'percentage', 'direction'],
    },
    execute: async ({
      scrollableView,
      strategy,
      selector,
      percentage,
      direction,
      maxCount = 5,
    }) => {
      log.info(`Executing scrollElementIntoView for ${selector} using ${strategy}`);
      await scrollElementIntoView({
        scrollableView,
        strategy,
        selector,
        percentage,
        direction,
        maxCount,
        driver,
      });
      return { success: true, message: 'Scroll completed successfully' };
    },
  });

  server.registerTool({
    name: 'doubleTap',
    description: 'Double tap on an element',
    inputSchema: {
      type: 'object',
      properties: {
        elementId: {
          type: 'string',
          description: 'ID of the element to double tap on',
        },
      },
      required: ['elementId'],
    },
    execute: async ({ elementId }) => {
      log.info(`Executing doubleTap on ${elementId}`);
      await doubleTap(elementId, driver);
      return { success: true, message: 'Double tap completed successfully' };
    },
  });

  server.registerTool({
    name: 'longPress',
    description: 'Long press on an element',
    inputSchema: {
      type: 'object',
      properties: {
        elementId: {
          type: 'string',
          description: 'ID of the element to long press on',
        },
        pressure: {
          type: 'number',
          description: 'Pressure to apply (percentage)',
          default: 50,
        },
        duration: {
          type: 'number',
          description: 'Duration of the long press in milliseconds',
          default: 1000,
        },
      },
      required: ['elementId'],
    },
    execute: async ({ elementId, pressure = 50, duration = 1000 }) => {
      log.info(`Executing longPress on ${elementId} with pressure ${pressure}% for ${duration}ms`);
      await longPress(elementId, pressure, duration, driver);
      return { success: true, message: 'Long press completed successfully' };
    },
  });

  return server;
}

/**
 * Start an MCP server in SSE mode
 * @param {object} driver - The Appium driver instance
 * @param {number} port - The port to listen on
 * @returns {object} The MCP server instance
 */
export async function startSseServer(driver, port = 4723) {
  const server = createMcpServer(driver, 'sse');
  await server.start({ port });
  log.info(`MCP SSE server started on port ${port}`);
  return server;
}

/**
 * Start an MCP server in stdio mode
 * @param {object} driver - The Appium driver instance
 * @returns {object} The MCP server instance
 */
export async function startStdioServer(driver) {
  const server = createMcpServer(driver, 'stdio');
  await server.start();
  log.info('MCP stdio server started');
  return server;
}
