'use client';

import { useMemo } from 'react';
import { useTournament } from '@/lib/tournament-context';
import { computeLeaderboard } from '@/lib/round-robin';
import Leaderboard from '@/components/Leaderboard';
import { motion } from 'motion/react';

export default function LeaderboardPage() {
  const { tournament } = useTournament();

  const leaderboard = useMemo(
    () => computeLeaderboard(tournament.players, tournament.rounds),
    [tournament.players, tournament.rounds]
  );

  if (tournament.rounds.length === 0) {
    return (
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-12 py-12">
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-outline mb-4 block">
            leaderboard
          </span>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">
            No Tournament Yet
          </h2>
          <p className="font-body text-on-surface-variant">
            Go to the dashboard to set up a tournament first.
          </p>
        </div>
      </main>
    );
  }

  // Compute additional stats
  const totalMatches = tournament.rounds.reduce((sum, r) => sum + r.matches.length, 0);
  const completedMatches = tournament.rounds.reduce(
    (sum, r) => sum + r.matches.filter((m) => m.status === 'finished').length,
    0
  );

  return (
    <main className="flex-grow w-full max-w-[900px] mx-auto px-4 md:px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="font-headline text-3xl font-extrabold text-on-background tracking-tight mb-2">
          Leaderboard
        </h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/50 text-on-surface-variant font-label text-xs tracking-wider">
            <span className="material-symbols-outlined text-sm text-primary-container">group</span>
            {tournament.players.length} Players
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/50 text-on-surface-variant font-label text-xs tracking-wider">
            <span className="material-symbols-outlined text-sm text-secondary">sports_score</span>
            {completedMatches}/{totalMatches} Matches
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/50 text-on-surface-variant font-label text-xs tracking-wider">
            <span className="material-symbols-outlined text-sm text-tertiary-container">calendar_today</span>
            {tournament.rounds.length} Rounds
          </div>
        </div>
      </motion.div>

      <Leaderboard stats={leaderboard} compact={false} />
    </main>
  );
}
