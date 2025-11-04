import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { Badge } from "@/components/ui/badge";

const Tournaments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: tournaments, isLoading } = useTournaments();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold font-orbitron text-gradient-fire-blue">
          {t("tournaments.title")}
        </h1>
        <Button onClick={() => navigate("/tournaments/create")}>
          <Plus className="h-4 w-4 mr-2" />
          {t("tournaments.create")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments && tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/tournaments/${tournament.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  <Badge
                    variant={
                      tournament.status === "active"
                        ? "default"
                        : tournament.status === "completed"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {tournament.status}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-1">{tournament.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(tournament.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{tournament.max_participants} {t("tournaments.participants")}</span>
                  </div>
                  {tournament.description && (
                    <p className="line-clamp-2 mt-2">{tournament.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">{t("common.noData")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
