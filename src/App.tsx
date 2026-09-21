import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ContactChannels } from './components/ContactChannels';
import { WebsiteShowcase } from './components/WebsiteShowcase';
import { RockShatterEffect } from './components/RockShatterEffect';
import { RealisticLavaBackground } from './components/RealisticLavaBackground';
import { DemonicCursor } from './components/DemonicCursor';
import { InstagramDropModal } from './components/InstagramDropModal';
import { InstagramProfileData } from './components/InstagramProfileCard';
import { YouTubeThemePlayer } from './components/YouTubeThemePlayer';
import { ThemeSongWidget } from './components/ThemeSongWidget';
import { WEBSITES } from './data/portfolioData';
import { Instagram } from 'lucide-react';
import { gothicAudio } from './utils/audioEngine';

export function App() {
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);

  // Multi-user dropped Instagram profiles list
  const [savedProfiles, setSavedProfiles] = useState<InstagramProfileData[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('user_saved_instagram_profiles');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.filter((p) => p && p.username);
          }
        }
      } catch (e) {
        console.warn('Could not read cached profiles:', e);
      }
    }
    return [];
  });

  // Fetch shared profiles on mount from server
  useEffect(() => {
    fetch('/api/saved-instagram')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setSavedProfiles(json.data);
          try {
            localStorage.setItem('user_saved_instagram_profiles', JSON.stringify(json.data));
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.warn('Using local cached profiles:', err);
      });
  }, []);

  const handleProfilesUpdated = (updatedList: InstagramProfileData[]) => {
    setSavedProfiles(updatedList);
    try {
      localStorage.setItem('user_saved_instagram_profiles', JSON.stringify(updatedList));
    } catch (e) {}
  };

  const handleOpenInstagramDrop = () => {
    gothicAudio.playWarriorLinkSound();
    setIsInstagramModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-red-900 selection:text-white font-sans">
      {/* Dynamic Cursed Hellfire Particle Cursor */}
      <DemonicCursor enabled={true} />

      {/* 1. Realistic Lava Animation Canvas Background */}
      <RealisticLavaBackground />

      {/* Atmospheric Vignette & Grain */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-[1]" />

      {/* Interactive Rock Shatter Canvas */}
      <RockShatterEffect />

      {/* Header: Logo at top */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-center items-center py-6 sm:py-8">
        
        {/* 3 Contact Socials at the top of 1st page with effect animations */}
        <ContactChannels />

        {/* The 5 Websites Showcase */}
        <WebsiteShowcase projects={WEBSITES} />

        {/* Bottom Space: Clean DROP INSTAGRAM HERE Button */}
        <div className="mt-6 sm:mt-8 w-full flex flex-col items-center px-2">
          <button
            onClick={handleOpenInstagramDrop}
            className="group relative w-full max-w-md sm:w-auto flex items-center justify-center gap-3 sm:gap-3.5 px-5 sm:px-7 py-3.5 min-h-[50px] rounded-2xl bg-gradient-to-r from-[#12121b] via-[#1a1118] to-[#12121b] hover:from-[#1c1218] hover:via-[#25131f] hover:to-[#1c1218] border border-red-700/70 hover:border-pink-500/80 text-white shadow-[0_0_25px_rgba(220,38,38,0.35)] hover:shadow-[0_0_35px_rgba(236,72,153,0.5)] transition-all duration-300 cursor-pointer active:scale-95"
          >
            {/* Specular Glare Animation */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-[0_0_15px_rgba(220,39,67,0.6)] group-hover:scale-110 transition-transform shrink-0">
              <Instagram className="w-5 h-5" />
            </div>

            <span className="font-gothic text-xs sm:text-base font-bold tracking-[0.10em] sm:tracking-[0.14em] text-zinc-100 group-hover:text-white uppercase whitespace-nowrap">
              DROP INSTAGRAM HERE
            </span>

            {savedProfiles.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-900/60 border border-red-700/60 text-xs font-mono font-bold text-pink-200 shrink-0">
                {savedProfiles.length}
              </span>
            )}
          </button>
        </div>
      </main>

      {/* YouTube Background Theme Audio Engine & Responsive Widget */}
      <YouTubeThemePlayer />
      <ThemeSongWidget />

      {/* Instagram Drop & Profile Modal (2nd Page) */}
      <InstagramDropModal
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
        profiles={savedProfiles}
        onProfilesUpdated={handleProfilesUpdated}
      />
    </div>
  );
}

export default App;
