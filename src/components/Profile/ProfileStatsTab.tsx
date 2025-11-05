import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PointsLineChart from "@/components/Charts/PointsLineChart";
import WinsDistributionChart from "@/components/Charts/WinsDistributionChart";
import { useTranslation } from "react-i18next";

interface ProfileStatsTabProps {
  stats: {
    pointsData: Array<{
      total_points: number;
      profile?: {
        display_name?: string;
      };
    }>;
    winsData: Array<{
      wins: number;
      profile?: {
        display_name?: string;
      };
    }>;
  };
}

export const ProfileStatsTab = ({ stats }: ProfileStatsTabProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.pointsEvolution")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PointsLineChart data={stats.pointsData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile.winsDistribution")}</CardTitle>
        </CardHeader>
        <CardContent>
          <WinsDistributionChart data={stats.winsData} />
        </CardContent>
      </Card>
    </div>
  );
};
