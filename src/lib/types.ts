// ─── Core Types ─────────────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  matchNumber: number;
  team1: Player[];
  team2: Player[];
  score1: number | null;
  score2: number | null;
  court: number;
  status: 'upcoming' | 'live' | 'finished';
}

export interface Round {
  id: string;
  roundNumber: number;
  matches: Match[];
}

export type TournamentMode = 'singles' | 'doubles';
export type DoublesPartnerMode = 'fixed' | 'rotating';

export interface TournamentConfig {
  name: string;
  mode: TournamentMode;
  doublesPartnerMode: DoublesPartnerMode;
  numberOfCourts: number;
  maxRounds: number | null; // null = full round robin
}

export interface Tournament {
  id: string;
  config: TournamentConfig;
  players: Player[];
  rounds: Round[];
  createdAt: string;
}

// ─── Leaderboard ────────────────────────────────────────────────────────────

export interface PlayerStats {
  player: Player;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  gamesPlayed: number;
}

// ─── Actions ────────────────────────────────────────────────────────────────

export type TournamentAction =
  | { type: 'SET_TOURNAMENT'; payload: Tournament }
  | { type: 'ADD_PLAYERS'; payload: Player[] }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'UPDATE_CONFIG'; payload: Partial<TournamentConfig> }
  | { type: 'GENERATE_ROUNDS'; payload: Round[] }
  | { type: 'UPDATE_SCORE'; payload: { roundId: string; matchId: string; score1: number; score2: number } }
  | { type: 'UPDATE_MATCH_STATUS'; payload: { roundId: string; matchId: string; status: Match['status'] } }
  | { type: 'RESET_TOURNAMENT' };
