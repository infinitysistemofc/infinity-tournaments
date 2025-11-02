import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tournamentId: string) => {
      const { error } = await supabase
        .from("tournaments")
        .delete()
        .eq("id", tournamentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast.success("Torneio deletado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao deletar torneio");
    },
  });
};
