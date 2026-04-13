// ==========================================
// DINO AVENTURA - BUCLE PRINCIPAL Y CONTROL DE JUEGO
// ==========================================

// ==========================================
// GAME LOOP
// ==========================================
function gameLoop() {
    if (gameState === 'levelselect') {
        renderLevelSelectBg();
        requestAnimationFrame(gameLoop);
        return;
    }
    if (gameState !== 'playing') {
        requestAnimationFrame(gameLoop);
        return;
    }

    frameCount++;
    if (frameCount % 10 === 0) animFrame++;

    updateDino();
    updateEnemies();
    updateCoins();
    updateParticles();
    updateCamera();
    checkWin();
    render();

    requestAnimationFrame(gameLoop);
}

// ==========================================
// CONTROL DE JUEGO
// ==========================================
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('winScreen').style.display = 'none';

    try {
        const saved = localStorage.getItem('dinoUnlocked');
        if (saved) unlockedLevels = Math.max(unlockedLevels, parseInt(saved));
    } catch(e) {}

    score = 0;
    lives = 3;
    updateHUD();

    gameState = 'levelselect';
    showLevelSelect();
}

function showLevelSelect() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('winScreen').style.display = 'none';
    document.getElementById('levelSelectScreen').style.display = 'block';
    gameState = 'levelselect';

    if (!DEBUG && levelSelectCursor >= unlockedLevels) levelSelectCursor = unlockedLevels - 1;

    const grid = document.getElementById('levelGrid');
    grid.innerHTML = '';
    LEVELS.forEach((lvl, i) => {
        const selectable = DEBUG || i < unlockedLevels;
        const btn = document.createElement('button');
        btn.id = `lvlbtn-${i}`;
        btn.className = 'level-btn' + (selectable ? ' unlocked' : ' locked');
        if (i === levelSelectCursor) btn.className += ' current';
        btn.innerHTML = `<span class="lvl-num">${lvl.world}</span><span class="lvl-name">${lvl.name}</span>`;
        if (selectable) {
            btn.onclick = () => { levelSelectCursor = i; startLevel(i); };
        } else {
            btn.innerHTML += '<span class="lock-icon">🔒</span>';
        }
        grid.appendChild(btn);
    });

    renderLevelSelectBg();
}

function refreshLevelSelectCursor() {
    LEVELS.forEach((_, i) => {
        const btn = document.getElementById(`lvlbtn-${i}`);
        if (!btn) return;
        const selectable = DEBUG || i < unlockedLevels;
        btn.className = 'level-btn' + (selectable ? ' unlocked' : ' locked');
        if (i === levelSelectCursor) btn.className += ' current';
    });
}

function startLevel(levelIdx) {
    currentLevel = levelIdx;
    document.getElementById('levelSelectScreen').style.display = 'none';

    camera.x = 0;
    frameCount = 0;
    animFrame = 0;

    buildLevel(levelIdx);
    initEntities(levelIdx);
    updateHUD();
    document.getElementById('levelDisplay').textContent = `🌍 Mundo ${LEVELS[levelIdx].world}`;

    gameState = 'playing';
}

function backToMenu() {
    document.getElementById('levelSelectScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
    gameState = 'menu';
}

function goToLevelSelect() {
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('winScreen').style.display = 'none';
    score = 0;
    lives = 3;
    updateHUD();
    showLevelSelect();
}

function retryLevel() {
    startLevel(currentLevel);
}

function loseLife(reason = 'desconocido') {
    if (dino.invincible > 0) return;
    if (DEBUG) {
        debugDeathMessage = `Dino perdio una vida. Razon: ${reason}`;
        debugDeathTimer = 180;
    }
    lives--;
    playSound('die');
    updateHUD();
    if (lives <= 0) {
        gameState = 'gameover';
        document.getElementById('finalScore').textContent = `Monedas: ${score} | Mundo: ${LEVELS[currentLevel].world}`;
        document.getElementById('gameOverScreen').style.display = 'block';
    } else {
        dino.x = 3 * TILE;
        dino.y = 11 * TILE;
        dino.vx = 0;
        dino.vy = 0;
        dino.jumpCount = 0;
        dino.invincible = 180;
        camera.x = 0;
    }
}

function updateHUD() {
    document.getElementById('scoreDisplay').textContent = `🪙 Monedas: ${score}`;
    document.getElementById('livesDisplay').textContent = `❤️ Vidas: ${lives}`;
}

function setupDebugControls() {
    const debugBtn = document.getElementById('debugAddLifeBtn');
    if (!debugBtn) return;

    if (DEBUG) {
        debugBtn.style.display = 'inline-block';
        debugBtn.onclick = () => {
            lives++;
            updateHUD();
        };
    } else {
        debugBtn.style.display = 'none';
        debugBtn.onclick = null;
    }
}

// ==========================================
// INICIALIZAR
// ==========================================
setupDebugControls();
requestAnimationFrame(gameLoop);
