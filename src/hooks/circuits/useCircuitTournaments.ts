import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCircuitTournaments = (circuitId: string | undefined) => {
  return useQuery({
    queryKey: ["circuit-tournaments", circuitId],
    queryFn: async () => {
      if (!circuitId) return [];

      const { data: circuitTournaments, error: ctError } = await supabase
        .from("circuit_tournaments")
        .select("*")
        .eq("circuit_id", circuitId)
        .order("order", { ascending: true });

      if (ctError) throw ctError;

      const tournamentIds = circuitTournaments?.map((ct) => ct.tournament_id) || [];
      
      if (tournamentIds.length === 0) return [];

      const { data: tournaments, error: tError } = await supabase
        .from("tournaments")
        .select("*")
        .in("id", tournamentIds);

      if (tError) throw tError;

      return circuitTournaments.map((ct) => ({
        ...ct,
        tournament: tournaments?.find((t) => t.id === ct.tournament_id),
      }));
    },
    enabled: !!circuitId,
  });
};
