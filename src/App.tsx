import { Navbar } from './components/Navbar';
import { ContactChannels } from './components/ContactChannels';
import { WebsiteShowcase } from './components/WebsiteShowcase';
import { RockShatterEffect } from './components/RockShatterEffect';
import { RealisticLavaBackground } from './components/RealisticLavaBackground';
import { DemonicCursor } from './components/DemonicCursor';
import { YouTubeThemePlayer } from './components/YouTubeThemePlayer';
import { SpinningDollarSigns } from './components/SpinningDollarSigns';
import { WEBSITES } from './data/portfolioData';

export function App() {
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

      </main>

      {/* YouTube Background Theme Audio Engine & Responsive Widget */}
      <YouTubeThemePlayer />
      <SpinningDollarSigns />

    </div>
  );
}

export default App;
