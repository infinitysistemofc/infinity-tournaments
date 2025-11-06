import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UpdateMatchInput {
  id: string;
  score_p1?: number;
  score_p2?: number;
  winner_id?: string;
  status?: "scheduled" | "ongoing" | "completed";
  match_date?: string;
  notes?: any;
}

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateMatchInput) => {
      const { data, error } = await supabase
        .from("matches")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      queryClient.invalidateQueries({ queryKey: ["circuit-stats"] });
      toast.success(t("match.updateSuccess", "Resultado salvo com sucesso!"));
    },
    onError: (error: Error) => {
      toast.error(`${t("match.updateError", "Erro ao salvar resultado")}: ${error.message}`);
    },
  });
};
