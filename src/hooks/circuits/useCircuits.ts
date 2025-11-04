import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CircuitFilters {
  status?: "draft" | "active" | "completed";
  season?: string;
  game_id?: string;
}

export const useCircuits = (filters?: CircuitFilters) => {
  return useQuery({
    queryKey: ["circuits", filters],
    queryFn: async () => {
      let query = supabase
        .from("circuits")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.season) {
        query = query.eq("season", filters.season);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};
