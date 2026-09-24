class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.6;
  private bellEnabled: boolean = true;
  private ritualSoundEnabled: boolean = true;
  private lastBellTime: number = 0;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  public setBellEnabled(enabled: boolean) {
    this.bellEnabled = enabled;
  }

  public setRitualSoundEnabled(enabled: boolean) {
    this.ritualSoundEnabled = enabled;
  }

  // Soft metallic Japanese brass bell jingle
  public playBellJingle(intensity: number = 0.5) {
    if (!this.enabled || !this.bellEnabled || this.masterVolume <= 0.01) return;
    
    const now = Date.now();
    if (now - this.lastBellTime < 80) return; // Throttle closely spaced chimes
    this.lastBellTime = now;

    this.initCtx();
    if (!this.ctx) return;

    const baseFreq = 2100 + (Math.random() - 0.5) * 120;
    const harmonics = [1, 2.76, 5.4, 8.9];
    const gains = [0.4, 0.25, 0.12, 0.05];
    const duration = 0.25 + intensity * 0.25;

    harmonics.forEach((h, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * h, this.ctx.currentTime);

      const amp = gains[idx] * this.masterVolume * Math.min(1.0, intensity);
      gainNode.gain.setValueAtTime(amp, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    });
  }

  // Auspicious pentatonic sparkle chime arpeggio for the double-click ritual
  public playRitualSparkle() {
    if (!this.enabled || !this.ritualSoundEnabled || this.masterVolume <= 0.01) return;

    this.initCtx();
    if (!this.ctx) return;

    // Pentatonic scale (C6, D6, E6, G6, A6, C7)
    const notes = [1046.5, 1174.7, 1318.5, 1568.0, 1760.0, 2093.0];
    const noteDelay = 0.065;

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + i * noteDelay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Pitch vibrato / shimmer
      osc.frequency.exponentialRampToValueAtTime(freq * 1.015, startTime + 0.35);

      const amp = 0.28 * this.masterVolume;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(amp, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  }

  // Soft grab / release tactile tap
  public playGrabTap() {
    if (!this.enabled || this.masterVolume <= 0.01) return;

    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.15 * this.masterVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }
}

export const soundEffects = new SoundEngine();
