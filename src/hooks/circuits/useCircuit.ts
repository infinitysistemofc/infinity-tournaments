import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCircuit = (circuitId: string | undefined) => {
  return useQuery({
    queryKey: ["circuit", circuitId],
    queryFn: async () => {
      if (!circuitId) return null;

      const { data, error } = await supabase
        .from("circuits")
        .select("*")
        .eq("id", circuitId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!circuitId,
  });
};
