import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, Trophy, Users, Calendar, Filter, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { useCircuits } from "@/hooks/circuits/useCircuits";

export const Showcase = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "active" | "draft" | "completed">("all");

  const { data: tournaments, isLoading: tournamentsLoading } = useTournaments({
    status: selectedCategory === "all" ? undefined : (selectedCategory as "active" | "draft" | "completed"),
  });

  const { data: circuits, isLoading: circuitsLoading } = useCircuits({
    status: selectedCategory === "all" ? undefined : (selectedCategory as "active" | "draft" | "completed"),
  });

  const filteredTournaments = tournaments?.filter(tournament =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournament.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCircuits = circuits?.filter(circuit =>
    circuit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    circuit.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4 text-gradient-fire-blue">
            {t("showcase.title")}
          </h1>
          <p className="text-xl text-muted-foreground font-rajdhani max-w-2xl mx-auto">
            {t("showcase.description")}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t("showcase.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                <Filter className="mr-2 h-4 w-4" />
                {t("showcase.filters.all")}
              </Button>
              <Button
                variant={selectedCategory === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("active")}
              >
                {t("showcase.filters.active")}
              </Button>
              <Button
                variant={selectedCategory === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("draft")}
              >
                {t("showcase.filters.draft")}
              </Button>
              <Button
                variant={selectedCategory === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("completed")}
              >
                {t("showcase.filters.completed")}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="tournaments" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-8">
            <TabsTrigger value="tournaments" className="font-rajdhani">
              <Trophy className="mr-2 h-4 w-4" />
              {t("common.tournaments")}
            </TabsTrigger>
            <TabsTrigger value="circuits" className="font-rajdhani">
              <TrendingUp className="mr-2 h-4 w-4" />
              {t("common.circuits")}
            </TabsTrigger>
          </TabsList>

          {/* Tournaments Tab */}
          <TabsContent value="tournaments">
            {tournamentsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-80 animate-pulse bg-card/50" />
                ))}
              </div>
            ) : filteredTournaments && filteredTournaments.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map((tournament, index) => (
                  <motion.div
                    key={tournament.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card
                      className="overflow-hidden bg-card border-glow-blue hover:border-glow-fire transition-all duration-300 cursor-pointer group h-full"
                      onClick={() => navigate(`/tournaments/${tournament.id}`)}
                    >
                      <div className="aspect-[16/9] bg-gradient-fire relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Trophy className="h-16 w-16 text-foreground opacity-20 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {t(`tournaments.status.${tournament.status}`)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-orbitron font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                          {tournament.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-rajdhani mb-4 line-clamp-2">
                          {tournament.description || t("tournaments.noDescription")}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(tournament.start_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-2 h-4 w-4" />
                            {tournament.max_participants} {t("tournaments.players")}
                          </div>
                          {tournament.prize_pool && (
                            <div className="flex items-center text-sm text-primary font-bold">
                              <Trophy className="mr-2 h-4 w-4" />
                              ${tournament.prize_pool}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-xl text-muted-foreground font-rajdhani">
                  {t("showcase.noTournaments")}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Circuits Tab */}
          <TabsContent value="circuits">
            {circuitsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-80 animate-pulse bg-card/50" />
                ))}
              </div>
            ) : filteredCircuits && filteredCircuits.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCircuits.map((circuit, index) => (
                  <motion.div
                    key={circuit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card
                      className="overflow-hidden bg-card border-glow-blue hover:border-glow-fire transition-all duration-300 cursor-pointer group h-full"
                      onClick={() => navigate(`/circuits/${circuit.id}`)}
                    >
                      <div className="aspect-[16/9] bg-gradient-blue relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TrendingUp className="h-16 w-16 text-foreground opacity-20 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {t(`circuits.status.${circuit.status}`)}
                          </span>
                        </div>
                        {circuit.season && (
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-bold">
                              {circuit.season}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-orbitron font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                          {circuit.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-rajdhani mb-4 line-clamp-2">
                          {circuit.description || t("circuits.noDescription")}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(circuit.start_date).toLocaleDateString()} - {new Date(circuit.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-xl text-muted-foreground font-rajdhani">
                  {t("showcase.noCircuits")}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Showcase;
