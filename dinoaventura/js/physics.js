// ==========================================
// FÍSICA Y COLISIONES
// ==========================================

// Colisión tile
function getTile(px, py) {
    const tx = Math.floor(px / TILE);
    const ty = Math.floor(py / TILE);
    if (tx < 0 || tx >= LEVEL_WIDTH || ty < 0 || ty >= LEVEL_HEIGHT) return 0;
    return levelMap[ty][tx];
}

function isSolid(tile) {
    return tile === 1 || tile === 2 || tile === 3 || tile === 4 || tile === 5;
}

// ---- Movimiento de Dino ----
function updateDino() {
    const speed = 3;
    const jumpForce = -11;

    // Movimiento con flechas del teclado
    if (keys['ArrowRight']) {
        dino.vx = speed;
        dino.dir = 1;
    } else if (keys['ArrowLeft']) {
        dino.vx = -speed;
        dino.dir = -1;
    } else {
        dino.vx *= FRICTION;
    }

    // Flecha arriba = saltar (doble salto)
    if (keys['ArrowUp'] && !dino._jumpHeld) {
        dino._jumpHeld = true;
        if (dino.jumpCount < 2) {
            dino.vy = jumpForce;
            dino.onGround = false;
            dino.jumpCount++;
            playSound('jump');
        }
    }
    if (!keys['ArrowUp']) dino._jumpHeld = false;

    // Espacio = atacar con lengua
    if (keys['Space'] && !dino._spaceHeld) {
        dino._spaceHeld = true;
        if (dino.tongueTimer <= 0) {
            dino.tongue = true;
            dino.tongueTimer = 30;
        }
    }
    if (!keys['Space']) dino._spaceHeld = false;
    if (dino.tongueTimer > 0) {
        dino.tongueTimer--;
        if (dino.tongueTimer <= 0) dino.tongue = false;
    }

    // Gravedad
    dino.vy += GRAVITY;
    if (dino.vy > 12) dino.vy = 12;

    // Invencibilidad
    if (dino.invincible > 0) dino.invincible--;

    // Animación caminar
    if (Math.abs(dino.vx) > 0.5) {
        dino.walkTimer++;
        if (dino.walkTimer > 6) {
            dino.walkTimer = 0;
            dino.walkFrame = (dino.walkFrame + 1) % 4;
        }
    } else {
        dino.walkFrame = 0;
    }

    // Mover X y resolver colisiones
    dino.x += dino.vx;
    resolveCollisionX();

    // Mover Y y resolver colisiones
    dino.y += dino.vy;
    resolveCollisionY();

    // Caer al vacío
    if (dino.y > LEVEL_HEIGHT * TILE + 64) {
        loseLife('Caer al vacío');
    }

    // Límite izquierdo
    if (dino.x < camera.x) dino.x = camera.x;
}

function resolveCollisionX() {
    const margin = 4;
    const left = dino.x + margin;
    const right = dino.x + dino.w - margin;
    const top = dino.y + 2;
    const bottom = dino.y + dino.h - 2;

    // Comprobar 4 esquinas
    if (isSolid(getTile(right, top)) || isSolid(getTile(right, bottom))) {
        dino.x = Math.floor(right / TILE) * TILE - dino.w + margin;
        dino.vx = 0;
    }
    if (isSolid(getTile(left, top)) || isSolid(getTile(left, bottom))) {
        dino.x = Math.floor(left / TILE) * TILE + TILE - margin;
        dino.vx = 0;
    }
}

function resolveCollisionY() {
    const margin = 4;
    const left = dino.x + margin;
    const center = dino.x + dino.w / 2;
    const right = dino.x + dino.w - margin;
    const top = dino.y;
    const bottom = dino.y + dino.h;

    dino.onGround = false;

    // Piso
    const hitBottomLeft = isSolid(getTile(left, bottom));
    const hitBottomCenter = isSolid(getTile(center, bottom));
    const hitBottomRight = isSolid(getTile(right, bottom));
    if (dino.vy >= 0 && (hitBottomCenter || (hitBottomLeft && hitBottomRight))) {
        dino.y = Math.floor(bottom / TILE) * TILE - dino.h;
        dino.vy = 0;
        dino.onGround = true;
        dino.jumpCount = 0;
    }

    // Techo
    const hitTopLeft = isSolid(getTile(left, top));
    const hitTopCenter = isSolid(getTile(center, top));
    const hitTopRight = isSolid(getTile(right, top));
    if (dino.vy < 0 && (hitTopCenter || (hitTopLeft && hitTopRight))) {
        const tileY = Math.floor(top / TILE);
        const tileXL = Math.floor(left / TILE);
        const tileXR = Math.floor(right / TILE);

        dino.y = tileY * TILE + TILE;
        dino.vy = 0;

        // Golpear bloque ?
        [tileXL, tileXR].forEach(tx => {
            const key = `${tileY},${tx}`;
            if (levelMap[tileY][tx] === 3 && questionBoxes.has(key)) {
                questionBoxes.delete(key);
                score += 10;
                playSound('coin');
                particles.push({
                    x: tx * TILE + 8, y: tileY * TILE - 16,
                    vy: -5, life: 30, type: 'coin'
                });
                updateHUD();
            }
            // Romper ladrillo
            if (levelMap[tileY][tx] === 2) {
                levelMap[tileY][tx] = 0;
                playSound('break');
                for (let i = 0; i < 4; i++) {
                    particles.push({
                        x: tx * TILE + 8 + (i % 2) * 16,
                        y: tileY * TILE + Math.floor(i / 2) * 16,
                        vx: (Math.random() - 0.5) * 6,
                        vy: -Math.random() * 6 - 2,
                        life: 40, type: 'brick'
                    });
                }
            }
        });
    }
}
