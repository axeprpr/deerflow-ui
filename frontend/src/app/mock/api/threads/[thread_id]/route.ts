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

function booleanFromUnknown(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function numberFromUnknown(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function arrayFromUnknown(value: unknown): unknown[] | undefined {
  return Array.isArray(value) ? value : undefined;
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
  const step =
    numberFromUnknown(threadData.step) ??
    numberFromUnknown(metadata?.step);

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
    agent_type:
      stringFromUnknown(threadData.agent_type) ??
      stringFromUnknown(metadata?.agent_type) ??
      stringFromUnknown(metadata?.agentType) ??
      stringFromUnknown(configurable?.agent_type) ??
      stringFromUnknown(configurable?.agentType),
    mode:
      stringFromUnknown(threadData.mode) ??
      stringFromUnknown(metadata?.mode) ??
      stringFromUnknown(configurable?.mode),
    model_name: modelName,
    reasoning_effort: reasoningEffort,
    thinking_enabled:
      booleanFromUnknown(threadData.thinking_enabled) ??
      booleanFromUnknown(metadata?.thinking_enabled) ??
      booleanFromUnknown(metadata?.thinkingEnabled) ??
      booleanFromUnknown(configurable?.thinking_enabled) ??
      booleanFromUnknown(configurable?.thinkingEnabled),
    is_plan_mode:
      booleanFromUnknown(threadData.is_plan_mode) ??
      booleanFromUnknown(metadata?.is_plan_mode) ??
      booleanFromUnknown(metadata?.isPlanMode) ??
      booleanFromUnknown(configurable?.is_plan_mode) ??
      booleanFromUnknown(configurable?.isPlanMode),
    subagent_enabled:
      booleanFromUnknown(threadData.subagent_enabled) ??
      booleanFromUnknown(metadata?.subagent_enabled) ??
      booleanFromUnknown(metadata?.subagentEnabled) ??
      booleanFromUnknown(configurable?.subagent_enabled) ??
      booleanFromUnknown(configurable?.subagentEnabled),
    temperature:
      numberFromUnknown(threadData.temperature) ??
      numberFromUnknown(metadata?.temperature) ??
      numberFromUnknown(configurable?.temperature),
    max_tokens:
      numberFromUnknown(threadData.max_tokens) ??
      numberFromUnknown(metadata?.max_tokens) ??
      numberFromUnknown(metadata?.maxTokens) ??
      numberFromUnknown(configurable?.max_tokens) ??
      numberFromUnknown(configurable?.maxTokens),
    step,
    artifacts: arrayFromUnknown(threadData.artifacts) ?? arrayFromUnknown(values?.artifacts),
    todos: arrayFromUnknown(threadData.todos) ?? arrayFromUnknown(values?.todos),
    sandbox: mapFromUnknown(threadData.sandbox) ?? mapFromUnknown(values?.sandbox),
    thread_data:
      mapFromUnknown(threadData.thread_data) ??
      mapFromUnknown(threadData.threadData) ??
      mapFromUnknown(values?.thread_data) ??
      mapFromUnknown(values?.threadData),
    uploaded_files:
      arrayFromUnknown(threadData.uploaded_files) ??
      arrayFromUnknown(threadData.uploadedFiles) ??
      arrayFromUnknown(values?.uploaded_files) ??
      arrayFromUnknown(values?.uploadedFiles),
    viewed_images:
      arrayFromUnknown(threadData.viewed_images) ??
      arrayFromUnknown(threadData.viewedImages) ??
      arrayFromUnknown(values?.viewed_images) ??
      arrayFromUnknown(values?.viewedImages),
  });
}
