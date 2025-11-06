import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateMatch } from "@/hooks/matches/useUpdateMatch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";

interface MatchResultFormProps {
  match: {
    id: string;
    participant1_id: string | null;
    participant2_id: string | null;
    score_p1: number | null;
    score_p2: number | null;
    winner_id: string | null;
  };
  participant1Name: string;
  participant2Name: string;
}

export const MatchResultForm = ({
  match,
  participant1Name,
  participant2Name,
}: MatchResultFormProps) => {
  const { t } = useTranslation();
  const updateMatch = useUpdateMatch();
  const [open, setOpen] = useState(false);
  const [scoreP1, setScoreP1] = useState(match.score_p1?.toString() || "0");
  const [scoreP2, setScoreP2] = useState(match.score_p2?.toString() || "0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const p1Score = parseInt(scoreP1);
    const p2Score = parseInt(scoreP2);
    const winnerId =
      p1Score > p2Score
        ? match.participant1_id
        : p2Score > p1Score
        ? match.participant2_id
        : null;

    await updateMatch.mutateAsync({
      id: match.id,
      score_p1: p1Score,
      score_p2: p2Score,
      winner_id: winnerId || undefined,
      status: "completed",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          {t("match.editResult", "Editar")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("match.enterResult", "Inserir Resultado")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score_p1">{participant1Name}</Label>
              <Input
                id="score_p1"
                type="number"
                min="0"
                value={scoreP1}
                onChange={(e) => setScoreP1(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="score_p2">{participant2Name}</Label>
              <Input
                id="score_p2"
                type="number"
                min="0"
                value={scoreP2}
                onChange={(e) => setScoreP2(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel", "Cancelar")}
            </Button>
            <Button type="submit" disabled={updateMatch.isPending}>
              {updateMatch.isPending
                ? t("common.saving", "Salvando...")
                : t("common.save", "Salvar")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
