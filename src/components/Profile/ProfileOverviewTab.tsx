import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Award, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProfileOverviewTabProps {
  stats: {
    totalTournaments: number;
    totalWins: number;
    winRate: number;
    totalPoints: number;
  };
  recentTournaments?: Array<{
    id: string;
    name: string;
    date: string;
    position: number;
    points: number;
  }>;
}

export const ProfileOverviewTab = ({
  stats,
  recentTournaments = [],
}: ProfileOverviewTabProps) => {
  const { t } = useTranslation();

  const statCards = [
    {
      title: t("profile.totalTournaments"),
      value: stats.totalTournaments,
      icon: Trophy,
      color: "text-blue-500",
    },
    {
      title: t("profile.totalWins"),
      value: stats.totalWins,
      icon: Award,
      color: "text-yellow-500",
    },
    {
      title: t("profile.winRate"),
      value: `${stats.winRate.toFixed(1)}%`,
      icon: Target,
      color: "text-green-500",
    },
    {
      title: t("profile.totalPoints"),
      value: stats.totalPoints,
      icon: TrendingUp,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {recentTournaments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.recentTournaments")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">{tournament.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tournament.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {t("common.position", { position: tournament.position })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tournament.points} pts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
