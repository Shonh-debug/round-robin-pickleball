'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTournament } from '@/lib/tournament-context';
import { generateRoundRobin } from '@/lib/round-robin';
import { Player, TournamentMode, DoublesPartnerMode } from '@/lib/types';

export default function PlayerInput() {
  const { tournament, dispatch } = useTournament();
  const [inputText, setInputText] = useState('');
  const [singleName, setSingleName] = useState('');
  const [mode, setMode] = useState<TournamentMode>(tournament.config.mode);
  const [partnerMode, setPartnerMode] = useState<DoublesPartnerMode>(tournament.config.doublesPartnerMode);
  const [courts, setCourts] = useState(tournament.config.numberOfCourts);
  const [maxRounds, setMaxRounds] = useState<string>('');
  const [tournamentName, setTournamentName] = useState(tournament.config.name);

  const players = tournament.players;

  const addSinglePlayer = () => {
    const name = singleName.trim();
    if (!name) return;
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) return;

    dispatch({
      type: 'ADD_PLAYERS',
      payload: [{ id: Math.random().toString(36).substring(2, 11), name }],
    });
    setSingleName('');
  };

  const addBulkPlayers = () => {
    const names = inputText
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const existingNames = new Set(players.map((p) => p.name.toLowerCase()));
    const newPlayers: Player[] = [];

    for (const name of names) {
      if (!existingNames.has(name.toLowerCase())) {
        newPlayers.push({
          id: Math.random().toString(36).substring(2, 11),
          name,
        });
        existingNames.add(name.toLowerCase());
      }
    }

    if (newPlayers.length > 0) {
      dispatch({ type: 'ADD_PLAYERS', payload: newPlayers });
    }
    setInputText('');
  };

  const removePlayer = (id: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: id });
  };

  const generateSchedule = () => {
    const config = {
      name: tournamentName || 'Rockii Pickleball Tournament',
      mode,
      doublesPartnerMode: partnerMode,
      numberOfCourts: courts,
      maxRounds: maxRounds ? parseInt(maxRounds) : null,
    };

    dispatch({ type: 'UPDATE_CONFIG', payload: config });

    const minPlayers = mode === 'doubles' ? 4 : 2;
    if (players.length < minPlayers) {
      alert(`Need at least ${minPlayers} players for ${mode}!`);
      return;
    }

    const rounds = generateRoundRobin(
      players,
      config.mode,
      config.doublesPartnerMode,
      config.numberOfCourts,
      config.maxRounds
    );

    dispatch({ type: 'GENERATE_ROUNDS', payload: rounds });
  };

  const canGenerate =
    (mode === 'singles' && players.length >= 2) ||
    (mode === 'doubles' && players.length >= 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-3xl mx-auto"
    >
      {/* Hero */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs tracking-widest font-bold mb-4"
        >
          <span className="material-symbols-outlined text-sm">sports_tennis</span>
          ROUND ROBIN TOURNAMENT
        </motion.div>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-background tracking-tight mb-3">
          Set Up Your Tournament
        </h2>
        <p className="font-body text-on-surface-variant text-lg">
          Add players, configure your format, and generate the schedule.
        </p>
      </div>

      {/* Tournament Name */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 p-6 mb-6">
        <label className="block font-label text-xs tracking-widest text-on-surface-variant uppercase mb-2">
          Tournament Name
        </label>
        <input
          type="text"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          placeholder="Rockii Pickleball Tournament"
          className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
        />
      </div>

      {/* Mode & Config */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 p-6 mb-6">
        <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container">tune</span>
          Tournament Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mode toggle */}
          <div>
            <label className="block font-label text-xs tracking-widest text-on-surface-variant uppercase mb-2">
              Format
            </label>
            <div className="flex rounded-lg border border-outline-variant overflow-hidden">
              {(['singles', 'doubles'] as TournamentMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 px-4 font-label text-sm font-semibold tracking-wide transition-all duration-200 ${
                    mode === m
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {m === 'singles' ? '🏓 Singles' : '🏓🏓 Doubles'}
                </button>
              ))}
            </div>
          </div>

          {/* Partner mode (doubles only) */}
          {mode === 'doubles' && (
            <div>
              <label className="block font-label text-xs tracking-widest text-on-surface-variant uppercase mb-2">
                Partners
              </label>
              <div className="flex rounded-lg border border-outline-variant overflow-hidden">
                {(['fixed', 'rotating'] as DoublesPartnerMode[]).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setPartnerMode(pm)}
                    className={`flex-1 py-3 px-4 font-label text-sm font-semibold tracking-wide transition-all duration-200 ${
                      partnerMode === pm
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {pm === 'fixed' ? '🔒 Fixed' : '🔄 Rotating'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courts */}
          <div>
            <label className="block font-label text-xs tracking-widest text-on-surface-variant uppercase mb-2">
              Number of Courts
            </label>
            <div className="relative">
              <select
                value={courts}
                onChange={(e) => setCourts(parseInt(e.target.value))}
                className="w-full appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} Court{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                expand_more
              </span>
            </div>
          </div>

          {/* Max Rounds */}
          <div>
            <label className="block font-label text-xs tracking-widest text-on-surface-variant uppercase mb-2">
              Max Rounds (optional)
            </label>
            <input
              type="number"
              value={maxRounds}
              onChange={(e) => setMaxRounds(e.target.value)}
              placeholder="All rounds"
              min="1"
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
            />
          </div>
        </div>
      </div>

      {/* Player Input */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 p-6 mb-6">
        <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container">person_add</span>
          Add Players
          {players.length > 0 && (
            <span className="ml-auto px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-bold font-mono">
              {players.length}
            </span>
          )}
        </h3>

        {/* Single add */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={singleName}
            onChange={(e) => setSingleName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSinglePlayer()}
            placeholder="Enter player name..."
            className="flex-1 bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={addSinglePlayer}
            className="px-6 py-3 bg-primary-container text-on-primary-container rounded-lg font-label text-sm font-bold tracking-wide hover:bg-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add
          </motion.button>
        </div>

        {/* Bulk add */}
        <details className="group mb-4">
          <summary className="cursor-pointer font-label text-xs tracking-widest text-on-surface-variant uppercase flex items-center gap-1 hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined text-sm transition-transform group-open:rotate-90">
              chevron_right
            </span>
            Bulk Add (paste multiple names)
          </summary>
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste player names here, one per line..."
              rows={5}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={addBulkPlayers}
              className="self-end px-5 py-2 bg-surface border border-primary-container text-primary-container rounded-lg font-label text-sm font-bold tracking-wide hover:bg-primary-container hover:text-on-primary-container transition-colors"
            >
              Add All
            </motion.button>
          </div>
        </details>

        {/* Player chips */}
        {players.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {players.map((player, i) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.02 }}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/50 text-on-surface text-sm font-body hover:border-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-sm text-outline">person</span>
                  {player.name}
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-outline hover:bg-error/10 hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={generateSchedule}
        disabled={!canGenerate}
        className={`w-full py-4 rounded-xl font-headline text-lg font-bold tracking-wide shadow-lg transition-all duration-200 flex items-center justify-center gap-3 ${
          canGenerate
            ? 'bg-secondary-container text-on-secondary-container hover:shadow-xl cursor-pointer'
            : 'bg-surface-container text-outline cursor-not-allowed'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">sports_tennis</span>
        Generate Round Robin Schedule
        {!canGenerate && (
          <span className="text-sm font-body font-normal ml-2">
            (need {mode === 'doubles' ? '4+' : '2+'} players)
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}
