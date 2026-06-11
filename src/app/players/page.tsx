'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTournament } from '@/lib/tournament-context';
import { generateRoundRobin } from '@/lib/round-robin';
import { Player } from '@/lib/types';

export default function PlayersPage() {
  const { tournament, dispatch } = useTournament();
  const [newName, setNewName] = useState('');

  const players = tournament.players;
  const hasSchedule = tournament.rounds.length > 0;

  const addPlayer = () => {
    const name = newName.trim();
    if (!name) return;
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) return;

    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 11),
      name,
    };

    dispatch({ type: 'ADD_PLAYERS', payload: [newPlayer] });
    setNewName('');
  };

  const removePlayer = (id: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: id });
  };

  const regenerateSchedule = () => {
    if (!confirm('Regenerating will clear all existing scores. Continue?')) return;

    const rounds = generateRoundRobin(
      tournament.players,
      tournament.config.mode,
      tournament.config.doublesPartnerMode,
      tournament.config.numberOfCourts,
      tournament.config.maxRounds
    );

    dispatch({ type: 'GENERATE_ROUNDS', payload: rounds });
  };

  return (
    <main className="flex-grow w-full max-w-[900px] mx-auto px-4 md:px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-on-background tracking-tight">
            Players
          </h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            {players.length} players registered
          </p>
        </div>
        {hasSchedule && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={regenerateSchedule}
            data-print-hide
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary-container text-on-secondary-container font-label text-sm font-bold tracking-wide hover:shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Regenerate Schedule
          </motion.button>
        )}
      </motion.div>

      {/* Add player */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 p-5 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            placeholder="Add new player..."
            className="flex-1 bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={addPlayer}
            className="px-6 py-3 bg-primary-container text-on-primary-container rounded-lg font-label text-sm font-bold tracking-wide hover:bg-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add
          </motion.button>
        </div>
      </div>

      {/* Player list */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-5 py-3 bg-surface-container-low font-mono text-[10px] tracking-widest text-on-surface-variant border-b border-outline-variant/30 uppercase">
          <div className="w-10 text-center">#</div>
          <div className="flex-grow px-2">Player Name</div>
          <div className="w-20 text-right">Action</div>
        </div>

        {/* Rows */}
        <AnimatePresence>
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, height: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`flex items-center px-5 py-3.5 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors ${
                i % 2 === 1 ? 'bg-surface-container-low/50' : ''
              }`}
            >
              <div className="w-10 text-center font-headline text-sm font-bold text-on-surface-variant">
                {i + 1}
              </div>
              <div className="flex-grow px-2 font-body text-sm font-medium text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-lg">account_circle</span>
                {player.name}
              </div>
              <div className="w-20 text-right">
                <button
                  onClick={() => removePlayer(player.id)}
                  className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {players.length === 0 && (
          <div className="px-5 py-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-outline mb-2 block">group_off</span>
            <p className="font-body text-sm">No players added yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
