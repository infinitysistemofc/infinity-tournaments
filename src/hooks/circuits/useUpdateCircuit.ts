import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UpdateCircuitInput {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  season?: string;
  start_date?: string;
  end_date?: string;
  status?: "draft" | "active" | "completed";
  scoring_rules?: any;
}

export const useUpdateCircuit = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateCircuitInput) => {
      const { data, error } = await supabase
        .from("circuits")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["circuits"] });
      queryClient.invalidateQueries({ queryKey: ["circuit", data.id] });
      toast.success(t("circuit.updateSuccess", "Circuito atualizado com sucesso!"));
    },
    onError: (error: Error) => {
      toast.error(`${t("circuit.updateError", "Erro ao atualizar circuito")}: ${error.message}`);
    },
  });
};
