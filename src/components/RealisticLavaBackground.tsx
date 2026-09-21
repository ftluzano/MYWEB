import React, { useEffect, useRef } from 'react';

export const RealisticLavaBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Attempt WebGL context
    const gl = (canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
      depth: false,
      stencil: false
    }) ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) return;

    // Ultra-optimized Fullscreen Quad Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Realistic Fluid Magma & Basalt Crust Fragment Shader with Domain Warping
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      varying vec2 v_uv;

      // 2D Hash
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // Value Noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      // Fractional Brownian Motion (3 octaves for high FPS, 0 delay)
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 3; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        // Fix aspect ratio distortion
        vec2 p = uv * vec2(u_resolution.x / u_resolution.y, 1.0);

        // Slow, viscous convective flow
        float t = u_time * 0.07;
        vec2 flow = vec2(sin(t * 0.4) * 0.15, -t * 0.35);

        // Domain warping for viscous fluid turbulence
        vec2 q = vec2(fbm(p * 2.2 + flow), fbm(p * 2.2 + flow + vec2(5.2, 1.3)));
        vec2 r = vec2(fbm(p * 2.2 + 3.0 * q + vec2(1.7, 9.2) + flow * 0.6),
                      fbm(p * 2.2 + 3.0 * q + vec2(8.3, 2.8) + flow * 0.6));

        float f = fbm(p * 2.2 + 3.2 * r);

        // Volcanic color palette:
        // 1. Basalt cooling crust (deep dark charcoal-obsidian)
        vec3 crust = vec3(0.035, 0.025, 0.035);
        // 2. Crust boundary (dark scorched burgundy)
        vec3 scorch = vec3(0.22, 0.03, 0.04);
        // 3. Molten magma fissure (radiant blood crimson)
        vec3 magmaRed = vec3(0.78, 0.08, 0.03);
        // 4. White-hot churning magma core (blazing orange-gold)
        vec3 magmaGold = vec3(1.0, 0.62, 0.12);
        vec3 whiteHot = vec3(1.0, 0.92, 0.6);

        // Smooth color interpolation based on heat density
        vec3 col = crust;
        
        // Magma fissures breaking through basalt crust
        float crack = smoothstep(0.42, 0.72, f);
        col = mix(col, scorch, smoothstep(0.32, 0.52, f));
        col = mix(col, magmaRed, crack);
        col = mix(col, magmaGold, smoothstep(0.68, 0.88, f));
        col = mix(col, whiteHot, smoothstep(0.88, 1.0, f));

        // Atmospheric heat pulse (breathing subterranean glow)
        float pulse = sin(u_time * 0.8) * 0.06 + 0.94;
        col *= pulse;

        // Subtle dark vignette to keep foreground content ultra-readable
        vec2 vigUv = (uv - 0.5) * 1.6;
        float vig = 1.0 - dot(vigUv, vigUv) * 0.45;
        vig = clamp(vig, 0.35, 1.0);
        col *= vig;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full-screen quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');

    // Resolution optimization: Render at 0.5x resolution for silky 60/120 FPS
    // Lava is soft, viscous, and atmospheric, so downsampling yields maximum realism
    // and eliminates all GPU and CPU overhead completely!
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      const width = Math.floor(window.innerWidth * scale);
      const height = Math.floor(window.innerHeight * scale);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let animId: number;
    let startTime = performance.now();
    let isVisible = true;

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = (time: number) => {
      if (isVisible) {
        const elapsed = (time - startTime) * 0.001;
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Hardware-accelerated GPU WebGL Lava Surface */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-80 filter contrast-125 brightness-90"
        style={{ willChange: 'transform' }}
      />

      {/* Atmospheric Magma Smoke & Heat Shimmer Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07070b]/85 via-[#07070b]/60 to-[#07070b]/90 pointer-events-none" />

      {/* Volcanic Deep Glow at Center Screen */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-r from-red-600/10 via-orange-600/15 to-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
    </div>
  );
};
