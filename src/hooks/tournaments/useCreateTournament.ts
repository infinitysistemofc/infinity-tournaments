import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type CreateTournamentInput = {
  name: string;
  description?: string;
  game_id: string;
  format: Database["public"]["Enums"]["tournament_format"];
  start_date: string;
  end_date: string;
  max_participants: number;
  prize_pool?: number;
  rules?: any;
};

export const useCreateTournament = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateTournamentInput) => {
      if (!user) throw new Error("Usuário não autenticado");

      const slug = input.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const { data, error } = await supabase
        .from("tournaments")
        .insert({
          ...input,
          slug,
          organizer_id: user.id,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast.success("Torneio criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar torneio");
    },
  });
};
