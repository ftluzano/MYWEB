import React from 'react';
import { ExternalLink, Mail, Instagram, Facebook } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/portfolioData';
import { gothicAudio } from '../utils/audioEngine';

export const ContactChannels: React.FC = () => {
  const handleLinkClick = () => {
    gothicAudio.playWarriorLinkSound();
  };

  const getBrandDetails = (name: string) => {
    switch (name.toLowerCase()) {
      case 'facebook':
        return {
          icon: <Facebook className="w-5 h-5 text-blue-400" />,
          glowClass: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-500/50',
          accentBg: 'bg-blue-950/40 border-blue-800/40 text-blue-400',
          radialGlow: 'from-blue-600/15'
        };
      case 'instagram':
        return {
          icon: <Instagram className="w-5 h-5 text-pink-400" />,
          glowClass: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:border-pink-500/50',
          accentBg: 'bg-pink-950/40 border-pink-800/40 text-pink-400',
          radialGlow: 'from-pink-600/15'
        };
      case 'direct email':
        return {
          icon: <Mail className="w-5 h-5 text-red-400" />,
          glowClass: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:border-red-500/50',
          accentBg: 'bg-red-950/40 border-red-800/40 text-red-400',
          radialGlow: 'from-red-600/15'
        };
      default:
        return {
          icon: <Mail className="w-5 h-5 text-zinc-400" />,
          glowClass: 'hover:shadow-[0_0_30px_rgba(220,38,38,0.25)] hover:border-zinc-600',
          accentBg: 'bg-zinc-900 border-zinc-800 text-zinc-300',
          radialGlow: 'from-zinc-600/10'
        };
    }
  };

  return (
    <div id="contact-channels" className="w-full max-w-4xl mx-auto mb-5">
      {/* 3 Contact Info Cards with Realistic Lighting, Reflections, and Tactile Depth */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {SOCIAL_LINKS.map(item => {
          const brand = getBrandDetails(item.name);

          return (
            <div
              key={item.name}
              className={`group relative overflow-hidden rounded-2xl p-4 flex flex-col justify-between bg-gradient-to-b from-[#13131c] via-[#0c0c14] to-[#07070b] border border-zinc-800/80 ${brand.glowClass} transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_25px_rgba(0,0,0,0.7)]`}
            >
              {/* Realistic Glass Sheen / Specular Glare Reflection on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full ease-in-out duration-1000" />

              {/* Atmospheric Radial Brand Backlight */}
              <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${brand.radialGlow} to-transparent blur-2xl opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`p-2 rounded-xl border ${brand.accentBg} shadow-inner transition-transform group-hover:scale-105 duration-200`}>
                    {brand.icon}
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-800/80 shadow-sm">
                    {item.gothicLabel}
                  </span>
                </div>

                <div className="text-sm font-bold font-gothic text-zinc-100 tracking-wide mb-0.5 group-hover:text-white transition-colors">
                  {item.name}
                </div>
                <div className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 truncate mb-3 select-all transition-colors">
                  {item.handle}
                </div>
              </div>

              {/* Single Centered CONNECT Action Button */}
              <div className="relative z-10 pt-3 border-t border-zinc-800/80 flex items-center justify-center">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 hover:from-red-900 hover:to-red-800 border border-red-700/80 text-xs font-gothic font-bold tracking-widest text-white shadow-[0_0_18px_rgba(220,38,38,0.4)] hover:shadow-[0_0_26px_rgba(220,38,38,0.7)] transition-all cursor-pointer active:scale-95 text-center"
                >
                  <span>CONNECT</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
