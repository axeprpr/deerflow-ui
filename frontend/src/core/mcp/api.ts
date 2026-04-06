import { getBackendBaseURL } from "@/core/config";

import type { MCPConfig, MCPServerConfig } from "./types";

async function readErrorDetail(
  response: Response,
  fallback: string,
): Promise<string> {
  const error = await response.json().catch(() => ({ detail: fallback }));
  return error.detail ?? fallback;
}

export async function loadMCPConfig() {
  const response = await fetch(`${getBackendBaseURL()}/api/mcp/config`);
  if (!response.ok) {
    throw new Error(
      await readErrorDetail(response, "Failed to load MCP config"),
    );
  }
  const json = (await response.json()) as
    | MCPConfig
    | {
        mcpServers?: Record<string, MCPServerConfig>;
      };
  const rawServers = json.mcp_servers ?? json.mcpServers ?? {};
  return {
    mcp_servers: Object.fromEntries(
      Object.entries(rawServers).map(([name, config]) => [
        name,
        {
          ...config,
          enabled: config.enabled ?? false,
          description: config.description ?? "",
        },
      ]),
    ),
  } satisfies MCPConfig;
}

export async function updateMCPConfig(config: MCPConfig) {
  const response = await fetch(`${getBackendBaseURL()}/api/mcp/config`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    },
  );
  if (!response.ok) {
    throw new Error(
      await readErrorDetail(response, "Failed to update MCP config"),
    );
  }
  return response.json();
}
