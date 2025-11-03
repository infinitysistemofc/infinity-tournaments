import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { MyTournamentsWidget } from "@/components/Dashboard/MyTournamentsWidget";
import { MyCircuitsWidget } from "@/components/Dashboard/MyCircuitsWidget";
import { StatsWidget } from "@/components/Dashboard/StatsWidget";
import { RecentActivityWidget } from "@/components/Dashboard/RecentActivityWidget";
import { UpcomingEventsWidget } from "@/components/Dashboard/UpcomingEventsWidget";

const Dashboard = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold mb-8 font-orbitron text-gradient-fire-blue">
        {t("dashboard.welcome")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Widget - Full width on mobile, spans 3 cols on desktop */}
        <div className="md:col-span-2 lg:col-span-3">
          <StatsWidget />
        </div>

        {/* My Tournaments Widget */}
        <div className="md:col-span-2 lg:col-span-2">
          <MyTournamentsWidget />
        </div>

        {/* My Circuits Widget */}
        <div className="md:col-span-2 lg:col-span-1">
          <MyCircuitsWidget />
        </div>

        {/* Upcoming Events Widget */}
        <div className="md:col-span-1 lg:col-span-2">
          <UpcomingEventsWidget />
        </div>

        {/* Recent Activity Widget */}
        <div className="md:col-span-1 lg:col-span-1">
          <RecentActivityWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
