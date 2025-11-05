import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Achievement {
  id: string;
  achievement: {
    id: string;
    name: string;
    description?: string;
    icon_url?: string;
  };
  unlocked_at: string;
}

interface ProfileAchievementsTabProps {
  achievements: Achievement[];
}

export const ProfileAchievementsTab = ({
  achievements,
}: ProfileAchievementsTabProps) => {
  const { t } = useTranslation();

  if (achievements.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">{t("profile.noAchievements")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {item.achievement.icon_url ? (
                <img
                  src={item.achievement.icon_url}
                  alt={item.achievement.name}
                  className="h-12 w-12 rounded-lg"
                />
              ) : (
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{item.achievement.name}</h4>
                {item.achievement.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.achievement.description}
                  </p>
                )}
                <Badge variant="outline" className="text-xs">
                  {new Date(item.unlocked_at).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
