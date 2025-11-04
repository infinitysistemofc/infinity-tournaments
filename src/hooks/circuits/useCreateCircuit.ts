import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateCircuitInput {
  name: string;
  slug: string;
  description?: string;
  season?: string;
  start_date: string;
  end_date: string;
  scoring_rules?: any;
  organizer_id: string;
}

export const useCreateCircuit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCircuitInput) => {
      const { data, error } = await supabase
        .from("circuits")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["circuits"] });
      toast.success("Circuito criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar circuito: ${error.message}`);
    },
  });
};
