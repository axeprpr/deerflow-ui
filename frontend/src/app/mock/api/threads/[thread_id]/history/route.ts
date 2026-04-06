import fs from "fs";
import path from "path";

import type { NextRequest } from "next/server";

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

function normalizeHistoryPayload(json: unknown) {
  if (Array.isArray(json)) {
    return json;
  }
  if (typeof json !== "object" || json === null) {
    return [];
  }
  const record = json as Record<string, unknown>;
  if (Array.isArray(record.history)) {
    return record.history;
  }
  if (Array.isArray(record.items)) {
    return record.items;
  }
  if (
    typeof record.data === "object" &&
    record.data !== null &&
    Array.isArray((record.data as Record<string, unknown>).history)
  ) {
    return (record.data as Record<string, unknown>).history as unknown[];
  }
  if (
    typeof record.data === "object" &&
    record.data !== null &&
    Array.isArray((record.data as Record<string, unknown>).items)
  ) {
    return (record.data as Record<string, unknown>).items as unknown[];
  }
  return [record];
}

function normalizeHistoryItem(item: unknown) {
  const record = mapFromUnknown(item);
  if (!record) {
    return item;
  }
  const values = mapFromUnknown(record.values);
  const metadata = mapFromUnknown(record.metadata);
  const configurable =
    mapFromUnknown(mapFromUnknown(record.config)?.configurable) ??
    mapFromUnknown(record.configurable);
  const createdAt =
    stringFromUnknown(record.created_at) ??
    stringFromUnknown(record.createdAt);
  const modelName =
    stringFromUnknown(record.model_name) ??
    stringFromUnknown(metadata?.model_name) ??
    stringFromUnknown(metadata?.modelName) ??
    stringFromUnknown(configurable?.model_name) ??
    stringFromUnknown(configurable?.modelName);
  const reasoningEffort =
    stringFromUnknown(record.reasoning_effort) ??
    stringFromUnknown(metadata?.reasoning_effort) ??
    stringFromUnknown(metadata?.reasoningEffort) ??
    stringFromUnknown(configurable?.reasoning_effort) ??
    stringFromUnknown(configurable?.reasoningEffort);

  return {
    ...record,
    created_at: createdAt,
    title: stringFromUnknown(record.title) ?? stringFromUnknown(values?.title),
    assistant_id:
      stringFromUnknown(record.assistant_id) ??
      stringFromUnknown(metadata?.assistant_id) ??
      stringFromUnknown(metadata?.assistantId),
    graph_id:
      stringFromUnknown(record.graph_id) ??
      stringFromUnknown(metadata?.graph_id) ??
      stringFromUnknown(metadata?.graphId),
    run_id:
      stringFromUnknown(record.run_id) ??
      stringFromUnknown(metadata?.run_id) ??
      stringFromUnknown(metadata?.runId),
    agent_name:
      stringFromUnknown(record.agent_name) ??
      stringFromUnknown(metadata?.agent_name) ??
      stringFromUnknown(metadata?.agentName) ??
      stringFromUnknown(configurable?.agent_name) ??
      stringFromUnknown(configurable?.agentName),
    agent_type:
      stringFromUnknown(record.agent_type) ??
      stringFromUnknown(metadata?.agent_type) ??
      stringFromUnknown(metadata?.agentType) ??
      stringFromUnknown(configurable?.agent_type) ??
      stringFromUnknown(configurable?.agentType),
    mode:
      stringFromUnknown(record.mode) ??
      stringFromUnknown(metadata?.mode) ??
      stringFromUnknown(configurable?.mode),
    model_name: modelName,
    reasoning_effort: reasoningEffort,
    thinking_enabled:
      booleanFromUnknown(record.thinking_enabled) ??
      booleanFromUnknown(metadata?.thinking_enabled) ??
      booleanFromUnknown(metadata?.thinkingEnabled) ??
      booleanFromUnknown(configurable?.thinking_enabled) ??
      booleanFromUnknown(configurable?.thinkingEnabled),
    is_plan_mode:
      booleanFromUnknown(record.is_plan_mode) ??
      booleanFromUnknown(metadata?.is_plan_mode) ??
      booleanFromUnknown(metadata?.isPlanMode) ??
      booleanFromUnknown(configurable?.is_plan_mode) ??
      booleanFromUnknown(configurable?.isPlanMode),
    subagent_enabled:
      booleanFromUnknown(record.subagent_enabled) ??
      booleanFromUnknown(metadata?.subagent_enabled) ??
      booleanFromUnknown(metadata?.subagentEnabled) ??
      booleanFromUnknown(configurable?.subagent_enabled) ??
      booleanFromUnknown(configurable?.subagentEnabled),
    temperature:
      numberFromUnknown(record.temperature) ??
      numberFromUnknown(metadata?.temperature) ??
      numberFromUnknown(configurable?.temperature),
    max_tokens:
      numberFromUnknown(record.max_tokens) ??
      numberFromUnknown(metadata?.max_tokens) ??
      numberFromUnknown(metadata?.maxTokens) ??
      numberFromUnknown(configurable?.max_tokens) ??
      numberFromUnknown(configurable?.maxTokens),
    step:
      numberFromUnknown(record.step) ??
      numberFromUnknown(metadata?.step),
    artifacts: arrayFromUnknown(record.artifacts) ?? arrayFromUnknown(values?.artifacts),
    todos: arrayFromUnknown(record.todos) ?? arrayFromUnknown(values?.todos),
    sandbox: mapFromUnknown(record.sandbox) ?? mapFromUnknown(values?.sandbox),
    thread_data:
      mapFromUnknown(record.thread_data) ??
      mapFromUnknown(record.threadData) ??
      mapFromUnknown(values?.thread_data) ??
      mapFromUnknown(values?.threadData),
    uploaded_files:
      arrayFromUnknown(record.uploaded_files) ??
      arrayFromUnknown(record.uploadedFiles) ??
      arrayFromUnknown(values?.uploaded_files) ??
      arrayFromUnknown(values?.uploadedFiles),
    viewed_images:
      arrayFromUnknown(record.viewed_images) ??
      arrayFromUnknown(record.viewedImages) ??
      arrayFromUnknown(values?.viewed_images) ??
      arrayFromUnknown(values?.viewedImages),
    next:
      arrayFromUnknown(record.next) ??
      arrayFromUnknown(values?.next),
    tasks:
      arrayFromUnknown(record.tasks) ??
      arrayFromUnknown(values?.tasks),
    interrupts:
      arrayFromUnknown(record.interrupts) ??
      arrayFromUnknown(values?.interrupts),
    checkpoint:
      mapFromUnknown(record.checkpoint) ??
      mapFromUnknown(metadata?.checkpoint),
    parent_checkpoint:
      mapFromUnknown(record.parent_checkpoint) ??
      mapFromUnknown(record.parentCheckpoint) ??
      mapFromUnknown(metadata?.parent_checkpoint) ??
      mapFromUnknown(metadata?.parentCheckpoint),
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ thread_id: string }> },
) {
  const threadId = (await params).thread_id;
  const jsonString = fs.readFileSync(
    path.resolve(process.cwd(), `public/demo/threads/${threadId}/thread.json`),
    "utf8",
  );
  const json = JSON.parse(jsonString) as unknown;
  const rawLimit =
    ((await request.json().catch(() => ({}))) as {
      limit?: number;
      pageSize?: number;
      page_size?: number;
    }) ?? {};
  const limit = rawLimit.limit ?? rawLimit.pageSize ?? rawLimit.page_size;
  const history = normalizeHistoryPayload(json).map(normalizeHistoryItem);
  if (typeof limit === "number") {
    const normalizedLimit = Math.max(0, Math.floor(limit));
    return Response.json(history.slice(-normalizedLimit));
  }
  return Response.json(history);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ thread_id: string }> },
) {
  const threadId = (await params).thread_id;
  const jsonString = fs.readFileSync(
    path.resolve(process.cwd(), `public/demo/threads/${threadId}/thread.json`),
    "utf8",
  );
  const json = JSON.parse(jsonString) as unknown;
  const url = new URL(request.url);
  const limitValue =
    url.searchParams.get("limit") ??
    url.searchParams.get("pageSize") ??
    url.searchParams.get("page_size");
  const history = normalizeHistoryPayload(json).map(normalizeHistoryItem);
  if (limitValue !== null) {
    const normalizedLimit = Math.max(0, Math.floor(Number(limitValue) || 0));
    return Response.json(history.slice(-normalizedLimit));
  }
  return Response.json(history);
}
