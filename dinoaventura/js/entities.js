// ==========================================
// ENTIDADES: DINO, ENEMIGOS, MONEDAS, PARTÍCULAS
// ==========================================

function initEntities(levelIdx) {
    dino = {
        x: 3 * TILE, y: 11 * TILE,
        w: TILE, h: TILE,
        vx: 0, vy: 0,
        dir: 1,
        onGround: false,
        jumpCount: 0,
        walkFrame: 0,
        walkTimer: 0,
        tongue: false,
        tongueTimer: 0,
        invincible: 0,
    };

    enemies = generateEnemies(levelIdx);
    coins = [];
    questionBoxes = new Set();

    // Escanear el mapa buscando bloques ?
    for (let y = 0; y < LEVEL_HEIGHT; y++) {
        for (let x = 0; x < LEVEL_WIDTH; x++) {
            if (levelMap[y][x] === 3) questionBoxes.add(`${y},${x}`);
        }
    }

    // Monedas flotantes generadas proceduralmente
    const coinSpacing = 15 + Math.floor(Math.random() * 5);
    for (let i = coinSpacing; i < LEVEL_WIDTH - 15; i += coinSpacing + Math.floor(Math.random() * 10)) {
        const cy = 6 + Math.floor(Math.random() * 4);
        if (levelMap[cy] && levelMap[cy][i] === 0 && levelMap[cy][i+1] === 0 && levelMap[cy][i+2] === 0) {
            coins.push({ x: i * TILE + 8, y: cy * TILE + 8, w: 16, h: 16, collected: false });
            coins.push({ x: (i+1) * TILE + 8, y: cy * TILE + 8, w: 16, h: 16, collected: false });
            coins.push({ x: (i+2) * TILE + 8, y: cy * TILE + 8, w: 16, h: 16, collected: false });
        }
    }

    particles = [];
}

function generateEnemies(levelIdx) {
    if (DEBUG && DEBUG_OPTIONS.disableEnemies) return [];

    const lvl = LEVELS[levelIdx];
    const result = [];
    const baseCount = 4 + levelIdx * 1;
    const spacing = Math.floor((lvl.width - 30) / baseCount);

    for (let i = 0; i < baseCount; i++) {
        const x = 15 + i * spacing + Math.floor(Math.random() * (spacing / 2));
        if (x >= lvl.width - 10) continue;
        if (levelMap[13] && levelMap[13][x] === 0) continue;

        const isTortuga = Math.random() < 0.2 + levelIdx * 0.02;
        const enemyY = (isTortuga ? 11 : 12) * TILE;
        result.push({
            type: isTortuga ? 'tortuga' : 'slime',
            x: x * TILE,
            y: enemyY,
            vx: -0.6 - (levelIdx * 0.05),
            baseY: enemyY,
            vy: isTortuga ? 0.45 : 0,
            alive: true,
        });
    }
    return result;
}

// ---- Actualizar enemigos ----
function updateEnemies() {
    const getGroundYAt = (px, startY) => {
        const tx = Math.floor(px / TILE);
        let ty = Math.max(0, Math.floor((startY + TILE) / TILE));
        while (ty < LEVEL_HEIGHT) {
            if (levelMap[ty] && isSolid(levelMap[ty][tx])) return ty * TILE;
            ty++;
        }
        return 13 * TILE;
    };

    enemies.forEach(e => {
        if (!e.alive) return;

        if (e.type === 'tortuga') {
            const groundY = getGroundYAt(e.x + TILE / 2, e.y);
            const bottomY = groundY - TILE;
            const topY = bottomY - TILE;
            e.y += e.vy;
            if (e.y <= topY || e.y >= bottomY) {
                e.vy *= -1;
                e.y = Math.max(topY, Math.min(e.y, bottomY));
            }
        }

        if (Math.abs(e.x - dino.x) > 600) return;

        e.x += e.vx;

        const nextX = e.vx > 0 ? e.x + TILE : e.x;
        const feetY = e.y + TILE;
        if (isSolid(getTile(nextX, feetY - 4))) {
            e.vx *= -1;
        }
        const groundProbeY = e.type === 'tortuga' ? feetY + TILE : feetY + 2;
        if (!isSolid(getTile(e.x + TILE / 2, groundProbeY))) {
            e.vx *= -1;
        }

        // Colisión con Dino
        if (dino.invincible <= 0) {
            const dx = (dino.x + dino.w / 2) - (e.x + TILE / 2);
            const dy = (dino.y + dino.h / 2) - (e.y + TILE / 2);
            if (Math.abs(dx) < TILE * 0.7 && Math.abs(dy) < TILE * 0.7) {
                loseLife(`Colisión con ${e.type}`);
            }
        }

        // Lengua de Dino mata enemigos
        if (dino.tongue && dino.tongueTimer > 0) {
            const tongueX = dino.dir === 1 ? dino.x + TILE : dino.x - 48;
            const tongueW = 64;
            if (tongueX < e.x + TILE && tongueX + tongueW > e.x &&
                dino.y - 8 < e.y + TILE && dino.y + 16 > e.y) {
                e.alive = false;
                score += 30;
                playSound('stomp');
                particles.push({ x: e.x, y: e.y, life: 15, type: 'poof' });
                updateHUD();
            }
        }
    });
}

// ---- Actualizar monedas ----
function updateCoins() {
    coins.forEach(c => {
        if (c.collected) return;
        if (Math.abs(dino.x - c.x) < 24 && Math.abs(dino.y - c.y) < 24) {
            c.collected = true;
            score += 10;
            playSound('coin');
            updateHUD();
        }
    });
}

// ---- Actualizar partículas ----
function updateParticles() {
    particles.forEach(p => {
        p.life--;
        if (p.type === 'coin') {
            p.y += p.vy;
            p.vy += 0.3;
        } else if (p.type === 'brick') {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.4;
        }
    });
    particles = particles.filter(p => p.life > 0);
}

// ---- Cámara ----
function updateCamera() {
    const target = dino.x - canvas.width / 3;
    camera.x = Math.max(0, Math.min(target, LEVEL_WIDTH * TILE - canvas.width));
}

// ---- Meta / Bandera ----
function checkWin() {
    const tx = Math.floor((dino.x + dino.w / 2) / TILE);
    for (let y = 5; y <= 12; y++) {
        if (tx >= 0 && tx < LEVEL_WIDTH && levelMap[y][tx] === 6) {
            if (currentLevel === 9) {
                gameState = 'win';
                document.getElementById('winScore').textContent = `Monedas: ${score} | Nivel Final completado`;
                document.getElementById('winScreen').style.display = 'block';
            } else {
                currentLevel++;
                if (currentLevel >= unlockedLevels) {
                    unlockedLevels = currentLevel + 1;
                    try { localStorage.setItem('dinoUnlocked', unlockedLevels); } catch(e) {}
                }
                gameState = 'levelselect';
                showLevelSelect();
            }
            return;
        }
    }
}
