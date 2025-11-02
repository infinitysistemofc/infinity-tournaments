import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type UpdateTournamentInput = {
  id: string;
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  max_participants?: number;
  prize_pool?: number;
  rules?: any;
  status?: Database["public"]["Enums"]["tournament_status"];
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateTournamentInput) => {
      const { data, error } = await supabase
        .from("tournaments")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
      toast.success("Torneio atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar torneio");
    },
  });
};
