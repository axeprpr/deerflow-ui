import { getBackendBaseURL } from "../config";

import type { UserMemory } from "./types";

async function readErrorDetail(
  response: Response,
  fallback: string,
): Promise<string> {
  const error = await response.json().catch(() => ({ detail: fallback }));
  return error.detail ?? fallback;
}

export async function loadMemory() {
  const memory = await fetch(`${getBackendBaseURL()}/api/memory`);
  if (!memory.ok) {
    throw new Error(await readErrorDetail(memory, "Failed to load memory"));
  }
  const json = (await memory.json()) as UserMemory & {
    facts?: Array<UserMemory["facts"][number] & {
      source_thread?: {
        thread_id: string;
        agent_name?: string;
      };
    }>
  };
  return {
    ...json,
    facts: (json.facts ?? []).map((fact) => ({
      ...fact,
      sourceThread: fact.sourceThread ?? fact.source_thread,
    })),
  } as UserMemory;
}
