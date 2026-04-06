import fs from "fs";
import path from "path";

import type { NextRequest } from "next/server";

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
  const history = normalizeHistoryPayload(json);
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
  const history = normalizeHistoryPayload(json);
  if (limitValue !== null) {
    const normalizedLimit = Math.max(0, Math.floor(Number(limitValue) || 0));
    return Response.json(history.slice(-normalizedLimit));
  }
  return Response.json(history);
}
