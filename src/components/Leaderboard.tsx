'use client';

import { motion } from 'motion/react';
import { PlayerStats } from '@/lib/types';

interface LeaderboardProps {
  stats: PlayerStats[];
  compact?: boolean;
}

export default function Leaderboard({ stats, compact = true }: LeaderboardProps) {
  const displayStats = compact ? stats.slice(0, 8) : stats;
  const hasResults = stats.some((s) => s.gamesPlayed > 0);

  if (!hasResults && compact) return null;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface rounded-t-xl">
        <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container">leaderboard</span>
          {compact ? 'Top Players' : 'Full Leaderboard'}
        </h2>
        {compact && stats.length > 8 && (
          <a
            href="/leaderboard"
            className="text-primary-container font-mono text-[10px] tracking-widest uppercase font-bold hover:underline"
          >
            View All
          </a>
        )}
      </div>

      {/* Table */}
      <div className="flex flex-col">
        {/* Header Row */}
        <div className="flex items-center px-4 py-2.5 bg-surface-container-low font-mono text-[10px] tracking-widest text-on-surface-variant border-b border-outline-variant/30 uppercase">
          <div className="w-8 text-center">#</div>
          <div className="flex-grow px-2">Player</div>
          <div className="w-10 text-center">W</div>
          <div className="w-10 text-center">L</div>
          <div className="w-14 text-right">Pts</div>
        </div>

        {/* Player Rows */}
        {displayStats.map((stat, i) => (
          <motion.div
            key={stat.player.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-center px-4 py-3.5 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors ${
              i % 2 === 1 ? 'bg-surface-container-low/50' : ''
            }`}
          >
            {/* Rank */}
            <div className="w-8 text-center">
              {i === 0 && hasResults ? (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary-container font-mono text-xs font-bold">
                  1
                </span>
              ) : (
                <span className="font-headline text-base font-bold text-on-surface-variant">
                  {i + 1}
                </span>
              )}
            </div>

            {/* Name */}
            <div className="flex-grow px-2 font-label text-sm font-semibold text-on-surface flex items-center gap-1.5">
              {i === 0 && hasResults && (
                <span className="material-symbols-outlined fill text-tertiary-container text-base">
                  emoji_events
                </span>
              )}
              {stat.player.name}
            </div>

            {/* Stats */}
            <div className="w-10 text-center font-mono text-sm text-secondary font-bold">
              {stat.wins}
            </div>
            <div className="w-10 text-center font-mono text-sm text-error font-bold">
              {stat.losses}
            </div>
            <div className="w-14 text-right font-headline text-base font-bold text-on-surface">
              {stat.pointsFor}
            </div>
          </motion.div>
        ))}

        {!hasResults && (
          <div className="px-4 py-8 text-center text-on-surface-variant font-body text-sm">
            <span className="material-symbols-outlined text-3xl text-outline mb-2 block">
              scoreboard
            </span>
            No scores recorded yet.
            <br />
            Click on a match card to enter scores.
          </div>
        )}
      </div>
    </div>
  );
}
