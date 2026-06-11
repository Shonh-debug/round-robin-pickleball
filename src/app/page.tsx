'use client';

import { useState, useMemo } from 'react';
import { useTournament } from '@/lib/tournament-context';
import { computeLeaderboard } from '@/lib/round-robin';
import { Match } from '@/lib/types';
import PlayerInput from '@/components/PlayerInput';
import RoundTabs from '@/components/RoundTabs';
import MatchCard from '@/components/MatchCard';
import FilterBar from '@/components/FilterBar';
import Leaderboard from '@/components/Leaderboard';
import ExportBar from '@/components/ExportBar';
import ScoreInput from '@/components/ScoreInput';
import { motion } from 'motion/react';

export default function Home() {
  const { tournament } = useTournament();
  const [activeRound, setActiveRound] = useState(1);
  const [playerFilter, setPlayerFilter] = useState('');
  const [courtFilter, setCourtFilter] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<{ match: Match; roundId: string } | null>(null);

  const hasSchedule = tournament.rounds.length > 0;

  const currentRound = tournament.rounds.find((r) => r.roundNumber === activeRound);
  const leaderboard = useMemo(
    () => computeLeaderboard(tournament.players, tournament.rounds),
    [tournament.players, tournament.rounds]
  );

  // Apply filters
  const filteredMatches = useMemo(() => {
    if (!currentRound) return [];
    return currentRound.matches.filter((match) => {
      if (playerFilter) {
        const allPlayers = [...match.team1, ...match.team2];
        if (!allPlayers.some((p) => p.name === playerFilter)) return false;
      }
      if (courtFilter) {
        if (match.court.toString() !== courtFilter) return false;
      }
      return true;
    });
  }, [currentRound, playerFilter, courtFilter]);

  // Show setup if no schedule exists
  if (!hasSchedule) {
    return (
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-12 py-12">
        <PlayerInput />
      </main>
    );
  }

  // Show tournament dashboard
  return (
    <>
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-12 py-8 flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-grow flex flex-col gap-5 min-w-0">
          {/* Title + Export */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">
                {tournament.config.name}
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                {tournament.config.mode === 'doubles' ? 'Doubles' : 'Singles'}
                {tournament.config.mode === 'doubles' && (
                  <> • {tournament.config.doublesPartnerMode === 'rotating' ? 'Rotating Partners' : 'Fixed Partners'}</>
                )}
                {' '}• {tournament.players.length} Players • {tournament.rounds.length} Rounds • {tournament.config.numberOfCourts} Court{tournament.config.numberOfCourts > 1 ? 's' : ''}
              </p>
            </div>
            <ExportBar />
          </motion.div>

          {/* Round Tabs + Filters */}
          <div>
            <RoundTabs
              totalRounds={tournament.rounds.length}
              activeRound={activeRound}
              onRoundChange={setActiveRound}
            />
            {currentRound && (
              <FilterBar
                matches={currentRound.matches}
                playerFilter={playerFilter}
                courtFilter={courtFilter}
                onPlayerFilterChange={setPlayerFilter}
                onCourtFilterChange={setCourtFilter}
              />
            )}
          </div>

          {/* Match Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMatches.map((match, i) => (
              <MatchCard
                key={match.id}
                match={match}
                index={i}
                onClickMatch={() => setSelectedMatch({ match, roundId: currentRound!.id })}
              />
            ))}
          </div>

          {filteredMatches.length === 0 && currentRound && (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline mb-2 block">
                filter_alt_off
              </span>
              <p className="font-body text-sm">No matches found with current filters.</p>
            </div>
          )}
        </div>

        {/* Sidebar Leaderboard */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-28">
            <Leaderboard stats={leaderboard} compact={true} />
          </div>
        </aside>
      </main>

      {/* Score Input Modal — rendered OUTSIDE the main layout */}
      {selectedMatch && (
        <ScoreInput
          key={selectedMatch.match.id}
          match={selectedMatch.match}
          roundId={selectedMatch.roundId}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </>
  );
}
