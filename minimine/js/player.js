/**
 * MINIMINE - Player Module
 * Handles player movement, physics, combat interactions.
 */

const Player = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    width: CONFIG.PLAYER.WIDTH,
    height: CONFIG.PLAYER.HEIGHT,
    health: CONFIG.PLAYER.MAX_HEALTH,
    maxHealth: CONFIG.PLAYER.MAX_HEALTH,
    shield: CONFIG.PLAYER.MAX_SHIELD,
    maxShield: CONFIG.PLAYER.MAX_SHIELD,
    facingRight: true,
    onGround: false,
    hasWings: CONFIG.PLAYER.HAS_WINGS,
    wingSpeed: CONFIG.PLAYER.WING_SPEED,
    regenRate: CONFIG.PLAYER.REGEN_RATE,
    lastRegenTime: 0,
    lastAttackTime: 0,
    invulnerable: false,
    invulnerableTimer: 0,
    dead: false,
    killCount: 0,
    deathCount: 0,
    money: 0,
    diamonds: 0,
    emeralds: 0,

    init() {
        const spawn = World.getSpawnPoint();
        this.x = spawn.x;
        this.y = spawn.y;
        this.vx = 0;
        this.vy = 0;
        this.health = this.maxHealth;
        this.shield = this.maxShield;
        this.facingRight = true;
        this.onGround = false;
        this.dead = false;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.lastAttackTime = 0;
        this.lastRegenTime = 0;
    },

    reset() {
        this.health = CONFIG.PLAYER.MAX_HEALTH;
        this.maxHealth = CONFIG.PLAYER.MAX_HEALTH;
        this.shield = CONFIG.PLAYER.MAX_SHIELD;
        this.maxShield = CONFIG.PLAYER.MAX_SHIELD;
        this.hasWings = false;
        this.wingSpeed = CONFIG.PLAYER.WING_SPEED;
        this.regenRate = 0;
        this.killCount = 0;
        this.money = 0;
        this.diamonds = 0;
        this.emeralds = 0;
        this.dead = false;
    },

    update(dt) {
        if (this.dead) return;

        // Invulnerability frames
        if (this.invulnerable) {
            this.invulnerableTimer -= dt;
            if (this.invulnerableTimer <= 0) {
                this.invulnerable = false;
            }
        }

        // Regeneration
        if (this.regenRate > 0) {
            const now = Utils.timestamp();
            if (now - this.lastRegenTime > 3000) {
                this.heal(this.regenRate);
                this.lastRegenTime = now;
            }
        }

        // Movement
        this.vx = 0;
        if (Input.isLeft()) {
            this.vx = -CONFIG.PLAYER.SPEED;
            this.facingRight = false;
        }
        if (Input.isRight()) {
            this.vx = CONFIG.PLAYER.SPEED;
            this.facingRight = true;
        }

        // Jump / fly
        if (Input.isJump()) {
            if (this.hasWings) {
                this.vy = this.wingSpeed;
                AudioManager.play('SFX_JUMP');
            } else if (this.onGround) {
                this.vy = CONFIG.PLAYER.JUMP_FORCE;
                this.onGround = false;
                AudioManager.play('SFX_JUMP');
            }
        }

        // Gravity
        this.vy += CONFIG.PLAYER.GRAVITY;
        this.vy = Math.min(this.vy, CONFIG.PLAYER.MAX_FALL_SPEED);

        // Apply horizontal movement with collision
        this._moveX(this.vx);
        // Apply vertical movement with collision
        this._moveY(this.vy);

        // World bounds
        const worldWidth = CONFIG.WORLD.WIDTH * CONFIG.WORLD.BLOCK_SIZE;
        this.x = Utils.clamp(this.x, 0, worldWidth - this.width);

        // Fall into void = death
        if (this.y > CONFIG.WORLD.HEIGHT * CONFIG.WORLD.BLOCK_SIZE) {
            this.die();
        }

        // Attack
        if (Input.isAttack()) {
            this.attack();
        }

        // Secondary action (interact)
        if (Input.isSecondary()) {
            this.interact();
        }
    },

    _moveX(dx) {
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        const newX = this.x + dx;
        
        // Check collision
        const left = Math.floor(newX / bs);
        const right = Math.floor((newX + this.width - 1) / bs);
        const top = Math.floor(this.y / bs);
        const bottom = Math.floor((this.y + this.height - 1) / bs);

        for (let bx = left; bx <= right; bx++) {
            for (let by = top; by <= bottom; by++) {
                if (World.isSolid(bx, by)) {
                    if (dx > 0) {
                        this.x = bx * bs - this.width;
                    } else if (dx < 0) {
                        this.x = (bx + 1) * bs;
                    }
                    return;
                }
            }
        }
        this.x = newX;
    },

    _moveY(dy) {
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        const newY = this.y + dy;

        const left = Math.floor(this.x / bs);
        const right = Math.floor((this.x + this.width - 1) / bs);
        const top = Math.floor(newY / bs);
        const bottom = Math.floor((newY + this.height - 1) / bs);

        this.onGround = false;

        for (let bx = left; bx <= right; bx++) {
            for (let by = top; by <= bottom; by++) {
                if (World.isSolid(bx, by)) {
                    if (dy > 0) {
                        this.y = by * bs - this.height;
                        this.vy = 0;
                        this.onGround = true;
                    } else if (dy < 0) {
                        this.y = (by + 1) * bs;
                        this.vy = 0;
                    }
                    return;
                }
            }
        }
        this.y = newY;
    },

    attack() {
        const now = Utils.timestamp();
        const equipped = Inventory.getEquipped();
        if (!equipped) return;

        const toolDef = CONFIG.TOOLS[equipped.id] || CONFIG.ENCHANTED[equipped.id];
        if (!toolDef) return;

        const speed = toolDef.speed || 300;
        if (now - this.lastAttackTime < speed) return;
        this.lastAttackTime = now;
        AudioManager.play('SFX_ATTACK');

        // Mining (tool hits block)
        if (toolDef.type === 'tool' || toolDef.canBreak) {
            const mouseWorld = Input.getMouseWorldPos(Game.camera);
            const block = Utils.worldToBlock(mouseWorld.x, mouseWorld.y);
            const dist = Utils.distance(
                this.x + this.width / 2, this.y + this.height / 2,
                block.x * CONFIG.WORLD.BLOCK_SIZE + CONFIG.WORLD.BLOCK_SIZE / 2,
                block.y * CONFIG.WORLD.BLOCK_SIZE + CONFIG.WORLD.BLOCK_SIZE / 2
            );

            if (dist < CONFIG.WORLD.BLOCK_SIZE * 4) {
                const broken = World.breakBlock(block.x, block.y, equipped.id);
                if (broken) {
                    this._collectResource(broken);
                }
            }
        }

        // Combat (weapon hits enemy)
        if (toolDef.damage > 0) {
            if (toolDef.ranged) {
                Combat.shootProjectile(this, toolDef);
            } else {
                Combat.meleeAttack(this, toolDef, equipped.id);
            }
        }
    },

    interact() {
        // Check for nearby villagers
        for (const villager of World.villagers) {
            const dist = Utils.distance(
                this.x + this.width / 2, this.y + this.height / 2,
                villager.x, villager.y + villager.height / 2
            );
            if (dist < CONFIG.WORLD.BLOCK_SIZE * 3) {
                Game.showVillagerDialog();
                return;
            }
        }

        // Check for portal
        if (World.portalPosition) {
            const portal = World.portalPosition;
            const dist = Utils.distance(
                this.x + this.width / 2, this.y + this.height / 2,
                portal.x + portal.width / 2, portal.y + portal.height / 2
            );
            if (dist < CONFIG.WORLD.BLOCK_SIZE * 3) {
                Game.showPortalScreen();
                return;
            }
        }
    },

    _collectResource(blockType) {
        const value = CONFIG.RESOURCE_VALUES[blockType];
        if (value !== undefined && value > 0) {
            this.money += value;
        }
        if (blockType === 'diamond') {
            this.diamonds++;
        }
        if (blockType === 'emerald') {
            this.emeralds++;
        }
        // Add to inventory
        Inventory.addItem(blockType, 1);
    },

    takeDamage(amount) {
        if (this.dead || this.invulnerable) return;

        // Shield absorbs first
        if (this.shield > 0) {
            const absorbed = Math.min(this.shield, amount);
            this.shield -= absorbed;
            amount -= absorbed;
        }

        // Remaining damages health
        if (amount > 0) {
            this.health -= amount;
        }

        // Invulnerability frames
        this.invulnerable = true;
        this.invulnerableTimer = 500;

        AudioManager.play('SFX_DAMAGE');

        if (this.health <= 0) {
            this.die();
        }
    },

    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    },

    healShield(amount) {
        this.shield = Math.min(this.shield + amount, this.maxShield);
    },

    die() {
        this.dead = true;
        this.health = 0;
        this.shield = 0;
        AudioManager.play('SFX_DEATH');
        Game.showDeathScreen();
    },

    respawn() {
        this.dead = false;
        this.health = this.maxHealth;
        this.shield = this.maxShield;
        this.invulnerable = true;
        this.invulnerableTimer = 2000;

        // Respawn at house or spawn point
        if (World.housePosition) {
            this.x = World.housePosition.x * CONFIG.WORLD.BLOCK_SIZE;
            this.y = (World.housePosition.y - 2) * CONFIG.WORLD.BLOCK_SIZE;
        } else {
            const spawn = World.getSpawnPoint();
            this.x = spawn.x;
            this.y = spawn.y;
        }

        this.vx = 0;
        this.vy = 0;

        // Lose equipped items (not stored in house)
        Inventory.onDeath();
    },

    getRect() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    },

    toSaveData() {
        return {
            x: this.x,
            y: this.y,
            health: this.health,
            maxHealth: this.maxHealth,
            shield: this.shield,
            maxShield: this.maxShield,
            hasWings: this.hasWings,
            wingSpeed: this.wingSpeed,
            regenRate: this.regenRate,
            killCount: this.killCount,
            deathCount: this.deathCount,
            money: this.money,
            diamonds: this.diamonds,
            emeralds: this.emeralds,
        };
    },

    fromSaveData(data) {
        Object.assign(this, data);
        this.dead = false;
        this.vx = 0;
        this.vy = 0;
    },
};
