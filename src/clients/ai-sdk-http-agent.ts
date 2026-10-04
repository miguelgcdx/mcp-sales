import 'dotenv/config';

import { createMCPClient } from '@ai-sdk/mcp';
import { stepCountIs, ToolLoopAgent } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';

async function main() {
  const token = process.env.MCP_API_TOKEN;

  if (!token) {
    throw new Error('MCP_API_TOKEN is required');
  }

  const mcpClient = await createMCPClient({
    // AI SDK's HTTP transport connects to a remotely served MCP endpoint.
    transport: {
      type: 'http',
      url: process.env.MCP_HTTP_URL ?? 'http://127.0.0.1:3333/mcp',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
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
      'Search for Acme leads and tell me which lead should be prioritized.';

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
