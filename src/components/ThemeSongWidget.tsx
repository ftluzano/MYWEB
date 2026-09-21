import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { youtubeTheme, THEME_SONG_INFO } from '../utils/youtubeThemeAudio';

export const ThemeSongWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    // Sync initial state and subscribe to changes
    setIsPlaying(youtubeTheme.getIsPlaying());

    const unsubscribe = youtubeTheme.subscribe((playing: boolean) => {
      setIsPlaying(playing);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggle = () => {
    youtubeTheme.toggle();
  };

  return (
    <div
      id="theme-song-widget"
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 select-none pb-safe pr-safe"
    >
      <button
        onClick={handleToggle}
        className={`group relative flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 min-h-[44px] min-w-[44px] rounded-2xl border transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer active:scale-95 ${
          isPlaying
            ? 'bg-[#110e14]/90 border-red-700/80 hover:border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] text-red-100'
            : 'bg-[#0e0e13]/85 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
        }`}
        title={`${isPlaying ? 'Pause' : 'Play'} theme song: ${THEME_SONG_INFO.title}`}
        aria-label="Toggle Theme Song"
      >
        {/* Animated Equalizer or Paused Icon */}
        <div className="flex items-center justify-center shrink-0">
          {isPlaying ? (
            <div className="flex items-end gap-[2px] h-3.5 w-3.5">
              <span className="w-[2.5px] bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
              <span className="w-[2.5px] bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s] h-3.5" />
              <span className="w-[2.5px] bg-rose-400 rounded-full animate-bounce [animation-delay:-0.45s] h-2.5" />
            </div>
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </div>

        {/* Text Details (Compact on mobile, readable on tablet/desktop) */}
        <div className="flex flex-col items-start text-left leading-tight hidden xs:flex">
          <span className="text-[10px] font-gothic font-bold tracking-wider uppercase flex items-center gap-1">
            <Music className="w-2.5 h-2.5 text-red-500 shrink-0" />
            <span className="truncate max-w-[110px] sm:max-w-[150px]">{THEME_SONG_INFO.shortTitle}</span>
          </span>
          <span className="text-[8px] font-mono text-zinc-500">
            {isPlaying ? 'BATTLE HYMN • PLAYING' : 'THEME MUTED'}
          </span>
        </div>

        {/* Action Icon for very small screens */}
        <div className="shrink-0 xs:hidden">
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-red-400" />
          ) : (
            <Music className="w-4 h-4 text-zinc-500" />
          )}
        </div>
      </button>
    </div>
  );
};
