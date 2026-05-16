/**
 * MINIMINE - Configuration File
 * =============================
 * All editable game values are here for easy tuning.
 */

const CONFIG = {
    // =====================
    // WORLD
    // =====================
    WORLD: {
        WIDTH: 200,          // World width in blocks
        HEIGHT: 80,          // World height in blocks
        BLOCK_SIZE: 32,      // Pixel size of each block
        SURFACE_Y: 25,       // Surface level (blocks from top)
        CAVE_START_Y: 40,    // Where caves begin
        BIOMES: ['forest', 'desert', 'mountains'],
        BIOME_WIDTH: 60,     // Width of each biome in blocks
    },

    // =====================
    // PLAYER
    // =====================
    PLAYER: {
        MAX_HEALTH: 8,
        MAX_SHIELD: 5,
        SPEED: 4,
        JUMP_FORCE: -10,
        GRAVITY: 0.5,
        MAX_FALL_SPEED: 12,
        WIDTH: 24,
        HEIGHT: 40,
        REGEN_RATE: 0,       // HP regenerated per second (0 = none, upgradeable)
        HAS_WINGS: false,
        WING_SPEED: -3,
    },

    // =====================
    // TOOLS & WEAPONS
    // =====================
    TOOLS: {
        axe: {
            name: 'Hacha',
            icon: '🪓',
            damage: 1,
            type: 'tool',
            canBreak: ['wood'],
            speed: 400,
            description: 'Tala árboles. Daño: 1',
        },
        shovel: {
            name: 'Pala',
            icon: '🪏',
            damage: 1,
            specialDamage: 4,     // Against sand monsters
            type: 'tool',
            canBreak: ['sand', 'dirt'],
            speed: 350,
            description: 'Excava arena. Daño especial vs monstruos de arena: 4',
        },
        pickaxe: {
            name: 'Pico',
            icon: '⛏',
            damage: 0,
            type: 'tool',
            canBreak: ['stone', 'hardstone', 'iron', 'gold', 'diamond', 'emerald'],
            speed: 500,
            description: 'Rompe bloques de piedra y minerales. No hace daño.',
        },
        sword: {
            name: 'Espada',
            icon: '⚔️',
            damage: 3,
            type: 'weapon',
            speed: 300,
            description: 'Arma cuerpo a cuerpo. Daño: 3',
        },
        hammer: {
            name: 'Martillo',
            icon: '🔨',
            damage: 5,
            type: 'weapon',
            speed: 800,
            description: 'Ataque lento pero poderoso. Daño: 5',
        },
        bow: {
            name: 'Arco',
            icon: '🏹',
            damage: 1,
            type: 'weapon',
            ranged: true,
            speed: 600,
            description: 'Ataque a distancia. Flechas infinitas. Daño: 1',
        },
        trident: {
            name: 'Tridente',
            icon: '🔱',
            damage: 3,
            type: 'weapon',
            electric: true,
            speed: 500,
            description: 'Ataque eléctrico. Daño: 3',
        },
        wings: {
            name: 'Alas',
            icon: '🪽',
            type: 'utility',
            description: 'Permite volar.',
        },
    },

    // =====================
    // ENCHANTED WEAPONS (diamond purchases)
    // =====================
    ENCHANTED: {
        enchanted_sword: {
            name: 'Espada Encantada',
            icon: '⚔️✨',
            damage: 6,
            type: 'weapon',
            speed: 250,
            description: 'Espada mágica. Daño: 6',
        },
        enchanted_bow: {
            name: 'Arco Encantado',
            icon: '🏹✨',
            damage: 3,
            type: 'weapon',
            ranged: true,
            speed: 400,
            description: 'Arco mágico. Flechas de fuego. Daño: 3',
        },
        enchanted_trident: {
            name: 'Tridente Divino',
            icon: '🔱✨',
            damage: 6,
            type: 'weapon',
            electric: true,
            speed: 400,
            description: 'Tridente del trueno. Daño: 6',
        },
        golden_wings: {
            name: 'Alas Doradas',
            icon: '🪽✨',
            type: 'utility',
            description: 'Alas mejoradas. Vuelo más rápido.',
            wingSpeed: -5,
        },
    },

    // =====================
    // BLOCKS & RESOURCES
    // =====================
    BLOCKS: {
        air: { solid: false, color: 'transparent' },
        dirt: { solid: true, color: '#8B5E3C', hardness: 1, tool: 'shovel' },
        grass: { solid: true, color: '#4CAF50', hardness: 1, tool: 'shovel' },
        sand: { solid: true, color: '#F4D03F', hardness: 1, tool: 'shovel' },
        stone: { solid: true, color: '#7F8C8D', hardness: 2, tool: 'pickaxe' },
        hardstone: { solid: true, color: '#566573', hardness: 3, tool: 'pickaxe' },
        iron: { solid: true, color: '#D4AC6E', hardness: 3, tool: 'pickaxe' },
        gold: { solid: true, color: '#F1C40F', hardness: 3, tool: 'pickaxe' },
        diamond: { solid: true, color: '#5DADE2', hardness: 4, tool: 'pickaxe' },
        emerald: { solid: true, color: '#2ECC71', hardness: 4, tool: 'pickaxe' },
        wood: { solid: true, color: '#6D4C2A', hardness: 1, tool: 'axe' },
        leaves: { solid: false, color: '#27AE60', hardness: 0 },
        bedrock: { solid: true, color: '#1C1C1C', hardness: 999 },
    },

    // =====================
    // RESOURCE VALUES (Dinero points)
    // =====================
    RESOURCE_VALUES: {
        sand: 0,
        dirt: 0,
        wood: 4,
        stone: 8,
        hardstone: 10,
        iron: 20,
        gold: 30,
    },

    // =====================
    // ENEMIES
    // =====================
    ENEMIES: {
        TYPES: {
            zombie: {
                name: 'Zombie',
                health: 4,
                damage: 1,
                speed: 1.2,
                color: '#27AE60',
                width: 24,
                height: 38,
                money: 5,
                biome: 'any',
            },
            skeleton: {
                name: 'Esqueleto',
                health: 3,
                damage: 2,
                speed: 1.5,
                color: '#ECF0F1',
                width: 22,
                height: 38,
                money: 8,
                biome: 'any',
                ranged: true,
            },
            sand_monster: {
                name: 'Monstruo de Arena',
                health: 6,
                damage: 2,
                speed: 0.8,
                color: '#D4AC0D',
                width: 30,
                height: 30,
                money: 10,
                biome: 'desert',
                weakTo: 'shovel',
            },
            cave_spider: {
                name: 'Araña de Cueva',
                health: 3,
                damage: 1,
                speed: 2,
                color: '#6C3483',
                width: 28,
                height: 18,
                money: 7,
                biome: 'caves',
            },
            mountain_golem: {
                name: 'Golem de Montaña',
                health: 10,
                damage: 3,
                speed: 0.6,
                color: '#5D6D7E',
                width: 32,
                height: 42,
                money: 15,
                biome: 'mountains',
            },
            boss: {
                name: 'Jefe Oscuro',
                health: 50,
                damage: 5,
                speed: 1.0,
                color: '#8E44AD',
                width: 48,
                height: 56,
                money: 100,
                biome: 'portal',
                isBoss: true,
            },
        },
        SPAWN_RATE_NIGHT: 3000,  // ms between spawn attempts at night
        SPAWN_RATE_DAY: 0,       // No spawning during day (surface)
        SPAWN_RATE_CAVE: 5000,   // Caves always spawn
        MAX_ENEMIES: 10,
    },

    // =====================
    // SHOP
    // =====================
    SHOP: {
        MONEY_ITEMS: [
            { id: 'house', name: 'Casa', icon: '🏠', price: 50, description: 'Punto de respawn y almacén' },
            { id: 'health_potion', name: 'Poción de Vida', icon: '❤️', price: 15, description: '+3 vida' },
            { id: 'shield_potion', name: 'Poción de Escudo', icon: '🛡️', price: 20, description: '+3 escudo' },
            { id: 'sword', name: 'Espada', icon: '⚔️', price: 25, description: 'Arma básica. Daño: 3' },
            { id: 'axe', name: 'Hacha', icon: '🪓', price: 10, description: 'Tala árboles. Daño: 1' },
            { id: 'pickaxe', name: 'Pico', icon: '⛏', price: 10, description: 'Rompe piedra y minerales' },
            { id: 'shovel', name: 'Pala', icon: '🪏', price: 10, description: 'Excava arena y tierra' },
            { id: 'hammer', name: 'Martillo', icon: '🔨', price: 40, description: 'Ataque lento, daño: 5' },
            { id: 'bow', name: 'Arco', icon: '🏹', price: 30, description: 'Ataque a distancia' },
            { id: 'trident', name: 'Tridente', icon: '🔱', price: 60, description: 'Ataque eléctrico, daño: 3' },
            { id: 'wings', name: 'Alas', icon: '🪽', price: 90, description: 'Permite volar' },
            { id: 'health_upgrade', name: '+2 Vida Máxima', icon: '💖', price: 80, description: 'Aumenta vida máxima' },
            { id: 'shield_upgrade', name: '+2 Escudo Máximo', icon: '🛡️+', price: 80, description: 'Aumenta escudo máximo' },
            { id: 'regen', name: 'Regeneración', icon: '✨', price: 100, description: 'Regenera vida lentamente' },
        ],
        DIAMOND_ITEMS: [
            { id: 'enchanted_sword', name: 'Espada Encantada', icon: '⚔️✨', price: 3, description: 'Daño: 6, ataque rápido' },
            { id: 'enchanted_bow', name: 'Arco Encantado', icon: '🏹✨', price: 4, description: 'Flechas de fuego, daño: 3' },
            { id: 'enchanted_trident', name: 'Tridente Divino', icon: '🔱✨', price: 5, description: 'Trueno, daño: 6' },
            { id: 'golden_wings', name: 'Alas Doradas', icon: '🪽✨', price: 6, description: 'Vuelo mejorado' },
        ],
    },

    // =====================
    // VILLAGER TRADES
    // =====================
    VILLAGER_ITEMS: [
        { id: 'health_potion', name: 'Poción de Vida', icon: '❤️' },
        { id: 'shield_potion', name: 'Poción de Escudo', icon: '🛡️' },
        { id: 'sword', name: 'Espada', icon: '⚔️' },
        { id: 'bow', name: 'Arco', icon: '🏹' },
        { id: 'hammer', name: 'Martillo', icon: '🔨' },
        { id: 'diamond_ore', name: 'Diamante', icon: '💎' },
    ],

    // =====================
    // DAY/NIGHT CYCLE
    // =====================
    DAY_NIGHT: {
        DAY_DURATION: 60000,     // ms for full day (60s)
        NIGHT_DURATION: 40000,   // ms for full night (40s)
    },

    // =====================
    // PORTAL / BOSS
    // =====================
    PORTAL: {
        /** 
         * EDITABLE: Number of monsters to kill before portal opens.
         * Change this value to adjust difficulty.
         */
        KILLS_TO_OPEN: 5,
        BOSS_REWARD_MONEY: 200,
    },

    // =====================
    // AUDIO (placeholder paths)
    // =====================
    AUDIO: {
        MUSIC_DAY: 'assets/audio/music_day.mp3',
        MUSIC_NIGHT: 'assets/audio/music_night.mp3',
        MUSIC_BOSS: 'assets/audio/music_boss.mp3',
        SFX_HIT: 'assets/audio/hit.mp3',
        SFX_MINE: 'assets/audio/mine.mp3',
        SFX_MENU: 'assets/audio/menu.mp3',
        SFX_DEATH: 'assets/audio/death.mp3',
        SFX_PORTAL: 'assets/audio/portal.mp3',
        SFX_PURCHASE: 'assets/audio/purchase.mp3',
    },

    // =====================
    // CAMERA
    // =====================
    CAMERA: {
        SMOOTH: 0.1,
        DEAD_ZONE_X: 100,
        DEAD_ZONE_Y: 80,
    },
};
