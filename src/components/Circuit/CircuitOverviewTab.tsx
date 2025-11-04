import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCircuitTournaments } from "@/hooks/circuits/useCircuitTournaments";
import { useCircuitRanking } from "@/hooks/circuits/useCircuitRanking";
import { Trophy, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CircuitOverviewTabProps {
  circuitId: string;
}

const CircuitOverviewTab = ({ circuitId }: CircuitOverviewTabProps) => {
  const { t } = useTranslation();
  const { data: tournaments } = useCircuitTournaments(circuitId);
  const { data: ranking } = useCircuitRanking(circuitId);

  const upcomingTournaments = tournaments?.filter(
    (ct) => ct.tournament?.status === "registration" || ct.tournament?.status === "draft"
  ).slice(0, 3);

  const topPlayers = ranking?.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Próximos Torneios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("circuits.upcomingTournaments")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTournaments && upcomingTournaments.length > 0 ? (
            <div className="space-y-4">
              {upcomingTournaments.map((ct) => (
                <div
                  key={ct.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div>
                    <h4 className="font-semibold">{ct.tournament?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {ct.tournament?.start_date
                        ? new Date(ct.tournament.start_date).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {ct.points_multiplier}x {t("circuits.points")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("common.noData")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top 3 Jogadores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {t("circuits.topPlayers")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topPlayers && topPlayers.length > 0 ? (
            <div className="space-y-4">
              {topPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="text-2xl font-bold text-muted-foreground w-8">
                    #{index + 1}
                  </div>
                  <Avatar>
                    <AvatarImage src={player.profile?.avatar_url || ""} />
                    <AvatarFallback>
                      {player.profile?.display_name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {player.profile?.display_name || "Unknown"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {player.wins}W - {player.losses}L
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{player.total_points}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("circuits.points")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("common.noData")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CircuitOverviewTab;
