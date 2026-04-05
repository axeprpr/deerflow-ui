import { getBackendBaseURL, getLangGraphBaseURL } from "../config";

import type { Model } from "./types";

export async function loadModels(isMock?: boolean) {
  const url = isMock
    ? `${getLangGraphBaseURL(true)}/models`
    : `${getBackendBaseURL()}/api/models`;
  const res = await fetch(url);
  const { models } = (await res.json()) as { models: Model[] };
  return models;
}
