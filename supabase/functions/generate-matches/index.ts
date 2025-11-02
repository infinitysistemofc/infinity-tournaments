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

    const { stageId, format } = await req.json();

    console.log("Generating matches for stage:", stageId, "format:", format);

    // Get stage info
    const { data: stage, error: stageError } = await supabase
      .from("stages")
      .select("*, tournament_id")
      .eq("id", stageId)
      .single();

    if (stageError) throw stageError;

    // Get confirmed participants
    const { data: participants, error: participantsError } = await supabase
      .from("participants")
      .select("*")
      .eq("tournament_id", stage.tournament_id)
      .eq("status", "confirmed")
      .order("seed", { ascending: true });

    if (participantsError) throw participantsError;

    if (participants.length < 2) {
      throw new Error("Minimum 2 confirmed participants required");
    }

    // Generate matches based on format
    let matches = [];

    if (format === "elimination") {
      // Single elimination
      const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(participants.length)));
      for (let i = 0; i < nextPowerOf2 / 2; i++) {
        const p1 = participants[i * 2] || null;
        const p2 = participants[i * 2 + 1] || null;
        matches.push({
          stage_id: stageId,
          participant1_id: p1?.id || null,
          participant2_id: p2?.id || null,
          status: "scheduled",
        });
      }
    } else if (format === "groups" || format === "league") {
      // Round robin - everyone plays everyone
      for (let i = 0; i < participants.length; i++) {
        for (let j = i + 1; j < participants.length; j++) {
          matches.push({
            stage_id: stageId,
            participant1_id: participants[i].id,
            participant2_id: participants[j].id,
            status: "scheduled",
          });
        }
      }
    }

    // Insert matches
    const { data: insertedMatches, error: matchesError } = await supabase
      .from("matches")
      .insert(matches)
      .select();

    if (matchesError) throw matchesError;

    // Update stage status to active
    await supabase
      .from("stages")
      .update({ status: "active" })
      .eq("id", stageId);

    return new Response(
      JSON.stringify({ success: true, matches: insertedMatches }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating matches:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
