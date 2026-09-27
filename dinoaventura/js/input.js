// ==========================================
// ENTRADA DE TECLADO
// ==========================================

const keys = {};

window.addEventListener('keydown', e => {
    keys[e.code] = true;
    e.preventDefault();

    // Pantalla de inicio
    if ((e.code === 'Enter' || e.code === 'Space') && gameState === 'menu') {
        startGame();
        return;
    }

    // Game Over
    if (e.code === 'Space' && gameState === 'gameover') {
        retryLevel();
    }
    if (e.code === 'Enter' && gameState === 'gameover') {
        goToLevelSelect();
    }

    // Selector de nivel
    if (gameState === 'levelselect') {
        const canSelectLevel = idx => DEBUG || idx < unlockedLevels;

        if (e.code === 'ArrowRight') {
            do { levelSelectCursor = (levelSelectCursor + 1) % LEVELS.length; }
            while (!canSelectLevel(levelSelectCursor));
            refreshLevelSelectCursor();
        }
        if (e.code === 'ArrowLeft') {
            do { levelSelectCursor = (levelSelectCursor - 1 + LEVELS.length) % LEVELS.length; }
            while (!canSelectLevel(levelSelectCursor));
            refreshLevelSelectCursor();
        }
        if (e.code === 'ArrowDown') {
            const next = levelSelectCursor + 5;
            if (next < LEVELS.length && canSelectLevel(next)) { levelSelectCursor = next; refreshLevelSelectCursor(); }
        }
        if (e.code === 'ArrowUp') {
            const prev = levelSelectCursor - 5;
            if (prev >= 0 && canSelectLevel(prev)) { levelSelectCursor = prev; refreshLevelSelectCursor(); }
        }
        if (e.code === 'Enter' || e.code === 'Space') {
            if (canSelectLevel(levelSelectCursor)) startLevel(levelSelectCursor);
        }
    }
});

window.addEventListener('keyup', e => { 
    keys[e.code] = false; 
    e.preventDefault(); 
});

// ==========================================
// CONTROLES TÁCTILES (móvil, tablet y ordenador táctil)
// ==========================================
// Cada botón en pantalla equivale a mantener pulsada su tecla.

const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0;
if (isTouchDevice) document.body.classList.add('touch');

function bindTouchKey(btn) {
    const code = btn.dataset.key;
    const press = e => {
        e.preventDefault();
        keys[code] = true;
        try { btn.setPointerCapture(e.pointerId); } catch (_) {}
    };
    const release = e => {
        e.preventDefault();
        keys[code] = false;
    };
    btn.addEventListener('pointerdown', press);
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('contextmenu', e => e.preventDefault());
}
document.querySelectorAll('.touch-btn').forEach(bindTouchKey);

// Los botones solo se ven mientras se está jugando un nivel.
(function syncTouchControls() {
    document.body.classList.toggle('playing', gameState === 'playing');
    if (gameState !== 'playing') {
        document.querySelectorAll('.touch-btn').forEach(b => { keys[b.dataset.key] = false; });
    }
    requestAnimationFrame(syncTouchControls);
})();
