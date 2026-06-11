'use client';

import { Match } from '@/lib/types';

interface FilterBarProps {
  matches: Match[];
  playerFilter: string;
  courtFilter: string;
  onPlayerFilterChange: (value: string) => void;
  onCourtFilterChange: (value: string) => void;
}

export default function FilterBar({
  matches,
  playerFilter,
  courtFilter,
  onPlayerFilterChange,
  onCourtFilterChange,
}: FilterBarProps) {
  // Extract unique player names and courts
  const playerNames = new Set<string>();
  const courts = new Set<number>();

  for (const match of matches) {
    match.team1.forEach((p) => playerNames.add(p.name));
    match.team2.forEach((p) => playerNames.add(p.name));
    courts.add(match.court);
  }

  const sortedPlayers = Array.from(playerNames).sort();
  const sortedCourts = Array.from(courts).sort((a, b) => a - b);

  return (
    <div className="p-4 flex flex-wrap gap-3 bg-surface-container-lowest border border-outline-variant/30 border-t-0 rounded-b-xl">
      {/* Player filter */}
      <div className="relative">
        <select
          value={playerFilter}
          onChange={(e) => onPlayerFilterChange(e.target.value)}
          className="appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 font-body text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
        >
          <option value="">All Players</option>
          {sortedPlayers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-lg">
          expand_more
        </span>
      </div>

      {/* Court filter */}
      <div className="relative">
        <select
          value={courtFilter}
          onChange={(e) => onCourtFilterChange(e.target.value)}
          className="appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 font-body text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
        >
          <option value="">All Courts</option>
          {sortedCourts.map((court) => (
            <option key={court} value={court.toString()}>
              Court {court}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-lg">
          expand_more
        </span>
      </div>
    </div>
  );
}
