import React, { useState, useEffect } from 'react';
import { Flame, Swords, Play, Pause } from 'lucide-react';
import { WEBSITES } from '../data/portfolioData';
import { gothicAudio } from '../utils/audioEngine';

export const HeroSection: React.FC = () => {
  const [isThemePlaying, setIsThemePlaying] = useState(false);

  useEffect(() => {
    const unsub = gothicAudio.subscribeState(playing => {
      setIsThemePlaying(playing);
    });
    return () => unsub();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      gothicAudio.playWarriorLinkSound();
    }
  };

  const handleToggleTheme = () => {
    const active = gothicAudio.toggleThemeSong();
    setIsThemePlaying(active);
    gothicAudio.playWarriorLinkSound();
  };

  return (
    <section className="relative min-h-[82vh] flex flex-col justify-center items-center text-center px-4 pt-24 pb-12 overflow-hidden">
      {/* Dark gothic atmospheric background light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Official Status Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121219]/90 border border-red-900/50 text-xs font-mono text-zinc-300 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.15)]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-red-400 font-semibold uppercase tracking-wider">KYLE DESILLA RICO</span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-400 tracking-wide">FULL-STACK & AI SYSTEMS ARCHITECT</span>
      </div>

      {/* Main Display Title */}
      <div className="max-w-4xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-6xl font-extrabold font-gothic tracking-[0.05em] text-zinc-100 uppercase leading-[1.08] drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]">
          Autonomous Systems <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-red-600">
            & Digital Sanctuaries
          </span>
        </h1>
      </div>

      {/* OFFICIAL THEME SONG BANNER: Sparta | Warrior Song - Beneath the Sun */}
      <div className="mt-7 max-w-lg w-full mx-auto p-3 rounded-xl bg-[#111118]/90 border border-red-900/60 shadow-[0_4px_25px_rgba(185,28,28,0.25)] backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-left">
          <button
            onClick={handleToggleTheme}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              isThemePlaying
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)]'
                : 'bg-zinc-900 hover:bg-red-950 text-red-400 border border-red-900/70'
            }`}
            title={isThemePlaying ? 'Pause Theme Song' : 'Play Sparta | Warrior Song - Beneath the Sun'}
          >
            {isThemePlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
              PORTFOLIO THEME SONG
            </div>
            <div className="text-xs sm:text-sm font-gothic font-bold text-zinc-100 tracking-wide">
              Sparta | Warrior Song - Beneath the Sun
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-zinc-400 hidden sm:flex items-center gap-1.5 bg-[#0a0a0e] px-2.5 py-1.5 rounded border border-zinc-800">
          <Swords className="w-3.5 h-3.5 text-red-500" />
          <span>Click links to hear sound</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <button
          onClick={() => scrollTo('school-anonymous')}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-950 via-red-900 to-zinc-900 hover:from-red-900 hover:to-red-950 border border-red-700/70 text-white font-gothic tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(185,28,28,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          EXPLORE THE 5 WEBSITES
        </button>

        <button
          onClick={() => scrollTo('journal')}
          className="px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-gothic tracking-widest text-xs uppercase transition-all cursor-pointer"
        >
          JOURNAL
        </button>

        <button
          onClick={() => scrollTo('contact')}
          className="px-6 py-3 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-red-950/80 text-red-400 hover:text-red-300 font-gothic tracking-widest text-xs uppercase transition-all cursor-pointer"
        >
          CONTACT
        </button>
      </div>

      {/* Quick Crown Navigation Strip */}
      <div className="mt-12 w-full max-w-4xl pt-6 border-t border-zinc-900/80">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {WEBSITES.map(w => (
            <button
              key={w.id}
              onClick={() => scrollTo(w.id)}
              className="p-2.5 rounded-lg bg-[#0e0e14]/70 hover:bg-[#151520] border border-zinc-800/70 hover:border-red-800 text-left transition-all group cursor-pointer"
            >
              <div className="text-sm group-hover:scale-110 transition-transform inline-block">
                {w.sigil}
              </div>
              <div className="text-xs font-gothic font-bold text-zinc-200 group-hover:text-red-300 truncate mt-0.5">
                {w.title}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 truncate">
                {w.crownTitle}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
