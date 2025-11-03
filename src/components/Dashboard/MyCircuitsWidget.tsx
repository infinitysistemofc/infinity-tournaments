import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Edit, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const MyCircuitsWidget = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: circuits, isLoading } = useQuery({
    queryKey: ["circuits", "my", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("circuits")
        .select("*")
        .eq("organizer_id", user?.id || "")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {t("dashboard.myCircuits")}
        </CardTitle>
        <Link to="/circuits">
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
        ) : circuits && circuits.length > 0 ? (
          <div className="space-y-4">
            {circuits.map((circuit) => (
              <div
                key={circuit.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{circuit.name}</h3>
                  <p className="text-sm text-muted-foreground">{circuit.season}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/circuits/${circuit.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/circuits/${circuit.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("dashboard.noCircuits")}</p>
            <Link to="/circuits/create">
              <Button className="mt-4" variant="neon">
                {t("circuits.create")}
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
