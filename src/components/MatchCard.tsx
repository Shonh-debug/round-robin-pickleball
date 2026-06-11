'use client';

import { motion } from 'motion/react';
import { Match } from '@/lib/types';

interface MatchCardProps {
  match: Match;
  index: number;
  onClickMatch: () => void;
}

export default function MatchCard({ match, index, onClickMatch }: MatchCardProps) {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  const hasScore = match.score1 !== null && match.score2 !== null;

  const team1Won = hasScore && (match.score1 ?? 0) > (match.score2 ?? 0);
  const team2Won = hasScore && (match.score2 ?? 0) > (match.score1 ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0px 8px 30px rgba(0,0,0,0.08)' }}
      onClick={onClickMatch}
      className={`bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border-t-4 overflow-hidden flex flex-col relative cursor-pointer ${
        isFinished
          ? 'border-outline-variant opacity-85'
          : 'border-primary-container'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface">
        <div
          className={`font-label text-xs tracking-widest font-bold uppercase ${
            isFinished ? 'text-on-surface-variant' : 'text-primary-container'
          }`}
        >
          Game {match.matchNumber}
        </div>
        <div
          className={`px-3 py-1 rounded-full font-mono text-[10px] tracking-widest font-bold flex items-center gap-1.5 ${
            isLive
              ? 'bg-secondary-container text-on-secondary-container'
              : isFinished
                ? 'bg-surface-container border border-outline-variant text-on-surface-variant'
                : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/50'
          }`}
        >
          {isLive && <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />}
          {isLive ? 'LIVE' : isFinished ? 'FINISHED' : 'UPCOMING'}
        </div>
      </div>

      {/* Match Body */}
      <div className="flex-grow relative flex bg-surface-bright min-h-[140px]">
        {/* Score Centerpiece */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 bg-primary-container text-surface-container-lowest font-mono text-3xl font-extrabold px-5 py-2.5 rounded-b-xl shadow-lg z-10 flex items-center gap-3">
          {hasScore ? (
            <>
              <span className={team1Won ? 'text-secondary-fixed' : 'text-on-primary-container/60'}>
                {match.score1}
              </span>
              <span className="text-on-primary-container/30 text-lg">:</span>
              <span className={team2Won ? 'text-secondary-fixed' : 'text-on-primary-container/60'}>
                {match.score2}
              </span>
            </>
          ) : (
            <span className="text-on-primary-container/40 text-lg">VS</span>
          )}
        </div>

        {/* Team 1 */}
        <div
          className={`flex-1 p-5 pt-16 flex flex-col gap-3 border-r border-outline-variant/20 ${
            team1Won
              ? 'bg-gradient-to-br from-surface-container-lowest to-surface-container'
              : 'bg-surface-container-lowest'
          }`}
        >
          <div className="font-label text-xs tracking-widest text-on-surface-variant uppercase flex items-center gap-1.5">
            {team1Won && (
              <span className="material-symbols-outlined fill text-tertiary-container text-base">
                emoji_events
              </span>
            )}
            Team 1
          </div>
          <div className="flex flex-col gap-2">
            {match.team1.map((player) => (
              <div key={player.id} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-lg">account_circle</span>
                <span className={`font-body text-sm text-on-surface ${team1Won ? 'font-medium' : ''}`}>
                  {player.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team 2 */}
        <div
          className={`flex-1 p-5 pt-16 flex flex-col gap-3 items-end text-right ${
            team2Won
              ? 'bg-gradient-to-bl from-surface-container-lowest to-surface-container'
              : 'bg-surface-container-lowest'
          }`}
        >
          <div className="font-label text-xs tracking-widest text-on-surface-variant uppercase flex items-center gap-1.5">
            Team 2
            {team2Won && (
              <span className="material-symbols-outlined fill text-tertiary-container text-base">
                emoji_events
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            {match.team2.map((player) => (
              <div key={player.id} className="flex items-center gap-2 flex-row-reverse">
                <span className="material-symbols-outlined text-outline text-lg">account_circle</span>
                <span className={`font-body text-sm text-on-surface ${team2Won ? 'font-medium' : ''}`}>
                  {player.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* VS Badge */}
        {!hasScore && (
          <div className="absolute left-1/2 bottom-6 -translate-x-1/2 w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center font-mono text-[10px] tracking-widest text-outline font-bold shadow-sm">
            VS
          </div>
        )}
      </div>

      {/* Court footer */}
      <div className="bg-surface py-2.5 text-center border-t border-outline-variant/30 font-mono text-[10px] tracking-[0.15em] text-on-surface-variant uppercase">
        Court {match.court}
      </div>
    </motion.div>
  );
}
