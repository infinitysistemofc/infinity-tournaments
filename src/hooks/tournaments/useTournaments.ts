import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseTournamentsOptions {
  organizerId?: string;
  status?: string;
  limit?: number;
}

export const useTournaments = (options: UseTournamentsOptions = {}) => {
  return useQuery({
    queryKey: ["tournaments", options],
    queryFn: async () => {
      let query = supabase.from("tournaments").select("*");

      if (options.organizerId) {
        query = query.eq("organizer_id", options.organizerId);
      }

      if (options.status) {
        query = query.eq("status", options.status as any);
      }

      query = query.order("created_at", { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};
