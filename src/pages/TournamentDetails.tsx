import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Trophy, Calendar, Users, ArrowLeft, Medal, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ParticipantWithProfile = {
  id: string;
  joined_at: string;
  seed: number;
  status: "champion" | "confirmed" | "eliminated" | "registered";
  team_name: string;
  tournament_id: string;
  user_id: string;
  profile?: {
    display_name: string | null;
  } | null;
};

export const TournamentDetails = () => {
  const { tournamentId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: tournament, isLoading } = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", tournamentId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: participants } = useQuery<ParticipantWithProfile[]>({
    queryKey: ["participants", tournamentId],
    queryFn: async () => {
      const { data: participantsData, error } = await supabase
        .from("participants")
        .select("*")
        .eq("tournament_id", tournamentId)
        .order("seed", { ascending: true });

      if (error) throw error;

      // Fetch profiles separately
      if (participantsData && participantsData.length > 0) {
        const userIds = participantsData.map(p => p.user_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("*")
          .in("user_id", userIds);

        // Merge profiles with participants
        return participantsData.map(participant => ({
          ...participant,
          profile: profilesData?.find(p => p.user_id === participant.user_id)
        }));
      }

      return participantsData;
    },
  });

  const { data: stages } = useQuery({
    queryKey: ["stages", tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stages")
        .select("*, matches(*)")
        .eq("tournament_id", tournamentId)
        .order("order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h1 className="text-2xl font-orbitron font-bold mb-4">{t("tournaments.notFound")}</h1>
        <Button onClick={() => navigate("/showcase")}>{t("common.back")}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/showcase")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>

        {/* Tournament Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 mb-8 bg-card border-glow-fire">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 aspect-[9/16] bg-gradient-fire rounded-lg flex items-center justify-center">
                <Trophy className="h-20 w-20 text-foreground opacity-20" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-2 text-gradient-fire-blue">
                      {tournament.name}
                    </h1>
                    <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {t(`tournaments.status.${tournament.status}`)}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground font-rajdhani mb-6">
                  {tournament.description || t("tournaments.noDescription")}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-background/50 rounded-lg p-4">
                    <Calendar className="h-5 w-5 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">{t("tournaments.startDate")}</p>
                    <p className="font-bold">{new Date(tournament.start_date).toLocaleDateString()}</p>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4">
                    <Users className="h-5 w-5 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">{t("tournaments.participants")}</p>
                    <p className="font-bold">{participants?.length || 0} / {tournament.max_participants}</p>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4">
                    <Target className="h-5 w-5 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">{t("tournaments.format")}</p>
                    <p className="font-bold">{t(`tournaments.formats.${tournament.format}`)}</p>
                  </div>

                  {tournament.prize_pool && (
                    <div className="bg-background/50 rounded-lg p-4">
                      <Trophy className="h-5 w-5 text-primary mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">{t("tournaments.prizePool")}</p>
                      <p className="font-bold">${tournament.prize_pool}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="participants">{t("tournaments.tabs.participants")}</TabsTrigger>
            <TabsTrigger value="brackets">{t("tournaments.tabs.brackets")}</TabsTrigger>
            <TabsTrigger value="results">{t("tournaments.tabs.results")}</TabsTrigger>
          </TabsList>

          {/* Participants Tab */}
          <TabsContent value="participants" className="mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-orbitron font-bold mb-6">{t("tournaments.participantsList")}</h2>
              
              {participants && participants.length > 0 ? (
                <div className="grid gap-4">
                  {participants.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-lg hover:bg-background/80 transition-colors cursor-pointer"
                      onClick={() => navigate(`/players/${participant.user_id}/achievements`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-fire flex items-center justify-center font-bold">
                          {participant.seed || index + 1}
                        </div>
                        <div>
                          <p className="font-bold">
                            {participant.profile?.display_name || t("tournaments.unknownPlayer")}
                          </p>
                          {participant.team_name && (
                            <p className="text-sm text-muted-foreground">{participant.team_name}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        participant.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                        participant.status === 'registered' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {t(`tournaments.participantStatus.${participant.status}`)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">{t("tournaments.noParticipants")}</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Brackets Tab */}
          <TabsContent value="brackets" className="mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-orbitron font-bold mb-6">{t("tournaments.brackets")}</h2>
              
              {stages && stages.length > 0 ? (
                <div className="space-y-6">
                  {stages.map((stage) => (
                    <div key={stage.id}>
                      <h3 className="text-xl font-bold mb-4">{stage.name}</h3>
                      <div className="grid gap-4">
                        {stage.matches?.map((match: any) => (
                          <div key={match.id} className="p-4 bg-background/50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-bold">{t("tournaments.player")} 1</p>
                                <p className="text-sm text-muted-foreground">ID: {match.participant1_id}</p>
                              </div>
                              <div className="px-4">
                                <p className="text-2xl font-bold">
                                  {match.score_p1 ?? '-'} : {match.score_p2 ?? '-'}
                                </p>
                              </div>
                              <div className="flex-1 text-right">
                                <p className="font-bold">{t("tournaments.player")} 2</p>
                                <p className="text-sm text-muted-foreground">ID: {match.participant2_id}</p>
                              </div>
                            </div>
                            {match.winner_id && (
                              <div className="mt-2 text-center">
                                <Medal className="inline h-4 w-4 text-primary mr-2" />
                                <span className="text-sm text-primary font-bold">
                                  {t("tournaments.winner")}: {match.winner_id}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">{t("tournaments.noBrackets")}</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-orbitron font-bold mb-6">{t("tournaments.results")}</h2>
              
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">{t("tournaments.noResults")}</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TournamentDetails;
