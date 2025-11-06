import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "player" | "organizer" | "admin";

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-roles", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;
      return (data?.map((r) => r.role) || []) as AppRole[];
    },
    enabled: !!user?.id,
  });
};

export const useHasRole = (role: AppRole) => {
  const { data: roles = [], isLoading } = useUserRole();
  return {
    hasRole: roles.includes(role) || roles.includes("admin"),
    isLoading,
  };
};
