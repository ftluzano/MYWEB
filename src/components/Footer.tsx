import React from 'react';
import { Flame, ArrowUp, Shield, Swords } from 'lucide-react';
import { gothicAudio } from '../utils/audioEngine';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    gothicAudio.playWarriorLinkSound();
  };

  const handleLinkClick = () => {
    gothicAudio.playWarriorLinkSound();
  };

  return (
    <footer className="border-t border-red-950/50 bg-[#07070b] py-14 px-4 sm:px-6 relative select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand and Copyright */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-950/70 border border-red-900/70 flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.25)]">
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <div className="font-gothic text-sm font-bold text-zinc-200 tracking-wider">
              KYLE DESILLA RICO
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              © {new Date().getFullYear()} • Systems Architect & AI Engineering Sanctum
            </div>
          </div>
        </div>

        {/* Center Theme Song Attribution */}
        <div className="text-center text-xs font-mono text-zinc-400 hidden md:flex items-center gap-2">
          <Swords className="w-3.5 h-3.5 text-red-500" />
          <span>Theme Song: <strong className="text-zinc-200">Sparta | Warrior Song - Beneath the Sun</strong></span>
        </div>

        {/* Back to top */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Production Vercel & TypeScript
          </span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            title="Return to top (triggers warrior sound)"
          >
            <ArrowUp className="w-3.5 h-3.5 text-red-400" />
            <span>TOP</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
