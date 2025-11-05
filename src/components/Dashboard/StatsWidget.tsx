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
    queryKey: ["player-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const [participants, circuitStats, achievements] = await Promise.all([
        supabase
          .from("participants")
          .select("*")
          .eq("user_id", user.id),
        supabase
          .from("circuit_stats")
          .select("total_points, wins")
          .eq("user_id", user.id),
        supabase
          .from("user_achievements")
          .select("*")
          .eq("user_id", user.id),
      ]);

      const totalTournaments = participants.data?.length || 0;
      const totalWins = participants.data?.filter((p) => p.status === "champion").length || 0;
      const totalPoints = circuitStats.data?.reduce((acc, s) => acc + s.total_points, 0) || 0;
      const totalAchievements = achievements.data?.length || 0;

      return {
        totalTournaments,
        totalWins,
        totalPoints,
        totalAchievements,
      };
    },
    enabled: !!user?.id,
  });

  const statCards = [
    {
      title: t("dashboard.totalTournaments"),
      value: stats?.totalTournaments || 0,
      icon: Trophy,
      gradient: "gradient-fire",
    },
    {
      title: t("dashboard.totalWins"),
      value: stats?.totalWins || 0,
      icon: Target,
      gradient: "gradient-blue",
    },
    {
      title: t("dashboard.totalPoints"),
      value: stats?.totalPoints || 0,
      icon: Activity,
      gradient: "gradient-fire",
    },
    {
      title: t("dashboard.achievements"),
      value: stats?.totalAchievements || 0,
      icon: Users,
      gradient: "gradient-blue",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={stat.title} className="border-glow-blue hover:border-glow-fire transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.gradient}`}>
              <stat.icon className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-orbitron font-bold text-gradient-fire-blue">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
