import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Database } from "@/integrations/supabase/types";

export default function Tournaments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Database["public"]["Enums"]["tournament_status"] | "">("");
  const { data: tournaments, isLoading } = useTournaments({ search, status: statusFilter || undefined });
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-orbitron font-bold text-gradient-fire-blue">
          Torneios
        </h1>
        {isAuthenticated && (
          <Link to="/tournaments/create">
            <Button variant="hero" className="animate-glow-fire">
              <Plus className="mr-2 h-5 w-5" />
              Criar Torneio
            </Button>
          </Link>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar torneios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="border-glow-blue">
          <Filter className="mr-2 h-5 w-5" />
          Filtros
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments?.map((tournament, index) => (
          <motion.div
            key={tournament.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={`/tournaments/${tournament.id}`}>
              <Card className="p-6 hover:border-glow-fire transition-all cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-orbitron font-bold text-foreground">
                    {tournament.name}
                  </h3>
                  <Badge variant={tournament.status === "active" ? "default" : "secondary"}>
                    {tournament.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {tournament.description}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {format(new Date(tournament.start_date), "dd MMM yyyy", { locale: ptBR })}
                  </span>
                  <span className="text-primary font-medium">
                    {tournament.max_participants} vagas
                  </span>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
