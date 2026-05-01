/**
 * MINIMINE - Audio Manager
 * Generates retro sound effects and music using Web Audio API.
 * No external files needed.
 */

const AudioManager = {
    ctx: null,
    muted: false,
    volume: 0.5,
    musicGain: null,
    musicOscillators: [],
    currentMusic: null,
    initialized: false,

    init() {
        // Defer AudioContext creation until user interaction
        this.initialized = false;
    },

    _ensureContext() {
        if (this.ctx) return true;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = this.volume * 0.25;
            this.musicGain.connect(this.ctx.destination);
            this.initialized = true;
            return true;
        } catch (e) {
            return false;
        }
    },

    play(key) {
        if (this.muted) return;
        if (!this._ensureContext()) return;

        switch (key) {
            case 'SFX_HIT': this._playHit(); break;
            case 'SFX_MINE': this._playMine(); break;
            case 'SFX_DEATH': this._playDeath(); break;
            case 'SFX_PURCHASE': this._playPurchase(); break;
            case 'SFX_PORTAL': this._playPortal(); break;
            case 'SFX_MENU': this._playMenu(); break;
            case 'SFX_ATTACK': this._playAttack(); break;
            case 'SFX_DAMAGE': this._playDamage(); break;
            case 'SFX_JUMP': this._playJump(); break;
            case 'SFX_COLLECT': this._playPurchase(); break;
        }
    },

    _playTone(freq, duration, type, vol, detune) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type || 'square';
        osc.frequency.value = freq;
        if (detune) osc.detune.value = detune;
        gain.gain.value = (vol || 0.3) * this.volume;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    _playNoise(duration, vol) {
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.value = (vol || 0.15) * this.volume;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
    },

    _playHit() {
        this._playTone(200, 0.1, 'square', 0.25);
        this._playTone(150, 0.15, 'sawtooth', 0.15);
        this._playNoise(0.08, 0.1);
    },

    _playAttack() {
        this._playTone(400, 0.08, 'square', 0.2);
        this._playTone(300, 0.1, 'sawtooth', 0.15);
    },

    _playDamage() {
        this._playTone(150, 0.15, 'square', 0.3);
        this._playTone(100, 0.2, 'sawtooth', 0.2);
        this._playNoise(0.1, 0.12);
    },

    _playMine() {
        this._playTone(500, 0.06, 'square', 0.15);
        this._playTone(700, 0.04, 'square', 0.1);
        this._playNoise(0.05, 0.08);
    },

    _playDeath() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.8);
        gain.gain.setValueAtTime(0.3 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 1.0);
        this._playNoise(0.4, 0.15);
    },

    _playPurchase() {
        this._playTone(523, 0.1, 'square', 0.2);
        setTimeout(() => this._playTone(659, 0.1, 'square', 0.2), 80);
        setTimeout(() => this._playTone(784, 0.15, 'square', 0.25), 160);
    },

    _playPortal() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.5);
        gain.gain.setValueAtTime(0.2 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.6);
    },

    _playMenu() {
        this._playTone(440, 0.08, 'square', 0.15);
    },

    _playJump() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
        gain.gain.setValueAtTime(0.15 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
    },

    // ===== RETRO MUSIC =====
    playMusic(track) {
        if (this.muted) return;
        if (!this._ensureContext()) return;
        if (this.currentMusic === track) return;

        this.stopMusic();
        this.currentMusic = track;

        switch (track) {
            case 'day': this._startDayMusic(); break;
            case 'night': this._startNightMusic(); break;
            case 'boss': this._startBossMusic(); break;
        }
    },

    stopMusic() {
        for (const osc of this.musicOscillators) {
            try { osc.stop(); } catch (e) {}
        }
        this.musicOscillators = [];
        this.currentMusic = null;
    },

    _scheduleNote(freq, startTime, duration, type, vol) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type || 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime((vol || 0.12) * this.volume, startTime);
        gain.gain.setValueAtTime((vol || 0.12) * this.volume, startTime + duration * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
        this.musicOscillators.push(osc);
        return osc;
    },

    _startDayMusic() {
        // Cheerful looping melody (C major pentatonic)
        const notes = [262, 294, 330, 392, 440, 392, 330, 294, 262, 330, 392, 440, 523, 440, 392, 330];
        const bpm = 140;
        const noteLen = 60 / bpm;
        const loopDuration = notes.length * noteLen;

        const playLoop = () => {
            if (this.currentMusic !== 'day') return;
            const now = this.ctx.currentTime + 0.05;
            for (let i = 0; i < notes.length; i++) {
                this._scheduleNote(notes[i], now + i * noteLen, noteLen * 0.85, 'square', 0.08);
                // Bass (octave down, every 2 notes)
                if (i % 2 === 0) {
                    this._scheduleNote(notes[i] / 2, now + i * noteLen, noteLen * 1.8, 'triangle', 0.06);
                }
            }
            this._musicTimeout = setTimeout(playLoop, loopDuration * 1000 - 50);
        };
        playLoop();
    },

    _startNightMusic() {
        // Minor key, slower, mysterious
        const notes = [220, 262, 247, 220, 196, 220, 247, 262, 220, 196, 175, 196, 220, 247, 220, 196];
        const bpm = 90;
        const noteLen = 60 / bpm;
        const loopDuration = notes.length * noteLen;

        const playLoop = () => {
            if (this.currentMusic !== 'night') return;
            const now = this.ctx.currentTime + 0.05;
            for (let i = 0; i < notes.length; i++) {
                this._scheduleNote(notes[i], now + i * noteLen, noteLen * 0.9, 'triangle', 0.07);
                if (i % 4 === 0) {
                    this._scheduleNote(notes[i] / 2, now + i * noteLen, noteLen * 3.5, 'sine', 0.05);
                }
            }
            this._musicTimeout = setTimeout(playLoop, loopDuration * 1000 - 50);
        };
        playLoop();
    },

    _startBossMusic() {
        // Intense, fast, minor
        const notes = [165, 196, 220, 262, 247, 220, 196, 165, 196, 220, 262, 330, 294, 262, 220, 196];
        const bpm = 180;
        const noteLen = 60 / bpm;
        const loopDuration = notes.length * noteLen;

        const playLoop = () => {
            if (this.currentMusic !== 'boss') return;
            const now = this.ctx.currentTime + 0.05;
            for (let i = 0; i < notes.length; i++) {
                this._scheduleNote(notes[i], now + i * noteLen, noteLen * 0.7, 'sawtooth', 0.1);
                // Aggressive bass
                if (i % 2 === 0) {
                    this._scheduleNote(82.4, now + i * noteLen, noteLen * 1.5, 'square', 0.08);
                }
            }
            this._musicTimeout = setTimeout(playLoop, loopDuration * 1000 - 50);
        };
        playLoop();
    },

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopMusic();
        }
    },

    preloadAll() {
        this.init();
    },
};
