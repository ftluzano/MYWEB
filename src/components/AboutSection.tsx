import React from 'react';
import { Shield, Sparkles, Flame, Cpu } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-14 scroll-mt-24">
      <div className="max-w-4xl mx-auto rune-border bg-[#0d0d14]/90 backdrop-blur-md rounded-2xl p-6 sm:p-10 relative overflow-hidden border border-zinc-800/80 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/50 border border-red-900/50 text-xs font-mono text-red-400 mb-5">
          <Flame className="w-3.5 h-3.5 text-red-500" />
          <span className="uppercase tracking-wider">ABOUT KYLE</span>
        </div>

        {/* Title and Concise Bio */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-gothic text-zinc-100 tracking-wide">
            Kyle Desilla Rico
          </h2>
          <p className="text-base sm:text-lg font-journal text-zinc-300 italic leading-relaxed">
            Software engineer & AI systems architect specializing in full-stack web applications, autonomous LLM integrations, and confidential digital sanctuaries.
          </p>

          {/* Core Engineering Disciplines - Clean & Minimal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
            <div className="bg-[#121219] p-3.5 rounded-xl border border-zinc-800/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-gothic text-zinc-200 font-bold">
                <Cpu className="w-4 h-4 text-red-400" />
                <span>Autonomous AI Systems</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Real-time streaming LLM pipelines, prompt cognition, and tailored agent personalities.
              </p>
            </div>

            <div className="bg-[#121219] p-3.5 rounded-xl border border-zinc-800/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-gothic text-zinc-200 font-bold">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Confidential Sanctuaries</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Zero-telemetry privacy architectures and encrypted student confession portals.
              </p>
            </div>

            <div className="bg-[#121219] p-3.5 rounded-xl border border-zinc-800/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-gothic text-zinc-200 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Sensory Dark Web UX</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Procedural Spartan audio synthesis, physical particle dynamics, and fluid obsidian styling.
              </p>
            </div>
          </div>

          {/* Compact Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80">
            <div className="bg-[#121219] p-2.5 rounded-lg border border-zinc-800/80 text-center">
              <div className="text-xl font-gothic font-bold text-red-400">5</div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Live Deployments</div>
            </div>
            <div className="bg-[#121219] p-2.5 rounded-lg border border-zinc-800/80 text-center">
              <div className="text-xl font-gothic font-bold text-zinc-100">TypeScript</div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Full-Stack Core</div>
            </div>
            <div className="bg-[#121219] p-2.5 rounded-lg border border-zinc-800/80 text-center">
              <div className="text-xl font-gothic font-bold text-amber-400">100%</div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Production Ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
