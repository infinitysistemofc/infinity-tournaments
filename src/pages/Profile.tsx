import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-orbitron font-bold text-gradient-fire-blue mb-2">
          Perfil
        </h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </motion.div>

      <Card className="p-6 border-glow-blue">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-card border border-border flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-orbitron font-bold">{user?.email}</h2>
            <p className="text-muted-foreground">Jogador</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Funcionalidade de edição de perfil em desenvolvimento.
        </p>
      </Card>
    </div>
  );
}
