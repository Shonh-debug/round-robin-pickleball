'use client';

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { Tournament, TournamentAction, TournamentConfig, Player, Round } from './types';

// ─── Default State ──────────────────────────────────────────────────────────

const defaultConfig: TournamentConfig = {
  name: 'Rockii Pickleball Tournament',
  mode: 'doubles',
  doublesPartnerMode: 'rotating',
  numberOfCourts: 3,
  maxRounds: null,
};

const defaultTournament: Tournament = {
  id: '',
  config: defaultConfig,
  players: [],
  rounds: [],
  createdAt: new Date().toISOString(),
};

// ─── Reducer ────────────────────────────────────────────────────────────────

function tournamentReducer(state: Tournament, action: TournamentAction): Tournament {
  switch (action.type) {
    case 'SET_TOURNAMENT':
      return action.payload;

    case 'ADD_PLAYERS':
      return {
        ...state,
        players: [...state.players, ...action.payload],
      };

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.payload),
      };

    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      };

    case 'GENERATE_ROUNDS':
      return {
        ...state,
        id: state.id || Math.random().toString(36).substring(2, 11),
        rounds: action.payload,
        createdAt: state.createdAt || new Date().toISOString(),
      };

    case 'UPDATE_SCORE': {
      const { roundId, matchId, score1, score2 } = action.payload;
      return {
        ...state,
        rounds: state.rounds.map((round) => {
          if (round.id !== roundId) return round;
          return {
            ...round,
            matches: round.matches.map((match) => {
              if (match.id !== matchId) return match;
              return {
                ...match,
                score1,
                score2,
                status: 'finished' as const,
              };
            }),
          };
        }),
      };
    }

    case 'UPDATE_MATCH_STATUS': {
      const { roundId, matchId, status } = action.payload;
      return {
        ...state,
        rounds: state.rounds.map((round) => {
          if (round.id !== roundId) return round;
          return {
            ...round,
            matches: round.matches.map((match) => {
              if (match.id !== matchId) return match;
              return { ...match, status };
            }),
          };
        }),
      };
    }

    case 'UPDATE_COURT': {
      const { roundId, matchId, court } = action.payload;
      return {
        ...state,
        rounds: state.rounds.map((round) => {
          if (round.id !== roundId) return round;
          return {
            ...round,
            matches: round.matches.map((match) => {
              if (match.id !== matchId) return match;
              return { ...match, court };
            }),
          };
        }),
      };
    }

    case 'RESET_TOURNAMENT':
      return { ...defaultTournament, config: state.config };

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────

interface TournamentContextType {
  tournament: Tournament;
  dispatch: React.Dispatch<TournamentAction>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const STORAGE_KEY = 'rockii-tournament';

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [tournament, dispatch] = useReducer(tournamentReducer, defaultTournament);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Tournament;
        dispatch({ type: 'SET_TOURNAMENT', payload: parsed });
      }
    } catch (e) {
      console.error('Failed to load tournament from storage:', e);
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (isHydrated && tournament.id) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tournament));
      } catch (e) {
        console.error('Failed to save tournament to storage:', e);
      }
    }
  }, [tournament, isHydrated]);

  return (
    <TournamentContext.Provider value={{ tournament, dispatch }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}
