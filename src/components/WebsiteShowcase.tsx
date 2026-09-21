import React, { useState } from 'react';
import { ProjectWebsite } from '../types';
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bot,
  Heart,
  Trophy,
  Sparkles,
  Lock,
  Globe,
  ArrowUpRight,
  Maximize2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { gothicAudio } from '../utils/audioEngine';

interface WebsiteShowcaseProps {
  projects: ProjectWebsite[];
}

export const WebsiteShowcase: React.FC<WebsiteShowcaseProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const current = projects[currentIndex] || projects[0];

  const handleSelect = (idx: number) => {
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
      setIsLoading(true);
      setIframeKey(prev => prev + 1);
      gothicAudio.playWarriorLinkSound();
    }
  };

  const handlePrev = () => {
    const nextIdx = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    handleSelect(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    handleSelect(nextIdx);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
    gothicAudio.playWarriorLinkSound();
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    gothicAudio.playWarriorLinkSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const getProjectIcon = (id: string, size = "w-3.5 h-3.5") => {
    switch (id) {
      case 'school-anonymous':
        return <ShieldCheck className={size} />;
      case 'damon-ai':
        return <Bot className={size} />;
      case 'damon-affection':
        return <Heart className={size} />;
      case 'quiz-damon':
        return <Trophy className={size} />;
      case 'araw-ai':
        return <Sparkles className={size} />;
      default:
        return <Globe className={size} />;
    }
  };

  return (
    <section id="featured-systems" className="w-full max-w-4xl mx-auto py-1">
      {/* 1. Compact Website Selection Tabs */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2.5 mb-3.5 no-scrollbar gap-2 px-1 touch-pan-x select-none">
        {projects.map((p, idx) => {
          const isSelected = idx === currentIndex;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 border min-h-[44px] active:scale-95 ${
                isSelected
                  ? 'bg-[#14141e] text-white border-red-700/80 shadow-[0_0_15px_rgba(220,38,38,0.25)] font-semibold'
                  : 'bg-[#0b0b10] text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:border-zinc-700'
              }`}
              title={`View ${p.title} live interface`}
            >
              <div className={`p-1.5 rounded-md shrink-0 ${isSelected ? 'bg-red-950/90 text-red-400' : 'bg-zinc-900 text-zinc-500'}`}>
                {getProjectIcon(p.id, 'w-3.5 h-3.5')}
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[9px] font-mono text-zinc-500 leading-none">0{idx + 1}</span>
                <span className="tracking-wide text-xs font-semibold leading-tight whitespace-nowrap">{p.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Fixed Proportion Project Board */}
      <div className="bg-[#0b0b11]/95 border border-zinc-800/80 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Top Control Bar & Status */}
        <div className="bg-[#0f0f18] px-3.5 sm:px-6 py-2.5 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-2.5">
          {/* Status & Identity */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {current.status}
            </span>

            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {current.category}
            </span>

            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="hidden sm:inline text-[10px] font-mono text-zinc-400">
              System 0{currentIndex + 1} of 05
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
            <button
              onClick={() => handleCopy(current.url)}
              className="flex items-center gap-1 px-2.5 py-1.5 min-h-[36px] rounded-lg bg-[#14141e] hover:bg-[#1a1a26] border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer active:scale-95"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleReload}
              className="flex items-center justify-center p-2 min-h-[36px] min-w-[36px] rounded-lg bg-[#14141e] hover:bg-[#1a1a26] border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer active:scale-95"
              title="Reload live screen"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${isLoading ? 'animate-spin text-red-400' : ''}`} />
            </button>

            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => gothicAudio.playWarriorLinkSound()}
              className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-red-950/90 hover:bg-red-900 border border-red-800/90 text-white text-xs font-medium tracking-wide shadow-[0_0_12px_rgba(220,38,38,0.35)] transition-all cursor-pointer font-sans active:scale-95 whitespace-nowrap"
              title="Open site in new tab"
            >
              <span className="text-[11px] font-semibold">Launch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Content Layout: Centered Name & Fixed Proportioned Browser Window */}
        <div className="p-3 sm:p-5 space-y-3">
          {/* Centered Website Name */}
          <div className="flex items-center justify-center gap-2.5 py-0.5">
            <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 shadow-[0_0_12px_rgba(220,38,38,0.2)] shrink-0">
              {getProjectIcon(current.id, 'w-4 h-4')}
            </div>
            <h2 className="text-lg sm:text-2xl font-bold font-gothic tracking-wider text-zinc-100 text-center uppercase truncate">
              {current.title}
            </h2>
          </div>

          {/* Interactive Browser Window */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/90 bg-[#07070b] shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {/* Window Chrome Header Bar */}
            <div className="bg-[#12121c] px-3 sm:px-3.5 py-2 flex items-center justify-between border-b border-zinc-800 gap-2">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              </div>

              {/* Clickable Address Bar */}
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => gothicAudio.playWarriorLinkSound()}
                className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md bg-[#0a0a0f] border border-zinc-800/90 hover:border-zinc-700 max-w-md w-full mx-1 sm:mx-3 transition-colors cursor-pointer min-w-0"
                title="Click to visit website directly"
              >
                <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span className="text-[10px] font-mono text-zinc-300 group-hover:text-white truncate">
                  {current.url}
                </span>
                <ExternalLink className="w-2.5 h-2.5 text-zinc-600 group-hover:text-zinc-300 ml-auto shrink-0 transition-colors" />
              </a>

              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => gothicAudio.playWarriorLinkSound()}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 shrink-0"
                title="Open in new full tab"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Live Screen Frame Viewport */}
            <div className="relative w-full h-[280px] sm:h-[350px] md:h-[390px] bg-[#050508]">
              {/* Sleek Loading Overlay while the website initializes */}
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-[#07070b]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2.5 text-zinc-400 p-4 text-center">
                  <div className="w-6 h-6 border-2 border-red-900 border-t-red-500 rounded-full animate-spin" />
                  <span className="text-[11px] font-mono tracking-wider text-zinc-300">
                    CONNECTING TO {current.title.toUpperCase()}...
                  </span>
                </div>
              )}

              <iframe
                key={`${current.id}-${iframeKey}`}
                src={current.url}
                title={current.title}
                className="w-full h-full border-0 bg-[#050508]"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="eager"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="pt-1 flex items-center justify-between">
            <div className="text-[11px] font-mono text-zinc-500">
              {currentIndex + 1} of {projects.length} Systems
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 min-h-[38px] rounded-lg bg-[#14141e] hover:bg-[#1a1a26] border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer active:scale-95"
                title="Previous Platform"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-[11px]">Prev</span>
              </button>

              <div className="flex items-center gap-1 px-1">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === currentIndex ? 'bg-red-500 w-4 sm:w-5' : 'bg-zinc-700 hover:bg-zinc-500 w-1.5'
                    }`}
                    title={`View System 0${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1.5 min-h-[38px] rounded-lg bg-[#14141e] hover:bg-[#1a1a26] border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer active:scale-95"
                title="Next Platform"
              >
                <span className="text-[11px]">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
