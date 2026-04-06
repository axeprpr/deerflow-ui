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
  const json = (await memory.json()) as Record<string, unknown>;
  const user = (json.user ?? {}) as Record<string, unknown>;
  const history = (json.history ?? {}) as Record<string, unknown>;
  const facts = Array.isArray(json.facts) ? json.facts : [];

  function normalizeSection(
    value: unknown,
  ): { summary: string; updatedAt: string } {
    const section = (value ?? {}) as Record<string, unknown>;
    return {
      summary: typeof section.summary === "string" ? section.summary : "",
      updatedAt:
        (typeof section.updatedAt === "string" && section.updatedAt) ||
        (typeof section.updated_at === "string" && section.updated_at) ||
        "",
    };
  }

  return {
    version: typeof json.version === "string" ? json.version : "1",
    lastUpdated:
      (typeof json.lastUpdated === "string" && json.lastUpdated) ||
      (typeof json.last_updated === "string" && json.last_updated) ||
      "",
    user: {
      workContext: normalizeSection(user.workContext ?? user.work_context),
      personalContext: normalizeSection(
        user.personalContext ?? user.personal_context,
      ),
      topOfMind: normalizeSection(user.topOfMind ?? user.top_of_mind),
    },
    history: {
      recentMonths: normalizeSection(
        history.recentMonths ?? history.recent_months,
      ),
      earlierContext: normalizeSection(
        history.earlierContext ?? history.earlier_context,
      ),
      longTermBackground: normalizeSection(
        history.longTermBackground ?? history.long_term_background,
      ),
    },
    facts: facts
      .filter(
        (
          fact,
        ): fact is Record<string, unknown> =>
          typeof fact === "object" && fact !== null,
      )
      .map((fact) => ({
        id: typeof fact.id === "string" ? fact.id : "",
        content: typeof fact.content === "string" ? fact.content : "",
        category: typeof fact.category === "string" ? fact.category : "general",
        confidence:
          typeof fact.confidence === "number" && Number.isFinite(fact.confidence)
            ? fact.confidence
            : 0,
        createdAt:
          (typeof fact.createdAt === "string" && fact.createdAt) ||
          (typeof fact.created_at === "string" && fact.created_at) ||
          "",
        source: typeof fact.source === "string" ? fact.source : "",
        sourceThread:
          typeof fact.sourceThread === "object" && fact.sourceThread !== null
            ? (fact.sourceThread as { thread_id: string; agent_name?: string })
            : typeof fact.source_thread === "object" &&
                fact.source_thread !== null
              ? (fact.source_thread as {
                  thread_id: string;
                  agent_name?: string;
                })
              : undefined,
      })),
  } as UserMemory;
}
