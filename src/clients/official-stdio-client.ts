import 'dotenv/config';

import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

async function main() {
  // StdioClientTransport launches and owns the local MCP server process.
  const transport = new StdioClientTransport({
    command: 'pnpm',
    args: ['exec', 'tsx', 'src/index.ts'],
    cwd: process.cwd(),
    stderr: 'inherit',
  });

  const client = new Client({
    name: 'sales-mcp-learning-client',
    version: '1.0.0',
  });

  try {
    await client.connect(transport);

    const { tools } = await client.listTools();
    console.log(
      'Tools:',
      tools.map((tool) => tool.name),
    );

    const leadResult = await client.callTool({
      name: 'get-lead',
      arguments: {
        email: 'john@acme.com',
      },
    });

    console.log('get-lead:', leadResult.content);

    const { resources } = await client.listResources();
    console.log(
      'Resources:',
      resources.map((resource) => resource.uri),
    );

    const pricing = await client.readResource({
      uri: 'sales://pricing',
    });

    console.log('pricing:', pricing.contents);

    const { prompts } = await client.listPrompts();
    console.log(
      'Prompts:',
      prompts.map((prompt) => prompt.name),
    );

    const prompt = await client.getPrompt({
      name: 'qualify-lead',
      arguments: {
        email: 'john@acme.com',
      },
    });

    console.log('qualify-lead prompt:', prompt.messages);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
