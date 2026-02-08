import { useQuery } from "@tanstack/react-query";
import { fetchAsteroidFeed, fetchAsteroidDetail } from "@/services/api";

export function useAsteroidFeed() {
  return useQuery({
    queryKey: ["asteroid-feed"],
    queryFn: fetchAsteroidFeed,
    refetchInterval: 60000, // refresh every 60s
    staleTime: 30000,
  });
}

export function useAsteroidDetail(id: string | null) {
  return useQuery({
    queryKey: ["asteroid-detail", id],
    queryFn: () => fetchAsteroidDetail(id!),
    enabled: !!id,
  });
}
