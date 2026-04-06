import { getBackendBaseURL } from "@/core/config";

import type { Skill } from "./type";

async function readErrorDetail(
  response: Response,
  fallback: string,
): Promise<string> {
  const error = await response.json().catch(() => ({ detail: fallback }));
  return error.detail ?? fallback;
}

export async function loadSkills() {
  const skills = await fetch(`${getBackendBaseURL()}/api/skills`);
  if (!skills.ok) {
    throw new Error(await readErrorDetail(skills, "Failed to load skills"));
  }
  const json = await skills.json();
  return json.skills as Skill[];
}

export async function enableSkill(skillName: string, enabled: boolean) {
  const response = await fetch(
    `${getBackendBaseURL()}/api/skills/${skillName}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enabled,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(
      await readErrorDetail(response, `Failed to update skill '${skillName}'`),
    );
  }
  return response.json();
}

export interface InstallSkillRequest {
  thread_id: string;
  path: string;
}

export interface InstallSkillResponse {
  success: boolean;
  skill_name: string;
  message: string;
}

export async function installSkill(
  request: InstallSkillRequest,
): Promise<InstallSkillResponse> {
  const response = await fetch(`${getBackendBaseURL()}/api/skills/install`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    return {
      success: false,
      skill_name: "",
      message: await readErrorDetail(
        response,
        `HTTP ${response.status}: ${response.statusText}`,
      ),
    };
  }

  return response.json();
}
