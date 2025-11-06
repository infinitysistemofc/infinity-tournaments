import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface CreateTournamentInput {
  name: string;
  slug: string;
  description?: string;
  game_id: string;
  format: "elimination" | "groups" | "league" | "swiss";
  status: "draft" | "registration" | "active" | "completed";
  start_date: string;
  end_date: string;
  max_participants: number;
  prize_pool?: number;
  rules?: any;
  organizer_id: string;
}

export const useCreateTournament = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (input: CreateTournamentInput) => {
      const { data, error } = await supabase
        .from("tournaments")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast.success(t("tournament.createSuccess", "Torneio criado com sucesso!"));
    },
    onError: (error: Error) => {
      toast.error(`${t("tournament.createError", "Erro ao criar torneio")}: ${error.message}`);
    },
  });
};
