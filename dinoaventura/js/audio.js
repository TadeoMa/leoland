// ==========================================
// SONIDOS - AUDIOCTX
// ==========================================

let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playSound(type) {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.1;

        switch (type) {
            case 'jump':
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.2);
                break;
            case 'coin':
                osc.type = 'square';
                osc.frequency.setValueAtTime(988, ctx.currentTime);
                osc.frequency.setValueAtTime(1319, ctx.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.15);
                break;
            case 'stomp':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.15);
                break;
            case 'break':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
                break;
            case 'die':
                osc.type =  'sine';
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.5);
                break;
            case 'win':
                for (let i = 0; i < 3; i++) {
                    const osc2 = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc2.connect(g);
                    g.connect(ctx.destination);
                    osc2.frequency.value = 200 * (i + 2);
                    g.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2);
                    osc2.start(ctx.currentTime + i * 0.1);
                    osc2.stop(ctx.currentTime + i * 0.1 + 0.2);
                }
                return;
        }
    } catch(e) {
        // Sin audio = sin problemas
    }
}
