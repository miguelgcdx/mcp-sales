import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

import { searchLeads } from '@/services/leads';

export function registerSearchLeadsTool(server: McpServer) {
  server.registerTool(
    'search-leads',
    {
      description:
        'Search CRM leads by person name, email, company, or sales need.',
      inputSchema: z.object({
        query: z.string(),
      }),
    },
    async ({ query }) => {
      const leads = await searchLeads(query);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(leads, null, 2),
          },
        ],
      };
    },
  );
}
