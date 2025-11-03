import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export const MyTournamentsWidget = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: tournaments, isLoading } = useTournaments({
    organizerId: user?.id,
    limit: 5,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {t("dashboard.myTournaments")}
        </CardTitle>
        <Link to="/tournaments">
          <Button variant="ghost" size="sm">
            {t("dashboard.viewAll")}
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : tournaments && tournaments.length > 0 ? (
          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{tournament.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(tournament.status)}>
                      {t(`tournaments.${tournament.status}`)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {tournament.format}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/tournaments/${tournament.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/tournaments/${tournament.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("dashboard.noTournaments")}</p>
            <Link to="/tournaments/create">
              <Button className="mt-4" variant="neon">
                {t("tournaments.create")}
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
