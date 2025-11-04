import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";

const Games = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-orbitron text-gradient-fire-blue">
          {t("games.title")}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("games.title")}</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">{t("common.noData")}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Games;
