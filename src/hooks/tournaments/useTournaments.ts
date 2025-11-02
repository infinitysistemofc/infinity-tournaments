import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type TournamentFilters = {
  status?: Database["public"]["Enums"]["tournament_status"];
  gameId?: string;
  search?: string;
};

export const useTournaments = (filters?: TournamentFilters) => {
  return useQuery({
    queryKey: ["tournaments", filters],
    queryFn: async () => {
      let query = supabase
        .from("tournaments")
        .select(`
          *,
          games (id, name, icon_url, platform),
          profiles (display_name, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.gameId) {
        query = query.eq("game_id", filters.gameId);
      }

      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};
