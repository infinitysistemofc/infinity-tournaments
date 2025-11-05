import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Share2, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
  achievements?: Array<{
    id: string;
    name: string;
    icon_url?: string;
  }>;
}

export const ProfileHeader = ({
  userId,
  displayName,
  avatarUrl,
  bio,
  socialLinks,
  achievements = [],
}: ProfileHeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = user?.id === userId;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: displayName || "Player Profile",
        url: window.location.href,
      });
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Avatar className="h-32 w-32 border-4 border-primary">
          <AvatarImage src={avatarUrl || ""} />
          <AvatarFallback className="text-4xl">
            {displayName?.[0] || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold font-orbitron mb-2">
                {displayName || "Unknown Player"}
              </h1>
              {bio && <p className="text-muted-foreground">{bio}</p>}
            </div>

            <div className="flex gap-2">
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/players/${userId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {achievements.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Trophy className="h-5 w-5 text-primary" />
              {achievements.slice(0, 3).map((achievement) => (
                <Badge key={achievement.id} variant="secondary">
                  {achievement.name}
                </Badge>
              ))}
              {achievements.length > 3 && (
                <Badge variant="outline">+{achievements.length - 3} more</Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
