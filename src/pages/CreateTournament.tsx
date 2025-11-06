import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useCreateTournament } from "@/hooks/tournaments/useCreateTournament";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function CreateTournament() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const createTournament = useCreateTournament();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    game_id: "",
    format: "elimination" as const,
    status: "draft" as const,
    start_date: "",
    end_date: "",
    max_participants: 16,
    prize_pool: 0,
  });

  const { data: games = [] } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase.from("games").select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    await createTournament.mutateAsync({
      ...formData,
      organizer_id: user.id,
    });

    navigate("/tournaments");
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/tournaments")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.back", "Voltar")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">
            {t("tournament.create", "Criar Torneio")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("tournament.name", "Nome")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">{t("tournament.slug", "Slug")} *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                {t("tournament.description", "Descrição")}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="game_id">{t("tournament.game", "Jogo")} *</Label>
                <Select
                  value={formData.game_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, game_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("tournament.selectGame", "Selecione um jogo")} />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">{t("tournament.format", "Formato")} *</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, format: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elimination">
                      {t("tournament.formatElimination", "Eliminatória")}
                    </SelectItem>
                    <SelectItem value="groups">
                      {t("tournament.formatGroups", "Grupos")}
                    </SelectItem>
                    <SelectItem value="league">
                      {t("tournament.formatLeague", "Pontos Corridos")}
                    </SelectItem>
                    <SelectItem value="swiss">
                      {t("tournament.formatSwiss", "Sistema Suíço")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start_date">
                  {t("tournament.startDate", "Data Início")} *
                </Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">
                  {t("tournament.endDate", "Data Fim")} *
                </Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_participants">
                  {t("tournament.maxParticipants", "Máx. Participantes")} *
                </Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="2"
                  value={formData.max_participants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_participants: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prize_pool">
                {t("tournament.prizePool", "Premiação (R$)")}
              </Label>
              <Input
                id="prize_pool"
                type="number"
                min="0"
                step="0.01"
                value={formData.prize_pool}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prize_pool: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/tournaments")}
              >
                {t("common.cancel", "Cancelar")}
              </Button>
              <Button type="submit" disabled={createTournament.isPending}>
                {createTournament.isPending
                  ? t("common.creating", "Criando...")
                  : t("common.create", "Criar")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
