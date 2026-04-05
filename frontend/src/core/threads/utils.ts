import type { Message } from "@langchain/langgraph-sdk";

import type { AgentThread } from "./types";

export function pathOfThread(
  thread: string | Pick<AgentThread, "thread_id" | "agent_name">,
) {
  if (typeof thread === "string") {
    return `/workspace/chats/${thread}`;
  }
  const metadataAgentName =
    typeof (thread as AgentThread & { metadata?: { agent_name?: unknown } })
      .metadata?.agent_name === "string"
      ? (
          thread as AgentThread & { metadata?: { agent_name?: string } }
        ).metadata?.agent_name
      : undefined;
  const agentName = thread.agent_name ?? metadataAgentName;
  if (agentName) {
    return `/workspace/agents/${agentName}/chats/${thread.thread_id}`;
  }
  return `/workspace/chats/${thread.thread_id}`;
}

export function textOfMessage(message: Message) {
  if (typeof message.content === "string") {
    return message.content;
  } else if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part.type === "text") {
        return part.text;
      }
    }
  }
  return null;
}

export function titleOfThread(thread: AgentThread) {
  return thread.title ?? thread.values?.title ?? "Untitled";
}
