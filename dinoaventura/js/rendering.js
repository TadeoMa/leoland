// ==========================================
// RENDERING - TODAS LAS FUNCIONES DE DIBUJO
// ==========================================

// ---- Dibujar Dino ----
function drawDino(x, y, dir, frame, tongueOut) {
    const s = TILE;
    const flip = dir === -1;
    ctx.save();
    if (flip) {
        ctx.translate(x + s, y);
        ctx.scale(-1, 1);
    } else {
        ctx.translate(x, y);
    }
    ctx.fillStyle = COLORS.dinoShoe;
    ctx.fillRect(4, s - 6, 10, 6);
    ctx.fillRect(18, s - 6, 10, 6);
    ctx.fillStyle = COLORS.dinoBody;
    ctx.beginPath();
    ctx.ellipse(s / 2, s / 2 + 2, 12, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.dinoBelly;
    ctx.beginPath();
    ctx.ellipse(s / 2, s / 2 + 5, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.dinoShell;
    ctx.beginPath();
    ctx.ellipse(s / 2 - 1, s / 2 - 2, 7, 6, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.dinoBody;
    ctx.beginPath();
    ctx.ellipse(s / 2 + 6, s / 2 - 10, 9, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.dinoBody;
    ctx.beginPath();
    ctx.ellipse(s / 2 + 14, s / 2 - 10, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.arc(s / 2 + 17, s / 2 - 11, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.dinoEye;
    ctx.beginPath();
    ctx.ellipse(s / 2 + 8, s / 2 - 14, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.dinoPupil;
    ctx.beginPath();
    ctx.arc(s / 2 + 10, s / 2 - 14, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E65100';
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(s / 2 + 1 + i * 5, s / 2 - 16);
        ctx.lineTo(s / 2 + 4 + i * 5, s / 2 - 22);
        ctx.lineTo(s / 2 + 7 + i * 5, s / 2 - 16);
        ctx.fill();
    }
    if (tongueOut) {
        ctx.fillStyle = '#E53935';
        ctx.beginPath();
        ctx.ellipse(s / 2 + 42, s / 2 - 8, 10, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(s / 2 + 16, s / 2 - 11, 28, 6);
    }
    if (frame % 2 === 0) {
        ctx.fillStyle = COLORS.dinoShoe;
        ctx.fillRect(6, s - 6, 8, 6);
        ctx.fillRect(18, s - 6, 8, 6);
    } else {
        ctx.fillStyle = COLORS.dinoShoe;
        ctx.fillRect(2, s - 6, 8, 6);
        ctx.fillRect(22, s - 6, 8, 6);
    }
    ctx.restore();
}

function drawSlime(x, y) {
    ctx.fillStyle = COLORS.slime;
    ctx.beginPath();
    ctx.ellipse(x + TILE / 2, y + 10, 14, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.slimeDark;
    ctx.fillRect(x + 4, y + 10, 24, 16);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 3, y + 24, 10, 6);
    ctx.fillRect(x + 19, y + 24, 10, 6);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x + 11, y + 9, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 21, y + 9, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(x + 13, y + 9, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 23, y + 9, 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 7, y + 4); ctx.lineTo(x + 13, y + 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 25, y + 4); ctx.lineTo(x + 19, y + 6); ctx.stroke();
    ctx.lineWidth = 1;
}

function drawTortuga(x, y, frame) {
    ctx.fillStyle = COLORS.tortuga;
    ctx.beginPath();
    ctx.ellipse(x + TILE / 2, y + 8, 12, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.tortugaDark;
    ctx.beginPath();
    ctx.ellipse(x + TILE / 2, y + 10, 10, 8, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FDD835';
    ctx.fillRect(x + 8, y + 10, 16, 14);
    ctx.fillStyle = '#FDD835';
    ctx.beginPath();
    ctx.arc(x + TILE / 2, y + 4, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x + 13, y + 2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 20, y + 2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(x + 14, y + 2, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 21, y + 2, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FF8F00';
    if (frame % 2 === 0) {
        ctx.fillRect(x + 6, y + 24, 8, 6);
        ctx.fillRect(x + 18, y + 24, 8, 6);
    } else {
        ctx.fillRect(x + 4, y + 24, 8, 6);
        ctx.fillRect(x + 20, y + 24, 8, 6);
    }
}

// ---- Dibujar tiles ----
function drawGroundTile(x, y) {
    const lvl = LEVELS[currentLevel];
    ctx.fillStyle = lvl.groundColor;
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = lvl.groundTop;
    if (y === 13 * TILE || !isSolid(getTile(x, y - TILE))) {
        ctx.fillRect(x, y, TILE, 4);
    }
    ctx.strokeStyle = lvl.theme === 'underground' ? '#333' : lvl.theme === 'ice' ? '#78909C' : '#A03000';
    ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
}

function drawBrickTile(x, y) {
    ctx.fillStyle = COLORS.brick;
    ctx.fillRect(x, y, TILE, TILE);
    ctx.strokeStyle = COLORS.brickLine;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, TILE, TILE);
    ctx.beginPath();
    ctx.moveTo(x, y + TILE / 2);
    ctx.lineTo(x + TILE, y + TILE / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + TILE / 2, y);
    ctx.lineTo(x + TILE / 2, y + TILE / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + TILE / 4, y + TILE / 2);
    ctx.lineTo(x + TILE / 4, y + TILE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 3 * TILE / 4, y + TILE / 2);
    ctx.lineTo(x + 3 * TILE / 4, y + TILE);
    ctx.stroke();
}

function drawQuestionTile(x, y, key) {
    const active = questionBoxes.has(key);
    ctx.fillStyle = active ? COLORS.question : '#888';
    ctx.fillRect(x, y, TILE, TILE);
    ctx.strokeStyle = active ? '#FF8F00' : '#555';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
    if (active) {
        ctx.fillStyle = COLORS.questionMark;
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', x + TILE / 2, y + TILE / 2 + 1);
    }
    ctx.lineWidth = 1;
}

function drawPipeTop(x, y) {
    ctx.fillStyle = COLORS.pipe;
    ctx.fillRect(x - 2, y, TILE + 4, TILE);
    ctx.fillStyle = COLORS.pipeDark;
    ctx.fillRect(x - 2, y, 4, TILE);
    ctx.fillStyle = '#e0a650';
    ctx.fillRect(x + 4, y + 2, TILE - 4, TILE - 4);
    ctx.strokeStyle = '#502800';
    ctx.strokeRect(x - 2, y, TILE + 4, TILE);
}

function drawPipeBody(x, y) {
    ctx.fillStyle = COLORS.pipe;
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = COLORS.pipeDark;
    ctx.fillRect(x, y, 4, TILE);
    ctx.fillStyle = '#df7e10';
    ctx.fillRect(x + 6, y, TILE - 10, TILE);
}

function drawFlagPole(x, y) {
    ctx.fillStyle = COLORS.flagPole;
    ctx.fillRect(x + 14, y, 4, TILE);
    if (y === 5 * TILE) {
        ctx.fillStyle = COLORS.flag;
        ctx.beginPath();
        ctx.moveTo(x + 14, y);
        ctx.lineTo(x - 14, y + 16);
        ctx.lineTo(x + 14, y + 32);
        ctx.fill();
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + 16, y - 4, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawCoin(x, y) {
    const stretch = Math.abs(Math.sin(frameCount * 0.1));
    ctx.fillStyle = COLORS.coin;
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 8, 6 * stretch + 2, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.coinShine;
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 6, 2 * stretch, 3, 0, 0, Math.PI * 2);
    ctx.fill();
}

// ---- Fondo ----
function drawBackground() {
    const lvl = LEVELS[currentLevel];
    const theme = lvl.theme;
    if (theme !== 'underground' && theme !== 'lava' && theme !== 'castle') {
        const clouds = [[200, 50, 1.2], [600, 70, 0.8], [1200, 40, 1.0], [1800, 80, 1.3], [2400, 50, 0.9], [3200, 60, 1.1], [4000, 45, 1.0], [4800, 75, 0.8], [5600, 55, 1.2]];
        clouds.forEach(([cx, cy, scale]) => drawCloud(cx, cy, scale));
    }
    if (theme === 'grass' || theme === 'forest' || theme === 'desert') {
        const hillColor = theme === 'desert' ? '#D2B48C' : theme === 'forest' ? '#1B5E20' : COLORS.hill;
        const hillDark = theme === 'desert' ? '#C8A882' : theme === 'forest' ? '#0D3310' : COLORS.hillDark;
        const hills = [[100, 13 * TILE, 120, 60], [800, 13 * TILE, 180, 90], [1800, 13 * TILE, 140, 70], [3000, 13 * TILE, 160, 80], [4200, 13 * TILE, 120, 60], [5400, 13 * TILE, 180, 90]];
        hills.forEach(([hx, hy, hw, hh]) => {
            ctx.fillStyle = hillColor;
            ctx.beginPath();
            ctx.ellipse(hx, hy, hw, hh, 0, Math.PI, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = hillDark;
            ctx.beginPath();
            ctx.ellipse(hx, hy, hw * 0.6, hh * 0.5, 0, Math.PI, Math.PI * 2);
            ctx.fill();
        });
    }
    if (theme === 'grass' || theme === 'forest') {
        const bushes = [[300, 13 * TILE], [1000, 13 * TILE], [1600, 13 * TILE], [2500, 13 * TILE], [3500, 13 * TILE], [4500, 13 * TILE], [5500, 13 * TILE]];
        bushes.forEach(([bx, by]) => drawBush(bx, by));
    }
    if (theme === 'underground' || theme === 'castle' || theme === 'ice') {
        ctx.fillStyle = theme === 'ice' ? '#E0E0E0' : '#FFD700';
        for (let i = 0; i < 40; i++) {
            const sx = (i * 173 + 50) % (LEVEL_WIDTH * TILE);
            const sy = (i * 97 + 20) % (13 * TILE);
            ctx.globalAlpha = 0.2 + (i % 4) * 0.15;
            ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1;
    }
    if (theme === 'lava') {
        for (let x = 0; x < LEVEL_WIDTH * TILE; x += 64) {
            ctx.fillStyle = `rgba(255,${60 + Math.sin(frameCount * 0.05 + x * 0.01) * 40},0,0.4)`;
            ctx.fillRect(x, 13 * TILE + 20, 64, 44);
        }
    }
    if (theme === 'ice') {
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 30; i++) {
            const sx = ((i * 211 + frameCount * (1 + i % 3)) % (canvas.width + camera.x));
            const sy = ((i * 131 + frameCount * 2) % (13 * TILE));
            ctx.globalAlpha = 0.5;
            ctx.fillRect(sx, sy, 3, 3);
        }
        ctx.globalAlpha = 1;
    }
}

function drawCloud(x, y, scale) {
    ctx.fillStyle = COLORS.cloud;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
    ctx.arc(x + 25 * scale, y - 5 * scale, 25 * scale, 0, Math.PI * 2);
    ctx.arc(x + 50 * scale, y, 20 * scale, 0, Math.PI * 2);
    ctx.arc(x + 25 * scale, y + 5 * scale, 18 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
}

function drawBush(x, y) {
    ctx.fillStyle = COLORS.bush;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.arc(x + 24, y - 4, 22, 0, Math.PI * 2);
    ctx.arc(x + 48, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.bushDark;
    ctx.beginPath();
    ctx.arc(x + 24, y + 2, 14, 0, Math.PI * 2);
    ctx.fill();
}

// ---- Render principal ----
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const lvl = LEVELS[currentLevel];
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, lvl.skyTop);
    gradient.addColorStop(1, lvl.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (lvl.theme === 'lava') {
        ctx.fillStyle = 'rgba(255,100,0,0.1)';
        ctx.fillRect(0, canvas.height - 64, canvas.width, 64);
    }
    ctx.save();
    ctx.translate(-camera.x, 0);
    drawBackground();
    const startTile = Math.floor(camera.x / TILE);
    const endTile = Math.ceil((camera.x + canvas.width) / TILE) + 1;
    for (let y = 0; y < LEVEL_HEIGHT; y++) {
        for (let x = startTile; x < endTile && x < LEVEL_WIDTH; x++) {
            const tile = levelMap[y][x];
            const px = x * TILE;
            const py = y * TILE;
            switch (tile) {
                case 1: drawGroundTile(px, py); break;
                case 2: drawBrickTile(px, py); break;
                case 3: drawQuestionTile(px, py, `${y},${x}`); break;
                case 4: drawPipeBody(px, py); break;
                case 5: drawPipeTop(px, py); break;
                case 6: drawFlagPole(px, py); break;
            }
        }
    }
    if (DEBUG && DEBUG_OPTIONS.showCollisionMask) {
        for (let y = 0; y < LEVEL_HEIGHT; y++) {
            for (let x = startTile; x < endTile && x < LEVEL_WIDTH; x++) {
                const tile = levelMap[y][x];
                if (!isSolid(tile)) continue;
                const px = x * TILE;
                const py = y * TILE;
                if (tile === 4 || tile === 5) ctx.fillStyle = 'rgba(255, 152, 0, 0.35)';
                else if (tile === 1) ctx.fillStyle = 'rgba(76, 175, 80, 0.30)';
                else if (tile === 2 || tile === 3) ctx.fillStyle = 'rgba(33, 150, 243, 0.30)';
                else ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.fillRect(px, py, TILE, TILE);
                ctx.strokeStyle = 'rgba(255,255,255,0.75)';
                ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
            }
        }
    }
    coins.forEach(c => {
        if (c.collected) return;
        drawCoin(c.x, c.y);
    });
    enemies.forEach(e => {
        if (!e.alive) return;
        if (e.type === 'slime') drawSlime(e.x, e.y);
        else drawTortuga(e.x, e.y, animFrame);
    });
    particles.forEach(p => {
        if (p.type === 'coin') {
            drawCoin(p.x, p.y);
        } else if (p.type === 'brick') {
            ctx.fillStyle = COLORS.brick;
            ctx.fillRect(p.x, p.y, 8, 8);
        } else if (p.type === 'poof') {
            ctx.fillStyle = `rgba(255,255,255,${p.life / 15})`;
            const s = (15 - p.life) * 2;
            ctx.beginPath();
            ctx.arc(p.x + 16, p.y + 16, s, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    if (dino.invincible <= 0 || Math.floor(dino.invincible / 4) % 2 === 0) {
        drawDino(dino.x, dino.y, dino.dir, dino.walkFrame, dino.tongue);
    }
    ctx.restore();
    if (DEBUG && debugDeathTimer > 0) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#000';
        ctx.fillRect(12, 12, canvas.width - 24, 34);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#FFD54F';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(debugDeathMessage, 20, 29);
        ctx.restore();
        debugDeathTimer--;
    }
}

function renderLevelSelectBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 60; i++) {
        const sx = (i * 137 + 50) % canvas.width;
        const sy = (i * 89 + 30) % canvas.height;
        ctx.globalAlpha = 0.3 + (i % 5) * 0.15;
        ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1;
}
