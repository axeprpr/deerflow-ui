import { getBackendBaseURL } from "../config";

import type { UserMemory } from "./types";

export async function loadMemory() {
  const memory = await fetch(`${getBackendBaseURL()}/api/memory`);
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
