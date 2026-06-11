'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { useTournament } from '@/lib/tournament-context';

const navItems = [
  { label: 'Dashboard', href: '/', icon: 'dashboard' },
  { label: 'Players', href: '/players', icon: 'group' },
  { label: 'Leaderboard', href: '/leaderboard', icon: 'leaderboard' },
];

export default function Header() {
  const pathname = usePathname();
  const { tournament } = useTournament();
  const hasSchedule = tournament.rounds.length > 0;

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-primary-container border-b border-primary-container sticky top-0 z-50"
    >
      <div className="flex justify-between items-center px-4 md:px-16 h-20 w-full max-w-[1280px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined fill text-on-secondary-container text-xl">
                sports_tennis
              </span>
            </div>
            <h1 className="font-headline text-2xl md:text-[32px] font-black text-surface-container-lowest tracking-tight leading-tight">
              Rockii Pickleball
            </h1>
          </Link>

          {/* Desktop Nav */}
          {hasSchedule && (
            <nav className="hidden md:flex items-center gap-1 mt-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg font-label text-sm tracking-wide transition-colors duration-150 flex items-center gap-2 ${
                      isActive
                        ? 'text-secondary-container font-bold'
                        : 'text-on-primary-container/70 hover:text-surface-container-lowest hover:bg-white/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-secondary-container rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {hasSchedule && (
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 text-on-primary-container/80 text-xs font-label tracking-wider">
              <span className="material-symbols-outlined text-sm text-secondary-container">group</span>
              {tournament.players.length} Players
            </div>
          )}

          {/* Mobile Nav */}
          {hasSchedule && (
            <div className="flex md:hidden items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-secondary-container bg-white/10'
                        : 'text-on-primary-container/60 hover:text-surface-container-lowest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {item.icon}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
