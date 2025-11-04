import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCircuitRanking = (circuitId: string | undefined) => {
  return useQuery({
    queryKey: ["circuit-ranking", circuitId],
    queryFn: async () => {
      if (!circuitId) return [];

      const { data: stats, error: statsError } = await supabase
        .from("circuit_stats")
        .select("*")
        .eq("circuit_id", circuitId)
        .order("total_points", { ascending: false });

      if (statsError) throw statsError;

      const userIds = stats?.map((s) => s.user_id) || [];
      
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);

      return stats.map((stat) => ({
        ...stat,
        profile: profiles?.find((p) => p.user_id === stat.user_id),
      }));
    },
    enabled: !!circuitId,
  });
};
