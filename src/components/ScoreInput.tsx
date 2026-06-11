'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Match } from '@/lib/types';
import { useTournament } from '@/lib/tournament-context';

interface ScoreInputProps {
  match: Match;
  roundId: string;
  onClose: () => void;
}

export default function ScoreInput({ match, roundId, onClose }: ScoreInputProps) {
  const { dispatch } = useTournament();
  const [score1, setScore1] = useState(match.score1?.toString() ?? '');
  const [score2, setScore2] = useState(match.score2?.toString() ?? '');

  const handleSave = () => {
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);

    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) return;

    dispatch({
      type: 'UPDATE_SCORE',
      payload: { roundId, matchId: match.id, score1: s1, score2: s2 },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 w-[90vw] max-w-[400px] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary-container p-5 flex justify-between items-center">
          <div>
            <div className="font-label text-xs tracking-widest text-on-primary-container/70 uppercase">
              Game {match.matchNumber} • Court {match.court}
            </div>
            <div className="font-headline text-lg font-bold text-surface-container-lowest mt-1">
              Enter Score
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-surface-container-lowest transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-6">
          {/* Score inputs */}
          <div className="flex items-center gap-4">
            {/* Team 1 */}
            <div className="flex-1">
              <div className="font-label text-xs tracking-widest text-on-surface-variant uppercase mb-2 text-center">
                Team 1
              </div>
              <div className="text-center mb-3">
                {match.team1.map((p) => (
                  <div key={p.id} className="font-body text-sm text-on-surface">
                    {p.name}
                  </div>
                ))}
              </div>
              <input
                type="number"
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                min="0"
                className="w-full text-center bg-surface border-2 border-outline-variant rounded-xl px-4 py-4 font-mono text-3xl font-extrabold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
                autoFocus
              />
            </div>

            {/* Divider */}
            <div className="flex flex-col items-center gap-2 pt-8">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-on-primary-container">VS</span>
              </div>
            </div>

            {/* Team 2 */}
            <div className="flex-1">
              <div className="font-label text-xs tracking-widest text-on-surface-variant uppercase mb-2 text-center">
                Team 2
              </div>
              <div className="text-center mb-3">
                {match.team2.map((p) => (
                  <div key={p.id} className="font-body text-sm text-on-surface">
                    {p.name}
                  </div>
                ))}
              </div>
              <input
                type="number"
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
                min="0"
                className="w-full text-center bg-surface border-2 border-outline-variant rounded-xl px-4 py-4 font-mono text-3xl font-extrabold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-outline-variant font-label text-sm font-bold tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!score1 || !score2}
              className={`flex-1 py-3 rounded-xl font-label text-sm font-bold tracking-wide transition-colors flex items-center justify-center gap-2 ${
                score1 && score2
                  ? 'bg-secondary-container text-on-secondary-container hover:shadow-md'
                  : 'bg-surface-container text-outline cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-lg">check</span>
              Save Score
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
