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
  const modelName =
    stringFromUnknown(threadData.model_name) ??
    stringFromUnknown(metadata?.model_name) ??
    stringFromUnknown(metadata?.modelName) ??
    stringFromUnknown(configurable?.model_name) ??
    stringFromUnknown(configurable?.modelName);
  const reasoningEffort =
    stringFromUnknown(threadData.reasoning_effort) ??
    stringFromUnknown(metadata?.reasoning_effort) ??
    stringFromUnknown(metadata?.reasoningEffort) ??
    stringFromUnknown(configurable?.reasoning_effort) ??
    stringFromUnknown(configurable?.reasoningEffort);

  return Response.json({
    ...threadData,
    thread_id: threadId,
    created_at: createdAt,
    updated_at: updatedAt,
    title: stringFromUnknown(threadData.title) ?? stringFromUnknown(values?.title),
    assistant_id:
      stringFromUnknown(threadData.assistant_id) ??
      stringFromUnknown(metadata?.assistant_id) ??
      stringFromUnknown(metadata?.assistantId),
    graph_id:
      stringFromUnknown(threadData.graph_id) ??
      stringFromUnknown(metadata?.graph_id) ??
      stringFromUnknown(metadata?.graphId),
    run_id:
      stringFromUnknown(threadData.run_id) ??
      stringFromUnknown(metadata?.run_id) ??
      stringFromUnknown(metadata?.runId),
    agent_name:
      stringFromUnknown(threadData.agent_name) ??
      stringFromUnknown(metadata?.agent_name) ??
      stringFromUnknown(metadata?.agentName) ??
      stringFromUnknown(configurable?.agent_name) ??
      stringFromUnknown(configurable?.agentName),
    mode:
      stringFromUnknown(threadData.mode) ??
      stringFromUnknown(metadata?.mode) ??
      stringFromUnknown(configurable?.mode),
    model_name: modelName,
    reasoning_effort: reasoningEffort,
  });
}
