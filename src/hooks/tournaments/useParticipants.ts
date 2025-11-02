import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

export const useJoinTournament = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ tournamentId, teamName }: { tournamentId: string; teamName?: string }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("participants")
        .insert({
          tournament_id: tournamentId,
          user_id: user.id,
          team_name: teamName,
          status: "registered",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tournament", variables.tournamentId] });
      toast.success("Inscrição realizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao inscrever no torneio");
    },
  });
};

export const useUpdateParticipantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      participantId, 
      status, 
      seed 
    }: { 
      participantId: string; 
      status?: Database["public"]["Enums"]["participant_status"]; 
      seed?: number 
    }) => {
      const { data, error } = await supabase
        .from("participants")
        .update({ ...(status && { status }), ...(seed !== undefined && { seed }) })
        .eq("id", participantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      toast.success("Participante atualizado!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar participante");
    },
  });
};
