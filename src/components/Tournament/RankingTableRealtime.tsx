import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RankingEntry {
  user_id: string;
  total_points: number;
  wins: number;
  losses: number;
  matches_played: number;
  rank: number | null;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface RankingTableRealtimeProps {
  circuitId: string;
  data: RankingEntry[];
}

export const RankingTableRealtime = ({
  circuitId,
  data,
}: RankingTableRealtimeProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("circuit-stats-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "circuit_stats",
          filter: `circuit_id=eq.${circuitId}`,
        },
        (payload) => {
          console.log("Circuit stats updated:", payload);
          queryClient.invalidateQueries({ queryKey: ["circuit-ranking", circuitId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [circuitId, queryClient]);

  const getRankIcon = (rank: number | null) => {
    if (!rank) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (rank < 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (rank > 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getWinRate = (wins: number, matchesPlayed: number) => {
    if (matchesPlayed === 0) return "0%";
    return `${Math.round((wins / matchesPlayed) * 100)}%`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">#</TableHead>
          <TableHead>{t("ranking.player", "Jogador")}</TableHead>
          <TableHead className="text-center">{t("ranking.points", "Pontos")}</TableHead>
          <TableHead className="text-center">{t("ranking.wins", "Vitórias")}</TableHead>
          <TableHead className="text-center">{t("ranking.losses", "Derrotas")}</TableHead>
          <TableHead className="text-center">{t("ranking.winRate", "Win Rate")}</TableHead>
          <TableHead className="text-center">{t("ranking.trend", "Tendência")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry, index) => (
          <TableRow key={entry.user_id}>
            <TableCell className="font-bold">
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && index + 1}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {entry.profile?.display_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {entry.profile?.display_name || t("common.unknown", "Desconhecido")}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="default">{entry.total_points}</Badge>
            </TableCell>
            <TableCell className="text-center text-success">
              {entry.wins}
            </TableCell>
            <TableCell className="text-center text-destructive">
              {entry.losses}
            </TableCell>
            <TableCell className="text-center font-medium">
              {getWinRate(entry.wins, entry.matches_played)}
            </TableCell>
            <TableCell className="text-center">
              {getRankIcon(entry.rank)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
