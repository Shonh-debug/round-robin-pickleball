'use client';

import { motion } from 'motion/react';

interface RoundTabsProps {
  totalRounds: number;
  activeRound: number;
  onRoundChange: (round: number) => void;
}

export default function RoundTabs({ totalRounds, activeRound, onRoundChange }: RoundTabsProps) {
  return (
    <div className="bg-surface-container-lowest rounded-t-xl border border-outline-variant/30 border-b-0 overflow-hidden">
      <div className="flex overflow-x-auto hide-scrollbar bg-surface-container-low">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => {
          const isActive = round === activeRound;
          return (
            <button
              key={round}
              onClick={() => onRoundChange(round)}
              className={`relative px-6 py-4 font-label text-sm tracking-wide font-semibold whitespace-nowrap transition-colors duration-150 ${
                isActive
                  ? 'bg-surface-container-lowest text-primary-container'
                  : 'text-on-surface-variant hover:text-primary-container hover:bg-surface-container-lowest/50'
              }`}
            >
              Round {round}
              {isActive && (
                <motion.div
                  layoutId="round-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
