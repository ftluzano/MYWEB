import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Flame, Wind, Church, Sliders } from 'lucide-react';
import { gothicAudio } from '../utils/audioEngine';

export const AmbientSoundscape: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(45);
  const [engagement, setEngagement] = useState(24);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Engagement tracking loop
  useEffect(() => {
    let activityPoints = 20;
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(16, now - lastTime);
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      const speed = dist / dt;
      activityPoints = Math.min(100, activityPoints + speed * 1.8);
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
      if (!hasInteracted) setHasInteracted(true);
    };

    const onScroll = () => {
      activityPoints = Math.min(100, activityPoints + 4.5);
      if (!hasInteracted) setHasInteracted(true);
    };

    const onClick = () => {
      activityPoints = Math.min(100, activityPoints + 8);
      if (!hasInteracted) setHasInteracted(true);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    // Periodic decay & sync with audio engine
    const interval = setInterval(() => {
      activityPoints = Math.max(15, activityPoints * 0.94); // gradual decay to baseline brooding
      const rounded = Math.round(activityPoints);
      setEngagement(rounded);
      gothicAudio.updateEngagement(rounded);
    }, 400);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onClick);
      clearInterval(interval);
    };
  }, [hasInteracted]);

  const handleToggleSound = () => {
    const active = gothicAudio.toggle();
    setIsPlaying(active);
    if (active) {
      gothicAudio.playGothicChime(330);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    gothicAudio.setVolume(val / 100);
  };

  // State descriptor for engagement
  const getEngagementStatus = (lvl: number) => {
    if (lvl < 30) return { label: 'Brooding Slumber', color: 'text-zinc-500' };
    if (lvl < 60) return { label: 'Awakened Shadows', color: 'text-red-400' };
    if (lvl < 85) return { label: 'Resonating Flame', color: 'text-amber-400' };
    return { label: 'Transcendent Abyssal', color: 'text-red-500 font-bold' };
  };

  const status = getEngagementStatus(engagement);

  return (
    <div className="fixed bottom-5 right-5 z-[9900] select-none">
      {/* Sound Controller Panel */}
      <div className="relative">
        {/* Expanded Controls Drawer */}
        {isExpanded && (
          <div className="absolute bottom-14 right-0 w-72 bg-[#0d0d12]/95 border border-red-950/70 backdrop-blur-md rounded-lg p-4 shadow-[0_10px_30px_rgba(0,0,0,0.9)] mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 mb-3">
              <span className="font-gothic text-xs text-zinc-300 tracking-wider flex items-center gap-1.5 uppercase">
                <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                Gothic Soundscape
              </span>
              <span className="text-[10px] font-mono text-zinc-500">DYNAMIC ENGAGEMENT</span>
            </div>

            {/* Engagement Meter */}
            <div className="bg-[#141419] p-2.5 rounded border border-zinc-800/60 mb-3">
              <div className="flex justify-between items-center text-[11px] mb-1.5">
                <span className="text-zinc-400 font-journal text-sm">Engagement Level:</span>
                <span className={`text-[11px] font-mono ${status.color}`}>{engagement}%</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-900 via-red-600 to-amber-500 transition-all duration-300"
                  style={{ width: `${engagement}%` }}
                />
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-500">
                <span className="capitalize">{status.label}</span>
                <span className="text-[9px]">Reacts to cursor & scrolls</span>
              </div>
            </div>

            {/* Volume slider */}
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-[11px] text-zinc-400 font-journal">
                <span>Resonant Volume</span>
                <span className="font-mono text-[10px] text-zinc-500">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-red-600 h-1 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sound features description */}
            <div className="text-[10px] text-zinc-500 border-t border-zinc-900 pt-2 flex items-center justify-between">
              <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-zinc-400" /> Void Wind</span>
              <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-red-500" /> Embers</span>
              <span className="flex items-center gap-1"><Church className="w-3 h-3 text-amber-500" /> Chimes</span>
            </div>
          </div>
        )}

        {/* Floating Capsule Bar */}
        <div className="flex items-center gap-2 bg-[#0d0d12]/90 border border-red-950/60 hover:border-red-800/80 backdrop-blur-md rounded-full px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-all">
          {/* Main Toggle Button */}
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-2 text-xs font-gothic tracking-wider px-2.5 py-1 rounded-full transition-all ${
              isPlaying
                ? 'bg-red-950/70 text-red-200 border border-red-800/50 shadow-[0_0_12px_rgba(220,38,38,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60'
            }`}
            title={isPlaying ? 'Mute Gothic Soundscape' : 'Awaken Gothic Soundscape'}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span className="text-[11px]">AMBIENCE ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[11px]">SOUNDSCAPE</span>
              </>
            )}
          </button>

          {/* Quick Engagement indicator dot */}
          <div
            className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-full border border-zinc-800/60 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            title={`Engagement: ${engagement}% - ${status.label}. Click to adjust settings.`}
          >
            <span
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: isPlaying ? (engagement > 60 ? '#ef4444' : '#7f1d1d') : '#52525b',
                boxShadow: isPlaying ? '0 0 6px rgba(239, 68, 68, 0.8)' : 'none'
              }}
            />
            <span className="text-[10px] font-mono text-zinc-400">{engagement}%</span>
            <Sliders className="w-3 h-3 text-zinc-500 hover:text-zinc-300 ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
