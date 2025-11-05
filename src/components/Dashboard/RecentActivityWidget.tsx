import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Trophy, Award, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

export const RecentActivityWidget = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const { data: recentActivity, isLoading } = useQuery({
    queryKey: ["recent-activity", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const [participants, achievements] = await Promise.all([
        supabase
          .from("participants")
          .select("*, tournament:tournaments(name)")
          .eq("user_id", user.id)
          .order("joined_at", { ascending: false })
          .limit(3),
        supabase
          .from("user_achievements")
          .select("*, achievement:achievements(name, icon_url)")
          .eq("user_id", user.id)
          .order("unlocked_at", { ascending: false })
          .limit(3),
      ]);

      const activities = [
        ...(participants.data || []).map((p) => ({
          id: p.id,
          type: "tournament",
          message: t("dashboard.joinedTournament", { name: p.tournament.name }),
          date: p.joined_at,
          icon: Trophy,
        })),
        ...(achievements.data || []).map((a) => ({
          id: a.id,
          type: "achievement",
          message: t("dashboard.unlockedAchievement", { name: a.achievement.name }),
          date: a.unlocked_at,
          icon: Award,
        })),
      ];

      return activities.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 5);
    },
    enabled: !!user?.id,
  });

  return (
    <Card className="border-glow-blue h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          {t("dashboard.recentActivity")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === "achievement" ? "gradient-fire" : "gradient-blue"
                }`}>
                  <activity.icon className="h-3 w-3 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>{t("dashboard.noRecentActivity")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
