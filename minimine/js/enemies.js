/**
 * MINIMINE - Enemy System
 */

const Enemies = {
    list: [],
    spawnTimer: 0,

    init() {
        this.list = [];
        this.spawnTimer = 0;
    },

    update(dt) {
        this.spawnTimer += dt;

        // No regular spawning during boss arena
        if (Portal.inBossArena) {
            // Only update existing enemies (the boss)
            for (let i = this.list.length - 1; i >= 0; i--) {
                const enemy = this.list[i];
                this._updateEnemy(enemy, dt);

                if (enemy.health <= 0) {
                    Player.money += enemy.money;
                    Player.killCount++;
                    this.list.splice(i, 1);
                }
            }
            return;
        }

        // Spawn logic
        const isNight = DayNight.isNight();
        const spawnRate = isNight ? CONFIG.ENEMIES.SPAWN_RATE_NIGHT : CONFIG.ENEMIES.SPAWN_RATE_DAY;

        if (spawnRate > 0 && this.spawnTimer >= spawnRate && this.list.length < CONFIG.ENEMIES.MAX_ENEMIES) {
            this.spawnTimer = 0;
            this._spawnEnemy();
        }

        // Cave spawning (always active underground)
        if (Player.y > CONFIG.WORLD.CAVE_START_Y * CONFIG.WORLD.BLOCK_SIZE) {
            if (this.spawnTimer >= CONFIG.ENEMIES.SPAWN_RATE_CAVE && this.list.length < CONFIG.ENEMIES.MAX_ENEMIES) {
                this._spawnCaveEnemy();
            }
        }

        // Update each enemy
        for (let i = this.list.length - 1; i >= 0; i--) {
            const enemy = this.list[i];
            this._updateEnemy(enemy, dt);

            // Remove dead enemies
            if (enemy.health <= 0) {
                Player.money += enemy.money;
                Player.killCount++;
                Portal.checkKills();
                this.list.splice(i, 1);
            }

            // Remove if too far from player
            const dist = Utils.distance(Player.x, Player.y, enemy.x, enemy.y);
            if (dist > 1500) {
                this.list.splice(i, 1);
            }
        }
    },

    _spawnEnemy() {
        const biome = World.getBiomeAt(Math.floor(Player.x / CONFIG.WORLD.BLOCK_SIZE));
        const types = Object.entries(CONFIG.ENEMIES.TYPES).filter(([_, def]) => {
            return !def.isBoss && (def.biome === 'any' || def.biome === biome);
        });

        if (types.length === 0) return;

        const [id, def] = Utils.randomChoice(types);
        const side = Math.random() < 0.5 ? -1 : 1;
        const spawnX = Player.x + side * (400 + Math.random() * 200);
        const bx = Math.floor(spawnX / CONFIG.WORLD.BLOCK_SIZE);
        const surfaceY = World.getSurfaceY(Utils.clamp(bx, 0, CONFIG.WORLD.WIDTH - 1));

        this.list.push({
            id,
            x: spawnX,
            y: (surfaceY - 2) * CONFIG.WORLD.BLOCK_SIZE,
            vx: 0,
            vy: 0,
            width: def.width,
            height: def.height,
            health: def.health,
            maxHealth: def.health,
            damage: def.damage,
            speed: def.speed,
            color: def.color,
            money: def.money,
            ranged: def.ranged || false,
            biome: def.biome,
            weakTo: def.weakTo || null,
            isBoss: false,
            attackCooldown: 0,
            direction: side > 0 ? -1 : 1,
        });
    },

    _spawnCaveEnemy() {
        const types = Object.entries(CONFIG.ENEMIES.TYPES).filter(([_, def]) => {
            return !def.isBoss && def.biome === 'caves';
        });
        if (types.length === 0) return;

        const [id, def] = Utils.randomChoice(types);
        const side = Math.random() < 0.5 ? -1 : 1;
        const spawnX = Player.x + side * (300 + Math.random() * 200);

        this.list.push({
            id,
            x: spawnX,
            y: Player.y + Utils.randomInt(-100, 100),
            vx: 0,
            vy: 0,
            width: def.width,
            height: def.height,
            health: def.health,
            maxHealth: def.health,
            damage: def.damage,
            speed: def.speed,
            color: def.color,
            money: def.money,
            ranged: def.ranged || false,
            biome: def.biome,
            weakTo: def.weakTo || null,
            isBoss: false,
            attackCooldown: 0,
            direction: side > 0 ? -1 : 1,
        });
    },

    spawnBoss() {
        const def = CONFIG.ENEMIES.TYPES.boss;
        const portal = World.portalPosition;
        if (!portal) return;

        this.list.push({
            id: 'boss',
            x: portal.x,
            y: portal.y - def.height,
            vx: 0,
            vy: 0,
            width: def.width,
            height: def.height,
            health: def.health,
            maxHealth: def.health,
            damage: def.damage,
            speed: def.speed,
            color: def.color,
            money: def.money,
            ranged: false,
            biome: 'portal',
            weakTo: null,
            isBoss: true,
            attackCooldown: 0,
            direction: -1,
        });
    },

    _updateEnemy(enemy, dt) {
        // Simple AI: move toward player
        const dx = Player.x - enemy.x;
        const dy = Player.y - enemy.y;

        enemy.direction = dx > 0 ? 1 : -1;
        enemy.vx = enemy.direction * enemy.speed;

        // Gravity
        enemy.vy += CONFIG.PLAYER.GRAVITY;
        enemy.vy = Math.min(enemy.vy, CONFIG.PLAYER.MAX_FALL_SPEED);

        // Move with collision
        this._moveEnemy(enemy);

        // Jump if hitting wall
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        const frontX = enemy.x + (enemy.direction > 0 ? enemy.width : 0);
        const frontBlock = Utils.worldToBlock(frontX + enemy.direction * 4, enemy.y + enemy.height / 2);
        if (World.isSolid(frontBlock.x, frontBlock.y)) {
            enemy.vy = -8; // Jump
        }

        // Attack player
        enemy.attackCooldown -= dt;
        if (enemy.attackCooldown <= 0) {
            const dist = Utils.distance(
                enemy.x + enemy.width / 2, enemy.y + enemy.height / 2,
                Player.x + Player.width / 2, Player.y + Player.height / 2
            );

            if (dist < bs * 2) {
                Player.takeDamage(enemy.damage);
                enemy.attackCooldown = 1000;
            } else if (enemy.ranged && dist < bs * 8) {
                Combat.enemyShoot(enemy);
                enemy.attackCooldown = 2000;
            }
        }
    },

    _moveEnemy(enemy) {
        const bs = CONFIG.WORLD.BLOCK_SIZE;

        // Horizontal
        const newX = enemy.x + enemy.vx;
        const left = Math.floor(newX / bs);
        const right = Math.floor((newX + enemy.width - 1) / bs);
        const top = Math.floor(enemy.y / bs);
        const bottom = Math.floor((enemy.y + enemy.height - 1) / bs);

        let blocked = false;
        for (let bx = left; bx <= right && !blocked; bx++) {
            for (let by = top; by <= bottom && !blocked; by++) {
                if (World.isSolid(bx, by)) {
                    blocked = true;
                }
            }
        }
        if (!blocked) enemy.x = newX;

        // Vertical
        const newY = enemy.y + enemy.vy;
        const left2 = Math.floor(enemy.x / bs);
        const right2 = Math.floor((enemy.x + enemy.width - 1) / bs);
        const top2 = Math.floor(newY / bs);
        const bottom2 = Math.floor((newY + enemy.height - 1) / bs);

        blocked = false;
        for (let bx = left2; bx <= right2 && !blocked; bx++) {
            for (let by = top2; by <= bottom2 && !blocked; by++) {
                if (World.isSolid(bx, by)) {
                    blocked = true;
                    if (enemy.vy > 0) {
                        enemy.y = by * bs - enemy.height;
                    } else {
                        enemy.y = (by + 1) * bs;
                    }
                    enemy.vy = 0;
                }
            }
        }
        if (!blocked) enemy.y = newY;
    },

    damageEnemy(enemy, amount) {
        enemy.health -= amount;
        AudioManager.play('SFX_HIT');
        // Hit particles
        if (typeof Particles !== 'undefined') {
            Particles.add(
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height / 2,
                'hit',
                enemy.color
            );
        }
    },
};
