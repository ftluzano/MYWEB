import React, { useEffect, useRef } from 'react';

interface FlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  isEmber: boolean;
}

interface DemonicCursorProps {
  enabled?: boolean;
}

export const DemonicCursor: React.FC<DemonicCursorProps> = ({ enabled = true }) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Use refs for zero-lag coordinates & physics (no React re-renders on mousemove!)
  const mouseRef = useRef({
    x: -200,
    y: -200,
    lastX: -200,
    lastY: -200,
    vx: 0,
    vy: 0,
    speed: 0,
    isDown: false,
    visible: false
  });

  const particlesRef = useRef<FlameParticle[]>([]);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    if (enabled) {
      document.documentElement.classList.add('custom-cursor-active');
    } else {
      document.documentElement.classList.remove('custom-cursor-active');
    }

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [enabled]);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch || !enabled) return;

    const m = mouseRef.current;

    // Instant zero-latency native event listeners: direct DOM transform update!
    const onMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      const dx = clientX - m.lastX;
      const dy = clientY - m.lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      m.x = clientX;
      m.y = clientY;
      m.lastX = clientX;
      m.lastY = clientY;
      m.vx = dx * 0.4;
      m.vy = dy * 0.4;
      m.speed = Math.min(speed, 30);
      m.visible = true;

      // INSTANT direct DOM transform update (0ms lag, no React re-render)
      if (cursorRef.current) {
        const tilt = Math.max(-14, Math.min(14, -dx * 0.4));
        const scale = m.isDown ? 0.92 : 1;
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) rotate(${tilt}deg) scale(${scale})`;
        cursorRef.current.style.opacity = '1';
      }

      // Fast wake flame particle creation (limited to 2 per move event to keep 120fps)
      if (particlesRef.current.length < 50) {
        particlesRef.current.push({
          x: clientX,
          y: clientY,
          vx: -dx * 0.15 + (Math.random() - 0.5) * 1.2,
          vy: -Math.random() * 2.5 - 1.2,
          life: 0,
          maxLife: 16 + Math.random() * 12,
          size: Math.random() * 6 + 4,
          isEmber: false
        });

        if (Math.random() < 0.25) {
          particlesRef.current.push({
            x: clientX + (Math.random() - 0.5) * 4,
            y: clientY + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 3 - 2,
            life: 0,
            maxLife: 24 + Math.random() * 16,
            size: Math.random() * 2 + 1,
            isEmber: true
          });
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      m.isDown = true;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(0.9)`;
      }

      // Click combustion burst (burst of 18 light particles)
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 5 + 2;
        const isEmber = i % 3 === 0;

        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 2,
          life: 0,
          maxLife: isEmber ? 28 : 18,
          size: isEmber ? 2 : 8,
          isEmber
        });
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      m.isDown = false;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(1)`;
      }
    };

    const onMouseLeave = () => {
      m.visible = false;
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    const onMouseEnter = (e: MouseEvent) => {
      m.visible = true;
      m.x = e.clientX;
      m.y = e.clientY;
      m.lastX = e.clientX;
      m.lastY = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(1)`;
        cursorRef.current.style.opacity = '1';
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [enabled]);

  // High-performance canvas animation loop for fluid fire (zero garbage collection)
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch || !enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const m = mouseRef.current;
      const particles = particlesRef.current;

      // Idle tip torch flame if mouse is stationary & visible
      if (m.visible && m.x > 0 && Math.random() < 0.6 && particles.length < 40) {
        particles.push({
          x: m.x,
          y: m.y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 2.4 - 1.2,
          life: 0,
          maxLife: 16 + Math.random() * 8,
          size: Math.random() * 5 + 3,
          isEmber: false
        });
      }

      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.1; // buoyant updraft
        p.vx *= 0.95;

        const alpha = Math.sin(progress * Math.PI) * 0.85;

        if (p.isEmber) {
          ctx.fillStyle = `rgba(255, 215, 80, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Thermodynamic flame color ramp
          let r = 255, g = 255, b = 255;
          if (progress < 0.25) {
            r = 255; g = 240; b = 180;
          } else if (progress < 0.6) {
            r = 255; g = Math.floor(160 * (1 - progress)); b = 20;
          } else {
            r = Math.floor(220 * (1 - progress)); g = 20; b = 10;
          }

          const rad = p.size * (1 - progress * 0.6);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
          grad.addColorStop(0.5, `rgba(${r}, ${Math.max(0, g - 60)}, 10, ${alpha * 0.7})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = 'source-over';

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [enabled]);

  return (
    <>
      {/* Real Hellfire Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{ pointerEvents: 'none' }}
      />

      {/* Demonic Claw Pointer with 0ms direct DOM transform */}
      <div
        ref={cursorRef}
        id="demonic-cursor"
        className="fixed top-0 left-0 pointer-events-none z-[9999] select-none opacity-0"
        style={{
          transform: 'translate3d(-200px, -200px, 0)',
          transformOrigin: '2px 2px',
          willChange: 'transform'
        }}
      >
        <div className="relative -top-[4px] -left-[4px] w-[42px] h-[48px]">
          {/* Flame Core Glow */}
          <div className="absolute -top-[3px] -left-[3px] w-[16px] h-[16px] bg-red-600/35 rounded-full blur-xs pointer-events-none" />

          {/* Cursed Demon Claw SVG */}
          <svg
            viewBox="0 0 100 115"
            className="w-full h-full filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] drop-shadow-[0_0_6px_rgba(220,38,38,0.65)]"
          >
            <defs>
              <linearGradient id="demonBoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2c2a2b" />
                <stop offset="45%" stopColor="#18171a" />
                <stop offset="100%" stopColor="#0b0a0d" />
              </linearGradient>

              <linearGradient id="talonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="35%" stopColor="#7f1d1d" />
                <stop offset="70%" stopColor="#180404" />
                <stop offset="100%" stopColor="#050507" />
              </linearGradient>

              <radialGradient id="demonEyeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#ef4444" />
                <stop offset="85%" stopColor="#7f1d1d" />
                <stop offset="100%" stopColor="#1e0505" />
              </radialGradient>
            </defs>

            {/* Skeletal Bone Cartilage */}
            <path
              d="M 68,105 
                 C 55,95 48,82 42,70 
                 C 36,60 26,46 20,32 
                 C 17,24 14,14 10,2 
                 C 14,5 18,12 24,20 
                 C 30,30 38,44 46,55 
                 C 52,48 60,42 68,44 
                 C 74,46 76,54 75,62 
                 C 82,56 90,56 94,64 
                 C 96,72 92,84 88,94 
                 C 84,102 76,108 68,105 Z"
              fill="url(#demonBoneGrad)"
              stroke="#0a0a0c"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Razor Sharp Curved Index Talon */}
            <path
              d="M 10,2 
                 C 13,8 18,18 20,32 
                 C 16,28 12,20 10,2 Z"
              fill="url(#talonGrad)"
              stroke="#450a0a"
              strokeWidth="1.5"
            />

            {/* Red Hellfire Edge on Index Talon */}
            <path
              d="M 10,2 L 14,14 L 18,25"
              stroke="#ef4444"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Spiked Skeletal Knuckles */}
            <path d="M 46,55 L 42,48 L 48,51 Z" fill="#991b1b" stroke="#050507" strokeWidth="1" />
            <path d="M 68,44 L 66,35 L 72,40 Z" fill="#991b1b" stroke="#050507" strokeWidth="1" />
            <path d="M 94,64 L 98,56 L 93,60 Z" fill="#991b1b" stroke="#050507" strokeWidth="1" />

            {/* Demonic Glowing Eye */}
            <g transform="translate(56, 68)">
              <ellipse cx="0" cy="0" rx="9" ry="6" fill="#180404" stroke="#450a0a" strokeWidth="1.5" />
              <ellipse cx="0" cy="0" rx="6" ry="4.5" fill="url(#demonEyeGrad)" />
              <ellipse cx="0" cy="0" rx="1.2" ry="4" fill="#050507" />
              <circle cx="-1.5" cy="-1.5" r="1" fill="#ffffff" />
            </g>

            {/* Cursed Crimson Sigils */}
            <path
              d="M 38,65 L 44,75 L 52,72 L 62,84"
              fill="none"
              stroke="#dc2626"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Spiked Wrist Shackles */}
            <path
              d="M 52,94 C 60,88 72,92 84,102"
              stroke="#0a0a0c"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 56,100 C 64,95 75,99 86,108"
              stroke="#7f1d1d"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
};
