import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const MyCircuitsWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: myCircuits, isLoading } = useQuery({
    queryKey: ["my-circuits", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: stats, error } = await supabase
        .from("circuit_stats")
        .select("*, circuit:circuits(*)")
        .eq("user_id", user.id)
        .order("total_points", { ascending: false})
        .limit(3);

      if (error) throw error;
      return stats;
    },
    enabled: !!user?.id,
  });

  return (
    <Card className="border-glow-blue h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          {t("dashboard.myCircuits")}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate("/circuits")}>
          {t("common.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : myCircuits && myCircuits.length > 0 ? (
          <div className="space-y-3">
            {myCircuits.map((stat) => (
              <div
                key={stat.id}
                className="p-3 bg-card border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/circuits/${stat.circuit.id}`)}
              >
                <h4 className="font-semibold text-sm mb-2">{stat.circuit.name}</h4>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    {t("common.rank")}: {stat.rank || "N/A"}
                  </div>
                  <div className="font-bold text-primary">
                    {stat.total_points} {t("common.points")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>{t("dashboard.noCircuits")}</p>
            <Button variant="neon" size="sm" className="mt-4" onClick={() => navigate("/circuits")}>
              {t("dashboard.exploreCircuits")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
