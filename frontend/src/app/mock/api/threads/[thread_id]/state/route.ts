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
  const jsonString = fs.readFileSync(
    path.resolve(process.cwd(), `public/demo/threads/${threadId}/thread.json`),
    "utf8",
  );
  const json = JSON.parse(jsonString) as Record<string, unknown>;
  const values = mapFromUnknown(json.values);
  const metadata = mapFromUnknown(json.metadata);
  const configurable = mapFromUnknown(mapFromUnknown(json.config)?.configurable);
  const createdAt =
    stringFromUnknown(json.created_at) ??
    stringFromUnknown(json.createdAt) ??
    undefined;
  const updatedAt =
    stringFromUnknown(json.updated_at) ??
    stringFromUnknown(json.updatedAt) ??
    createdAt;
  const modelName =
    stringFromUnknown(json.model_name) ??
    stringFromUnknown(metadata?.model_name) ??
    stringFromUnknown(metadata?.modelName) ??
    stringFromUnknown(configurable?.model_name) ??
    stringFromUnknown(configurable?.modelName);
  const reasoningEffort =
    stringFromUnknown(json.reasoning_effort) ??
    stringFromUnknown(metadata?.reasoning_effort) ??
    stringFromUnknown(metadata?.reasoningEffort) ??
    stringFromUnknown(configurable?.reasoning_effort) ??
    stringFromUnknown(configurable?.reasoningEffort);
  const step =
    numberFromUnknown(json.step) ??
    numberFromUnknown(metadata?.step);
  return Response.json({
    ...json,
    thread_id:
      typeof json.thread_id === "string" && json.thread_id.trim()
        ? json.thread_id
        : threadId,
    created_at: createdAt,
    updated_at: updatedAt,
    title: stringFromUnknown(json.title) ?? stringFromUnknown(values?.title),
    assistant_id:
      stringFromUnknown(json.assistant_id) ??
      stringFromUnknown(metadata?.assistant_id) ??
      stringFromUnknown(metadata?.assistantId),
    graph_id:
      stringFromUnknown(json.graph_id) ??
      stringFromUnknown(metadata?.graph_id) ??
      stringFromUnknown(metadata?.graphId),
    run_id:
      stringFromUnknown(json.run_id) ??
      stringFromUnknown(metadata?.run_id) ??
      stringFromUnknown(metadata?.runId),
    agent_name:
      stringFromUnknown(json.agent_name) ??
      stringFromUnknown(metadata?.agent_name) ??
      stringFromUnknown(metadata?.agentName) ??
      stringFromUnknown(configurable?.agent_name) ??
      stringFromUnknown(configurable?.agentName),
    agent_type:
      stringFromUnknown(json.agent_type) ??
      stringFromUnknown(metadata?.agent_type) ??
      stringFromUnknown(metadata?.agentType) ??
      stringFromUnknown(configurable?.agent_type) ??
      stringFromUnknown(configurable?.agentType),
    mode:
      stringFromUnknown(json.mode) ??
      stringFromUnknown(metadata?.mode) ??
      stringFromUnknown(configurable?.mode),
    model_name: modelName,
    reasoning_effort: reasoningEffort,
    thinking_enabled:
      booleanFromUnknown(json.thinking_enabled) ??
      booleanFromUnknown(metadata?.thinking_enabled) ??
      booleanFromUnknown(metadata?.thinkingEnabled) ??
      booleanFromUnknown(configurable?.thinking_enabled) ??
      booleanFromUnknown(configurable?.thinkingEnabled),
    is_plan_mode:
      booleanFromUnknown(json.is_plan_mode) ??
      booleanFromUnknown(metadata?.is_plan_mode) ??
      booleanFromUnknown(metadata?.isPlanMode) ??
      booleanFromUnknown(configurable?.is_plan_mode) ??
      booleanFromUnknown(configurable?.isPlanMode),
    subagent_enabled:
      booleanFromUnknown(json.subagent_enabled) ??
      booleanFromUnknown(metadata?.subagent_enabled) ??
      booleanFromUnknown(metadata?.subagentEnabled) ??
      booleanFromUnknown(configurable?.subagent_enabled) ??
      booleanFromUnknown(configurable?.subagentEnabled),
    temperature:
      numberFromUnknown(json.temperature) ??
      numberFromUnknown(metadata?.temperature) ??
      numberFromUnknown(configurable?.temperature),
    max_tokens:
      numberFromUnknown(json.max_tokens) ??
      numberFromUnknown(metadata?.max_tokens) ??
      numberFromUnknown(metadata?.maxTokens) ??
      numberFromUnknown(configurable?.max_tokens) ??
      numberFromUnknown(configurable?.maxTokens),
    step,
    artifacts: arrayFromUnknown(json.artifacts) ?? arrayFromUnknown(values?.artifacts),
    todos: arrayFromUnknown(json.todos) ?? arrayFromUnknown(values?.todos),
    sandbox: mapFromUnknown(json.sandbox) ?? mapFromUnknown(values?.sandbox),
    thread_data:
      mapFromUnknown(json.thread_data) ??
      mapFromUnknown(json.threadData) ??
      mapFromUnknown(values?.thread_data) ??
      mapFromUnknown(values?.threadData),
    uploaded_files:
      arrayFromUnknown(json.uploaded_files) ??
      arrayFromUnknown(json.uploadedFiles) ??
      arrayFromUnknown(values?.uploaded_files) ??
      arrayFromUnknown(values?.uploadedFiles),
    viewed_images:
      arrayFromUnknown(json.viewed_images) ??
      arrayFromUnknown(json.viewedImages) ??
      arrayFromUnknown(values?.viewed_images) ??
      arrayFromUnknown(values?.viewedImages),
  });
}
