import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchResultForm } from "./MatchResultForm";
import { useHasRole } from "@/hooks/useUserRole";

interface Match {
  id: string;
  participant1_id: string | null;
  participant2_id: string | null;
  score_p1: number | null;
  score_p2: number | null;
  winner_id: string | null;
  status: string;
}

interface Participant {
  id: string;
  user_id: string;
  team_name: string | null;
  profile?: {
    display_name: string | null;
  };
}

interface BracketViewProps {
  matches: Match[];
  participants: Participant[];
  tournamentOrganizerId: string;
}

export const BracketView = ({
  matches,
  participants,
  tournamentOrganizerId,
}: BracketViewProps) => {
  const { t } = useTranslation();
  const { hasRole: isOrganizer } = useHasRole("organizer");

  const getParticipantName = (participantId: string | null) => {
    if (!participantId) return t("match.tbd", "A definir");
    const participant = participants.find((p) => p.id === participantId);
    return (
      participant?.team_name ||
      participant?.profile?.display_name ||
      t("match.unknown", "Desconhecido")
    );
  };

  // Group matches by rounds (simple implementation)
  const rounds: Match[][] = [];
  let currentRound: Match[] = [];
  matches.forEach((match, index) => {
    currentRound.push(match);
    if ((index + 1) % Math.ceil(matches.length / 4) === 0) {
      rounds.push([...currentRound]);
      currentRound = [];
    }
  });
  if (currentRound.length > 0) {
    rounds.push(currentRound);
  }

  return (
    <div className="space-y-8">
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex}>
          <h3 className="text-xl font-bold mb-4">
            {roundIndex === rounds.length - 1
              ? t("match.final", "Final")
              : roundIndex === rounds.length - 2
              ? t("match.semifinal", "Semifinal")
              : `${t("match.round", "Rodada")} ${roundIndex + 1}`}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {round.map((match) => {
              const p1Name = getParticipantName(match.participant1_id);
              const p2Name = getParticipantName(match.participant2_id);
              const isCompleted = match.status === "completed";

              return (
                <Card key={match.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              match.winner_id === match.participant1_id
                                ? "bg-primary/10 border-2 border-primary"
                                : "bg-muted"
                            }`}
                          >
                            <span className="font-medium">{p1Name}</span>
                            <span className="text-lg font-bold">
                              {match.score_p1 ?? "-"}
                            </span>
                          </div>
                          <div className="text-center py-1 text-muted-foreground">
                            vs
                          </div>
                          <div
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              match.winner_id === match.participant2_id
                                ? "bg-primary/10 border-2 border-primary"
                                : "bg-muted"
                            }`}
                          >
                            <span className="font-medium">{p2Name}</span>
                            <span className="text-lg font-bold">
                              {match.score_p2 ?? "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Badge
                          variant={isCompleted ? "default" : "secondary"}
                        >
                          {isCompleted
                            ? t("match.completed", "Finalizada")
                            : t("match.pending", "Pendente")}
                        </Badge>
                        {isOrganizer && (
                          <MatchResultForm
                            match={match}
                            participant1Name={p1Name}
                            participant2Name={p2Name}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
