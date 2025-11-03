import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HallOfFamePlayer = () => {
  const { playerId } = useParams();
  const { t } = useTranslation();

  const { data: profile } = useQuery({
    queryKey: ["profile", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", playerId || "")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["player-stats", playerId],
    queryFn: async () => {
      const { data: participations } = await supabase
        .from("participants")
        .select("*, tournaments(*)")
        .eq("user_id", playerId || "")
        .order("joined_at", { ascending: false });

      const totalTournaments = participations?.length || 0;
      const wins = participations?.filter((p) => p.status === "champion").length || 0;
      const winRate = totalTournaments > 0 ? (wins / totalTournaments) * 100 : 0;

      return {
        totalTournaments,
        wins,
        winRate,
        participations: participations || [],
      };
    },
  });

  const { data: achievements } = useQuery({
    queryKey: ["player-achievements", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_achievements")
        .select(`
          *,
          achievements(*)
        `)
        .eq("user_id", playerId || "")
        .order("unlocked_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 font-orbitron text-gradient-fire-blue">
          {t("hallOfFame.title")}
        </h1>
      </div>

      {/* Player Profile */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="text-3xl">
                {profile?.display_name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{profile?.display_name || "Unknown"}</h2>
              <p className="text-muted-foreground mb-4">{profile?.bio}</p>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <div>
                  <p className="text-sm text-muted-foreground">{t("tournaments.title")}</p>
                  <p className="text-2xl font-bold">{stats?.totalTournaments || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("hallOfFame.wins")}</p>
                  <p className="text-2xl font-bold">{stats?.wins || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("hallOfFame.winRate")}</p>
                  <p className="text-2xl font-bold">{stats?.winRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {t("hallOfFame.achievements")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievements && achievements.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Trophy className="h-8 w-8 mb-2 text-yellow-500" />
                    <p className="font-semibold text-sm text-center">
                      {achievement.achievements?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t("common.noData")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t("hallOfFame.performance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("common.noData")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tournament History */}
      <Card>
        <CardHeader>
          <CardTitle>{t("hallOfFame.tournamentHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("hallOfFame.tournament")}</TableHead>
                <TableHead className="text-center">{t("hallOfFame.date")}</TableHead>
                <TableHead className="text-center">{t("hallOfFame.position")}</TableHead>
                <TableHead className="text-center">{t("tournaments.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.participations.map((participation) => (
                <TableRow key={participation.id}>
                  <TableCell className="font-medium">
                    {participation.tournaments?.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(participation.joined_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">{participation.seed || "-"}</TableCell>
                  <TableCell className="text-center">{participation.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HallOfFamePlayer;
