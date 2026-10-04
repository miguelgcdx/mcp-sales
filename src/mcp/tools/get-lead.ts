import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

import { findLeadByEmail } from '@/services/leads';

// registerTool() exposes this capability through the MCP protocol.
// Any connected MCP client can discover and call it.
export function registerGetLeadTool(server: McpServer) {
  server.registerTool(
    'get-lead',
    {
      description: 'Get one CRM lead using their exact email address.',
      inputSchema: z.object({
        email: z.email().describe('Exact email address of the CRM lead'),
      }),
    },
    async ({ email }) => {
      const lead = await findLeadByEmail(email);

      if (!lead) {
        return {
          content: [
            {
              type: 'text',
              text: `No CRM lead found for ${email}.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(lead, null, 2),
          },
        ],
      };
    },
  );
}
