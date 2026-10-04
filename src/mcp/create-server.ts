import { McpServer } from '@modelcontextprotocol/server';

import { registerSalesPrompts } from '@/mcp/prompts/sales-prompts';
import { registerSalesResources } from '@/mcp/resources/sales-resources';
import { registerGetLeadTool } from '@/mcp/tools/get-lead';
import { registerQualifyLeadTool } from '@/mcp/tools/qualify-lead';
import { registerSearchLeadsTool } from '@/mcp/tools/search-leads';
import { registerUpdateLeadTool } from '@/mcp/tools/update-lead';

// McpServer is the container that owns the tools, resources, and prompts
// exposed by this MCP server.
export function createSalesMcpServer() {
  const server = new McpServer({
    name: 'sales-crm',
    version: '1.0.0',
    description: 'CRM tools, sales resources, and reusable sales prompts.',
  });

  registerGetLeadTool(server);
  registerSearchLeadsTool(server);
  registerQualifyLeadTool(server);
  registerUpdateLeadTool(server);

  registerSalesResources(server);
  registerSalesPrompts(server);

  return server;
}
