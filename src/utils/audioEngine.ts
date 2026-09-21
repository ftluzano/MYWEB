// Professional Gothic & Spartan Martial Audio Engine
// Web Audio API Procedural Synthesizer
// Features:
// 1. "Sparta | Warrior Song - Beneath the Sun" - Official Theme Song (Cinematic War March, Brass Horns, Taiko Drums, Spartan Choir)
// 2. Spartan Warrior Link Click Sound (Visceral Shield Bash, Blade Slash & War Horn Chime)
// 3. Realistic Rock Shatter Impact Physics Sound
// 4. Zero external network latency, zero CORS issues, immediate responsiveness across all browsers

class SpartanAudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Theme Song States ("Sparta | Warrior Song - Beneath the Sun")
  private isThemePlaying = false;
  private themeMasterGain: GainNode | null = null;
  private themeVolume = 0.55;
  private timerId: number | null = null;
  private step = 0;
  private tempo = 90; // 90 BPM Spartan War March
  private nextNoteTime = 0;
  private trackSeconds = 0;
  private trackDuration = 198; // 3:18 anthem cycle
  private trackTimer: number | null = null;

  // Ambient / SFX Gain
  private sfxGain: GainNode | null = null;
  private lastLinkSoundTime = 0;

  // Engagement level
  private engagementScore = 30;

  // Callbacks for UI updates
  private stateChangeListeners: Array<(isPlaying: boolean) => void> = [];
  private timeChangeListeners: Array<(currentTime: number) => void> = [];

  public init() {
    if (this.isInitialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.isInitialized = true;
      this.setupRouting();
    } catch (e) {
      console.warn('Web Audio API not supported on this browser', e);
    }
  }

  private setupRouting() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Master Theme Gain
    this.themeMasterGain = this.ctx.createGain();
    this.themeMasterGain.gain.setValueAtTime(this.themeVolume, now);
    this.themeMasterGain.connect(this.ctx.destination);

    // SFX Gain
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.75, now);
    this.sfxGain.connect(this.ctx.destination);
  }

  public subscribeState(cb: (isPlaying: boolean) => void) {
    this.stateChangeListeners.push(cb);
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== cb);
    };
  }

  public subscribeTime(cb: (currentTime: number) => void) {
    this.timeChangeListeners.push(cb);
    return () => {
      this.timeChangeListeners = this.timeChangeListeners.filter(l => l !== cb);
    };
  }

  private notifyState(playing: boolean) {
    this.stateChangeListeners.forEach(cb => cb(playing));
  }

  private notifyTime(t: number) {
    this.timeChangeListeners.forEach(cb => cb(t));
  }

  // =========================================================================
  // THEME SONG: "Sparta | Warrior Song - Beneath the Sun"
  // =========================================================================

  public enableAutoplay() {
    this.init();
    if (this.ctx && this.ctx.state === 'running') {
      this.startThemeSong();
      return;
    }

    // Attempt direct autoplay immediately
    this.startThemeSong().catch(() => {});

    // In case browser policy initially suspended the context, unlock on the first micro-interaction
    const unlockEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'pointerdown', 'wheel', 'scroll'];
    const unlocker = () => {
      this.startThemeSong().catch(() => {});
      unlockEvents.forEach(evt => window.removeEventListener(evt, unlocker));
    };

    unlockEvents.forEach(evt => {
      window.addEventListener(evt, unlocker, { once: true, passive: true });
    });
  }

  public async startThemeSong() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isThemePlaying) return;

    this.isThemePlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.step = 0;

    if (this.themeMasterGain) {
      const now = this.ctx.currentTime;
      this.themeMasterGain.gain.cancelScheduledValues(now);
      this.themeMasterGain.gain.setValueAtTime(0.001, now);
      this.themeMasterGain.gain.exponentialRampToValueAtTime(this.themeVolume, now + 1.2);
    }

    this.scheduler();
    this.startTrackClock();
    this.notifyState(true);
  }

  public stopThemeSong() {
    if (!this.isThemePlaying || !this.ctx) return;

    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }

    if (this.trackTimer !== null) {
      window.clearInterval(this.trackTimer);
      this.trackTimer = null;
    }

    if (this.themeMasterGain) {
      const now = this.ctx.currentTime;
      this.themeMasterGain.gain.cancelScheduledValues(now);
      this.themeMasterGain.gain.linearRampToValueAtTime(0.001, now + 0.4);
    }

    this.isThemePlaying = false;
    this.notifyState(false);
  }

  public toggleThemeSong(): boolean {
    if (this.isThemePlaying) {
      this.stopThemeSong();
      return false;
    } else {
      this.startThemeSong();
      return true;
    }
  }

  public ensureThemePlaying() {
    if (!this.isThemePlaying) {
      this.startThemeSong();
    }
  }

  public getIsPlaying(): boolean {
    return this.isThemePlaying;
  }

  public getThemeVolume(): number {
    return this.themeVolume;
  }

  public setThemeVolume(vol: number) {
    this.themeVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.themeMasterGain) {
      this.themeMasterGain.gain.setTargetAtTime(this.themeVolume, this.ctx.currentTime, 0.08);
    }
  }

  public getTrackSeconds(): number {
    return this.trackSeconds;
  }

  public getTrackDuration(): number {
    return this.trackDuration;
  }

  private startTrackClock() {
    if (this.trackTimer !== null) clearInterval(this.trackTimer);
    this.trackTimer = window.setInterval(() => {
      if (this.isThemePlaying) {
        this.trackSeconds = (this.trackSeconds + 1) % this.trackDuration;
        this.notifyTime(this.trackSeconds);
      }
    }, 1000);
  }

  // Lookahead Scheduler for Spartan Warrior Song
  private scheduler = () => {
    if (!this.isThemePlaying || !this.ctx) return;

    const lookaheadMs = 25.0;
    const scheduleAheadTime = 0.15; // 150ms ahead

    while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
      this.scheduleSpartanBeat(this.step, this.nextNoteTime);
      this.advanceStep();
    }

    this.timerId = window.setTimeout(this.scheduler, lookaheadMs);
  };

  private advanceStep() {
    const secondsPerBeat = 60.0 / this.tempo;
    const secondsPer16th = secondsPerBeat / 4; // 16th notes
    this.nextNoteTime += secondsPer16th;
    this.step = (this.step + 1) % 64; // 4-bar loop (16 steps per bar)
  }

  // Procedural Composition of "Sparta | Warrior Song - Beneath the Sun"
  private scheduleSpartanBeat(step: number, time: number) {
    if (!this.ctx || !this.themeMasterGain) return;

    const barStep = step % 16;
    const bar = Math.floor(step / 16);

    // 1. WAR DRUMS & TAIKO (Spartan 4/4 Martial Rhythm)
    // Heavy Taiko on Beats 1 and 3 (steps 0, 8)
    if (barStep === 0 || barStep === 8) {
      this.playWarTaiko(time, 0.9);
    }
    // Secondary war toms on steps 4, 12, 14
    if (barStep === 4 || barStep === 12) {
      this.playWarTom(time, 130, 0.7);
    }
    if (barStep === 14) {
      this.playWarTom(time, 160, 0.6);
    }
    // Martial marching snare rim / anvil strike on steps 4, 12
    if (barStep === 4 || barStep === 12) {
      this.playBronzeAnvil(time, 0.5);
    }
    // Marching sixteenth ghost rolls on steps 2, 6, 10, 14
    if (barStep === 2 || barStep === 6 || barStep === 10) {
      this.playMartialGhostRoll(time, 0.25);
    }

    // 2. SPARTAN MALE CHOIR DRONE (Harmonic Vowel Drone in D Minor)
    // Play sustained low warrior choir every 8 steps
    if (barStep === 0) {
      let rootFreq = 73.42; // D2
      if (bar === 1) rootFreq = 58.27; // Bb1
      if (bar === 2) rootFreq = 65.41; // C2
      if (bar === 3) rootFreq = 73.42; // D2
      this.playSpartanChoirChord(time, rootFreq, (60 / this.tempo) * 4);
    }

    // 3. SPARTAN WAR HORN / BRASS HEROIC MELODY ("Beneath the Sun" motif)
    // Melodic notes sequence across the 64-step epic cycle:
    // D Minor Aeolian / Dorian hero progression
    const melodyMap: Record<number, number> = {
      // Bar 0: D minor theme intro
      0: 293.66,  // D4
      4: 349.23,  // F4
      8: 392.00,  // G4
      12: 440.00, // A4
      // Bar 1: Heroic elevation
      16: 440.00, // A4
      20: 523.25, // C5
      24: 440.00, // A4
      28: 392.00, // G4
      // Bar 2: Resolute descent & march
      32: 349.23, // F4
      36: 392.00, // G4
      40: 349.23, // F4
      44: 329.63, // E4
      // Bar 3: Cadence resolve back to D
      48: 293.66, // D4
      52: 329.63, // E4
      56: 349.23, // F4
      60: 293.66  // D4 (resolving down)
    };

    if (melodyMap[step] !== undefined) {
      const noteFreq = melodyMap[step];
      const duration = (60 / this.tempo);
      this.playSpartanWarHorn(time, noteFreq, duration);
    }
  }

  // --- Spartan Instrument Synthesizers ---

  // 1. Deep War Taiko
  private playWarTaiko(time: number, gainScale = 1.0) {
    if (!this.ctx || !this.themeMasterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, time);
      osc.frequency.exponentialRampToValueAtTime(36, time + 0.18);

      gain.gain.setValueAtTime(0.55 * gainScale, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.themeMasterGain);

      osc.start(time);
      osc.stop(time + 0.38);
    } catch {
      // ignore
    }
  }

  // 2. War Tom
  private playWarTom(time: number, freq = 140, gainScale = 0.5) {
    if (!this.ctx || !this.themeMasterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.45, time + 0.12);

      gain.gain.setValueAtTime(0.35 * gainScale, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

      osc.connect(gain);
      gain.connect(this.themeMasterGain);

      osc.start(time);
      osc.stop(time + 0.25);
    } catch {
      // ignore
    }
  }

  // 3. Bronze Anvil / Shield Strike Percussion
  private playBronzeAnvil(time: number, gainScale = 0.5) {
    if (!this.ctx || !this.themeMasterGain) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(840, time);
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(1380, time);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, time);
      filter.Q.setValueAtTime(6.0, time);

      gain.gain.setValueAtTime(0.22 * gainScale, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.themeMasterGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.3);
      osc2.stop(time + 0.3);
    } catch {
      // ignore
    }
  }

  // 4. Martial Snare Ghost Roll
  private playMartialGhostRoll(time: number, gainScale = 0.3) {
    if (!this.ctx || !this.themeMasterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);

      gain.gain.setValueAtTime(0.12 * gainScale, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);

      osc.connect(gain);
      gain.connect(this.themeMasterGain);

      osc.start(time);
      osc.stop(time + 0.08);
    } catch {
      // ignore
    }
  }

  // 5. Spartan Male Choir Chord
  private playSpartanChoirChord(time: number, rootFreq: number, duration: number) {
    if (!this.ctx || !this.themeMasterGain) return;
    try {
      const ctx = this.ctx;
      const notes = [rootFreq, rootFreq * 1.5, rootFreq * 2]; // Root + Fifth + Octave

      notes.forEach(f => {
        const osc = ctx.createOscillator();
        const formantFilter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, time);

        // Formant filter simulating deep male "OOH/AAH" vowel
        formantFilter.type = 'bandpass';
        formantFilter.frequency.setValueAtTime(540, time);
        formantFilter.Q.setValueAtTime(3.5, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.4);
        gain.gain.setValueAtTime(0.08, time + duration - 0.4);
        gain.gain.linearRampToValueAtTime(0.0001, time + duration);

        osc.connect(formantFilter);
        formantFilter.connect(gain);
        gain.connect(this.themeMasterGain!);

        osc.start(time);
        osc.stop(time + duration + 0.1);
      });
    } catch {
      // ignore
    }
  }

  // 6. Spartan War Horn / Brass Lead ("Beneath the Sun")
  private playSpartanWarHorn(time: number, noteFreq: number, duration: number) {
    if (!this.ctx || !this.themeMasterGain) return;
    try {
      const ctx = this.ctx;

      // Two detuned oscillators for authentic cinematic brass width
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(noteFreq, time);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(noteFreq * 1.004, time); // detuned

      // Brass envelope: sharp attack into rich harmonic body
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(noteFreq * 1.5, time);
      filter.frequency.exponentialRampToValueAtTime(noteFreq * 3.8, time + 0.08);
      filter.frequency.exponentialRampToValueAtTime(noteFreq * 2.0, time + duration);
      filter.Q.setValueAtTime(3.0, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.05);
      gain.gain.setValueAtTime(0.18, time + duration - 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + 0.2);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.themeMasterGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration + 0.25);
      osc2.stop(time + duration + 0.25);
    } catch {
      // ignore
    }
  }

  // =========================================================================
  // MANDATORY USER REQUIREMENT:
  // "make sure when users clicks the link they will hear the sound."
  // =========================================================================

  public playWarriorLinkSound() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Debounce very rapid click cascades (min 80ms)
    const nowMs = performance.now();
    if (nowMs - this.lastLinkSoundTime < 80) return;
    this.lastLinkSoundTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const dest = this.sfxGain || this.ctx.destination;

      // LAYER 1: Spartan Shield Clash (Sub-bass impact punch)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.14);

      subGain.gain.setValueAtTime(0.45 * this.themeVolume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      subOsc.connect(subGain);
      subGain.connect(dest);
      subOsc.start(now);
      subOsc.stop(now + 0.2);

      // LAYER 2: Spartan Steel Blade Slash / Gleam
      const bladeOsc = this.ctx.createOscillator();
      const bladeFilter = this.ctx.createBiquadFilter();
      const bladeGain = this.ctx.createGain();

      bladeOsc.type = 'sawtooth';
      bladeOsc.frequency.setValueAtTime(950, now);
      bladeOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.04);
      bladeOsc.frequency.exponentialRampToValueAtTime(450, now + 0.12);

      bladeFilter.type = 'bandpass';
      bladeFilter.frequency.setValueAtTime(1800, now);
      bladeFilter.Q.setValueAtTime(5.0, now);

      bladeGain.gain.setValueAtTime(0.22 * this.themeVolume, now);
      bladeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      bladeOsc.connect(bladeFilter);
      bladeFilter.connect(bladeGain);
      bladeGain.connect(dest);
      bladeOsc.start(now);
      bladeOsc.stop(now + 0.18);

      // LAYER 3: Spartan War Fanfare Staccato Chime (D4 + A4 Fifth Interval)
      [293.66, 440.00].forEach((freq, idx) => {
        const hornOsc = this.ctx!.createOscillator();
        const hornGain = this.ctx!.createGain();
        hornOsc.type = 'sawtooth';
        hornOsc.frequency.setValueAtTime(freq, now + idx * 0.02);

        hornGain.gain.setValueAtTime(0.001, now + idx * 0.02);
        hornGain.gain.linearRampToValueAtTime(0.14 * this.themeVolume, now + idx * 0.02 + 0.03);
        hornGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.02 + 0.6);

        hornOsc.connect(hornGain);
        hornGain.connect(dest);
        hornOsc.start(now + idx * 0.02);
        hornOsc.stop(now + idx * 0.02 + 0.65);
      });
    } catch (e) {
      console.warn('Error playing warrior link sound', e);
    }
  }

  // Play hyper-realistic visceral stone smash & fracture audio
  public playRockShatter() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const now = this.ctx.currentTime;
      const dest = this.sfxGain || this.ctx.destination;

      // 1. Deep Sub-Bass Impact Thud (Seismic kinetic shock)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.18);

      subGain.gain.setValueAtTime(0.48 * this.themeVolume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      subOsc.connect(subGain);
      subGain.connect(dest);
      subOsc.start(now);
      subOsc.stop(now + 0.24);

      // 2. High-Frequency Stone Snapping & Chiseled Fracture (Noise burst)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1800, now);
      bandpass.frequency.exponentialRampToValueAtTime(450, now + 0.1);
      bandpass.Q.setValueAtTime(3.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.38 * this.themeVolume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      noiseSource.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(dest);
      noiseSource.start(now);

      // 3. Tumbling Granite Boulder Debris Ricochets
      for (let i = 0; i < 4; i++) {
        const chipTime = now + 0.02 + i * 0.035 + Math.random() * 0.02;
        const chipOsc = this.ctx.createOscillator();
        const chipGain = this.ctx.createGain();
        chipOsc.type = i % 2 === 0 ? 'triangle' : 'sawtooth';
        const startF = 380 + Math.random() * 450;
        chipOsc.frequency.setValueAtTime(startF, chipTime);
        chipOsc.frequency.exponentialRampToValueAtTime(startF * 0.35, chipTime + 0.05);

        chipGain.gain.setValueAtTime(0.16 * this.themeVolume, chipTime);
        chipGain.gain.exponentialRampToValueAtTime(0.0001, chipTime + 0.06);

        chipOsc.connect(chipGain);
        chipGain.connect(dest);
        chipOsc.start(chipTime);
        chipOsc.stop(chipTime + 0.07);
      }
    } catch {
      // ignore
    }
  }

  // Play resonant gothic chime note
  public playGothicChime(noteFreq = 440) {
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(noteFreq, now);

      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.linearRampToValueAtTime(0.14 * this.themeVolume, now + 0.04);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.sfxGain || this.ctx.destination);

      chimeOsc.start(now);
      chimeOsc.stop(now + 2.5);
    } catch {
      // ignore
    }
  }

  public toggle(): boolean {
    return this.toggleThemeSong();
  }

  public setVolume(vol: number) {
    this.setThemeVolume(vol);
  }

  public updateEngagement(score: number) {
    this.engagementScore = Math.max(0, Math.min(100, score));
  }
}

export const gothicAudio = new SpartanAudioEngine();
