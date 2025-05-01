import BasePlugin from '@appium/base-plugin';
import dragAndDrop from './gestures/dragAndDrop';
import { swipe, scrollElementIntoView } from './gestures/swipe';
import doubleTap from './gestures/doubleTap';
import longPress from './gestures/longPress';
import { createSseServer, stopSseServer, createStdioServer, stopStdioServer } from './mcp';
import { logger } from '@appium/support';

const log = logger.getLogger('gestures-plugin');

export default class GesturesPlugin extends BasePlugin {
  // MCP server instances
  sseServer = null;
  stdioServer = null;

  static executeMethodMap = {
    'gesture: dragAndDrop': {
      command: 'dragAndDrop',
      params: { required: ['sourceId', 'destinationId'] },
    },
    'gesture: swipe': {
      command: 'swipe',
      params: {
        required: ['elementId', 'percentage', 'direction'],
      },
    },
    'gesture: scrollElementIntoView': {
      command: 'scrollElementIntoView',
      params: {
        required: ['scrollableView', 'strategy', 'selector', 'percentage', 'direction', 'maxCount'],
      },
    },
    'gesture: doubleTap': {
      command: 'doubleTap',
      params: { required: ['elementId'] },
    },
    'gesture: longPress': {
      command: 'longPress',
      params: { required: ['elementId', 'pressure', 'duration'] },
    },
    'gesture: startMcpServer': {
      command: 'startMcpServer',
      params: {
        optional: ['mode', 'port'],
      },
    },
    'gesture: stopMcpServer': {
      command: 'stopMcpServer',
      params: {
        optional: ['mode'],
      },
    },
  };

  constructor(pluginName) {
    super(pluginName);
  }

  /**
   * Called when the plugin is initialized
   * @param {object} driver - The Appium driver instance
   */
  async onDriverInit(driver) {
    log.info('Initializing Gestures Plugin with MCP support');
    await this.startMcpServers(driver, {
      sse: true,
      stdio: true,
      port: 4723,
    });
  }

  /**
   * Called when the plugin is terminated
   */
  async onDriverQuit() {
    log.info('Terminating Gestures Plugin');
    await this.stopMcpServers();
  }

  async execute(next, driver, script, args) {
    return await this.executeMethod(next, driver, script, args);
  }

  async swipe(next, driver, elementId, percentage, direction) {
    await swipe(elementId, percentage, direction, driver);
  }

  async scrollElementIntoView(
    next,
    driver,
    scrollableView,
    strategy,
    selector,
    percentage,
    direction,
    maxCount
  ) {
    await scrollElementIntoView({
      scrollableView,
      strategy,
      selector,
      percentage,
      direction,
      maxCount,
      driver,
    });
  }

  async dragAndDrop(next, driver, sourceId, destinationId) {
    await dragAndDrop(sourceId, destinationId, driver);
  }

  async doubleTap(next, driver, elementId) {
    await doubleTap(elementId, driver);
  }

  async longPress(next, driver, elementId, pressure, duration) {
    await longPress(elementId, pressure, duration, driver);
  }

  /**
   * Start an MCP server
   * @param {object} next - The next handler in the chain
   * @param {object} driver - The Appium driver instance
   * @param {string} mode - The server mode ('sse' or 'stdio')
   * @param {number} port - The port for the SSE server
   * @returns {object} Information about the started server
   */
  async startMcpServer(next, driver, mode = 'sse', port = 4723) {
    log.info(`Starting MCP server in ${mode} mode`);

    if (mode === 'sse') {
      if (this.sseServer) {
        log.info('MCP SSE server is already running');
        return { status: 'already_running', mode: 'sse', port };
      }

      try {
        this.sseServer = await createSseServer(driver, { port });
        log.info(`MCP SSE server started on port ${port}`);
        return { status: 'started', mode: 'sse', port };
      } catch (error) {
        log.error(`Failed to start MCP SSE server: ${error.message}`);
        throw new Error(`Failed to start MCP SSE server: ${error.message}`);
      }
    } else if (mode === 'stdio') {
      if (this.stdioServer) {
        log.info('MCP stdio server is already running');
        return { status: 'already_running', mode: 'stdio' };
      }

      try {
        this.stdioServer = await createStdioServer(driver);
        log.info('MCP stdio server started');
        return { status: 'started', mode: 'stdio' };
      } catch (error) {
        log.error(`Failed to start MCP stdio server: ${error.message}`);
        throw new Error(`Failed to start MCP stdio server: ${error.message}`);
      }
    } else {
      throw new Error(`Invalid MCP server mode: ${mode}. Supported modes are 'sse' and 'stdio'.`);
    }
  }

  /**
   * Stop an MCP server
   * @param {object} next - The next handler in the chain
   * @param {object} driver - The Appium driver instance
   * @param {string} mode - The server mode ('sse', 'stdio', or 'all')
   * @returns {object} Information about the stopped server
   */
  async stopMcpServer(next, driver, mode = 'all') {
    log.info(`Stopping MCP server(s): ${mode}`);
    const result = { stopped: [] };

    if (mode === 'sse' || mode === 'all') {
      if (this.sseServer) {
        try {
          await stopSseServer(this.sseServer);
          this.sseServer = null;
          log.info('MCP SSE server stopped');
          result.stopped.push('sse');
        } catch (error) {
          log.error(`Failed to stop MCP SSE server: ${error.message}`);
          throw new Error(`Failed to stop MCP SSE server: ${error.message}`);
        }
      } else if (mode === 'sse') {
        log.info('MCP SSE server is not running');
      }
    }

    if (mode === 'stdio' || mode === 'all') {
      if (this.stdioServer) {
        try {
          await stopStdioServer(this.stdioServer);
          this.stdioServer = null;
          log.info('MCP stdio server stopped');
          result.stopped.push('stdio');
        } catch (error) {
          log.error(`Failed to stop MCP stdio server: ${error.message}`);
          throw new Error(`Failed to stop MCP stdio server: ${error.message}`);
        }
      } else if (mode === 'stdio') {
        log.info('MCP stdio server is not running');
      }
    }

    return result;
  }

  /**
   * Start MCP servers
   * @param {object} driver - The Appium driver instance
   * @param {object} options - Server options
   * @param {boolean} options.sse - Whether to start the SSE server (default: true)
   * @param {boolean} options.stdio - Whether to start the stdio server (default: false)
   * @param {number} options.port - The port for the SSE server (default: 4723)
   */
  async startMcpServers(driver, options = {}) {
    const { sse = true, stdio = false, port = 4723 } = options;

    if (sse) {
      try {
        log.info(`Starting MCP SSE server on port ${port}`);
        this.sseServer = await createSseServer(driver, { port });
        log.info('MCP SSE server started successfully');
      } catch (error) {
        log.error(`Failed to start MCP SSE server: ${error.message}`);
      }
    }

    if (stdio) {
      try {
        log.info('Starting MCP stdio server');
        this.stdioServer = await createStdioServer(driver);
        log.info('MCP stdio server started successfully');
      } catch (error) {
        log.error(`Failed to start MCP stdio server: ${error.message}`);
      }
    }
  }

  /**
   * Stop MCP servers
   */
  async stopMcpServers() {
    if (this.sseServer) {
      try {
        await stopSseServer(this.sseServer);
        this.sseServer = null;
        log.info('MCP SSE server stopped successfully');
      } catch (error) {
        log.error(`Failed to stop MCP SSE server: ${error.message}`);
      }
    }

    if (this.stdioServer) {
      try {
        await stopStdioServer(this.stdioServer);
        this.stdioServer = null;
        log.info('MCP stdio server stopped successfully');
      } catch (error) {
        log.error(`Failed to stop MCP stdio server: ${error.message}`);
      }
    }
  }
}
