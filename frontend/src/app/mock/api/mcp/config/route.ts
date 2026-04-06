export function GET() {
  return Response.json({
    mcp_servers: {
      "mcp-github-trending": {
        enabled: true,
        type: "stdio",
        command: "uvx",
        args: ["mcp-github-trending"],
        env: {},
        url: null,
        headers: {},
        description:
          "A MCP server that provides access to GitHub trending repositories and developers data",
      },
      "context-7": {
        enabled: true,
        type: "stdio",
        command: "",
        args: [],
        env: {},
        url: null,
        headers: {},
        description:
          "Get the latest documentation and code into Cursor, Claude, or other LLMs",
      },
      "feishu-importer": {
        enabled: true,
        type: "stdio",
        command: "",
        args: [],
        env: {},
        url: null,
        headers: {},
        description: "Import Feishu documents",
      },
    },
  });
}
