import React, { useEffect } from 'react';
import { youtubeTheme } from '../utils/youtubeThemeAudio';

export const YouTubeThemePlayer: React.FC = () => {
  useEffect(() => {
    youtubeTheme.init();
  }, []);

  return (
    <div
      id="youtube-theme-player-container"
      className="fixed -top-[9999px] -left-[9999px] w-[200px] h-[200px] opacity-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};
