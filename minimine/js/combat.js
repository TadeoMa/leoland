/**
 * MINIMINE - Combat System
 * Handles melee attacks, projectiles, damage calculations.
 */

const Combat = {
    projectiles: [],

    init() {
        this.projectiles = [];
    },

    update(dt) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.lifetime -= dt;

            if (p.lifetime <= 0) {
                this.projectiles.splice(i, 1);
                continue;
            }

            // Check collision
            if (p.fromPlayer) {
                // Hit enemies
                for (const enemy of Enemies.list) {
                    if (Utils.rectCollision(
                        { x: p.x, y: p.y, width: p.size, height: p.size },
                        { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height }
                    )) {
                        Enemies.damageEnemy(enemy, p.damage);
                        this.projectiles.splice(i, 1);
                        break;
                    }
                }
            } else {
                // Hit player
                if (Utils.rectCollision(
                    { x: p.x, y: p.y, width: p.size, height: p.size },
                    Player.getRect()
                )) {
                    Player.takeDamage(p.damage);
                    this.projectiles.splice(i, 1);
                }
            }

            // Hit blocks
            const block = Utils.worldToBlock(p.x, p.y);
            if (World.isSolid(block.x, block.y)) {
                this.projectiles.splice(i, 1);
            }
        }
    },

    meleeAttack(player, toolDef, toolId) {
        const range = CONFIG.WORLD.BLOCK_SIZE * 2.5;
        const cx = player.x + player.width / 2;
        const cy = player.y + player.height / 2;

        for (const enemy of Enemies.list) {
            const ex = enemy.x + enemy.width / 2;
            const ey = enemy.y + enemy.height / 2;
            const dist = Utils.distance(cx, cy, ex, ey);

            if (dist < range) {
                // Check facing direction
                const isRight = ex > cx;
                if ((player.facingRight && isRight) || (!player.facingRight && !isRight) || dist < range * 0.5) {
                    let damage = toolDef.damage;

                    // Special damage (shovel vs sand monsters)
                    if (toolDef.specialDamage && enemy.weakTo === toolId) {
                        damage = toolDef.specialDamage;
                    }

                    // Electric damage (trident)
                    if (toolDef.electric) {
                        // Hits nearby enemies too
                        for (const other of Enemies.list) {
                            if (other !== enemy) {
                                const d2 = Utils.distance(ex, ey, other.x + other.width / 2, other.y + other.height / 2);
                                if (d2 < range) {
                                    Enemies.damageEnemy(other, Math.floor(damage / 2));
                                }
                            }
                        }
                    }

                    Enemies.damageEnemy(enemy, damage);
                }
            }
        }
    },

    shootProjectile(player, toolDef) {
        const mouseWorld = Input.getMouseWorldPos(Game.camera);
        const cx = player.x + player.width / 2;
        const cy = player.y + player.height / 2;
        const angle = Math.atan2(mouseWorld.y - cy, mouseWorld.x - cx);
        const speed = 8;

        this.projectiles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: toolDef.damage,
            size: 8,
            color: toolDef.electric ? '#00BFFF' : '#F5B041',
            fromPlayer: true,
            lifetime: 2000,
        });
    },

    enemyShoot(enemy) {
        const angle = Math.atan2(
            Player.y + Player.height / 2 - (enemy.y + enemy.height / 2),
            Player.x + Player.width / 2 - (enemy.x + enemy.width / 2)
        );
        const speed = 5;

        this.projectiles.push({
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: enemy.damage,
            size: 6,
            color: '#E74C3C',
            fromPlayer: false,
            lifetime: 3000,
        });
    },
};
