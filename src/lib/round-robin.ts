import { Player, Match, Round, TournamentMode, DoublesPartnerMode } from './types';

// ─── Utilities ──────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ─── Singles Round Robin (Circle Method) ────────────────────────────────────

/**
 * Generate a full round robin schedule for singles using the circle/polygon method.
 * For n players: n-1 rounds if even, n rounds if odd (with byes).
 * Each player plays every other player exactly once.
 */
function generateSinglesRoundRobin(
  players: Player[],
  numberOfCourts: number,
  maxRounds: number | null
): Round[] {
  const playerList = shuffleArray(players);
  const n = playerList.length;

  // If odd number of players, add a BYE placeholder
  const hasBye = n % 2 !== 0;
  const participants: (Player | null)[] = hasBye
    ? [...playerList, null]
    : [...playerList];

  const totalParticipants = participants.length;
  const totalRoundsNeeded = totalParticipants - 1;
  const roundsToGenerate = maxRounds
    ? Math.min(maxRounds, totalRoundsNeeded)
    : totalRoundsNeeded;

  const rounds: Round[] = [];

  // Circle method: fix participant[0], rotate the rest
  for (let roundIdx = 0; roundIdx < roundsToGenerate; roundIdx++) {
    const matches: Match[] = [];
    let matchNumber = 1;
    let courtNumber = 1;

    for (let i = 0; i < totalParticipants / 2; i++) {
      const p1 = participants[i];
      const p2 = participants[totalParticipants - 1 - i];

      // Skip bye matches
      if (p1 === null || p2 === null) continue;

      matches.push({
        id: generateId(),
        matchNumber,
        team1: [p1],
        team2: [p2],
        score1: null,
        score2: null,
        court: courtNumber,
        status: 'upcoming',
      });

      matchNumber++;
      courtNumber = courtNumber >= numberOfCourts ? 1 : courtNumber + 1;
    }

    rounds.push({
      id: generateId(),
      roundNumber: roundIdx + 1,
      matches,
    });

    // Rotate: fix participants[0], shift the rest clockwise
    const last = participants.pop()!;
    participants.splice(1, 0, last);
  }

  return rounds;
}

// ─── Doubles Round Robin (Fixed Partners) ───────────────────────────────────

/**
 * Generate a doubles round robin with fixed partners.
 * Pairs players into teams, then schedules team-vs-team round robin.
 */
function generateFixedDoublesRoundRobin(
  players: Player[],
  numberOfCourts: number,
  maxRounds: number | null
): Round[] {
  const shuffled = shuffleArray(players);

  // Pair players into teams of 2
  const teams: Player[][] = [];
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    teams.push([shuffled[i], shuffled[i + 1]]);
  }

  // If odd player, they sit out
  const numTeams = teams.length;
  const hasTeamBye = numTeams % 2 !== 0;
  const teamList: (Player[] | null)[] = hasTeamBye
    ? [...teams, null]
    : [...teams];

  const totalTeams = teamList.length;
  const totalRoundsNeeded = totalTeams - 1;
  const roundsToGenerate = maxRounds
    ? Math.min(maxRounds, totalRoundsNeeded)
    : totalRoundsNeeded;

  const rounds: Round[] = [];

  for (let roundIdx = 0; roundIdx < roundsToGenerate; roundIdx++) {
    const matches: Match[] = [];
    let matchNumber = 1;
    let courtNumber = 1;

    for (let i = 0; i < totalTeams / 2; i++) {
      const t1 = teamList[i];
      const t2 = teamList[totalTeams - 1 - i];

      if (t1 === null || t2 === null) continue;

      matches.push({
        id: generateId(),
        matchNumber,
        team1: t1,
        team2: t2,
        score1: null,
        score2: null,
        court: courtNumber,
        status: 'upcoming',
      });

      matchNumber++;
      courtNumber = courtNumber >= numberOfCourts ? 1 : courtNumber + 1;
    }

    rounds.push({
      id: generateId(),
      roundNumber: roundIdx + 1,
      matches,
    });

    const last = teamList.pop()!;
    teamList.splice(1, 0, last);
  }

  return rounds;
}

// ─── Doubles Round Robin (Rotating Partners) ────────────────────────────────

/**
 * Generate a doubles round robin with rotating partners.
 * Every round, players are re-paired so they play WITH different partners
 * and AGAINST different opponents. Uses a structured rotation approach.
 *
 * Strategy: For each round, generate unique pairings for teams ensuring:
 * 1. Players don't partner with the same person twice (as much as possible)
 * 2. Teams don't face the same opponent team twice
 */
function generateRotatingDoublesRoundRobin(
  players: Player[],
  numberOfCourts: number,
  maxRounds: number | null
): Round[] {
  const shuffled = shuffleArray(players);
  const n = shuffled.length;

  if (n < 4) return [];

  // Track history
  // partnered[i-j] = number of times i and j have partnered
  const partnered: Record<string, number> = {};
  // opposed[i-j] = number of times i and j have opposed each other
  const opposed: Record<string, number> = {};

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      partnered[`${i}-${j}`] = 0;
      opposed[`${i}-${j}`] = 0;
    }
  }

  const rounds: Round[] = [];
  const playersPerRound = Math.floor(n / 4) * 4;
  const matchesPerRound = Math.floor(playersPerRound / 4);

  // Reasonable max rounds if not specified. E.g., for 8 players, it's 7.
  const totalRoundsNeeded = maxRounds || (n % 2 === 0 ? n - 1 : n);

  for (let roundIdx = 0; roundIdx < totalRoundsNeeded; roundIdx++) {
    const roundMatches: Match[] = [];
    const usedPlayersThisRound = new Set<number>();
    let courtNumber = 1;

    for (let m = 0; m < matchesPerRound; m++) {
      let bestMatch: { t1: [number, number]; t2: [number, number] } | null = null;
      let bestScore = Infinity;

      const available = [];
      for (let i = 0; i < n; i++) {
        if (!usedPlayersThisRound.has(i)) available.push(i);
      }

      if (available.length < 4) break;

      const p1 = available[0];

      for (let i = 1; i < available.length; i++) {
        const p2 = available[i];
        for (let j = i + 1; j < available.length; j++) {
          const p3 = available[j];
          for (let k = j + 1; k < available.length; k++) {
            const p4 = available[k];

            const splits = [
              { t1: [p1, p2], t2: [p3, p4] },
              { t1: [p1, p3], t2: [p2, p4] },
              { t1: [p1, p4], t2: [p2, p3] }
            ];

            for (const split of splits) {
              const [a, b] = split.t1 as [number, number];
              const [c, d] = split.t2 as [number, number];

              // Score calculation
              // Heavy penalty for repeating partners
              const partnerScore = 
                (partnered[`${a}-${b}`] * 1000) + 
                (partnered[`${c}-${d}`] * 1000);
              
              // Lighter penalty for repeating opponents
              const opposeScore = 
                (opposed[`${a}-${c}`] * 10) + (opposed[`${a}-${d}`] * 10) +
                (opposed[`${b}-${c}`] * 10) + (opposed[`${b}-${d}`] * 10);
              
              const score = partnerScore + opposeScore;

              if (score < bestScore) {
                bestScore = score;
                bestMatch = { t1: [a, b], t2: [c, d] };
              }
              
              if (bestScore === 0) break;
            }
            if (bestScore === 0) break;
          }
          if (bestScore === 0) break;
        }
        if (bestScore === 0) break;
      }

      if (bestMatch) {
        const { t1, t2 } = bestMatch;
        usedPlayersThisRound.add(t1[0]);
        usedPlayersThisRound.add(t1[1]);
        usedPlayersThisRound.add(t2[0]);
        usedPlayersThisRound.add(t2[1]);

        // Update tracking
        partnered[`${t1[0]}-${t1[1]}`]++;
        partnered[`${t1[1]}-${t1[0]}`]++;
        partnered[`${t2[0]}-${t2[1]}`]++;
        partnered[`${t2[1]}-${t2[0]}`]++;

        const opponents = [
          [t1[0], t2[0]], [t1[0], t2[1]],
          [t1[1], t2[0]], [t1[1], t2[1]]
        ];
        for (const [x, y] of opponents) {
          opposed[`${x}-${y}`]++;
          opposed[`${y}-${x}`]++;
        }

        roundMatches.push({
          id: generateId(),
          matchNumber: roundMatches.length + 1,
          team1: [shuffled[t1[0]], shuffled[t1[1]]],
          team2: [shuffled[t2[0]], shuffled[t2[1]]],
          score1: null,
          score2: null,
          court: courtNumber,
          status: 'upcoming',
        });

        courtNumber = courtNumber >= numberOfCourts ? 1 : courtNumber + 1;
      }
    }

    if (roundMatches.length > 0) {
      rounds.push({
        id: generateId(),
        roundNumber: roundIdx + 1,
        matches: roundMatches,
      });
    } else {
      break;
    }
  }

  return rounds;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function generateRoundRobin(
  players: Player[],
  mode: TournamentMode,
  doublesPartnerMode: DoublesPartnerMode,
  numberOfCourts: number,
  maxRounds: number | null
): Round[] {
  if (mode === 'singles') {
    return generateSinglesRoundRobin(players, numberOfCourts, maxRounds);
  }

  if (doublesPartnerMode === 'fixed') {
    return generateFixedDoublesRoundRobin(players, numberOfCourts, maxRounds);
  }

  return generateRotatingDoublesRoundRobin(players, numberOfCourts, maxRounds);
}

// ─── Leaderboard Computation ────────────────────────────────────────────────

import { PlayerStats } from './types';

export function computeLeaderboard(
  players: Player[],
  rounds: Round[]
): PlayerStats[] {
  const statsMap = new Map<string, PlayerStats>();

  // Initialize stats for all players
  for (const player of players) {
    statsMap.set(player.id, {
      player,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      gamesPlayed: 0,
    });
  }

  // Tally results from completed matches
  for (const round of rounds) {
    for (const match of round.matches) {
      if (match.score1 === null || match.score2 === null) continue;

      const team1Won = match.score1 > match.score2;

      for (const player of match.team1) {
        const stats = statsMap.get(player.id);
        if (!stats) continue;
        stats.gamesPlayed++;
        stats.pointsFor += match.score1;
        stats.pointsAgainst += match.score2;
        if (team1Won) stats.wins++;
        else stats.losses++;
      }

      for (const player of match.team2) {
        const stats = statsMap.get(player.id);
        if (!stats) continue;
        stats.gamesPlayed++;
        stats.pointsFor += match.score2;
        stats.pointsAgainst += match.score1;
        if (!team1Won) stats.wins++;
        else stats.losses++;
      }
    }
  }

  // Sort: wins desc, then point differential desc
  return Array.from(statsMap.values()).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    const diffA = a.pointsFor - a.pointsAgainst;
    const diffB = b.pointsFor - b.pointsAgainst;
    return diffB - diffA;
  });
}
