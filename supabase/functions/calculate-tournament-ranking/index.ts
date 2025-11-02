import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { tournamentId } = await req.json();

    console.log("Calculating ranking for tournament:", tournamentId);

    // Get all matches from all stages
    const { data: stages, error: stagesError } = await supabase
      .from("stages")
      .select("id")
      .eq("tournament_id", tournamentId);

    if (stagesError) throw stagesError;

    const stageIds = stages.map((s) => s.id);

    const { data: matches, error: matchesError } = await supabase
      .from("matches")
      .select("*")
      .in("stage_id", stageIds)
      .eq("status", "completed");

    if (matchesError) throw matchesError;

    // Calculate stats for each participant
    const stats = new Map();

    matches.forEach((match) => {
      if (!match.winner_id) return;

      // Winner
      if (!stats.has(match.winner_id)) {
        stats.set(match.winner_id, { wins: 0, losses: 0, points: 0 });
      }
      const winnerStats = stats.get(match.winner_id);
      winnerStats.wins++;
      winnerStats.points += 3;

      // Loser
      const loserId =
        match.participant1_id === match.winner_id
          ? match.participant2_id
          : match.participant1_id;

      if (loserId) {
        if (!stats.has(loserId)) {
          stats.set(loserId, { wins: 0, losses: 0, points: 0 });
        }
        stats.get(loserId).losses++;
      }
    });

    // Sort and return ranking
    const ranking = Array.from(stats.entries())
      .map(([participantId, data]) => ({
        participant_id: participantId,
        ...data,
      }))
      .sort((a, b) => b.points - a.points || b.wins - a.wins);

    return new Response(
      JSON.stringify({ success: true, ranking }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error calculating ranking:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
