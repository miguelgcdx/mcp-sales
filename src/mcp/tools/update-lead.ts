import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

import type { LeadStatus } from '@/generated/prisma/client';
import { updateLeadStatus } from '@/services/leads';

const statusMap = {
  new: 'NEW',
  contacted: 'CONTACTED',
  qualified: 'QUALIFIED',
  unqualified: 'UNQUALIFIED',
} as const satisfies Record<string, LeadStatus>;

export function registerUpdateLeadTool(server: McpServer) {
  server.registerTool(
    'update-lead',
    {
      description: 'Update the CRM status of an existing lead.',
      inputSchema: z.object({
        email: z.email(),
        status: z.enum(['new', 'contacted', 'qualified', 'unqualified']),
      }),
    },
    async ({ email, status }) => {
      try {
        const lead = await updateLeadStatus(email, statusMap[status]);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(lead, null, 2),
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: `Could not update lead ${email}.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
