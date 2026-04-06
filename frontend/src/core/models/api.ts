import { getBackendBaseURL, getLangGraphBaseURL } from "../config";

import type { Model } from "./types";

async function readErrorDetail(
  response: Response,
  fallback: string,
): Promise<string> {
  const error = await response.json().catch(() => ({ detail: fallback }));
  return error.detail ?? fallback;
}

export async function loadModels(isMock?: boolean) {
  const url = isMock
    ? `${getLangGraphBaseURL(true)}/models`
    : `${getBackendBaseURL()}/api/models`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(await readErrorDetail(res, "Failed to load models"));
  }
  const { models } = (await res.json()) as { models: Model[] };
  return models;
}
