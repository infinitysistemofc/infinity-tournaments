import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HallOfFameCircuit = () => {
  const { circuitId } = useParams();
  const { t } = useTranslation();

  const { data: circuit } = useQuery({
    queryKey: ["circuit", circuitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("circuits")
        .select("*")
        .eq("id", circuitId || "")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: rankings } = useQuery({
    queryKey: ["circuit-rankings", circuitId],
    queryFn: async () => {
      const { data: stats, error } = await supabase
        .from("circuit_stats")
        .select("*")
        .eq("circuit_id", circuitId || "")
        .order("total_points", { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch profiles separately
      const userIds = stats?.map((s) => s.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);

      // Merge data
      return stats?.map((s) => ({
        ...s,
        profile: profiles?.find((prof) => prof.user_id === s.user_id),
      })) || [];
    },
  });

  const champion = rankings?.[0];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 font-orbitron text-gradient-fire-blue">
          {t("hallOfFame.title")}
        </h1>
        <h2 className="text-2xl font-semibold text-muted-foreground">
          {circuit?.name} - {circuit?.season}
        </h2>
      </div>

      {/* Season Champion */}
      {champion && (
        <Card className="mb-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50">
          <CardContent className="p-8 text-center">
            <Trophy className="h-20 w-20 mx-auto mb-4 text-blue-500 animate-pulse" />
            <h3 className="text-3xl font-bold mb-4">{t("hallOfFame.seasonChampion")}</h3>
            <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-blue-500">
              <AvatarImage src={champion.profile?.avatar_url || ""} />
              <AvatarFallback className="text-3xl">
                {champion.profile?.display_name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <h4 className="text-2xl font-bold">
              {champion.profile?.display_name || "Unknown"}
            </h4>
            <p className="text-xl text-muted-foreground mt-2">
              {champion.total_points} {t("hallOfFame.points")}
            </p>
            <div className="flex gap-6 justify-center mt-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("hallOfFame.wins")}</p>
                <p className="font-bold text-lg">{champion.wins}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("circuits.matchesPlayed")}</p>
                <p className="font-bold text-lg">{champion.matches_played}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("hallOfFame.winRate")}</p>
                <p className="font-bold text-lg">
                  {champion.matches_played > 0
                    ? ((champion.wins / champion.matches_played) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 10 Players */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-4">{t("hallOfFame.topPlayers")}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">{t("hallOfFame.position")}</TableHead>
                <TableHead>{t("hallOfFame.player")}</TableHead>
                <TableHead className="text-center">{t("hallOfFame.points")}</TableHead>
                <TableHead className="text-center">{t("hallOfFame.wins")}</TableHead>
                <TableHead className="text-center">{t("circuits.matchesPlayed")}</TableHead>
                <TableHead className="text-center">{t("hallOfFame.winRate")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings?.map((stat, index) => {
                const winRate =
                  stat.matches_played > 0
                    ? ((stat.wins / stat.matches_played) * 100).toFixed(1)
                    : "0.0";

                return (
                  <TableRow key={stat.id}>
                    <TableCell className="font-bold">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={stat.profile?.avatar_url || ""} />
                          <AvatarFallback>
                            {stat.profile?.display_name?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{stat.profile?.display_name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {stat.total_points}
                    </TableCell>
                    <TableCell className="text-center">{stat.wins}</TableCell>
                    <TableCell className="text-center">{stat.matches_played}</TableCell>
                    <TableCell className="text-center">{winRate}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HallOfFameCircuit;
