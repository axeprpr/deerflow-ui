import fs from "fs";
import path from "path";

function stringFromUnknown(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function mapFromUnknown(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ thread_id: string }> },
) {
  const threadId = (await params).thread_id;
  const threadData = JSON.parse(
    fs.readFileSync(
      path.resolve(process.cwd(), `public/demo/threads/${threadId}/thread.json`),
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

  return Response.json({
    ...threadData,
    thread_id: threadId,
    created_at: createdAt,
    updated_at: updatedAt,
    title: stringFromUnknown(threadData.title) ?? stringFromUnknown(values?.title),
    agent_name:
      stringFromUnknown(threadData.agent_name) ??
      stringFromUnknown(metadata?.agent_name) ??
      stringFromUnknown(metadata?.agentName) ??
      stringFromUnknown(configurable?.agent_name) ??
      stringFromUnknown(configurable?.agentName),
  });
}
