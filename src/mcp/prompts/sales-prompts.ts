import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

export function registerSalesPrompts(server: McpServer) {
  // MCP prompts are reusable templates a client/user explicitly requests.
  server.registerPrompt(
    'qualify-lead',
    {
      title: 'Qualify Lead',
      description: 'Guide an agent through CRM lead qualification.',
      argsSchema: z.object({
        email: z.email(),
      }),
    },
    ({ email }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              `Qualify the CRM lead with email ${email}.`,
              'First retrieve the lead, then use the official qualification tool.',
              'Do not invent CRM data or a score.',
              'End with one concise next action for the sales representative.',
            ].join('\n'),
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    'prepare-outreach',
    {
      title: 'Prepare Outreach',
      description: 'Create personalized B2B outreach for a known lead.',
      argsSchema: z.object({
        name: z.string(),
        company: z.string(),
        need: z.string(),
      }),
    },
    ({ name, company, need }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              `Prepare concise B2B outreach for ${name} at ${company}.`,
              `Their known need is: ${need}`,
              'Mention the specific business problem instead of writing generic sales copy.',
              'Do not claim that an email has been sent.',
            ].join('\n'),
          },
        },
      ],
    }),
  );
}
