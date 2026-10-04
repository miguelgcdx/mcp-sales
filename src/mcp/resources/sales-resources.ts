import type { McpServer } from '@modelcontextprotocol/server';

const pricing = `
CRM automation projects start at $10,000.
Enterprise implementations typically range from $30,000 to $100,000,
depending on integrations and workflow complexity.
`.trim();

const salesHandbook = `
Prioritize leads with a clear automation problem, sufficient budget,
and meaningful operational scale.

Before outreach, understand the lead's specific problem.
Avoid generic sales copy and connect the outreach to the lead's need.
`.trim();

const services = `
We build AI automations for sales, lead qualification, CRM workflows,
follow-ups, customer support, email operations, and internal business processes.
`.trim();

export function registerSalesResources(server: McpServer) {
  // Resources expose read-only reference data by URI.
  server.registerResource(
    'pricing',
    'sales://pricing',
    {
      title: 'Sales Pricing',
      description: 'Current CRM automation pricing guidance.',
      mimeType: 'text/markdown',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/markdown',
          text: pricing,
        },
      ],
    }),
  );

  server.registerResource(
    'sales-handbook',
    'sales://handbook',
    {
      title: 'Sales Handbook',
      description: 'Internal sales qualification and outreach guidance.',
      mimeType: 'text/markdown',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/markdown',
          text: salesHandbook,
        },
      ],
    }),
  );

  server.registerResource(
    'services',
    'sales://services',
    {
      title: 'Services Catalog',
      description: 'Services offered by the AI automation company.',
      mimeType: 'text/markdown',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/markdown',
          text: services,
        },
      ],
    }),
  );
}
