import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Profile = () => {
  const { userId } = useParams();
  const { t } = useTranslation();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-orbitron text-gradient-fire-blue">
          {t("profile.title")}
        </h1>
      </div>

      {profile ? (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="text-2xl">
                  {profile.display_name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {profile.display_name || "Unknown User"}
                </h2>
                {profile.bio && (
                  <p className="text-muted-foreground">{profile.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">{t("common.noData")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
