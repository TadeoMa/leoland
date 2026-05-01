/**
 * MINIMINE - World Generation & Management
 * Handles biome generation, block placement/removal, trees, ores, caves.
 */

const World = {
    blocks: [],        // 2D array [x][y]
    trees: [],         // Tree positions for rendering
    villagers: [],     // NPC positions
    housePosition: null,
    portalPosition: null,

    init() {
        this.blocks = [];
        this.trees = [];
        this.villagers = [];
        this.housePosition = null;
        this.portalPosition = null;
    },

    generate() {
        this.init();
        const { WIDTH, HEIGHT, SURFACE_Y, CAVE_START_Y, BIOME_WIDTH } = CONFIG.WORLD;

        // Initialize empty grid
        for (let x = 0; x < WIDTH; x++) {
            this.blocks[x] = [];
            for (let y = 0; y < HEIGHT; y++) {
                this.blocks[x][y] = 'air';
            }
        }

        // Generate terrain per biome
        for (let x = 0; x < WIDTH; x++) {
            const biome = this.getBiomeAt(x);
            const surfaceY = this._getSurfaceHeight(x, biome);

            for (let y = 0; y < HEIGHT; y++) {
                if (y === HEIGHT - 1) {
                    this.blocks[x][y] = 'bedrock';
                } else if (y === surfaceY) {
                    this.blocks[x][y] = biome === 'desert' ? 'sand' : 'grass';
                } else if (y > surfaceY && y < surfaceY + 4) {
                    this.blocks[x][y] = biome === 'desert' ? 'sand' : 'dirt';
                } else if (y >= surfaceY + 4 && y < CAVE_START_Y) {
                    this.blocks[x][y] = 'stone';
                } else if (y >= CAVE_START_Y) {
                    this.blocks[x][y] = Math.random() < 0.3 ? 'hardstone' : 'stone';
                }
            }
        }

        // Generate caves
        this._generateCaves();

        // Place ores
        this._placeOres();

        // Place trees
        this._placeTrees();

        // Place villagers
        this._placeVillagers();
    },

    getBiomeAt(x) {
        const biomeWidth = CONFIG.WORLD.BIOME_WIDTH;
        const biomes = CONFIG.WORLD.BIOMES;
        const index = Math.floor(x / biomeWidth) % biomes.length;
        return biomes[index];
    },

    _getSurfaceHeight(x, biome) {
        const baseY = CONFIG.WORLD.SURFACE_Y;
        // Perlin-like noise using sin waves
        let height = baseY;
        height += Math.sin(x * 0.1) * 3;
        height += Math.sin(x * 0.05) * 2;

        if (biome === 'mountains') {
            height -= Math.abs(Math.sin(x * 0.08)) * 8;
        } else if (biome === 'desert') {
            height += Math.sin(x * 0.15) * 2;
        }

        return Math.floor(height);
    },

    getSurfaceY(x) {
        for (let y = 0; y < CONFIG.WORLD.HEIGHT; y++) {
            if (this.blocks[x] && this.blocks[x][y] && this.blocks[x][y] !== 'air' && this.blocks[x][y] !== 'leaves') {
                return y;
            }
        }
        return CONFIG.WORLD.SURFACE_Y;
    },

    _generateCaves() {
        const { WIDTH, HEIGHT, CAVE_START_Y } = CONFIG.WORLD;
        // Simple random walk cave generation
        const numCaves = 8;

        for (let c = 0; c < numCaves; c++) {
            let cx = Utils.randomInt(10, WIDTH - 10);
            let cy = Utils.randomInt(CAVE_START_Y, HEIGHT - 5);
            const length = Utils.randomInt(20, 60);

            for (let i = 0; i < length; i++) {
                const radius = Utils.randomInt(1, 3);
                for (let dx = -radius; dx <= radius; dx++) {
                    for (let dy = -radius; dy <= radius; dy++) {
                        const bx = cx + dx;
                        const by = cy + dy;
                        if (bx > 0 && bx < WIDTH - 1 && by > CAVE_START_Y - 2 && by < HEIGHT - 1) {
                            if (this.blocks[bx][by] !== 'bedrock') {
                                this.blocks[bx][by] = 'air';
                            }
                        }
                    }
                }
                cx += Utils.randomInt(-2, 2);
                cy += Utils.randomInt(-1, 1);
                cx = Utils.clamp(cx, 1, WIDTH - 2);
                cy = Utils.clamp(cy, CAVE_START_Y, HEIGHT - 2);
            }
        }
    },

    _placeOres() {
        const { WIDTH, HEIGHT, CAVE_START_Y } = CONFIG.WORLD;
        const ores = [
            { type: 'iron', minY: CAVE_START_Y - 5, maxY: HEIGHT - 5, chance: 0.03, clusterSize: 3 },
            { type: 'gold', minY: CAVE_START_Y + 5, maxY: HEIGHT - 5, chance: 0.015, clusterSize: 2 },
            { type: 'diamond', minY: CAVE_START_Y + 15, maxY: HEIGHT - 3, chance: 0.008, clusterSize: 2 },
            { type: 'emerald', minY: CAVE_START_Y + 10, maxY: HEIGHT - 3, chance: 0.006, clusterSize: 1 },
        ];

        ores.forEach(ore => {
            for (let x = 1; x < WIDTH - 1; x++) {
                for (let y = ore.minY; y < ore.maxY; y++) {
                    if (this.blocks[x][y] === 'stone' || this.blocks[x][y] === 'hardstone') {
                        if (Math.random() < ore.chance) {
                            // Place cluster
                            for (let i = 0; i < ore.clusterSize; i++) {
                                const ox = x + Utils.randomInt(-1, 1);
                                const oy = y + Utils.randomInt(-1, 1);
                                if (ox > 0 && ox < WIDTH - 1 && oy >= ore.minY && oy < ore.maxY) {
                                    if (this.blocks[ox][oy] === 'stone' || this.blocks[ox][oy] === 'hardstone') {
                                        this.blocks[ox][oy] = ore.type;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    },

    _placeTrees() {
        const { WIDTH } = CONFIG.WORLD;
        
        for (let x = 3; x < WIDTH - 3; x += Utils.randomInt(3, 7)) {
            const biome = this.getBiomeAt(x);
            if (biome === 'desert') continue; // No trees in desert
            
            const surfaceY = this.getSurfaceY(x);
            if (surfaceY <= 0) continue;

            const treeHeight = Utils.randomInt(3, 6);
            const treeTop = surfaceY - treeHeight;

            // Trunk
            for (let y = surfaceY - 1; y >= treeTop; y--) {
                if (y >= 0) this.blocks[x][y] = 'wood';
            }

            // Leaves
            for (let lx = x - 2; lx <= x + 2; lx++) {
                for (let ly = treeTop - 2; ly <= treeTop + 1; ly++) {
                    if (lx >= 0 && lx < WIDTH && ly >= 0) {
                        if (this.blocks[lx][ly] === 'air') {
                            this.blocks[lx][ly] = 'leaves';
                        }
                    }
                }
            }

            this.trees.push({ x, y: surfaceY, height: treeHeight });
        }
    },

    _placeVillagers() {
        const { WIDTH, BIOME_WIDTH } = CONFIG.WORLD;
        // Place 1-2 villagers per biome
        const biomes = CONFIG.WORLD.BIOMES;
        
        for (let i = 0; i < biomes.length; i++) {
            const startX = i * BIOME_WIDTH + 10;
            const endX = Math.min((i + 1) * BIOME_WIDTH - 10, WIDTH - 5);
            const vx = Utils.randomInt(startX, endX);
            const surfaceY = this.getSurfaceY(vx);
            
            this.villagers.push({
                x: vx * CONFIG.WORLD.BLOCK_SIZE + CONFIG.WORLD.BLOCK_SIZE / 2,
                y: (surfaceY - 1) * CONFIG.WORLD.BLOCK_SIZE,
                width: 20,
                height: 36,
            });
        }
    },

    getBlock(bx, by) {
        if (bx < 0 || bx >= CONFIG.WORLD.WIDTH || by < 0 || by >= CONFIG.WORLD.HEIGHT) {
            return 'bedrock';
        }
        return this.blocks[bx][by];
    },

    setBlock(bx, by, type) {
        if (bx < 0 || bx >= CONFIG.WORLD.WIDTH || by < 0 || by >= CONFIG.WORLD.HEIGHT) return;
        if (this.blocks[bx][by] === 'bedrock') return;
        this.blocks[bx][by] = type;
    },

    isSolid(bx, by) {
        const block = this.getBlock(bx, by);
        return CONFIG.BLOCKS[block] && CONFIG.BLOCKS[block].solid;
    },

    breakBlock(bx, by, toolId) {
        const blockType = this.getBlock(bx, by);
        if (blockType === 'air' || blockType === 'bedrock') return null;
        
        const blockDef = CONFIG.BLOCKS[blockType];
        if (!blockDef) return null;

        // Check if tool can break this block
        const tool = CONFIG.TOOLS[toolId];
        if (blockDef.tool && tool) {
            if (!tool.canBreak || !tool.canBreak.includes(blockType)) {
                // Special case: pickaxe breaks all stones/ores
                if (toolId === 'pickaxe' && ['stone', 'hardstone', 'iron', 'gold', 'diamond', 'emerald'].includes(blockType)) {
                    // ok
                } else {
                    return null;
                }
            }
        }

        this.blocks[bx][by] = 'air';
        AudioManager.play('SFX_MINE');

        // Spawn mining particles
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        const color = blockDef.color || '#AAA';
        if (typeof Particles !== 'undefined') {
            Particles.add(bx * bs + bs / 2, by * bs + bs / 2, 'mine', color);
        }

        return blockType;
    },

    placeHouse(bx, by) {
        this.housePosition = { x: bx, y: by };
    },

    openPortal() {
        // Place portal near center of the world
        const cx = Math.floor(CONFIG.WORLD.WIDTH / 2);
        const surfaceY = this.getSurfaceY(cx);
        this.portalPosition = {
            x: cx * CONFIG.WORLD.BLOCK_SIZE,
            y: (surfaceY - 3) * CONFIG.WORLD.BLOCK_SIZE,
            width: CONFIG.WORLD.BLOCK_SIZE * 2,
            height: CONFIG.WORLD.BLOCK_SIZE * 3,
        };
        AudioManager.play('SFX_PORTAL');
    },

    getSpawnPoint() {
        const spawnX = 5;
        const surfaceY = this.getSurfaceY(spawnX);
        return {
            x: spawnX * CONFIG.WORLD.BLOCK_SIZE,
            y: (surfaceY - 2) * CONFIG.WORLD.BLOCK_SIZE,
        };
    },

    toSaveData() {
        return {
            blocks: this.blocks,
            villagers: this.villagers,
            housePosition: this.housePosition,
            portalPosition: this.portalPosition,
        };
    },

    fromSaveData(data) {
        this.blocks = data.blocks;
        this.villagers = data.villagers || [];
        this.housePosition = data.housePosition;
        this.portalPosition = data.portalPosition;
    },
};
