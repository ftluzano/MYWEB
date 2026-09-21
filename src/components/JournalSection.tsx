import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { BookOpen, Clock, Feather, Flame } from 'lucide-react';
import { gothicAudio } from '../utils/audioEngine';

interface JournalSectionProps {
  entries: JournalEntry[];
}

export const JournalSection: React.FC<JournalSectionProps> = ({ entries }) => {
  const [activeEntryId, setActiveEntryId] = useState<string>(entries[0]?.id || '');

  const activeEntry = entries.find(e => e.id === activeEntryId) || entries[0];

  const handleSelect = (id: string) => {
    setActiveEntryId(id);
    gothicAudio.playWarriorLinkSound();
  };

  return (
    <section id="journal" className="py-14 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-900/50 text-xs font-mono text-red-400 mb-3">
          <Feather className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider">CODEX</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-gothic tracking-wider text-zinc-100">
          Architecture Journal
        </h2>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Entry List */}
        <div className="lg:col-span-5 space-y-2.5">
          {entries.map(entry => {
            const isSelected = entry.id === activeEntryId;
            return (
              <div
                key={entry.id}
                onClick={() => handleSelect(entry.id)}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all duration-200 relative ${
                  isSelected
                    ? 'bg-[#13131c] border-red-800/90 shadow-[0_0_20px_rgba(185,28,28,0.25)]'
                    : 'bg-[#0d0d14]/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-[#121219]'
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-red-600 rounded-r shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                )}

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
                  <span className="text-red-400/90 font-semibold">{entry.entryNumber}</span>
                  <span>{entry.date}</span>
                </div>

                <h3 className={`text-sm font-gothic font-semibold transition-colors ${
                  isSelected ? 'text-zinc-100' : 'text-zinc-300'
                }`}>
                  {entry.title}
                </h3>

                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    {entry.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {entry.readTime}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Tome Reading Canvas */}
        <div className="lg:col-span-7">
          <div className="bg-[#0f0f16] rune-border rounded-2xl p-6 sm:p-8 relative overflow-hidden h-full flex flex-col justify-between border border-zinc-800/80 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-b border-zinc-800 pb-3 mb-5">
                <span className="flex items-center gap-1.5 text-red-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  {activeEntry.entryNumber}
                </span>
                <span>{activeEntry.date}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-gothic text-zinc-100 leading-snug mb-3">
                {activeEntry.title}
              </h2>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-6 pb-3 border-b border-zinc-900">
                <span className="px-2 py-0.5 rounded bg-red-950/50 border border-red-900/60 text-red-300">
                  {activeEntry.category}
                </span>
                <span>•</span>
                <span>{activeEntry.readTime}</span>
              </div>

              <div className="space-y-3 font-journal text-base text-zinc-300 leading-relaxed">
                <p className="text-base text-zinc-200 italic border-l-2 border-red-800/80 pl-3 py-0.5">
                  "{activeEntry.excerpt}"
                </p>
                <p className="pt-2 text-zinc-300 leading-relaxed">
                  {activeEntry.content}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-red-950 border border-red-700/80 flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="text-xs font-gothic font-bold text-zinc-200">KYLE DESILLA RICO</div>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Verified Scribe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
