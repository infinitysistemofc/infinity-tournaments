import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HallOfFameTournament = () => {
  const { tournamentId } = useParams();
  const { t } = useTranslation();

  const { data: tournament } = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", tournamentId || "")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: rankings } = useQuery({
    queryKey: ["tournament-rankings", tournamentId],
    queryFn: async () => {
      const { data: participants, error } = await supabase
        .from("participants")
        .select("*")
        .eq("tournament_id", tournamentId || "")
        .order("seed", { ascending: true });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = participants?.map((p) => p.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);

      // Merge data
      return participants?.map((p) => ({
        ...p,
        profile: profiles?.find((prof) => prof.user_id === p.user_id),
      })) || [];
    },
  });

  const champion = rankings?.[0];
  const podium = rankings?.slice(0, 3);
  const allRankings = rankings || [];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 font-orbitron text-gradient-fire-blue">
          {t("hallOfFame.title")}
        </h1>
        <h2 className="text-2xl font-semibold text-muted-foreground">
          {tournament?.name}
        </h2>
      </div>

      {/* Champion Highlight */}
      {champion && (
        <Card className="mb-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50">
          <CardContent className="p-8 text-center">
            <Trophy className="h-20 w-20 mx-auto mb-4 text-yellow-500 animate-pulse" />
            <h3 className="text-3xl font-bold mb-4">{t("hallOfFame.champion")}</h3>
            <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-yellow-500">
              <AvatarImage src={champion.profile?.avatar_url || ""} />
              <AvatarFallback className="text-3xl">
                {champion.profile?.display_name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <h4 className="text-2xl font-bold">
              {champion.profile?.display_name || champion.team_name || "Unknown"}
            </h4>
            {tournament?.prize_pool && (
              <p className="text-xl text-muted-foreground mt-2">
                {t("hallOfFame.prize")}: ${tournament.prize_pool}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Podium */}
      {podium && podium.length >= 3 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">{t("hallOfFame.podium")}</h3>
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* 2nd Place */}
            <Card className="bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-gray-400/50">
              <CardContent className="p-6 text-center">
                <Medal className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-muted-foreground mb-2">2º {t("hallOfFame.position")}</p>
                <Avatar className="h-16 w-16 mx-auto mb-2">
                  <AvatarImage src={podium[1].profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {podium[1].profile?.display_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold">
                  {podium[1].profile?.display_name || podium[1].team_name}
                </p>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 border-yellow-400/50 -mt-4">
              <CardContent className="p-6 text-center">
                <Trophy className="h-16 w-16 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm text-muted-foreground mb-2">1º {t("hallOfFame.position")}</p>
                <Avatar className="h-20 w-20 mx-auto mb-2">
                  <AvatarImage src={podium[0].profile?.avatar_url || ""} />
                  <AvatarFallback className="text-xl">
                    {podium[0].profile?.display_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold text-lg">
                  {podium[0].profile?.display_name || podium[0].team_name}
                </p>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-orange-400/50">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 mx-auto mb-2 text-orange-400" />
                <p className="text-sm text-muted-foreground mb-2">3º {t("hallOfFame.position")}</p>
                <Avatar className="h-16 w-16 mx-auto mb-2">
                  <AvatarImage src={podium[2].profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {podium[2].profile?.display_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold">
                  {podium[2].profile?.display_name || podium[2].team_name}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Complete Rankings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-4">{t("hallOfFame.completeRanking")}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">{t("hallOfFame.position")}</TableHead>
                <TableHead>{t("hallOfFame.player")}</TableHead>
                <TableHead className="text-center">{t("circuits.rank")}</TableHead>
                <TableHead className="text-center">{t("tournaments.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRankings.map((participant, index) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-bold">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.profile?.avatar_url || ""} />
                        <AvatarFallback>
                          {participant.profile?.display_name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {participant.profile?.display_name ||
                          participant.team_name ||
                          "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{participant.seed || "-"}</TableCell>
                  <TableCell className="text-center">
                    <Badge>{participant.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HallOfFameTournament;
