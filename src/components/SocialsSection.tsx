import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Share2 } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/portfolioData';
import { gothicAudio } from '../utils/audioEngine';

export const SocialsSection: React.FC = () => {
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const handleCopy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHandle(name);
    gothicAudio.playWarriorLinkSound();
    setTimeout(() => setCopiedHandle(null), 2000);
  };

  const handleLinkClick = () => {
    gothicAudio.playWarriorLinkSound();
  };

  return (
    <section id="socials" className="py-14 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-900/50 text-xs font-mono text-red-400 mb-3">
            <Share2 className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">CHANNELS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-gothic tracking-wider text-zinc-100">
            Official Channels
          </h2>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SOCIAL_LINKS.map(item => (
            <div
              key={item.name}
              className="rune-border bg-[#0e0e15]/90 backdrop-blur-sm rounded-xl p-5 flex flex-col justify-between border border-zinc-800/80 hover:border-red-800/80 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.7)]"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-2">
                  <span className="text-red-400 font-gothic">{item.gothicLabel}</span>
                  <span className="capitalize text-zinc-400">{item.name}</span>
                </div>

                <h3 className="text-lg font-bold font-gothic text-zinc-100 mb-0.5">
                  {item.name}
                </h3>
                <div className="text-xs font-mono text-zinc-300 mb-4 truncate">
                  {item.handle}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(item.url.startsWith('mailto:') ? item.handle : item.url, item.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
                  title="Copy"
                >
                  {copiedHandle === item.name ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  onMouseDown={handleLinkClick}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-[11px] font-gothic tracking-wider text-red-200 hover:text-white transition-all shadow-[0_0_12px_rgba(220,38,38,0.25)] cursor-pointer"
                >
                  <span>CONNECT</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
