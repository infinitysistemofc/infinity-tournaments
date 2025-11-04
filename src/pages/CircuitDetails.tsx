import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCircuit } from "@/hooks/circuits/useCircuit";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Trophy } from "lucide-react";
import CircuitOverviewTab from "@/components/Circuit/CircuitOverviewTab";
import CircuitTournamentsTab from "@/components/Circuit/CircuitTournamentsTab";
import CircuitRankingTab from "@/components/Circuit/CircuitRankingTab";
import CircuitStatsTab from "@/components/Circuit/CircuitStatsTab";

const CircuitDetails = () => {
  const { circuitId } = useParams();
  const { t } = useTranslation();
  const { data: circuit, isLoading } = useCircuit(circuitId);

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

  if (!circuit) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">{t("common.noData")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header do Circuito */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold font-orbitron text-gradient-fire-blue">
            {circuit.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-4 items-center text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{circuit.season || t("circuits.season")}</span>
          </div>
          <span>•</span>
          <span>
            {new Date(circuit.start_date).toLocaleDateString()} -{" "}
            {new Date(circuit.end_date).toLocaleDateString()}
          </span>
          <span>•</span>
          <span className="capitalize">{circuit.status}</span>
        </div>
        {circuit.description && (
          <p className="mt-4 text-muted-foreground">{circuit.description}</p>
        )}
      </div>

      {/* Abas */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("circuits.overview")}</TabsTrigger>
          <TabsTrigger value="tournaments">{t("tournaments.title")}</TabsTrigger>
          <TabsTrigger value="ranking">{t("circuits.ranking")}</TabsTrigger>
          <TabsTrigger value="stats">{t("circuits.statistics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <CircuitOverviewTab circuitId={circuitId || ""} />
        </TabsContent>

        <TabsContent value="tournaments" className="mt-6">
          <CircuitTournamentsTab circuitId={circuitId || ""} />
        </TabsContent>

        <TabsContent value="ranking" className="mt-6">
          <CircuitRankingTab circuitId={circuitId || ""} />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <CircuitStatsTab circuitId={circuitId || ""} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CircuitDetails;
