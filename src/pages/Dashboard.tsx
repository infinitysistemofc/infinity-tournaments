import { motion } from "framer-motion";
import { Trophy, Users, Award, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const stats = [
    { icon: Trophy, label: "Torneios Criados", value: "0", color: "text-primary" },
    { icon: Users, label: "Participantes Totais", value: "0", color: "text-accent" },
    { icon: Award, label: "Conquistas", value: "0", color: "text-primary" },
    { icon: TrendingUp, label: "Taxa de Vitória", value: "0%", color: "text-accent" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-orbitron font-bold text-gradient-fire-blue mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Acompanhe suas estatísticas e torneios</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 border-glow-blue hover:border-glow-fire transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-card rounded-lg border border-border">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-orbitron font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6 border-glow-blue">
        <h2 className="text-2xl font-orbitron font-bold mb-4">Meus Torneios</h2>
        <p className="text-muted-foreground">
          Você ainda não criou nenhum torneio. Comece criando seu primeiro torneio!
        </p>
      </Card>
    </div>
  );
}
