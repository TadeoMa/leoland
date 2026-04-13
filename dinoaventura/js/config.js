// ==========================================
// CONFIGURACIÓN GLOBAL - DINO AVENTURA
// ==========================================

const DEBUG = false;
const DEBUG_OPTIONS = {
    disablePipes: false,
    disableGaps: false,
    disableGround: false,
    disableEnemies: false,
    showCollisionMask: false,
};

// Canvas y contexto (se inicializan en HTML)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constantes de physics
const TILE = 32;
const GRAVITY = 0.6;
const FRICTION = 0.8;
const LEVEL_HEIGHT = 15;

// Variables de estado del juego
let gameState = 'menu'; // menu | levelselect | playing | gameover | win
let currentLevel = 0;
let unlockedLevels = 1;
let levelSelectCursor = 0;
let score = 0;
let lives = 5;
let camera = { x: 0 };
let animFrame = 0;
let frameCount = 0;
let debugDeathMessage = '';
let debugDeathTimer = 0;

// Mapa del nivel
let LEVEL_WIDTH = 210;
let levelMap = [];

// Entidades
let dino, enemies, coins, particles, questionBoxes;

// Colores para rendering
const COLORS = {
    dinoBody: '#4CAF50',
    dinoBelly: '#E8F5E9',
    dinoShell: '#E65100',
    dinoShoe: '#FF6D00',
    dinoEye: '#fff',
    dinoPupil: '#000',
    dinoNose: '#4CAF50',
    sky: '#5C94FC',
    ground: '#C84C0C',
    groundTop: '#00A800',
    brick: '#C84C0C',
    brickLine: '#E09050',
    question: '#FFB300',
    questionMark: '#fff',
    coin: '#FFD700',
    coinShine: '#FFF176',
    pipe: '#d46d0d',
    pipeDark: '#8a5705',
    slime: '#50c06a',
    slimeDark: '#0a793c',
    tortuga: '#4CAF50',
    tortugaDark: '#388E3C',
    cloud: '#fff',
    bush: '#00A800',
    bushDark: '#007000',
    hill: '#00C800',
    hillDark: '#009000',
    flag: '#FF1744',
    flagPole: '#888',
    castle: '#888',
    castleDark: '#555',
};
