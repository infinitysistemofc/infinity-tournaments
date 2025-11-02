import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type CreateStageInput = {
  tournament_id: string;
  name: string;
  stage_type: Database["public"]["Enums"]["stage_type"];
  order: number;
};

export const useCreateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateStageInput) => {
      const { data, error } = await supabase
        .from("stages")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tournament", variables.tournament_id] });
      toast.success("Estágio criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar estágio");
    },
  });
};

export const useUpdateStageStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      stageId, 
      status 
    }: { 
      stageId: string; 
      status: Database["public"]["Enums"]["stage_status"] 
    }) => {
      const { data, error } = await supabase
        .from("stages")
        .update({ status })
        .eq("id", stageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      toast.success("Estágio atualizado!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar estágio");
    },
  });
};
