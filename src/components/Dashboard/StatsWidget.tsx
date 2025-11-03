import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Activity, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const StatsWidget = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      const [tournamentsRes, participantsRes, circuitsRes] = await Promise.all([
        supabase
          .from("tournaments")
          .select("id, status", { count: "exact" })
          .eq("organizer_id", user?.id || ""),
        supabase
          .from("participants")
          .select("id", { count: "exact" })
          .in(
            "tournament_id",
            (
              await supabase
                .from("tournaments")
                .select("id")
                .eq("organizer_id", user?.id || "")
            ).data?.map((t) => t.id) || []
          ),
        supabase
          .from("circuits")
          .select("id, status", { count: "exact" })
          .eq("organizer_id", user?.id || ""),
      ]);

      return {
        totalTournaments: tournamentsRes.count || 0,
        activeTournaments:
          tournamentsRes.data?.filter((t) => t.status === "active").length || 0,
        totalParticipants: participantsRes.count || 0,
        activeCircuits:
          circuitsRes.data?.filter((c) => c.status === "active").length || 0,
      };
    },
    enabled: !!user?.id,
  });

  const statCards = [
    {
      title: t("dashboard.tournamentsCreated"),
      value: stats?.totalTournaments || 0,
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      title: t("dashboard.totalParticipants"),
      value: stats?.totalParticipants || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: t("dashboard.activeTournaments"),
      value: stats?.activeTournaments || 0,
      icon: Activity,
      color: "text-green-500",
    },
    {
      title: t("dashboard.activeCircuits"),
      value: stats?.activeCircuits || 0,
      icon: Target,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
