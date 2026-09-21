import React, { useState } from 'react';
import { ExternalLink, Mail, Instagram, Facebook, Copy, Check } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/portfolioData';
import { gothicAudio } from '../utils/audioEngine';

export const ContactChannels: React.FC = () => {
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const handleLinkClick = () => {
    gothicAudio.playWarriorLinkSound();
  };

  const handleCopy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHandle(name);
    gothicAudio.playWarriorLinkSound();
    setTimeout(() => setCopiedHandle(null), 2000);
  };

  const getBrandDetails = (name: string) => {
    switch (name.toLowerCase()) {
      case 'facebook':
        return {
          icon: <Facebook className="w-5 h-5 text-blue-400" />,
          glowClass: 'hover:shadow-[0_0_35px_rgba(59,130,246,0.35)] hover:border-blue-500/60',
          accentBg: 'bg-blue-950/40 border-blue-800/40 text-blue-400',
          radialGlow: 'from-blue-600/25'
        };
      case 'instagram':
        return {
          icon: <Instagram className="w-5 h-5 text-pink-400" />,
          glowClass: 'hover:shadow-[0_0_35px_rgba(236,72,153,0.35)] hover:border-pink-500/60',
          accentBg: 'bg-pink-950/40 border-pink-800/40 text-pink-400',
          radialGlow: 'from-pink-600/25'
        };
      case 'direct email':
        return {
          icon: <Mail className="w-5 h-5 text-red-400" />,
          glowClass: 'hover:shadow-[0_0_35px_rgba(239,68,68,0.35)] hover:border-red-500/60',
          accentBg: 'bg-red-950/40 border-red-800/40 text-red-400',
          radialGlow: 'from-red-600/25'
        };
      default:
        return {
          icon: <Mail className="w-5 h-5 text-zinc-400" />,
          glowClass: 'hover:shadow-[0_0_35px_rgba(220,38,38,0.3)] hover:border-zinc-600',
          accentBg: 'bg-zinc-900 border-zinc-800 text-zinc-300',
          radialGlow: 'from-zinc-600/15'
        };
    }
  };

  return (
    <div id="contact-channels" className="w-full max-w-4xl mx-auto mb-6">
      {/* 3 Contact Info Cards with Realistic Lighting, Reflections, and Tactile Depth */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {SOCIAL_LINKS.map(item => {
          const brand = getBrandDetails(item.name);
          const isCopied = copiedHandle === item.name;

          return (
            <div
              key={item.name}
              className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 flex flex-col justify-between items-center text-center bg-gradient-to-b from-[#13131c] via-[#0c0c14] to-[#07070b] border border-zinc-800/80 ${brand.glowClass} transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.7)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.85)]`}
            >
              {/* Realistic Glass Sheen / Specular Glare Reflection on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

              {/* Atmospheric Radial Brand Backlight Centered */}
              <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-gradient-to-b ${brand.radialGlow} to-transparent blur-2xl opacity-40 group-hover:opacity-90 group-hover:scale-125 transition-all duration-500 pointer-events-none`} />

              {/* Centered Brand Icon, Platform Name, and Username */}
              <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                {/* Centered Icon */}
                <div className={`p-2.5 rounded-2xl border ${brand.accentBg} shadow-inner transition-transform duration-300 group-hover:scale-110 mb-2.5 flex items-center justify-center`}>
                  {brand.icon}
                </div>

                {/* Platform Name Centered */}
                <div className="text-sm sm:text-base font-bold font-gothic text-zinc-100 tracking-wider mb-1 group-hover:text-white transition-colors text-center">
                  {item.name}
                </div>

                {/* Username / Handle Centered with Copy Button */}
                <div className="flex items-center justify-center gap-1.5 mb-3 sm:mb-3.5 max-w-full px-1">
                  <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 truncate select-all transition-colors text-center">
                    {item.handle}
                  </span>
                  <button
                    onClick={() => handleCopy(item.url.startsWith('mailto:') ? item.handle : item.url, item.name)}
                    className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/80 active:bg-zinc-700 transition-colors shrink-0 cursor-pointer"
                    title={`Copy ${item.name} handle`}
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Single Centered CONNECT Action Button */}
              <div className="relative z-10 pt-2.5 sm:pt-3 border-t border-zinc-800/80 w-full flex items-center justify-center">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 hover:from-red-900 hover:to-red-800 border border-red-700/80 text-xs font-gothic font-bold tracking-widest text-white shadow-[0_0_18px_rgba(220,38,38,0.4)] hover:shadow-[0_0_26px_rgba(220,38,38,0.7)] transition-all cursor-pointer active:scale-95 text-center group/btn"
                >
                  <span>CONNECT</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
