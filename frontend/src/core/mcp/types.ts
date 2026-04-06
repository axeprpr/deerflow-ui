export interface MCPServerConfig extends Record<string, unknown> {
  enabled: boolean;
  description: string;
  type?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
  oauth?: Record<string, unknown> | null;
}

export interface MCPConfig {
  mcp_servers: Record<string, MCPServerConfig>;
}
