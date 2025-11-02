import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type UpdateMatchInput = {
  matchId: string;
  score_p1?: number;
  score_p2?: number;
  winner_id?: string;
  status?: Database["public"]["Enums"]["match_status"];
};

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, ...input }: UpdateMatchInput) => {
      const { data, error } = await supabase
        .from("matches")
        .update(input)
        .eq("id", matchId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      toast.success("Resultado registrado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao registrar resultado");
    },
  });
};

export const useGenerateMatches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stageId, format }: { stageId: string; format: string }) => {
      const { data, error } = await supabase.functions.invoke("generate-matches", {
        body: { stageId, format },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      toast.success("Confrontos gerados com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao gerar confrontos");
    },
  });
};
