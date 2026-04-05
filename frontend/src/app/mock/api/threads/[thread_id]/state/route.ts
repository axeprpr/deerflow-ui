import fs from "fs";
import path from "path";

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
  return Response.json({
    ...json,
    thread_id:
      typeof json.thread_id === "string" && json.thread_id.trim()
        ? json.thread_id
        : threadId,
  });
}
