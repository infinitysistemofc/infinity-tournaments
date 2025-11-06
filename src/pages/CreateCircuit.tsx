import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useCreateCircuit } from "@/hooks/circuits/useCreateCircuit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function CreateCircuit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const createCircuit = useCreateCircuit();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    season: "",
    start_date: "",
    end_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    await createCircuit.mutateAsync({
      ...formData,
      organizer_id: user.id,
    });

    navigate("/circuits");
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
        onClick={() => navigate("/circuits")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.back", "Voltar")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">
            {t("circuit.create", "Criar Circuito")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("circuit.name", "Nome")} *</Label>
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
                <Label htmlFor="slug">{t("circuit.slug", "Slug")} *</Label>
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
              <Label htmlFor="season">{t("circuit.season", "Temporada")}</Label>
              <Input
                id="season"
                placeholder="Ex: 2024"
                value={formData.season}
                onChange={(e) =>
                  setFormData({ ...formData, season: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                {t("circuit.description", "Descrição")}
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
                <Label htmlFor="start_date">
                  {t("circuit.startDate", "Data Início")} *
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
                  {t("circuit.endDate", "Data Fim")} *
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
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/circuits")}
              >
                {t("common.cancel", "Cancelar")}
              </Button>
              <Button type="submit" disabled={createCircuit.isPending}>
                {createCircuit.isPending
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
