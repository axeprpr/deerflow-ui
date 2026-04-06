import fs from "fs";
import path from "path";

import type { NextRequest } from "next/server";

function contentTypeForFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".md":
    case ".txt":
    case ".log":
    case ".py":
    case ".js":
    case ".ts":
    case ".tsx":
    case ".jsx":
    case ".json":
    case ".csv":
    case ".html":
    case ".css":
    case ".xml":
    case ".yaml":
    case ".yml":
    case ".skill":
      return "text/plain; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    case ".mp4":
      return "video/mp4";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      thread_id: string;
      artifact_path?: string[] | undefined;
    }>;
  },
) {
  const threadId = (await params).thread_id;
  let artifactPath = (await params).artifact_path?.join("/") ?? "";
  if (artifactPath.startsWith("mnt/")) {
    artifactPath = path.resolve(
      process.cwd(),
      artifactPath.replace("mnt/", `public/demo/threads/${threadId}/`),
    );
    if (fs.existsSync(artifactPath)) {
      const fileContent = fs.readFileSync(artifactPath);
      const contentType = contentTypeForFile(artifactPath);
      if (request.nextUrl.searchParams.get("download") === "true") {
        const headers = new Headers();
        headers.set(
          "Content-Disposition",
          `attachment; filename="${path.basename(artifactPath)}"`,
        );
        headers.set("Content-Type", contentType);
        return new Response(fileContent, {
          status: 200,
          headers,
        });
      }
      return new Response(fileContent, {
        status: 200,
        headers: {
          "Content-Type": contentType,
        },
      });
    }
  }
  return new Response("File not found", { status: 404 });
}
