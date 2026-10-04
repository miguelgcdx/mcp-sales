import 'dotenv/config';

import { createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { stepCountIs, ToolLoopAgent } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';

async function main() {
  // createMCPClient() discovers MCP tools and converts them into
  // AI SDK-compatible tools that ToolLoopAgent can use directly.
  const mcpClient = await createMCPClient({
    transport: new Experimental_StdioMCPTransport({
      command: 'pnpm',
      args: ['exec', 'tsx', 'src/index.ts'],
      cwd: process.cwd(),
      stderr: 'inherit',
    }),
  });

  try {
    const tools = await mcpClient.tools();

    const agent = new ToolLoopAgent({
      model: ollama('llama3.2:3b'),
      instructions: [
        'You are a B2B sales CRM assistant.',
        'Use MCP tools whenever CRM information is required.',
        'Do not invent CRM data or qualification scores.',
      ].join('\n'),
      tools,
      stopWhen: stepCountIs(6),
    });

    const prompt =
      process.argv.slice(2).join(' ') ||
      'Find john@acme.com, qualify the lead, and recommend the next sales action.';

    const result = await agent.generate({
      prompt,
    });

    console.log(result.text);
  } finally {
    await mcpClient.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
