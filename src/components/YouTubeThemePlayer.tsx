import React, { useEffect } from 'react';
import { youtubeTheme } from '../utils/youtubeThemeAudio';

export const YouTubeThemePlayer: React.FC = () => {
  useEffect(() => {
    // Initialize YouTube background audio engine
    youtubeTheme.init();

    // User gesture unlock listener for browser autoplay restrictions
    const handleFirstGesture = () => {
      if (!youtubeTheme.getIsPlaying()) {
        youtubeTheme.play();
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  return (
    // Hidden container managed by the YouTube IFrame API for background theme music
    <div
      id="youtube-theme-player-container"
      className="fixed -top-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};
