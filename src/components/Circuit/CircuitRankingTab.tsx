import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { useCircuitRanking } from "@/hooks/circuits/useCircuitRanking";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import ProgressBarSimple from "@/components/ProgressBar/ProgressBarSimple";

interface CircuitRankingTabProps {
  circuitId: string;
}

const CircuitRankingTab = ({ circuitId }: CircuitRankingTabProps) => {
  const { t } = useTranslation();
  const { data: ranking, isLoading } = useCircuitRanking(circuitId);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-muted rounded" />
      </div>
    );
  }

  if (!ranking || ranking.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">{t("common.noData")}</p>
        </CardContent>
      </Card>
    );
  }

  const maxPoints = Math.max(...ranking.map((r) => r.total_points));

  return (
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">{t("circuits.position")}</TableHead>
              <TableHead>{t("circuits.player")}</TableHead>
              <TableHead className="text-center">{t("circuits.points")}</TableHead>
              <TableHead className="text-center">{t("circuits.wins")}</TableHead>
              <TableHead className="text-center">{t("circuits.losses")}</TableHead>
              <TableHead className="text-center">{t("circuits.winRate")}</TableHead>
              <TableHead>{t("circuits.progress")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.map((player, index) => {
              const winRate =
                player.matches_played > 0
                  ? ((player.wins / player.matches_played) * 100).toFixed(1)
                  : "0.0";
              
              const rankChange = player.rank && player.rank < index + 1 ? "up" : player.rank && player.rank > index + 1 ? "down" : "same";

              return (
                <TableRow key={player.id}>
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-2">
                      {index + 1}
                      {rankChange === "up" && (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      )}
                      {rankChange === "down" && (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={player.profile?.avatar_url || ""} />
                        <AvatarFallback>
                          {player.profile?.display_name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">
                        {player.profile?.display_name || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {player.total_points}
                  </TableCell>
                  <TableCell className="text-center">{player.wins}</TableCell>
                  <TableCell className="text-center">{player.losses}</TableCell>
                  <TableCell className="text-center">{winRate}%</TableCell>
                  <TableCell>
                    <ProgressBarSimple
                      current={player.total_points}
                      max={maxPoints}
                      label={`${player.total_points} pts`}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CircuitRankingTab;
