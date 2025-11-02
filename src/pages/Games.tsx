import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Games() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-orbitron font-bold text-gradient-fire-blue mb-2">
          Jogos
        </h1>
        <p className="text-muted-foreground">
          Explore os jogos suportados pela plataforma
        </p>
      </motion.div>

      <Card className="p-12 border-glow-blue text-center">
        <Gamepad2 className="h-16 w-16 text-primary mx-auto mb-4 animate-glow-blue" />
        <h2 className="text-2xl font-orbitron font-bold mb-2">Em Breve</h2>
        <p className="text-muted-foreground">
          A listagem de jogos está em desenvolvimento.
        </p>
      </Card>
    </div>
  );
}
