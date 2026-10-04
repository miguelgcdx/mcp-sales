import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

import { calculateLeadQualification } from '@/domain/lead-qualification';
import { findLeadById } from '@/services/leads';

const qualificationSchema = z.object({
  leadId: z.string(),
  score: z.number(),
  priority: z.enum(['low', 'medium', 'high']),
  qualified: z.boolean(),
  reasons: z.array(z.string()),
});

export function registerQualifyLeadTool(server: McpServer) {
  server.registerTool(
    'qualify-lead',
    {
      description:
        'Calculate the official qualification score for an existing CRM lead.',
      inputSchema: z.object({
        leadId: z.string(),
      }),

      // outputSchema describes the structured result clients can consume.
      outputSchema: qualificationSchema,
    },
    async ({ leadId }) => {
      const lead = await findLeadById(leadId);

      if (!lead) {
        return {
          content: [
            {
              type: 'text',
              text: `Lead ${leadId} was not found.`,
            },
          ],
          isError: true,
        };
      }

      const qualification = calculateLeadQualification({
        employees: lead.company.employees,
        annualRevenue: lead.company.annualRevenue,
        estimatedBudget: lead.estimatedBudget,
        need: lead.need,
      });

      const output = {
        leadId: lead.id,
        ...qualification,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],

        // structuredContent is the machine-readable result.
        structuredContent: output,
      };
    },
  );
}
