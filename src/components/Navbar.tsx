import React from 'react';
import kyleLogo from '../assets/images/kyle_stairs_portrait_1789984379217.jpg';

export const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-[#08080c]/95 backdrop-blur-md border-b border-red-950/40 py-3.5 select-none sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {/* Brand: KYLE DOMAIN with custom Website Logo at the top */}
        <div className="flex items-center gap-3 group cursor-pointer">
          {/* Logo container styled like AI Studio top app logo */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-black border border-red-700/80 shadow-[0_0_16px_rgba(220,38,38,0.45)] group-hover:border-red-500 group-hover:shadow-[0_0_24px_rgba(239,68,68,0.7)] transition-all shrink-0">
            <img
              src={kyleLogo}
              alt="KYLE DOMAIN Logo"
              className="w-full h-full object-cover object-[center_24%] group-hover:scale-110 transition-transform duration-300"
            />
            {/* Realistic glass gleam across logo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
          </div>

          <span
            id="kyle-domain-brand"
            className="font-graffiti text-2xl sm:text-3xl font-bold tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-100 to-red-500 drop-shadow-[0_0_14px_rgba(239,68,68,0.7)] group-hover:drop-shadow-[0_0_22px_rgba(239,68,68,0.95)] transition-all select-none leading-none pt-0.5"
            title="KYLE DOMAIN"
          >
            KYLE DOMAIN
          </span>
        </div>
      </div>
    </header>
  );
};
