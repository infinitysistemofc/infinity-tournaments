import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UpdateTournamentInput {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  game_id?: string;
  format?: "elimination" | "groups" | "league" | "swiss";
  status?: "draft" | "registration" | "active" | "completed";
  start_date?: string;
  end_date?: string;
  max_participants?: number;
  prize_pool?: number;
  rules?: any;
}

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTournamentInput) => {
      const { data, error } = await supabase
        .from("tournaments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
      toast.success(t("tournament.updateSuccess", "Torneio atualizado com sucesso!"));
    },
    onError: (error: Error) => {
      toast.error(`${t("tournament.updateError", "Erro ao atualizar torneio")}: ${error.message}`);
    },
  });
};
