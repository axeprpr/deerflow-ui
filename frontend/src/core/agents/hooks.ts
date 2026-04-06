import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAgent,
  deleteAgent,
  getAgent,
  listAgents,
  updateAgent,
} from "./api";
import type { CreateAgentRequest, UpdateAgentRequest } from "./types";

type AgentQueryOptions = {
  enabled?: boolean;
};

export function useAgents(options?: AgentQueryOptions) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agents", options?.enabled ?? true],
    queryFn: () => listAgents(),
    enabled: options?.enabled ?? true,
  });
  return { agents: data ?? [], isLoading, error };
}

export function useAgent(
  name: string | null | undefined,
  options?: AgentQueryOptions,
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agents", name, options?.enabled ?? true],
    queryFn: () => getAgent(name!),
    enabled: !!name && (options?.enabled ?? true),
  });
  return { agent: data ?? null, isLoading, error };
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateAgentRequest) => createAgent(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      request,
    }: {
      name: string;
      request: UpdateAgentRequest;
    }) => updateAgent(name, request),
    onSuccess: (_data, { name }) => {
      void queryClient.invalidateQueries({ queryKey: ["agents"] });
      void queryClient.invalidateQueries({ queryKey: ["agents", name] });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => deleteAgent(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}
