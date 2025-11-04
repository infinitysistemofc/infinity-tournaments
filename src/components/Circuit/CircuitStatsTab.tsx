import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCircuitRanking } from "@/hooks/circuits/useCircuitRanking";
import { useCircuitTournaments } from "@/hooks/circuits/useCircuitTournaments";
import PointsLineChart from "@/components/Charts/PointsLineChart";
import WinsDistributionChart from "@/components/Charts/WinsDistributionChart";
import { Trophy, Users, Target } from "lucide-react";

interface CircuitStatsTabProps {
  circuitId: string;
}

const CircuitStatsTab = ({ circuitId }: CircuitStatsTabProps) => {
  const { t } = useTranslation();
  const { data: ranking } = useCircuitRanking(circuitId);
  const { data: tournaments } = useCircuitTournaments(circuitId);

  const totalParticipants = ranking?.length || 0;
  const totalMatches = ranking?.reduce((sum, p) => sum + p.matches_played, 0) || 0;
  const avgPointsPerPlayer =
    totalParticipants > 0
      ? (ranking?.reduce((sum, p) => sum + p.total_points, 0) || 0) / totalParticipants
      : 0;

  return (
    <div className="space-y-6">
      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("circuits.totalParticipants")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("circuits.totalMatches")}
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMatches}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("circuits.avgPoints")}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPointsPerPlayer.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("circuits.pointsDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <PointsLineChart data={ranking || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("circuits.winsDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <WinsDistributionChart data={ranking || []} />
          </CardContent>
        </Card>
      </div>

      {/* Torneios do Circuito */}
      <Card>
        <CardHeader>
          <CardTitle>{t("circuits.tournamentsBreakdown")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tournaments?.map((ct) => (
              <div
                key={ct.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium">{ct.tournament?.name}</span>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{ct.points_multiplier}x multiplier</span>
                  <span className="capitalize">{ct.tournament?.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CircuitStatsTab;
