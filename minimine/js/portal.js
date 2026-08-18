/**
 * MINIMINE - Portal & Boss System
 * Teleports player to a hell-themed boss arena.
 */

const Portal = {
    isOpen: false,
    bossDefeated: false,
    bossActive: false,
    portalScreenShown: false,
    inBossArena: false,
    treasureCollected: false,
    returnPortalActive: false,
    fireworks: [],
    fireworkTimer: 0,
    fireworksActive: false,
    treasurePosition: null,
    returnPortalPosition: null,
    savedPlayerPos: null,
    lavaParticles: [],

    init() {
        this.isOpen = false;
        this.bossDefeated = false;
        this.bossActive = false;
        this.portalScreenShown = false;
        this.inBossArena = false;
        this.treasureCollected = false;
        this.returnPortalActive = false;
        this.fireworks = [];
        this.fireworkTimer = 0;
        this.fireworksActive = false;
        this.treasurePosition = null;
        this.returnPortalPosition = null;
        this.savedPlayerPos = null;
        this.lavaParticles = [];
    },

    checkKills() {
        if (this.isOpen || this.bossDefeated) return;

        if (Player.killCount >= CONFIG.PORTAL.KILLS_TO_OPEN) {
            this.openPortal();
        }
    },

    openPortal() {
        this.isOpen = true;
        this.portalScreenShown = false;
        World.openPortal();
        Game.showPortalNotification();
    },

    enterPortal() {
        if (!this.isOpen || this.bossActive || this.inBossArena) return;

        // Save current world state and player position
        this.savedPlayerPos = { x: Player.x, y: Player.y };
        World.saveWorldState();

        // Generate boss arena
        World.generateBossArena();
        this.inBossArena = true;
        this.bossActive = true;
        this.portalScreenShown = false;

        // Position player at arena entrance
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        Player.x = 75 * bs;
        Player.y = 38 * bs;
        Player.vx = 0;
        Player.vy = 0;

        // Clear regular enemies and spawn boss
        Enemies.list = [];
        this._spawnBossInArena();

        // Set return portal position (at entrance)
        this.returnPortalPosition = {
            x: 73 * bs,
            y: 36 * bs,
            width: bs * 2,
            height: bs * 3,
        };

        AudioManager.playMusic('boss');
    },

    _spawnBossInArena() {
        const def = CONFIG.ENEMIES.TYPES.boss;
        const bs = CONFIG.WORLD.BLOCK_SIZE;

        Enemies.list.push({
            id: 'boss',
            x: 100 * bs,
            y: 36 * bs,
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

    onBossDefeated() {
        this.bossDefeated = true;
        this.bossActive = false;

        // Start fireworks celebration
        this.fireworksActive = true;
        this.fireworkTimer = 0;

        // Place treasure at boss location
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        this.treasurePosition = {
            x: 100 * bs,
            y: 39 * bs,
            width: bs * 2,
            height: bs * 2,
            collected: false,
            sparkleTimer: 0,
        };

        // Show subtle victory notification
        Game.showBossDefeatedNotification();
    },

    collectTreasure() {
        if (this.treasureCollected) return;
        this.treasureCollected = true;
        this.treasurePosition.collected = true;

        // Give rewards
        Player.money += CONFIG.PORTAL.BOSS_REWARD_MONEY;
        Player.diamonds += CONFIG.PORTAL.BOSS_REWARD_DIAMONDS;
        Player.emeralds += CONFIG.PORTAL.BOSS_REWARD_EMERALDS;

        // Activate return portal
        this.returnPortalActive = true;

        Game.showTreasureCollectedNotification();
    },

    returnToNormalWorld() {
        if (!this.inBossArena) return;

        // Restore the normal world
        World.restoreWorldState();
        this.inBossArena = false;
        this.fireworksActive = false;
        this.fireworks = [];
        this.returnPortalActive = false;
        this.returnPortalPosition = null;
        this.treasurePosition = null;

        // Restore player to saved position near the original portal
        if (this.savedPlayerPos) {
            Player.x = this.savedPlayerPos.x;
            Player.y = this.savedPlayerPos.y;
        }
        Player.vx = 0;
        Player.vy = 0;

        // Remove the portal from the normal world
        World.portalPosition = null;

        AudioManager.playMusic(DayNight.isNight() ? 'night' : 'day');
    },

    update() {
        if (this.inBossArena) {
            this._updateArena();
            return;
        }

        // Normal world: check if player is near the portal
        if (this.isOpen && !this.bossActive && !this.bossDefeated && !this.portalScreenShown && World.portalPosition) {
            const portalRect = {
                x: World.portalPosition.x,
                y: World.portalPosition.y,
                width: World.portalPosition.width,
                height: World.portalPosition.height,
            };
            const playerRect = Player.getRect();

            const expanded = {
                x: portalRect.x - 100,
                y: portalRect.y - 100,
                width: portalRect.width + 200,
                height: portalRect.height + 200,
            };

            if (Utils.rectCollision(playerRect, expanded)) {
                this.portalScreenShown = true;
                Game.showPortalScreen();
            }
        }
    },

    _updateArena() {
        // Check if boss is dead
        if (this.bossActive) {
            const boss = Enemies.list.find(e => e.isBoss);
            if (!boss) {
                this.onBossDefeated();
            }
        }

        // Update fireworks
        if (this.fireworksActive) {
            this._updateFireworks(16);
        }

        // Update lava particles
        this._updateLavaParticles();

        // Check treasure collection
        if (this.treasurePosition && !this.treasurePosition.collected) {
            this.treasurePosition.sparkleTimer += 16;
            const playerRect = Player.getRect();
            const treasureRect = {
                x: this.treasurePosition.x - 20,
                y: this.treasurePosition.y - 20,
                width: this.treasurePosition.width + 40,
                height: this.treasurePosition.height + 40,
            };
            if (Utils.rectCollision(playerRect, treasureRect)) {
                this.collectTreasure();
            }
        }

        // Check return portal
        if (this.returnPortalActive && this.returnPortalPosition) {
            const playerRect = Player.getRect();
            const portalRect = {
                x: this.returnPortalPosition.x - 30,
                y: this.returnPortalPosition.y - 30,
                width: this.returnPortalPosition.width + 60,
                height: this.returnPortalPosition.height + 60,
            };
            if (Utils.rectCollision(playerRect, portalRect)) {
                this.returnToNormalWorld();
            }
        }

        // Lava damage — check blocks the player body overlaps
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        const pLeft = Math.floor(Player.x / bs);
        const pRight = Math.floor((Player.x + Player.width - 1) / bs);
        const pTop = Math.floor(Player.y / bs);
        const pBottom = Math.floor((Player.y + Player.height - 1) / bs);
        let inLava = false;
        for (let bx = pLeft; bx <= pRight && !inLava; bx++) {
            for (let by = pTop; by <= pBottom && !inLava; by++) {
                if (World.getBlock(bx, by) === 'lava') inLava = true;
            }
        }
        if (inLava) {
            Player.takeDamage(1);
        }
    },

    _updateFireworks(dt) {
        this.fireworkTimer += dt;

        // Launch new fireworks periodically
        if (this.fireworkTimer % 400 < dt && this.fireworks.length < 50) {
            this._spawnFirework();
        }

        // Stop after 8 seconds
        if (this.fireworkTimer > 8000) {
            this.fireworksActive = false;
        }

        // Update particles
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const f = this.fireworks[i];
            f.x += f.vx;
            f.y += f.vy;
            f.vy += f.gravity;
            f.life -= dt;
            f.alpha = Math.max(0, f.life / f.maxLife);

            if (f.life <= 0) {
                // If rocket, explode into particles
                if (f.type === 'rocket') {
                    this._explodeFirework(f.x, f.y, f.color);
                }
                this.fireworks.splice(i, 1);
            }
        }
    },

    _spawnFirework() {
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        const colors = ['#FF0000', '#00FF00', '#0066FF', '#FFD700', '#FF69B4', '#00FFFF', '#FF4500', '#ADFF2F'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const x = (85 + Math.random() * 30) * bs;
        const y = 42 * bs;

        this.fireworks.push({
            x: x,
            y: y,
            vx: Utils.randomFloat(-1, 1),
            vy: Utils.randomFloat(-8, -5),
            gravity: 0.04,
            life: 700 + Math.random() * 400,
            maxLife: 1100,
            alpha: 1,
            size: 4,
            color: color,
            type: 'rocket',
        });
    },

    _explodeFirework(x, y, baseColor) {
        const count = 20 + Math.floor(Math.random() * 15);
        const colors = [baseColor, '#FFFFFF', '#FFD700'];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Utils.randomFloat(-0.2, 0.2);
            const speed = Utils.randomFloat(1.5, 4);
            this.fireworks.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 0.06,
                life: 600 + Math.random() * 400,
                maxLife: 1000,
                alpha: 1,
                size: Utils.randomFloat(2, 4),
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'spark',
            });
        }
    },

    _updateLavaParticles() {
        // Spawn lava bubbles
        if (Math.random() < 0.15) {
            const bs = CONFIG.WORLD.BLOCK_SIZE;
            const x = (72 + Math.random() * 56) * bs;
            const y = (43 + Math.random() * 3) * bs;
            this.lavaParticles.push({
                x: x,
                y: y,
                vy: Utils.randomFloat(-1.5, -0.3),
                life: 500 + Math.random() * 500,
                maxLife: 1000,
                size: Utils.randomFloat(2, 6),
                color: Math.random() < 0.5 ? '#FF6600' : '#FF4400',
            });
        }

        for (let i = this.lavaParticles.length - 1; i >= 0; i--) {
            const p = this.lavaParticles[i];
            p.y += p.vy;
            p.x += Utils.randomFloat(-0.5, 0.5);
            p.life -= 16;
            if (p.life <= 0) {
                this.lavaParticles.splice(i, 1);
            }
        }
    },

    toSaveData() {
        return {
            isOpen: this.isOpen,
            bossDefeated: this.bossDefeated,
            killCount: Player.killCount,
        };
    },

    fromSaveData(data) {
        this.isOpen = data.isOpen || false;
        this.bossDefeated = data.bossDefeated || false;
        if (data.killCount !== undefined) Player.killCount = data.killCount;
    },
};
