import { useQuery } from "@tanstack/react-query";

import { loadModels } from "./api";

export function useModels({
  enabled = true,
  isMock,
}: {
  enabled?: boolean;
  isMock?: boolean;
} = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["models", isMock ? "mock" : "default"],
    queryFn: () => loadModels(isMock),
    enabled,
    refetchOnWindowFocus: false,
  });
  return { models: data ?? [], isLoading, error };
}
