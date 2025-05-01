import express from 'express';
import bodyParser from 'body-parser';
import { logger } from '@appium/support';
import { startSseServer } from './server';

const log = logger.getLogger('gestures-mcp-sse');

/**
 * Create and start an SSE MCP server
 * @param {object} driver - The Appium driver instance
 * @param {object} options - Server options
 * @param {number} options.port - The port to listen on (default: 4723)
 * @returns {object} The express app and MCP server
 */
export async function createSseServer(driver, options = {}) {
  const { port = 4723 } = options;

  // Create Express app
  const app = express();
  app.use(bodyParser.json());

  // Create and start MCP server
  const mcpServer = await startSseServer(driver, port);

  // Setup routes
  app.get('/status', (req, res) => {
    res.json({
      status: 'running',
      mode: 'sse',
      version: '1.0.0',
      tools: mcpServer.getToolNames(),
    });
  });

  // Start Express server
  const server = app.listen(port, () => {
    log.info(`Gestures MCP SSE server listening on port ${port}`);
  });

  return { app, server, mcpServer };
}

/**
 * Stop the SSE server
 * @param {object} server - The server object returned by createSseServer
 */
export async function stopSseServer(server) {
  if (server.mcpServer) {
    await server.mcpServer.stop();
  }

  if (server.server && server.server.close) {
    return new Promise((resolve) => {
      server.server.close(() => {
        log.info('Gestures MCP SSE server stopped');
        resolve();
      });
    });
  }
}
