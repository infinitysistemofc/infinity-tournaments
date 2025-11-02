import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTournament = (tournamentId: string) => {
  return useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select(`
          *,
          games (id, name, icon_url, platform),
          profiles (display_name, avatar_url),
          participants (
            id,
            user_id,
            team_name,
            seed,
            status,
            joined_at,
            profiles (display_name, avatar_url)
          ),
          stages (
            id,
            name,
            stage_type,
            order,
            status,
            matches (
              id,
              participant1_id,
              participant2_id,
              winner_id,
              score_p1,
              score_p2,
              status,
              match_date
            )
          )
        `)
        .eq("id", tournamentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!tournamentId,
  });
};
