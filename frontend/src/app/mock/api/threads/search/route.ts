import fs from "fs";
import path from "path";

type ThreadSearchRequest = {
  limit?: number;
  offset?: number;
  sortBy?: "updated_at" | "created_at";
  sortOrder?: "asc" | "desc";
};

type MockThreadSearchResult = Record<string, unknown> & {
  thread_id: string;
  created_at: string | undefined;
  updated_at: string | undefined;
  title?: string;
  agent_name?: string;
};

function stringFromUnknown(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function mapFromUnknown(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => ({}))) ?? {}) as ThreadSearchRequest;

  const rawLimit = body.limit;
  let limit = 50;
  if (typeof rawLimit === "number") {
    const normalizedLimit = Math.max(0, Math.floor(rawLimit));
    if (!Number.isNaN(normalizedLimit)) {
      limit = normalizedLimit;
    }
  }

  const rawOffset = body.offset;
  let offset = 0;
  if (typeof rawOffset === "number") {
    const normalizedOffset = Math.max(0, Math.floor(rawOffset));
    if (!Number.isNaN(normalizedOffset)) {
      offset = normalizedOffset;
    }
  }
  const sortBy = body.sortBy ?? "updated_at";
  const sortOrder = body.sortOrder ?? "desc";

  const threadsDir = fs.readdirSync(
    path.resolve(process.cwd(), "public/demo/threads"),
    {
      withFileTypes: true,
    },
  );

  const threadData = threadsDir
    .map<MockThreadSearchResult | null>((threadId) => {
      if (threadId.isDirectory() && !threadId.name.startsWith(".")) {
        const threadData = JSON.parse(
          fs.readFileSync(
            path.resolve(`public/demo/threads/${threadId.name}/thread.json`),
            "utf8",
          ),
        ) as Record<string, unknown>;

        const values = mapFromUnknown(threadData.values);
        const metadata = mapFromUnknown(threadData.metadata);
        const configurable = mapFromUnknown(mapFromUnknown(threadData.config)?.configurable);
        const createdAt =
          stringFromUnknown(threadData.created_at) ??
          stringFromUnknown(threadData.createdAt) ??
          undefined;
        const updatedAt =
          stringFromUnknown(threadData.updated_at) ??
          stringFromUnknown(threadData.updatedAt) ??
          createdAt;
        return {
          ...threadData,
          thread_id: threadId.name,
          created_at: createdAt,
          updated_at: updatedAt,
          title: stringFromUnknown(threadData.title) ?? stringFromUnknown(values?.title),
          agent_name:
            stringFromUnknown(threadData.agent_name) ??
            stringFromUnknown(metadata?.agent_name) ??
            stringFromUnknown(metadata?.agentName) ??
            stringFromUnknown(configurable?.agent_name) ??
            stringFromUnknown(configurable?.agentName),
        };
      }
      return null;
    })
    .filter((thread): thread is MockThreadSearchResult => thread !== null)
    .sort((a, b) => {
      const aTimestamp = a[sortBy];
      const bTimestamp = b[sortBy];
      const aParsed =
        typeof aTimestamp === "string" ? Date.parse(aTimestamp) : 0;
      const bParsed =
        typeof bTimestamp === "string" ? Date.parse(bTimestamp) : 0;
      const aValue = Number.isNaN(aParsed) ? 0 : aParsed;
      const bValue = Number.isNaN(bParsed) ? 0 : bParsed;
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  const pagedThreads = threadData.slice(offset, offset + limit);
  return Response.json(pagedThreads);
}
