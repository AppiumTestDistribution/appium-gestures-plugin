import { logger } from '@appium/support';
import { startStdioServer } from './server';

const log = logger.getLogger('gestures-mcp-stdio');

/**
 * Create and start a stdio MCP server
 * @param {object} driver - The Appium driver instance
 * @returns {object} The MCP server instance
 */
export async function createStdioServer(driver) {
  log.info('Starting Gestures MCP stdio server');

  // Create and start MCP server in stdio mode
  const mcpServer = await startStdioServer(driver);

  return mcpServer;
}

/**
 * Stop the stdio server
 * @param {object} server - The MCP server instance
 */
export async function stopStdioServer(server) {
  if (server && typeof server.stop === 'function') {
    await server.stop();
    log.info('Gestures MCP stdio server stopped');
  }
}
