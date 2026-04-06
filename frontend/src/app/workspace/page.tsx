import fs from "fs";
import path from "path";

import { redirect } from "next/navigation";

import { env } from "@/env";

function agentPathOfDemoThread(threadId: string) {
  const threadPath = path.resolve(
    process.cwd(),
    "public/demo/threads",
    threadId,
    "thread.json",
  );
  try {
    const raw = JSON.parse(fs.readFileSync(threadPath, "utf8")) as {
      metadata?: { agent_name?: unknown; agentName?: unknown };
      config?: { configurable?: { agent_name?: unknown; agentName?: unknown } };
    };
    const agentName =
      typeof raw.metadata?.agent_name === "string"
        ? raw.metadata.agent_name
        : typeof raw.metadata?.agentName === "string"
          ? raw.metadata.agentName
          : typeof raw.config?.configurable?.agent_name === "string"
            ? raw.config.configurable.agent_name
            : typeof raw.config?.configurable?.agentName === "string"
              ? raw.config.configurable.agentName
              : undefined;
    if (agentName && agentName.trim()) {
      return `/workspace/agents/${agentName}/chats/${threadId}?mock=true`;
    }
  } catch {}
  return `/workspace/chats/${threadId}?mock=true`;
}

export default function WorkspacePage({
  searchParams,
}: {
  searchParams?: { mock?: string };
}) {
  const mockSuffix = searchParams?.mock === "true" ? "?mock=true" : "";
  if (env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY === "true") {
    const firstThread = fs
      .readdirSync(path.resolve(process.cwd(), "public/demo/threads"), {
        withFileTypes: true,
      })
      .find((thread) => thread.isDirectory() && !thread.name.startsWith("."));
    if (firstThread) {
      return redirect(agentPathOfDemoThread(firstThread.name));
    }
  }
  return redirect(`/workspace/chats/new${mockSuffix}`);
}
