import React from 'react';

interface GothicCrownProps {
  type?: 'obsidian' | 'crimson' | 'void' | 'arcane' | 'solar';
  title?: string;
  size?: 'md' | 'lg';
}

export const GothicCrown: React.FC<GothicCrownProps> = ({
  type = 'obsidian',
  title = 'Crown of Sovereignty',
  size = 'lg'
}) => {
  // Theme color maps for gems and metal tones
  const themeMap = {
    obsidian: {
      gemPrimary: '#dc2626',
      gemSecondary: '#7f1d1d',
      metalLight: '#3f3f46',
      metalDark: '#09090b',
      metalAccent: '#71717a',
      glow: 'rgba(220, 38, 38, 0.45)',
      sigilText: 'V I R T U S • S I L E N T I U M'
    },
    void: {
      gemPrimary: '#9333ea',
      gemSecondary: '#4c1d95',
      metalLight: '#52525b',
      metalDark: '#09090b',
      metalAccent: '#a1a1aa',
      glow: 'rgba(147, 51, 234, 0.45)',
      sigilText: 'C O G N I T I O • V O I D'
    },
    crimson: {
      gemPrimary: '#f43f5e',
      gemSecondary: '#881337',
      metalLight: '#78716c',
      metalDark: '#1c1917',
      metalAccent: '#b91c1c',
      glow: 'rgba(244, 63, 94, 0.5)',
      sigilText: 'A F F E C T I O • A E T E R N A'
    },
    arcane: {
      gemPrimary: '#f59e0b',
      gemSecondary: '#78350f',
      metalLight: '#65a30d',
      metalDark: '#18181b',
      metalAccent: '#d97706',
      glow: 'rgba(245, 158, 11, 0.45)',
      sigilText: 'T R I A L • S A P I E N T I A'
    },
    solar: {
      gemPrimary: '#fb923c',
      gemSecondary: '#9a3412',
      metalLight: '#ca8a04',
      metalDark: '#1c1917',
      metalAccent: '#f59e0b',
      glow: 'rgba(251, 146, 60, 0.5)',
      sigilText: 'S O L • I N V I C T U S'
    }
  };

  const theme = themeMap[type] || themeMap.obsidian;
  const isLarge = size === 'lg';

  return (
    <div className="flex flex-col items-center justify-center my-6 group select-none">
      {/* Levitating Floating Crown Container */}
      <div className="relative animate-gothic-float">
        {/* Ambient Dark Gothic Aura / Backlight */}
        <div
          className="absolute inset-0 -top-6 rounded-full blur-2xl opacity-65 transition-opacity duration-700 group-hover:opacity-95"
          style={{
            background: `radial-gradient(circle, ${theme.glow} 0%, rgba(9,9,11,0) 70%)`
          }}
        />

        {/* Realistic Gothic Crown Vector Masterpiece */}
        <div className={`relative ${isLarge ? 'w-56 sm:w-64 h-36' : 'w-40 sm:w-48 h-28'} transition-transform duration-500 group-hover:scale-105`}>
          <svg
            viewBox="0 0 400 240"
            className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
          >
            <defs>
              {/* Blackened Obsidian / Steel Metal Gradient */}
              <linearGradient id={`metalBase-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.metalLight} />
                <stop offset="25%" stopColor="#18181b" />
                <stop offset="50%" stopColor="#27272a" />
                <stop offset="75%" stopColor={theme.metalDark} />
                <stop offset="100%" stopColor={theme.metalLight} />
              </linearGradient>

              {/* Gold/Silver Gothic Filigree Edge Gradient */}
              <linearGradient id={`filigreeGrad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e4e4e7" />
                <stop offset="50%" stopColor={theme.metalAccent} />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>

              {/* Glowing Cabochon Gemstone Gradient */}
              <radialGradient id={`gemGrad-${type}`} cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor={theme.gemPrimary} />
                <stop offset="70%" stopColor={theme.gemSecondary} />
                <stop offset="100%" stopColor="#050505" />
              </radialGradient>

              {/* Dark Velvet Interior Shadow */}
              <linearGradient id={`interiorVelvet-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#110707" />
                <stop offset="100%" stopColor="#050505" />
              </linearGradient>
            </defs>

            {/* Back Arch Velvet Lining */}
            <path
              d="M 60,165 C 100,140 300,140 340,165 L 330,185 C 270,160 130,160 70,185 Z"
              fill={`url(#interiorVelvet-${type})`}
              opacity="0.8"
            />

            {/* Back Crown Spires (Depth Layer) */}
            <path
              d="M 120,160 L 150,70 L 170,155 L 200,60 L 230,155 L 250,70 L 280,160"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="2"
              opacity="0.6"
            />

            {/* Main Gothic Crown Body / Front Lancet Spires */}
            {/* Center Sower / High Spire (Lancet Gothic Arch) */}
            <path
              d="M 200,18 
                 C 192,40 182,75 175,115 
                 C 185,120 215,120 225,115 
                 C 218,75 208,40 200,18 Z"
              fill={`url(#metalBase-${type})`}
              stroke={`url(#filigreeGrad-${type})`}
              strokeWidth="2"
            />

            {/* Left High Flank Spire */}
            <path
              d="M 120,45 
                 C 118,70 115,100 110,140 
                 C 125,142 145,138 152,130 
                 C 142,95 132,65 120,45 Z"
              fill={`url(#metalBase-${type})`}
              stroke={`url(#filigreeGrad-${type})`}
              strokeWidth="2"
            />

            {/* Right High Flank Spire */}
            <path
              d="M 280,45 
                 C 268,65 258,95 248,130 
                 C 255,138 275,142 290,140 
                 C 285,100 282,70 280,45 Z"
              fill={`url(#metalBase-${type})`}
              stroke={`url(#filigreeGrad-${type})`}
              strokeWidth="2"
            />

            {/* Outer Left Edge Point */}
            <path
              d="M 50,85 
                 C 55,110 60,135 68,165 
                 C 80,162 95,155 105,148 
                 C 90,120 72,100 50,85 Z"
              fill={`url(#metalBase-${type})`}
              stroke={`url(#filigreeGrad-${type})`}
              strokeWidth="1.8"
            />

            {/* Outer Right Edge Point */}
            <path
              d="M 350,85 
                 C 328,100 310,120 295,148 
                 C 305,155 320,162 332,165 
                 C 340,135 345,110 350,85 Z"
              fill={`url(#metalBase-${type})`}
              stroke={`url(#filigreeGrad-${type})`}
              strokeWidth="1.8"
            />

            {/* Center Finial / Gothic Cross Crest */}
            <g transform="translate(200, 18)">
              {/* Top Gothic Cross Finial */}
              <path
                d="M 0,-18 L 4,-8 L 14,-8 L 6,-2 L 10,8 L 0,3 L -10,8 L -6,-2 L -14,-8 L -4,-8 Z"
                fill={theme.metalAccent}
                stroke="#09090b"
                strokeWidth="1"
              />
              <circle cx="0" cy="-6" r="3" fill={theme.gemPrimary} />
            </g>

            {/* Left and Right Spire Crests */}
            <circle cx="120" cy="45" r="4" fill={theme.metalAccent} stroke="#09090b" />
            <circle cx="280" cy="45" r="4" fill={theme.metalAccent} stroke="#09090b" />
            <circle cx="50" cy="85" r="3.5" fill={theme.metalAccent} stroke="#09090b" />
            <circle cx="350" cy="85" r="3.5" fill={theme.metalAccent} stroke="#09090b" />

            {/* Main Circlet / Runic Base Band */}
            <path
              d="M 52,165 
                 C 130,195 270,195 348,165 
                 L 352,198 
                 C 270,230 130,230 48,198 Z"
              fill={`url(#metalBase-${type})`}
              stroke={`url(#filigreeGrad-${type})`}
              strokeWidth="2.5"
            />

            {/* Lower Base Filigree Rim */}
            <path
              d="M 48,198 
                 C 130,230 270,230 352,198 
                 L 354,206 
                 C 270,238 130,238 46,206 Z"
              fill={theme.metalAccent}
              stroke="#09090b"
              strokeWidth="1.5"
            />

            {/* Studded Runic Rivets along the band */}
            {[70, 110, 150, 190, 210, 250, 290, 330].map((rx, idx) => {
              const ry = 186 + Math.sin((rx - 50) / 300 * Math.PI) * 18;
              return (
                <circle
                  key={idx}
                  cx={rx}
                  cy={ry}
                  r="3"
                  fill="#71717a"
                  stroke="#09090b"
                  strokeWidth="1"
                />
              );
            })}

            {/* Inlaid Glowing Gothic Gemstones */}
            {/* Center Great Cabochon Ruby */}
            <ellipse
              cx="200"
              cy="145"
              rx="14"
              ry="20"
              fill={`url(#gemGrad-${type})`}
              stroke="#27272a"
              strokeWidth="2"
              className="animate-pulse"
              style={{ animationDuration: '2.5s' }}
            />
            {/* Gold bezel around center ruby */}
            <ellipse
              cx="200"
              cy="145"
              rx="16"
              ry="22"
              fill="none"
              stroke={theme.metalAccent}
              strokeWidth="1.5"
            />

            {/* Left Mid Gemstone */}
            <ellipse
              cx="132"
              cy="156"
              rx="9"
              ry="13"
              fill={`url(#gemGrad-${type})`}
              stroke="#18181b"
              strokeWidth="1.5"
            />

            {/* Right Mid Gemstone */}
            <ellipse
              cx="268"
              cy="156"
              rx="9"
              ry="13"
              fill={`url(#gemGrad-${type})`}
              stroke="#18181b"
              strokeWidth="1.5"
            />

            {/* Outer Left Gemstone */}
            <circle
              cx="80"
              cy="172"
              r="6.5"
              fill={`url(#gemGrad-${type})`}
              stroke="#18181b"
              strokeWidth="1"
            />

            {/* Outer Right Gemstone */}
            <circle
              cx="320"
              cy="172"
              r="6.5"
              fill={`url(#gemGrad-${type})`}
              stroke="#18181b"
              strokeWidth="1"
            />

            {/* Gothic Traceries & Interlaced Thorns */}
            <path
              d="M 180,120 C 190,105 210,105 220,120"
              fill="none"
              stroke={theme.metalAccent}
              strokeWidth="2"
            />
            <path
              d="M 170,135 C 185,125 215,125 230,135"
              fill="none"
              stroke={theme.metalAccent}
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Floating Mist / Shadow Grounding beneath crown */}
        <div className="w-32 h-3 mx-auto mt-2 bg-black/60 rounded-full blur-md" />
      </div>

      {/* Gothic Crown Proclamation Label */}
      <div className="mt-2 text-center">
        <span className="text-[11px] font-gothic tracking-[0.25em] text-zinc-400 uppercase flex items-center justify-center gap-2">
          <span className="w-4 h-[1px] bg-red-900/60" />
          {title}
          <span className="w-4 h-[1px] bg-red-900/60" />
        </span>
      </div>
    </div>
  );
};
