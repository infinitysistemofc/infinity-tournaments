import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const MyTournamentsWidget = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: myTournaments, isLoading } = useQuery({
    queryKey: ["my-tournaments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: participants, error } = await supabase
        .from("participants")
        .select("*, tournament:tournaments(*)")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return participants;
    },
    enabled: !!user?.id,
  });

  return (
    <Card className="border-glow-blue">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          {t("dashboard.myTournaments")}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate("/tournaments")}>
          {t("common.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : myTournaments && myTournaments.length > 0 ? (
          <div className="space-y-3">
            {myTournaments.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/tournaments/${participant.tournament.id}`)}
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{participant.tournament.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(participant.tournament.start_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    participant.status === "champion" 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {t(`tournaments.participantStatus.${participant.status}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>{t("dashboard.noTournaments")}</p>
            <Button variant="neon" size="sm" className="mt-4" onClick={() => navigate("/tournaments")}>
              {t("dashboard.exploreTournaments")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
