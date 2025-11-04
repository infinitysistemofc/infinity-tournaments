import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { useCircuitTournaments } from "@/hooks/circuits/useCircuitTournaments";
import { Calendar, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CircuitTournamentsTabProps {
  circuitId: string;
}

const CircuitTournamentsTab = ({ circuitId }: CircuitTournamentsTabProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: tournaments, isLoading } = useCircuitTournaments(circuitId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-muted rounded" />
        <div className="h-32 bg-muted rounded" />
      </div>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">{t("common.noData")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tournaments.map((ct) => (
        <Card key={ct.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{ct.tournament?.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      ct.tournament?.status === "active"
                        ? "bg-green-500/20 text-green-500"
                        : ct.tournament?.status === "completed"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-gray-500/20 text-gray-500"
                    }`}
                  >
                    {ct.tournament?.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {ct.tournament?.start_date
                        ? new Date(ct.tournament.start_date).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{ct.tournament?.max_participants} max</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>{ct.points_multiplier}x points</span>
                  </div>
                </div>

                {ct.tournament?.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {ct.tournament.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/tournaments/${ct.tournament_id}`)}
                >
                  {t("tournaments.viewDetails")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CircuitTournamentsTab;
