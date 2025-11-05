import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfileOverviewTab } from "@/components/Profile/ProfileOverviewTab";
import { ProfileHistoryTab } from "@/components/Profile/ProfileHistoryTab";
import { ProfileStatsTab } from "@/components/Profile/ProfileStatsTab";
import { ProfileAchievementsTab } from "@/components/Profile/ProfileAchievementsTab";

const Profile = () => {
  const { userId } = useParams();
  const { t } = useTranslation();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: history = [] } = useQuery({
    queryKey: ["player-history", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("participants")
        .select("*, tournament:tournaments(id, name)")
        .eq("user_id", userId)
        .order("joined_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: stats } = useQuery({
    queryKey: ["player-stats", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data: participants, error } = await supabase
        .from("participants")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      const totalTournaments = participants.length;
      const totalWins = participants.filter((p) => p.status === "champion").length;
      const winRate = totalTournaments > 0 ? (totalWins / totalTournaments) * 100 : 0;

      return {
        totalTournaments,
        totalWins,
        winRate,
        totalPoints: 0,
      };
    },
    enabled: !!userId,
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["player-achievements", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*, achievement:achievements(*)")
        .eq("user_id", userId)
        .order("unlocked_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: circuitStats = [] } = useQuery({
    queryKey: ["player-circuit-stats", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("circuit_stats")
        .select("total_points, wins, user_id")
        .eq("user_id", userId)
        .order("total_points", { ascending: false });
      if (error) throw error;
      
      // Get profile separately
      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", userId)
        .maybeSingle();
      
      return data.map((stat) => ({
        ...stat,
        profile: profileData ? { display_name: profileData.display_name } : undefined,
      }));
    },
    enabled: !!userId,
  });

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <p className="text-center text-muted-foreground">{t("common.noData")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <ProfileHeader
        userId={userId!}
        displayName={profile.display_name}
        avatarUrl={profile.avatar_url}
        bio={profile.bio}
        socialLinks={profile.social_links as Record<string, string>}
        achievements={achievements.map((a) => a.achievement)}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("profile.overview")}</TabsTrigger>
          <TabsTrigger value="history">{t("profile.history")}</TabsTrigger>
          <TabsTrigger value="stats">{t("profile.statistics")}</TabsTrigger>
          <TabsTrigger value="achievements">{t("profile.achievements")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ProfileOverviewTab
            stats={stats || { totalTournaments: 0, totalWins: 0, winRate: 0, totalPoints: 0 }}
            recentTournaments={[]}
          />
        </TabsContent>

        <TabsContent value="history">
          <ProfileHistoryTab history={history} />
        </TabsContent>

        <TabsContent value="stats">
          <ProfileStatsTab
            stats={{
              pointsData: circuitStats.map((s) => ({ total_points: s.total_points, profile: s.profile })),
              winsData: circuitStats.map((s) => ({ wins: s.wins, profile: s.profile })),
            }}
          />
        </TabsContent>

        <TabsContent value="achievements">
          <ProfileAchievementsTab achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
