/* Sonido procedural (Web Audio API) y vibración para Sushi Family. */
class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('sushi_soundEnabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('sushi_soundVolume'));
    if (isNaN(this.volume)) this.volume = 0.6;
    this.hapticEnabled = localStorage.getItem('sushi_hapticEnabled') !== 'false';
  }

  ensureContext() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setEnabled(value) {
    this.enabled = value;
    localStorage.setItem('sushi_soundEnabled', String(value));
  }

  setVolume(value) {
    this.volume = value;
    localStorage.setItem('sushi_soundVolume', String(value));
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

  jump() {
    this.tone({ freq: 600, duration: 0.1, type: 'sine', gain: 0.18 });
  }

  death() {
    this.tone({ freq: 400, startFreq: 800, duration: 0.15, type: 'sawtooth', gain: 0.22 });
  }

  removeObstacle() {
    this.tone({ freq: 900, startFreq: 500, duration: 0.12, type: 'triangle', gain: 0.2 });
    setTimeout(() => this.tone({ freq: 1300, duration: 0.08, type: 'triangle', gain: 0.15 }), 60);
  }

  teleport() {
    this.tone({ freq: 250, startFreq: 950, duration: 0.18, type: 'sine', gain: 0.2 });
  }

  launch() {
    this.tone({ freq: 1100, startFreq: 320, duration: 0.2, type: 'sawtooth', gain: 0.2 });
  }

  levelComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => this.tone({ freq, duration: 0.18, type: 'triangle', gain: 0.2 }), i * 110);
    });
  }

  vibrate(pattern) {
    if (!this.hapticEnabled) return;
    if (navigator.vibrate) navigator.vibrate(pattern);
  }
}
