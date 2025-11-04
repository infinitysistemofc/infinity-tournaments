import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface ProgressBarExpandedProps {
  userId: string;
  playerName: string;
  avatarUrl?: string;
  currentPoints: number;
  maxPoints: number;
  position: number;
  rankChange?: "up" | "down" | "same";
  nextTournament?: string;
  nextTournamentDate?: string;
}

const ProgressBarExpanded = ({
  userId,
  playerName,
  avatarUrl,
  currentPoints,
  maxPoints,
  position,
  rankChange = "same",
  nextTournament,
  nextTournamentDate,
}: ProgressBarExpandedProps) => {
  const navigate = useNavigate();
  const percentage = maxPoints > 0 ? (currentPoints / maxPoints) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-xl">
                {playerName[0] || "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold">{playerName}</h3>
                {rankChange === "up" && (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                )}
                {rankChange === "down" && (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Posição #{position} • {currentPoints} pontos
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/players/${userId}/achievements`)}
            >
              Ver Perfil
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progresso</span>
              <span className="text-muted-foreground">
                {currentPoints} / {maxPoints} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          {nextTournament && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-accent rounded-lg">
              <Calendar className="h-4 w-4" />
              <div>
                <p className="font-medium text-foreground">Próximo Torneio</p>
                <p>
                  {nextTournament}
                  {nextTournamentDate && ` • ${nextTournamentDate}`}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressBarExpanded;
