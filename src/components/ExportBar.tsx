'use client';

import { motion } from 'motion/react';
import { useTournament } from '@/lib/tournament-context';
import { exportTournamentPDF } from '@/lib/pdf-export';

export default function ExportBar() {
  const { tournament, dispatch } = useTournament();

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    exportTournamentPDF(tournament);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the entire tournament? This cannot be undone.')) {
      localStorage.removeItem('rockii-tournament');
      dispatch({ type: 'RESET_TOURNAMENT' });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3" data-print-hide>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handlePrint}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-label text-sm font-bold tracking-wide hover:bg-surface-container-low transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-lg">print</span>
        Print
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleExportPDF}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label text-sm font-bold tracking-wide hover:bg-primary transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
        Export PDF
      </motion.button>

      <div className="flex-grow" />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleReset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-error/30 text-error font-label text-sm font-bold tracking-wide hover:bg-error/5 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">restart_alt</span>
        New Tournament
      </motion.button>
    </div>
  );
}
