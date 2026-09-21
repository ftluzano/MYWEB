import React, { useEffect, useRef } from 'react';
import { gothicAudio } from '../utils/audioEngine';

interface RockShard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  size: number;
  opacity: number;
  shapePoints: [number, number][];
  lightFaceColor: string;
  darkFaceColor: string;
  isSpark: boolean;
  gravity: number;
  bounceCount: number;
}

interface CrackBranch {
  points: { x: number; y: number }[];
  width: number;
}

interface ImpactCrater {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  branches: CrackBranch[];
  dustPuffs: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[];
}

export const RockShatterEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shardsRef = useRef<RockShard[]>([]);
  const cratersRef = useRef<ImpactCrater[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate realistic multi-faceted 3D rock polygon coordinates
    const createRockGeometry = (size: number): [number, number][] => {
      const vertices: [number, number][] = [];
      const numPoints = Math.floor(Math.random() * 3) + 5; // 5 to 7 vertices
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const rad = size * (0.65 + Math.random() * 0.7);
        vertices.push([Math.cos(angle) * rad, Math.sin(angle) * rad]);
      }
      return vertices;
    };

    // Generate realistic fractal fracture branches radiating from impact
    const createFractures = (originX: number, originY: number): CrackBranch[] => {
      const branches: CrackBranch[] = [];
      const numBranches = Math.floor(Math.random() * 4) + 7; // 7 to 10 major fissure cracks

      for (let i = 0; i < numBranches; i++) {
        const baseAngle = (i / numBranches) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
        const length = Math.random() * 35 + 25; // 25px - 60px fissure radius
        const steps = Math.floor(Math.random() * 3) + 3; // 3 to 5 jagged steps
        const points: { x: number; y: number }[] = [{ x: originX, y: originY }];

        let curX = originX;
        let curY = originY;
        let curAngle = baseAngle;

        for (let s = 1; s <= steps; s++) {
          const stepDist = (length / steps) * (0.8 + Math.random() * 0.4);
          curAngle += (Math.random() - 0.5) * 0.6; // jagged zig-zag
          curX += Math.cos(curAngle) * stepDist;
          curY += Math.sin(curAngle) * stepDist;
          points.push({ x: curX, y: curY });
        }

        branches.push({
          points,
          width: Math.random() * 1.5 + 1.2
        });
      }
      return branches;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // 1. Play visceral acoustic stone smash sound
      gothicAudio.playRockShatter();

      // 2. Spawn realistic impact crater with fractured ground cracks & stone dust puffs
      const dustPuffs: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];
      for (let d = 0; d < 12; d++) {
        const dustAngle = Math.random() * Math.PI * 2;
        const dustSpeed = Math.random() * 2.8 + 0.8;
        dustPuffs.push({
          x,
          y,
          vx: Math.cos(dustAngle) * dustSpeed,
          vy: Math.sin(dustAngle) * dustSpeed - 0.6,
          radius: Math.random() * 10 + 6,
          alpha: 0.65
        });
      }

      cratersRef.current.push({
        x,
        y,
        radius: 3,
        maxRadius: Math.random() * 20 + 35,
        alpha: 1.0,
        branches: createFractures(x, y),
        dustPuffs
      });

      // 4. Spawn 3D polygonal rock shards with realistic physics
      const shardCount = Math.floor(Math.random() * 8) + 18; // 18 to 26 realistic stones
      const stonePalettes = [
        { light: '#44403c', dark: '#1c1917' }, // Basalt obsidian
        { light: '#57534e', dark: '#292524' }, // Granite grey
        { light: '#78716c', dark: '#1e1b18' }, // Slate stone
        { light: '#991b1b', dark: '#450a0a' }, // Molten blood stone
        { light: '#b91c1c', dark: '#2d0606' }, // Brimstone core
      ];

      for (let i = 0; i < shardCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 9 + 4; // explosive kinetic burst
        const isSpark = i % 4 === 0;
        const palette = stonePalettes[Math.floor(Math.random() * stonePalettes.length)];
        const size = isSpark ? Math.random() * 2.5 + 1.5 : Math.random() * 8 + 3.5;

        shardsRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 5 + 3.5), // high upward launch
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.45,
          size,
          opacity: 1,
          shapePoints: createRockGeometry(size),
          lightFaceColor: isSpark ? '#fef08a' : palette.light,
          darkFaceColor: isSpark ? '#ea580c' : palette.dark,
          isSpark,
          gravity: isSpark ? 0.22 : 0.42,
          bounceCount: 0
        });
      }
    };

    window.addEventListener('pointerdown', handleMouseDown, { passive: true });

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // =========================================================================
      // 1. Render Ground Fractures, Molten Fissures, and Pulverized Stone Dust
      // =========================================================================
      const craters = cratersRef.current;
      for (let i = craters.length - 1; i >= 0; i--) {
        const c = craters[i];
        c.alpha -= 0.016; // gradual cool down

        if (c.alpha <= 0) {
          craters.splice(i, 1);
          continue;
        }

        // Draw Expanding Dust Smoke Cloud
        for (let d = 0; d < c.dustPuffs.length; d++) {
          const puff = c.dustPuffs[d];
          puff.x += puff.vx;
          puff.y += puff.vy;
          puff.vx *= 0.94;
          puff.vy *= 0.94;
          puff.radius += 0.35;
          puff.alpha = c.alpha * 0.45;

          const dustGrad = ctx.createRadialGradient(puff.x, puff.y, 0, puff.x, puff.y, puff.radius);
          dustGrad.addColorStop(0, `rgba(120, 113, 108, ${puff.alpha})`);
          dustGrad.addColorStop(0.6, `rgba(68, 64, 60, ${puff.alpha * 0.6})`);
          dustGrad.addColorStop(1, 'rgba(28, 25, 23, 0)');

          ctx.fillStyle = dustGrad;
          ctx.beginPath();
          ctx.arc(puff.x, puff.y, puff.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Jagged Impact Fracture Lines
        ctx.save();
        for (const branch of c.branches) {
          if (branch.points.length < 2) continue;

          // Outer fiery fissure glow
          ctx.strokeStyle = `rgba(239, 68, 68, ${c.alpha * 0.8})`;
          ctx.lineWidth = branch.width * 1.8;
          ctx.shadowColor = '#dc2626';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(branch.points[0].x, branch.points[0].y);
          for (let p = 1; p < branch.points.length; p++) {
            ctx.lineTo(branch.points[p].x, branch.points[p].y);
          }
          ctx.stroke();

          // Inner sharp basalt crack
          ctx.strokeStyle = `rgba(20, 20, 24, ${c.alpha * 0.95})`;
          ctx.lineWidth = Math.max(1, branch.width * 0.7);
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.moveTo(branch.points[0].x, branch.points[0].y);
          for (let p = 1; p < branch.points.length; p++) {
            ctx.lineTo(branch.points[p].x, branch.points[p].y);
          }
          ctx.stroke();
        }

        // Center Impact Crater Core
        const coreGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 14);
        coreGrad.addColorStop(0, `rgba(255, 200, 100, ${c.alpha * 0.9})`);
        coreGrad.addColorStop(0.4, `rgba(220, 38, 38, ${c.alpha * 0.7})`);
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // =========================================================================
      // 2. Render 3D Tumbling Polygonal Stone Shards with Shading & Sparks
      // =========================================================================
      const shards = shardsRef.current;
      for (let i = shards.length - 1; i >= 0; i--) {
        const s = shards[i];

        // Ballistic physics
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity; // downward gravity
        s.vx *= 0.985; // air resistance
        s.rotation += s.vRot;
        s.opacity -= 0.015;

        // Ground bounce simulation
        if (s.y > canvas.height - 20 && s.bounceCount < 2) {
          s.y = canvas.height - 20;
          s.vy = -s.vy * 0.45; // bounce restitution
          s.vx *= 0.7;
          s.vRot *= 0.6;
          s.bounceCount++;
        }

        if (s.opacity <= 0 || s.y > canvas.height + 60) {
          shards.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = Math.max(0, s.opacity);

        if (s.isSpark) {
          // Fiery molten spark chip
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 10;
          ctx.fillStyle = s.lightFaceColor;
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Multi-faceted 3D Chiseled Stone Shard
          const pts = s.shapePoints;
          if (pts.length >= 3) {
            // Shadow facet
            ctx.fillStyle = s.darkFaceColor;
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let p = 1; p < pts.length; p++) {
              ctx.lineTo(pts[p][0], pts[p][1]);
            }
            ctx.closePath();
            ctx.fill();

            // Highlight beveled edge
            ctx.fillStyle = s.lightFaceColor;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(pts[0][0], pts[0][1]);
            ctx.lineTo(pts[1][0], pts[1][1]);
            ctx.closePath();
            ctx.fill();

            // Crisp chiseled perimeter stroke
            ctx.strokeStyle = '#09090b';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      // Keep capacity bounded
      if (shards.length > 220) {
        shards.splice(0, shards.length - 220);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handleMouseDown);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9990]"
      style={{ pointerEvents: 'none' }}
    />
  );
};
