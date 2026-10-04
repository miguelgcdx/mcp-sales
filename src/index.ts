import 'dotenv/config';

import { serveStdio } from '@modelcontextprotocol/server/stdio';

import { createSalesMcpServer } from '@/mcp/create-server';

// serveStdio() exposes the same MCP server factory over stdin/stdout.
// stdout belongs to the MCP protocol, so server logs must use stderr.
void serveStdio(() => createSalesMcpServer());

console.error('sales-crm MCP server running on stdio');
