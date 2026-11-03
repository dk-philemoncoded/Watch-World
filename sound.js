/**
 * Web Audio API Mechanical Watch Synthesizer
 * Zero external audio files; pure procedural acoustic synthesis.
 */

class WatchSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.lastTickTime = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      this.playTick(true);
    }
    return this.enabled;
  }

  /**
   * Mechanical Escapement Tick
   * High quality dual-impulse tick-tock sound
   */
  playTick(high = false) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastTickTime < 0.05) return;
    this.lastTickTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Bandpass filter to isolate the metallic resonance of the pallet jewel
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(high ? 3400 : 2800, now);
      filter.Q.setValueAtTime(14, now);

      osc.type = "sine";
      osc.frequency.setValueAtTime(high ? 4200 : 3600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.015);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);

      // Pallet release secondary mini-click (12ms later)
      const secOsc = this.ctx.createOscillator();
      const secGain = this.ctx.createGain();
      secOsc.type = "triangle";
      secOsc.frequency.setValueAtTime(high ? 5200 : 4400, now + 0.012);
      secOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.024);

      secGain.gain.setValueAtTime(0.02, now + 0.012);
      secGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      secOsc.connect(secGain);
      secGain.connect(this.ctx.destination);

      secOsc.start(now + 0.012);
      secOsc.stop(now + 0.026);
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  }

  /**
   * Fast Winding Gear Whirl Sound
   * Played while the watch is rapidly spinning hands to the new timezone
   */
  playWindingEffect(duration = 1.2) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    try {
      // Create white noise buffer for mechanical friction
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.linearRampToValueAtTime(3200, now + duration * 0.5);
      filter.frequency.linearRampToValueAtTime(1400, now + duration);
      filter.Q.setValueAtTime(6, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Arrival Crystal Lock Chime
   */
  playArrivalChime() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    try {
      const freqs = [1046.5, 1318.5, 2093.0]; // C6, E6, C7
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        const startTime = now + idx * 0.04;
        gain.gain.setValueAtTime(0.04 / (idx + 1), startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.7);
      });
    } catch (e) {
      // Ignore
    }
  }
}

export const soundEngine = new WatchSoundEngine();
