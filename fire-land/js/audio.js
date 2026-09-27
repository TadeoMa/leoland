/* Sonido procedural (Web Audio API) y vibración para Fire Land. */
class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('fireland_soundEnabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('fireland_soundVolume'));
    if (isNaN(this.volume)) this.volume = 0.6;
    this.hapticEnabled = localStorage.getItem('fireland_hapticEnabled') !== 'false';
  }

  ensureContext() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  setEnabled(value) {
    this.enabled = value;
    localStorage.setItem('fireland_soundEnabled', String(value));
  }

  setHaptic(value) {
    this.hapticEnabled = value;
    localStorage.setItem('fireland_hapticEnabled', String(value));
  }

  setVolume(value) {
    this.volume = value;
    localStorage.setItem('fireland_soundVolume', String(value));
  }

  tone({ freq, duration, type = 'sine', startFreq = null, gain = 0.2 }) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;

    const now = ctx.currentTime;
    if (startFreq !== null) {
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.linearRampToValueAtTime(freq, now + duration);
    } else {
      osc.frequency.setValueAtTime(freq, now);
    }

    const peak = gain * this.volume;
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(peak, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  noise({ duration = 0.15, gain = 0.18 }) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const frames = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.value = gain * this.volume;
    src.connect(g);
    g.connect(ctx.destination);
    src.start();
  }

  shoot() {
    this.tone({ freq: 220, startFreq: 640, duration: 0.09, type: 'sawtooth', gain: 0.12 });
  }

  beam() {
    this.tone({ freq: 900, startFreq: 300, duration: 0.16, type: 'square', gain: 0.12 });
  }

  hitEnemy() {
    this.noise({ duration: 0.08, gain: 0.12 });
  }

  explosion() {
    this.noise({ duration: 0.28, gain: 0.22 });
    this.tone({ freq: 60, startFreq: 160, duration: 0.3, type: 'sine', gain: 0.2 });
  }

  playerHit() {
    this.tone({ freq: 140, startFreq: 320, duration: 0.22, type: 'sawtooth', gain: 0.25 });
    this.vibrate(120);
  }

  levelComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => this.tone({ freq, duration: 0.18, type: 'triangle', gain: 0.2 }), i * 110);
    });
    this.vibrate([60, 40, 120]);
  }

  gameOver() {
    const notes = [440, 349.23, 261.63, 196];
    notes.forEach((freq, i) => {
      setTimeout(() => this.tone({ freq, duration: 0.22, type: 'sawtooth', gain: 0.2 }), i * 130);
    });
    this.vibrate([200, 80, 200]);
  }

  unlock() {
    this.tone({ freq: 1318.5, startFreq: 659.25, duration: 0.25, type: 'triangle', gain: 0.2 });
  }

  vibrate(pattern) {
    if (!this.hapticEnabled) return;
    if (navigator.vibrate) navigator.vibrate(pattern);
  }
}
