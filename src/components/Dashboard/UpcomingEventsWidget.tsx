import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const UpcomingEventsWidget = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: upcomingTournaments, isLoading } = useQuery({
    queryKey: ["upcoming-tournaments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .in("status", ["registration", "active"])
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="border-glow-blue h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t("dashboard.upcomingEvents")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : upcomingTournaments && upcomingTournaments.length > 0 ? (
          <div className="space-y-3">
            {upcomingTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="p-3 bg-card border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/tournaments/${tournament.id}`)}
              >
                <h4 className="font-semibold text-sm mb-2">{tournament.name}</h4>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {tournament.max_participants}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>{t("dashboard.noUpcomingEvents")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
