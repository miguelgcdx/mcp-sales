import 'dotenv/config';

import { createServer } from 'node:http';

import { toNodeHandler } from '@modelcontextprotocol/node';
import { createMcpHandler } from '@modelcontextprotocol/server';

import { createSalesMcpServer } from '@/mcp/create-server';

const port = Number(process.env.MCP_HTTP_PORT ?? 3333);
const expectedToken = process.env.MCP_API_TOKEN;

// createMcpHandler() exposes the same MCP server factory over
// Streamable HTTP instead of stdio.
const mcpHandler = createMcpHandler(() => createSalesMcpServer());
const nodeHandler = toNodeHandler(mcpHandler);

const httpServer = createServer(async (request, response) => {
  const url = new URL(
    request.url ?? '/',
    `http://${request.headers.host ?? '127.0.0.1'}`,
  );

  if (url.pathname !== '/mcp') {
    response.writeHead(404, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  if (!expectedToken) {
    response.writeHead(500, {
      'Content-Type': 'application/json',
    });
    response.end(
      JSON.stringify({
        error: 'MCP_API_TOKEN is not configured',
      }),
    );
    return;
  }

  // This project uses a simple Bearer token gate so we can learn
  // the HTTP/auth boundary. A real public server would normally use
  // OAuth 2.0 token verification and MCP protected-resource metadata.
  if (request.headers.authorization !== `Bearer ${expectedToken}`) {
    response.writeHead(401, {
      'Content-Type': 'application/json',
      'WWW-Authenticate': 'Bearer',
    });
    response.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  await nodeHandler(request, response);
});

httpServer.listen(port, '127.0.0.1', () => {
  console.error(
    `sales-crm MCP HTTP server listening on http://127.0.0.1:${port}/mcp`,
  );
});

async function shutdown() {
  await mcpHandler.close();

  httpServer.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  void shutdown();
});

process.on('SIGTERM', () => {
  void shutdown();
});
