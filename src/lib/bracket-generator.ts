type Participant = {
  id: string;
  seed?: number | null;
};

type Match = {
  participant1_id: string | null;
  participant2_id: string | null;
  stage_id: string;
  status: "scheduled" | "ongoing" | "completed";
};

export const generateSingleElimination = (
  participants: Participant[],
  stageId: string
): Match[] => {
  const sortedParticipants = [...participants].sort((a, b) => 
    (a.seed || 999) - (b.seed || 999)
  );

  const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(sortedParticipants.length)));
  const byes = nextPowerOf2 - sortedParticipants.length;

  const matches: Match[] = [];
  let participantIndex = 0;

  for (let i = 0; i < nextPowerOf2 / 2; i++) {
    const p1 = participantIndex < sortedParticipants.length 
      ? sortedParticipants[participantIndex++] 
      : null;
    const p2 = participantIndex < sortedParticipants.length 
      ? sortedParticipants[participantIndex++] 
      : null;

    matches.push({
      participant1_id: p1?.id || null,
      participant2_id: p2?.id || null,
      stage_id: stageId,
      status: "scheduled",
    });
  }

  return matches;
};

export const generateRoundRobin = (
  participants: Participant[],
  stageId: string
): Match[] => {
  const matches: Match[] = [];
  
  for (let i = 0; i < participants.length; i++) {
    for (let j = i + 1; j < participants.length; j++) {
      matches.push({
        participant1_id: participants[i].id,
        participant2_id: participants[j].id,
        stage_id: stageId,
        status: "scheduled",
      });
    }
  }

  return matches;
};

export const generateSwiss = (
  participants: Participant[],
  stageId: string,
  rounds: number = 5
): Match[] => {
  const sortedParticipants = [...participants].sort((a, b) => 
    (a.seed || 999) - (b.seed || 999)
  );
  
  const matches: Match[] = [];
  const halfSize = Math.floor(sortedParticipants.length / 2);

  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < halfSize; i++) {
      matches.push({
        participant1_id: sortedParticipants[i * 2]?.id || null,
        participant2_id: sortedParticipants[i * 2 + 1]?.id || null,
        stage_id: stageId,
        status: "scheduled",
      });
    }
  }

  return matches;
};
