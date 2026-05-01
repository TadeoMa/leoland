/**
 * MINIMINE - Renderer (Enhanced Graphics)
 * Features: parallax sky, clouds, detailed block textures, particles, 
 * dynamic lighting, smooth shadows, animated effects.
 */

const Particles = {
    list: [],

    add(x, y, type, color) {
        const count = type === 'mine' ? 6 : type === 'hit' ? 5 : 3;
        for (let i = 0; i < count; i++) {
            this.list.push({
                x, y,
                vx: Utils.randomFloat(-3, 3),
                vy: Utils.randomFloat(-5, -1),
                life: Utils.randomFloat(300, 800),
                maxLife: 800,
                size: Utils.randomFloat(2, 5),
                color: color || (type === 'hit' ? '#E74C3C' : type === 'mine' ? '#F5B041' : '#FFF'),
                gravity: 0.15,
            });
        }
    },

    update(dt) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const p = this.list[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life -= dt;
            if (p.life <= 0) this.list.splice(i, 1);
        }
    },

    render(ctx) {
        for (const p of this.list) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    },
};

const Renderer = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    blockTextures: {},
    lightCanvas: null,
    lightCtx: null,
    clouds: [],
    stars: [],

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this._generateBlockTextures();
        this._generateClouds();
        this._generateStars();

        this.lightCanvas = document.createElement('canvas');
        this.lightCtx = this.lightCanvas.getContext('2d');
    },

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        if (this.lightCanvas) {
            this.lightCanvas.width = this.width;
            this.lightCanvas.height = this.height;
        }
    },

    _generateBlockTextures() {
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        const defs = {
            grass: (ctx) => {
                ctx.fillStyle = '#6B4423';
                ctx.fillRect(0, 0, bs, bs);
                ctx.fillStyle = '#4CAF50';
                ctx.fillRect(0, 0, bs, Math.floor(bs * 0.35));
                ctx.fillStyle = '#388E3C';
                for (let i = 0; i < 7; i++) {
                    ctx.fillRect(Utils.randomInt(1, bs - 3), 0, 2, Utils.randomInt(3, 9));
                }
                ctx.fillStyle = '#5D3A1A';
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(Utils.randomInt(2, bs - 6), Utils.randomInt(Math.floor(bs * 0.4), bs - 6), Utils.randomInt(3, 6), Utils.randomInt(2, 4));
                }
                ctx.fillStyle = '#66BB6A';
                ctx.fillRect(0, 0, bs, 2);
            },
            dirt: (ctx) => {
                ctx.fillStyle = '#6B4423';
                ctx.fillRect(0, 0, bs, bs);
                ctx.fillStyle = '#5D3A1A';
                for (let i = 0; i < 6; i++) {
                    ctx.fillRect(Utils.randomInt(1, bs - 5), Utils.randomInt(1, bs - 5), Utils.randomInt(3, 7), Utils.randomInt(2, 5));
                }
                ctx.fillStyle = '#7B5B3A';
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(Utils.randomInt(2, bs - 4), Utils.randomInt(2, bs - 4), Utils.randomInt(2, 4), Utils.randomInt(2, 4));
                }
            },
            sand: (ctx) => {
                ctx.fillStyle = '#F4D03F';
                ctx.fillRect(0, 0, bs, bs);
                ctx.fillStyle = '#E8C830';
                for (let i = 0; i < 10; i++) {
                    ctx.fillRect(Utils.randomInt(0, bs - 3), Utils.randomInt(0, bs - 3), Utils.randomInt(2, 4), Utils.randomInt(1, 3));
                }
                ctx.fillStyle = '#FAE5A0';
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(Utils.randomInt(1, bs - 2), Utils.randomInt(1, bs - 2), 1, 1);
                }
            },
            stone: (ctx) => {
                ctx.fillStyle = '#6B7B8D';
                ctx.fillRect(0, 0, bs, bs);
                ctx.strokeStyle = '#556270';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(bs * 0.2, bs * 0.3);
                ctx.lineTo(bs * 0.5, bs * 0.4);
                ctx.lineTo(bs * 0.7, bs * 0.2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(bs * 0.1, bs * 0.7);
                ctx.lineTo(bs * 0.4, bs * 0.8);
                ctx.lineTo(bs * 0.8, bs * 0.65);
                ctx.stroke();
                ctx.fillStyle = '#7F9BAD';
                ctx.fillRect(Math.floor(bs * 0.6), Math.floor(bs * 0.5), 4, 3);
                ctx.fillRect(Math.floor(bs * 0.2), Math.floor(bs * 0.15), 3, 3);
                ctx.fillStyle = '#4A5A6A';
                ctx.fillRect(Math.floor(bs * 0.7), Math.floor(bs * 0.7), 5, 4);
            },
            hardstone: (ctx) => {
                ctx.fillStyle = '#4A5568';
                ctx.fillRect(0, 0, bs, bs);
                ctx.strokeStyle = '#3A4558';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(0, bs * 0.5);
                ctx.lineTo(bs * 0.4, bs * 0.45);
                ctx.lineTo(bs, bs * 0.55);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(bs * 0.5, 0);
                ctx.lineTo(bs * 0.55, bs);
                ctx.stroke();
                ctx.fillStyle = '#5A6A7A';
                ctx.fillRect(Math.floor(bs * 0.15), Math.floor(bs * 0.15), 5, 4);
                ctx.fillRect(Math.floor(bs * 0.65), Math.floor(bs * 0.7), 4, 4);
            },
            iron: (ctx) => {
                ctx.fillStyle = '#6B7B8D';
                ctx.fillRect(0, 0, bs, bs);
                ctx.fillStyle = '#4A5A6A';
                ctx.fillRect(Math.floor(bs * 0.1), Math.floor(bs * 0.6), 5, 4);
                ctx.fillStyle = '#C8A96E';
                ctx.beginPath(); ctx.arc(bs * 0.3, bs * 0.35, 4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(bs * 0.65, bs * 0.55, 3.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(bs * 0.5, bs * 0.72, 3, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#E8C878';
                ctx.beginPath(); ctx.arc(bs * 0.28, bs * 0.32, 2, 0, Math.PI * 2); ctx.fill();
            },
            gold: (ctx) => {
                ctx.fillStyle = '#6B7B8D';
                ctx.fillRect(0, 0, bs, bs);
                ctx.fillStyle = '#DAA520';
                ctx.beginPath(); ctx.arc(bs * 0.35, bs * 0.4, 5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(bs * 0.62, bs * 0.6, 4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(bs * 0.48, bs * 0.25, 3.5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#FFD700';
                ctx.beginPath(); ctx.arc(bs * 0.33, bs * 0.37, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(bs * 0.6, bs * 0.57, 2, 0, Math.PI * 2); ctx.fill();
            },
            diamond: (ctx) => {
                ctx.fillStyle = '#6B7B8D';
                ctx.fillRect(0, 0, bs, bs);
                ctx.fillStyle = '#4FC3F7';
                ctx.save();
                ctx.translate(bs * 0.35, bs * 0.4);
                ctx.beginPath();
                ctx.moveTo(0, -5); ctx.lineTo(5, 0); ctx.lineTo(0, 5); ctx.lineTo(-5, 0);
                ctx.closePath(); ctx.fill();
                ctx.restore();
                ctx.save();
                ctx.translate(bs * 0.67, bs * 0.62);
                ctx.beginPath();
                ctx.moveTo(0, -4); ctx.lineTo(4, 0); ctx.lineTo(0, 4); ctx.lineTo(-4, 0);
                ctx.closePath(); ctx.fill();
                ctx.restore();
                ctx.fillStyle = '#B3E5FC';
                ctx.fillRect(Math.floor(bs * 0.32), Math.floor(bs * 0.35), 2, 2);
                ctx.fillRect(Math.floor(bs * 0.64), Math.floor(bs * 0.57), 2, 2);
            },
            emerald: (ctx) => {
                ctx.fillStyle = '#6B7B8D';
                ctx.fillRect(0, 0, bs, bs);
                ctx.fillStyle = '#2ECC71';
                ctx.save();
                ctx.translate(bs * 0.4, bs * 0.45);
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const a = (Math.PI / 3) * i - Math.PI / 6;
                    if (i === 0) ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5);
                    else ctx.lineTo(Math.cos(a) * 5, Math.sin(a) * 5);
                }
                ctx.closePath(); ctx.fill();
                ctx.restore();
                ctx.save();
                ctx.translate(bs * 0.65, bs * 0.65);
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const a = (Math.PI / 3) * i - Math.PI / 6;
                    if (i === 0) ctx.moveTo(Math.cos(a) * 4, Math.sin(a) * 4);
                    else ctx.lineTo(Math.cos(a) * 4, Math.sin(a) * 4);
                }
                ctx.closePath(); ctx.fill();
                ctx.restore();
                ctx.fillStyle = '#58D68D';
                ctx.fillRect(Math.floor(bs * 0.37), Math.floor(bs * 0.4), 2, 2);
            },
            wood: (ctx) => {
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(0, 0, bs, bs);
                ctx.fillStyle = '#4E342E';
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(Math.floor(bs * (0.15 + i * 0.22)), 0, 2, bs);
                }
                ctx.fillStyle = '#6D4C41';
                ctx.fillRect(Math.floor(bs * 0.4), 0, 1, bs);
                ctx.fillStyle = '#3E2723';
                ctx.beginPath(); ctx.arc(bs * 0.5, bs * 0.5, 3, 0, Math.PI * 2); ctx.fill();
            },
            leaves: (ctx) => {
                ctx.fillStyle = '#2E7D32';
                ctx.fillRect(0, 0, bs, bs);
                for (let i = 0; i < 14; i++) {
                    ctx.fillStyle = ['#388E3C', '#43A047', '#1B5E20', '#4CAF50', '#66BB6A'][i % 5];
                    ctx.beginPath();
                    ctx.arc(Utils.randomInt(2, bs - 2), Utils.randomInt(2, bs - 2), Utils.randomInt(3, 6), 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.fillStyle = 'rgba(255,255,255,0.08)';
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(Utils.randomInt(2, bs - 4), Utils.randomInt(2, bs - 4), 2, 2);
                }
            },
            bedrock: (ctx) => {
                ctx.fillStyle = '#1A1A1A';
                ctx.fillRect(0, 0, bs, bs);
                ctx.fillStyle = '#2D2D2D';
                for (let i = 0; i < 8; i++) {
                    ctx.fillRect(Utils.randomInt(0, bs - 4), Utils.randomInt(0, bs - 4), Utils.randomInt(3, 8), Utils.randomInt(3, 8));
                }
                ctx.fillStyle = '#0D0D0D';
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(Utils.randomInt(0, bs - 3), Utils.randomInt(0, bs - 3), Utils.randomInt(2, 5), Utils.randomInt(2, 5));
                }
            },
        };

        Object.entries(defs).forEach(([name, drawFn]) => {
            const c = document.createElement('canvas');
            c.width = bs;
            c.height = bs;
            drawFn(c.getContext('2d'));
            this.blockTextures[name] = c;
        });
    },

    _generateClouds() {
        this.clouds = [];
        for (let i = 0; i < 12; i++) {
            this.clouds.push({
                x: Utils.randomFloat(0, 3000),
                y: Utils.randomFloat(20, 150),
                width: Utils.randomFloat(80, 200),
                height: Utils.randomFloat(25, 50),
                speed: Utils.randomFloat(0.1, 0.4),
                opacity: Utils.randomFloat(0.3, 0.7),
            });
        }
    },

    _generateStars() {
        this.stars = [];
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Utils.randomFloat(0, 1),
                y: Utils.randomFloat(0, 0.5),
                size: Utils.randomFloat(1, 3),
                twinkle: Utils.randomFloat(0, Math.PI * 2),
            });
        }
    },

    clear() {
        const skyTop = DayNight.isNight() ? '#0C1445' : '#4A90D9';
        const skyBottom = DayNight.isNight() ? '#1A237E' : '#87CEEB';
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, skyTop);
        gradient.addColorStop(1, skyBottom);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    },

    render(camera) {
        this.clear();
        Particles.update(16);

        this._renderBackground(camera);

        this.ctx.save();
        this.ctx.translate(-camera.x, -camera.y);

        this._renderWorld(camera);
        this._renderHouse();
        this._renderPortal();
        this._renderVillagers();
        this._renderPlayer();
        this._renderEnemies();
        this._renderProjectiles();
        Particles.render(this.ctx);

        this.ctx.restore();

        this._renderOverlay();
        this._renderUndergroundLight(camera);
    },

    _renderBackground(camera) {
        const time = Date.now();

        // Stars
        if (DayNight.isNight()) {
            for (const star of this.stars) {
                const twinkle = Math.sin(time * 0.002 + star.twinkle) * 0.5 + 0.5;
                this.ctx.globalAlpha = twinkle * 0.8;
                this.ctx.fillStyle = '#FFF';
                this.ctx.beginPath();
                this.ctx.arc(star.x * this.width, star.y * this.height, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.globalAlpha = 1;
            // Moon
            this.ctx.fillStyle = '#ECF0F1';
            this.ctx.beginPath();
            this.ctx.arc(this.width * 0.82, 75, 28, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#BDC3C7';
            this.ctx.beginPath();
            this.ctx.arc(this.width * 0.82 + 5, 70, 5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.width * 0.82 - 8, 80, 3, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Sun with glow
            const sx = this.width * 0.15;
            const sy = 70;
            const sunGlow = this.ctx.createRadialGradient(sx, sy, 12, sx, sy, 65);
            sunGlow.addColorStop(0, 'rgba(255,235,59,0.9)');
            sunGlow.addColorStop(0.4, 'rgba(255,193,7,0.2)');
            sunGlow.addColorStop(1, 'rgba(255,193,7,0)');
            this.ctx.fillStyle = sunGlow;
            this.ctx.fillRect(sx - 70, sy - 70, 140, 140);
            this.ctx.fillStyle = '#FDD835';
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Clouds
        const parallax = 0.2;
        for (const cloud of this.clouds) {
            cloud.x += cloud.speed;
            if (cloud.x > 3500) cloud.x = -cloud.width;
            const cx = cloud.x - camera.x * parallax;
            if (cx < -cloud.width - 50 || cx > this.width + 50) continue;

            this.ctx.globalAlpha = cloud.opacity * (DayNight.isNight() ? 0.25 : 1);
            this.ctx.fillStyle = DayNight.isNight() ? '#34495E' : '#FFFFFF';
            const r = cloud.height / 2;
            this.ctx.beginPath();
            this.ctx.arc(cx + r, cloud.y + r, r, 0, Math.PI * 2);
            this.ctx.arc(cx + cloud.width * 0.3, cloud.y + r * 0.6, r * 1.2, 0, Math.PI * 2);
            this.ctx.arc(cx + cloud.width * 0.6, cloud.y + r * 0.8, r * 0.9, 0, Math.PI * 2);
            this.ctx.arc(cx + cloud.width - r, cloud.y + r, r * 0.8, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;

        // Distant mountains
        this._renderDistantMountains(camera);
    },

    _renderDistantMountains(camera) {
        const offsetX = -camera.x * 0.08;
        const baseY = this.height * 0.55;

        // Far mountains
        this.ctx.fillStyle = DayNight.isNight() ? 'rgba(25,35,55,0.5)' : 'rgba(90,130,170,0.25)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        for (let x = 0; x <= this.width; x += 15) {
            const wx = x - offsetX;
            const h = Math.sin(wx * 0.002) * 70 + Math.sin(wx * 0.005) * 35 + Math.cos(wx * 0.001) * 50;
            this.ctx.lineTo(x, baseY - h);
        }
        this.ctx.lineTo(this.width, this.height);
        this.ctx.closePath();
        this.ctx.fill();

        // Near mountains (slightly different parallax)
        const offsetX2 = -camera.x * 0.14;
        this.ctx.fillStyle = DayNight.isNight() ? 'rgba(20,28,45,0.4)' : 'rgba(70,110,150,0.15)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        for (let x = 0; x <= this.width; x += 15) {
            const wx = x - offsetX2;
            const h = Math.sin(wx * 0.004 + 1) * 45 + Math.sin(wx * 0.009) * 25;
            this.ctx.lineTo(x, baseY + 30 - h);
        }
        this.ctx.lineTo(this.width, this.height);
        this.ctx.closePath();
        this.ctx.fill();
    },

    _renderWorld(camera) {
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        const startX = Math.max(0, Math.floor(camera.x / bs) - 1);
        const endX = Math.min(CONFIG.WORLD.WIDTH, Math.ceil((camera.x + this.width) / bs) + 1);
        const startY = Math.max(0, Math.floor(camera.y / bs) - 1);
        const endY = Math.min(CONFIG.WORLD.HEIGHT, Math.ceil((camera.y + this.height) / bs) + 1);

        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                const block = World.blocks[x][y];
                if (block === 'air') continue;

                const px = x * bs;
                const py = y * bs;

                // Draw texture
                const texture = this.blockTextures[block];
                if (texture) {
                    this.ctx.drawImage(texture, px, py, bs, bs);
                } else {
                    const blockDef = CONFIG.BLOCKS[block];
                    if (blockDef) {
                        this.ctx.fillStyle = blockDef.color;
                        this.ctx.fillRect(px, py, bs, bs);
                    }
                }

                // 3D depth edges
                const above = World.getBlock(x, y - 1);
                const left = World.getBlock(x - 1, y);
                const below = World.getBlock(x, y + 1);
                const right = World.getBlock(x + 1, y);

                if (above === 'air' || (CONFIG.BLOCKS[above] && !CONFIG.BLOCKS[above].solid)) {
                    this.ctx.fillStyle = 'rgba(255,255,255,0.07)';
                    this.ctx.fillRect(px, py, bs, 2);
                }
                if (left === 'air' || (CONFIG.BLOCKS[left] && !CONFIG.BLOCKS[left].solid)) {
                    this.ctx.fillStyle = 'rgba(255,255,255,0.04)';
                    this.ctx.fillRect(px, py, 2, bs);
                }
                if (below === 'air' || (CONFIG.BLOCKS[below] && !CONFIG.BLOCKS[below].solid)) {
                    this.ctx.fillStyle = 'rgba(0,0,0,0.12)';
                    this.ctx.fillRect(px, py + bs - 2, bs, 2);
                }
                if (right === 'air' || (CONFIG.BLOCKS[right] && !CONFIG.BLOCKS[right].solid)) {
                    this.ctx.fillStyle = 'rgba(0,0,0,0.08)';
                    this.ctx.fillRect(px + bs - 2, py, 2, bs);
                }

                // Ore glow
                if (['diamond', 'gold', 'emerald', 'iron'].includes(block)) {
                    const t = Date.now() * 0.003;
                    const glow = Math.sin(t + x * 2 + y * 3) * 0.5 + 0.5;
                    const colors = { diamond: '100,200,255', gold: '255,215,0', emerald: '46,204,113', iron: '196,164,100' };
                    this.ctx.fillStyle = `rgba(${colors[block]},${glow * 0.25})`;
                    this.ctx.fillRect(px + 2, py + 2, bs - 4, bs - 4);
                    // Sparkle
                    const sx = px + bs / 2 + Math.sin(t + x) * (bs * 0.25);
                    const sy = py + bs / 2 + Math.cos(t + y) * (bs * 0.25);
                    this.ctx.fillStyle = `rgba(255,255,255,${glow * 0.7})`;
                    this.ctx.fillRect(sx - 1, sy - 1, 2, 2);
                }
            }
        }
    },

    _renderPlayer() {
        const p = Player;
        if (p.dead) return;

        if (p.invulnerable && Math.floor(Date.now() / 80) % 2 === 0) {
            this.ctx.globalAlpha = 0.35;
        }

        // Shadow
        this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        this.ctx.beginPath();
        this.ctx.ellipse(p.x + p.width / 2, p.y + p.height + 2, p.width * 0.4, 4, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Wings (behind)
        if (p.hasWings) {
            const wingOff = Math.sin(Date.now() * 0.008) * 4;
            const wingSprite = Player.wingSpeed <= -5 ? 'golden_wings' : 'wings';
            const ws = Sprites.get(wingSprite);
            if (ws) {
                this.ctx.drawImage(ws, p.x - 16, p.y + 2 + wingOff, p.width + 32, 32);
            }
        }

        // Player sprite
        const spriteName = p.facingRight ? 'player' : 'player_left';
        const sprite = Sprites.get(spriteName);
        if (sprite) {
            this.ctx.drawImage(sprite, p.x - 4, p.y - 2, p.width + 8, p.height + 4);
        } else {
            this.ctx.fillStyle = '#3498DB';
            this.ctx.fillRect(p.x, p.y, p.width, p.height);
            this.ctx.fillStyle = '#F5CBA7';
            this.ctx.fillRect(p.x + 5, p.y, p.width - 10, 14);
        }

        // Tool with swing animation
        const equipped = Inventory.getEquipped();
        if (equipped) {
            const toolSprite = Sprites.get(equipped.id);
            const isAttacking = Input.isAttack();
            const swingAngle = isAttacking ? Math.sin(Date.now() * 0.02) * 0.6 : 0;
            const toolX = p.facingRight ? p.x + p.width - 2 : p.x - 22;
            const toolY = p.y + 8;

            this.ctx.save();
            if (toolSprite) {
                this.ctx.translate(toolX + 12, toolY + 12);
                this.ctx.rotate(swingAngle * (p.facingRight ? 1 : -1));
                if (!p.facingRight) this.ctx.scale(-1, 1);
                this.ctx.drawImage(toolSprite, -12, -12, 24, 24);
            } else {
                this.ctx.translate(toolX + 10, toolY + 10);
                this.ctx.rotate(swingAngle);
                this.ctx.font = '18px serif';
                this.ctx.fillText(equipped.icon, -8, 6);
            }
            this.ctx.restore();
        }

        this.ctx.globalAlpha = 1;
    },

    _renderEnemies() {
        for (const enemy of Enemies.list) {
            // Shadow
            this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
            this.ctx.beginPath();
            this.ctx.ellipse(enemy.x + enemy.width / 2, enemy.y + enemy.height + 2, enemy.width * 0.35, 3, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Sprite
            const sprite = Sprites.get(enemy.id);
            if (sprite) {
                this.ctx.save();
                if (enemy.direction < 0) {
                    this.ctx.translate(enemy.x + enemy.width, enemy.y);
                    this.ctx.scale(-1, 1);
                    this.ctx.drawImage(sprite, 0, 0, enemy.width, enemy.height);
                } else {
                    this.ctx.drawImage(sprite, enemy.x, enemy.y, enemy.width, enemy.height);
                }
                this.ctx.restore();
            } else {
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                this.ctx.fillStyle = '#E74C3C';
                const eyeX = enemy.direction > 0 ? enemy.x + enemy.width - 8 : enemy.x + 4;
                this.ctx.fillRect(eyeX, enemy.y + 6, 4, 4);
            }

            // Health bar
            if (enemy.health < enemy.maxHealth) {
                const bw = enemy.width + 4;
                const bh = 5;
                const bx = enemy.x - 2;
                const by = enemy.y - 10;
                this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
                this.ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
                this.ctx.fillStyle = '#2C3E50';
                this.ctx.fillRect(bx, by, bw, bh);
                const hpPct = enemy.health / enemy.maxHealth;
                this.ctx.fillStyle = hpPct > 0.5 ? '#27AE60' : hpPct > 0.25 ? '#F39C12' : '#E74C3C';
                this.ctx.fillRect(bx, by, bw * hpPct, bh);
                this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
                this.ctx.fillRect(bx, by, bw * hpPct, 2);
            }

            // Boss aura
            if (enemy.isBoss) {
                const t = Date.now() * 0.003;
                const auraSize = 5 + Math.sin(t) * 3;
                this.ctx.strokeStyle = `rgba(142,68,173,${0.3 + Math.sin(t) * 0.15})`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.ellipse(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2,
                    enemy.width / 2 + auraSize, enemy.height / 2 + auraSize, 0, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.fillStyle = '#F1C40F';
                this.ctx.font = 'bold 13px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.shadowColor = '#000';
                this.ctx.shadowBlur = 4;
                this.ctx.fillText('JEFE OSCURO', enemy.x + enemy.width / 2, enemy.y - 16);
                this.ctx.shadowBlur = 0;
                this.ctx.textAlign = 'left';
            }
        }
    },

    _renderProjectiles() {
        for (const p of Combat.projectiles) {
            // Trail
            this.ctx.globalAlpha = 0.4;
            this.ctx.fillStyle = p.color;
            for (let i = 1; i <= 3; i++) {
                const tx = p.x - p.vx * i * 0.5;
                const ty = p.y - p.vy * i * 0.5;
                this.ctx.beginPath();
                this.ctx.arc(tx, ty, p.size * (1 - i * 0.2) / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.globalAlpha = 1;
            // Glow
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 8;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#FFF';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size / 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
    },

    _renderVillagers() {
        for (const v of World.villagers) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.15)';
            this.ctx.beginPath();
            this.ctx.ellipse(v.x, v.y + v.height + 2, v.width * 0.4, 3, 0, 0, Math.PI * 2);
            this.ctx.fill();

            const sprite = Sprites.get('villager');
            if (sprite) {
                this.ctx.drawImage(sprite, v.x - v.width / 2 - 2, v.y - 2, v.width + 8, v.height + 4);
            } else {
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(v.x - v.width / 2, v.y, v.width, v.height);
            }

            const dist = Utils.distance(Player.x + Player.width / 2, Player.y + Player.height / 2, v.x, v.y + v.height / 2);
            if (dist < CONFIG.WORLD.BLOCK_SIZE * 3) {
                const bounce = Math.sin(Date.now() * 0.004) * 3;
                this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
                const lw = 74;
                this.ctx.fillRect(v.x - lw / 2, v.y - 28 + bounce, lw, 20);
                this.ctx.fillStyle = '#F1C40F';
                this.ctx.font = 'bold 11px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('\uD83D\uDFE2 Comerciar', v.x, v.y - 14 + bounce);
                this.ctx.textAlign = 'left';
            } else {
                this.ctx.fillStyle = '#FFF';
                this.ctx.font = '10px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.shadowColor = '#000';
                this.ctx.shadowBlur = 3;
                this.ctx.fillText('Aldeano', v.x, v.y - 6);
                this.ctx.shadowBlur = 0;
                this.ctx.textAlign = 'left';
            }
        }
    },

    _renderHouse() {
        if (!World.housePosition) return;
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        const hx = World.housePosition.x * bs;
        const hy = (World.housePosition.y - 3) * bs;

        // Shadow
        this.ctx.fillStyle = 'rgba(0,0,0,0.12)';
        this.ctx.fillRect(hx + 5, hy + bs * 3, bs * 3, 6);

        // Walls (planks)
        this.ctx.fillStyle = '#8B6914';
        this.ctx.fillRect(hx, hy, bs * 3, bs * 3);
        this.ctx.strokeStyle = '#6B4E0A';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 7; i++) {
            const ly = hy + i * (bs * 3 / 7);
            this.ctx.beginPath();
            this.ctx.moveTo(hx, ly);
            this.ctx.lineTo(hx + bs * 3, ly);
            this.ctx.stroke();
        }

        // Roof
        this.ctx.fillStyle = '#922B21';
        this.ctx.beginPath();
        this.ctx.moveTo(hx - bs * 0.3, hy);
        this.ctx.lineTo(hx + bs * 1.5, hy - bs * 1.1);
        this.ctx.lineTo(hx + bs * 3.3, hy);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.fillStyle = '#7B241C';
        this.ctx.beginPath();
        this.ctx.moveTo(hx + bs * 0.2, hy - bs * 0.15);
        this.ctx.lineTo(hx + bs * 1.5, hy - bs * 0.85);
        this.ctx.lineTo(hx + bs * 2.8, hy - bs * 0.15);
        this.ctx.closePath();
        this.ctx.fill();

        // Door
        this.ctx.fillStyle = '#4E342E';
        this.ctx.fillRect(hx + bs * 1.1, hy + bs * 1.3, bs * 0.8, bs * 1.7);
        this.ctx.strokeStyle = '#3E2723';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(hx + bs * 1.1, hy + bs * 1.3, bs * 0.8, bs * 1.7);
        this.ctx.fillStyle = '#F1C40F';
        this.ctx.beginPath();
        this.ctx.arc(hx + bs * 1.7, hy + bs * 2.2, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Windows
        const wGlow = DayNight.isNight() ? '#FFF176' : '#81D4FA';
        this.ctx.fillStyle = wGlow;
        this.ctx.fillRect(hx + bs * 0.25, hy + bs * 0.5, bs * 0.6, bs * 0.6);
        this.ctx.fillRect(hx + bs * 2.15, hy + bs * 0.5, bs * 0.6, bs * 0.6);
        this.ctx.strokeStyle = '#5D4037';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(hx + bs * 0.25, hy + bs * 0.5, bs * 0.6, bs * 0.6);
        this.ctx.strokeRect(hx + bs * 2.15, hy + bs * 0.5, bs * 0.6, bs * 0.6);

        // Chimney
        this.ctx.fillStyle = '#5D6D7E';
        this.ctx.fillRect(hx + bs * 2.2, hy - bs * 0.7, bs * 0.4, bs * 0.7);
        if (DayNight.isNight()) {
            const t = Date.now() * 0.002;
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillStyle = '#BDC3C7';
            for (let i = 0; i < 3; i++) {
                const sx = hx + bs * 2.4 + Math.sin(t + i) * 5;
                const sy = hy - bs * 0.7 - i * 12 - Math.sin(t * 0.5) * 3;
                this.ctx.beginPath();
                this.ctx.arc(sx, sy, 5 + i * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.globalAlpha = 1;
        }

        // Label
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 10px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#000';
        this.ctx.shadowBlur = 3;
        this.ctx.fillText('\uD83C\uDFE0 Casa', hx + bs * 1.5, hy - bs * 1.2);
        this.ctx.shadowBlur = 0;
        this.ctx.textAlign = 'left';
    },

    _renderPortal() {
        if (!World.portalPosition) return;
        const p = World.portalPosition;
        const time = Date.now() * 0.003;
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;

        // Outer glow
        const outerGlow = this.ctx.createRadialGradient(cx, cy, p.width * 0.3, cx, cy, p.width * 1.5);
        outerGlow.addColorStop(0, 'rgba(155,89,182,0.35)');
        outerGlow.addColorStop(1, 'rgba(155,89,182,0)');
        this.ctx.fillStyle = outerGlow;
        this.ctx.fillRect(p.x - p.width, p.y - p.height, p.width * 3, p.height * 3);

        // Frame
        this.ctx.strokeStyle = '#4A235A';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, p.width / 2 + 4, p.height / 2 + 4, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // Vortex
        const grad = this.ctx.createRadialGradient(cx, cy, 5, cx, cy, p.width / 2);
        grad.addColorStop(0, '#E8DAEF');
        grad.addColorStop(0.3, '#9B59B6');
        grad.addColorStop(0.7, '#6C3483');
        grad.addColorStop(1, '#4A235A');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, p.width / 2, p.height / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Energy rings
        this.ctx.strokeStyle = 'rgba(232,218,239,0.5)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const a = time * (1 + i * 0.5);
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy, p.width * 0.15 * (i + 1), p.height * 0.2 * (i + 1), a, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Orbiting particles
        for (let i = 0; i < 8; i++) {
            const a = time * 1.5 + (i * Math.PI * 2 / 8);
            const d = p.width * 0.3 + Math.sin(time * 2 + i) * 8;
            const px2 = cx + Math.cos(a) * d;
            const py2 = cy + Math.sin(a) * d * 0.7;
            this.ctx.fillStyle = i % 2 === 0 ? '#E8DAEF' : '#BB8FCE';
            this.ctx.beginPath();
            this.ctx.arc(px2, py2, 2 + Math.sin(time + i) * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    },

    _renderOverlay() {
        if (DayNight.alpha > 0) {
            this.ctx.fillStyle = DayNight.getOverlayColor();
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    },

    _renderUndergroundLight(camera) {
        const playerWorldY = Player.y;
        const caveStartPixel = CONFIG.WORLD.CAVE_START_Y * CONFIG.WORLD.BLOCK_SIZE;

        if (playerWorldY > caveStartPixel - 100) {
            const depth = (playerWorldY - caveStartPixel + 100) / 200;
            const darkness = Utils.clamp(depth, 0, 0.92);

            this.lightCtx.clearRect(0, 0, this.width, this.height);
            this.lightCtx.fillStyle = `rgba(5,5,15,${darkness})`;
            this.lightCtx.fillRect(0, 0, this.width, this.height);

            // Player torch light
            const px = Player.x - camera.x + Player.width / 2;
            const py = Player.y - camera.y + Player.height / 2;
            const radius = 190 - darkness * 40;

            this.lightCtx.globalCompositeOperation = 'destination-out';
            const lg = this.lightCtx.createRadialGradient(px, py, 0, px, py, radius);
            lg.addColorStop(0, 'rgba(0,0,0,1)');
            lg.addColorStop(0.6, 'rgba(0,0,0,0.7)');
            lg.addColorStop(1, 'rgba(0,0,0,0)');
            this.lightCtx.fillStyle = lg;
            this.lightCtx.beginPath();
            this.lightCtx.arc(px, py, radius, 0, Math.PI * 2);
            this.lightCtx.fill();
            this.lightCtx.globalCompositeOperation = 'source-over';

            this.ctx.drawImage(this.lightCanvas, 0, 0);

            // Warm glow
            const warmGlow = this.ctx.createRadialGradient(px, py, 0, px, py, radius * 0.4);
            warmGlow.addColorStop(0, 'rgba(255,180,80,0.06)');
            warmGlow.addColorStop(1, 'rgba(255,180,80,0)');
            this.ctx.fillStyle = warmGlow;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    },
};
