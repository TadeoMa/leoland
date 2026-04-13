// ==========================================
// DINO AVENTURA - Motor del Juego 2D
// ==========================================

const DEBUG = true; // Cambiar a false para desactivar mensajes de debug

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE = 32;
const GRAVITY = 0.6;
const FRICTION = 0.8;

// ---- Estado global ----
let gameState = 'menu'; // menu | levelselect | playing | gameover | win
let currentLevel = 0;
let unlockedLevels = 1; // cuántos niveles desbloqueados
let score = 0;
let lives = 5;
let camera = { x: 0 };
let animFrame = 0;
let frameCount = 0;
let debugDeathMessage = '';
let debugDeathTimer = 0;

// ==========================================
// DEFINICIONES DE NIVELES
// ==========================================
const LEVELS = [
    {
        name: 'Pradera Verde',
        world: '1-1',
        width: 210,
        skyTop: '#5C94FC',
        skyBottom: '#87CEEB',
        groundColor: '#C84C0C',
        groundTop: '#00A800',
        theme: 'grass'
    },
    {
        name: 'Colinas Altas',
        world: '1-2',
        width: 200,
        skyTop: '#4A84EC',
        skyBottom: '#77BEDA',
        groundColor: '#C84C0C',
        groundTop: '#00A800',
        theme: 'grass'
    },
    {
        name: 'Cueva Oscura',
        world: '2-1',
        width: 180,
        skyTop: '#1a1a2e',
        skyBottom: '#16213e',
        groundColor: '#555',
        groundTop: '#777',
        theme: 'underground'
    },
    {
        name: 'Subterráneo',
        world: '2-2',
        width: 190,
        skyTop: '#0f0f23',
        skyBottom: '#1a1a3e',
        groundColor: '#444',
        groundTop: '#666',
        theme: 'underground'
    },
    {
        name: 'Cielo de Nubes',
        world: '3-1',
        width: 180,
        skyTop: '#87CEEB',
        skyBottom: '#E0F7FA',
        groundColor: '#ddd',
        groundTop: '#fff',
        theme: 'sky'
    },
    {
        name: 'Desierto Caliente',
        world: '3-2',
        width: 200,
        skyTop: '#FF8F00',
        skyBottom: '#FFE082',
        groundColor: '#D2B48C',
        groundTop: '#F5DEB3',
        theme: 'desert'
    },
    {
        name: 'Bosque Profundo',
        world: '4-1',
        width: 200,
        skyTop: '#2E7D32',
        skyBottom: '#81C784',
        groundColor: '#5D4037',
        groundTop: '#4CAF50',
        theme: 'forest'
    },
    {
        name: 'Noche Helada',
        world: '4-2',
        width: 190,
        skyTop: '#1A237E',
        skyBottom: '#3F51B5',
        groundColor: '#B0BEC5',
        groundTop: '#ECEFF1',
        theme: 'ice'
    },
    {
        name: 'Volcán Ardiente',
        world: '5-1',
        width: 200,
        skyTop: '#B71C1C',
        skyBottom: '#E53935',
        groundColor: '#4E342E',
        groundTop: '#FF6F00',
        theme: 'lava'
    },
    {
        name: 'Castillo Final',
        world: '5-2',
        width: 220,
        skyTop: '#212121',
        skyBottom: '#424242',
        groundColor: '#555',
        groundTop: '#888',
        theme: 'castle'
    },
];

// ---- Entrada de teclado ----
const keys = {};
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    e.preventDefault();
    if (e.code === 'Space' && gameState === 'gameover') {
        startGame();
    }
});
window.addEventListener('keyup', e => { keys[e.code] = false; e.preventDefault(); });

// ==========================================
// Colores / Dibujo de Dino
// ==========================================
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

// ==========================================
// Dibujar a Dino (pixel art simplificado)
// ==========================================
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

    // Sombra zapatos
    ctx.fillStyle = COLORS.dinoShoe;
    ctx.fillRect(4, s - 6, 10, 6);
    ctx.fillRect(18, s - 6, 10, 6);

    // Cuerpo
    ctx.fillStyle = COLORS.dinoBody;
    ctx.beginPath();
    ctx.ellipse(s / 2, s / 2 + 2, 12, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Panza
    ctx.fillStyle = COLORS.dinoBelly;
    ctx.beginPath();
    ctx.ellipse(s / 2, s / 2 + 5, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Caparazón
    ctx.fillStyle = COLORS.dinoShell;
    ctx.beginPath();
    ctx.ellipse(s / 2 - 1, s / 2 - 2, 7, 6, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // Cabeza
    ctx.fillStyle = COLORS.dinoBody;
    ctx.beginPath();
    ctx.ellipse(s / 2 + 6, s / 2 - 10, 9, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Hocico / nariz
    ctx.fillStyle = COLORS.dinoBody;
    ctx.beginPath();
    ctx.ellipse(s / 2 + 14, s / 2 - 10, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fosa nasal
    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.arc(s / 2 + 17, s / 2 - 11, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Ojo blanco
    ctx.fillStyle = COLORS.dinoEye;
    ctx.beginPath();
    ctx.ellipse(s / 2 + 8, s / 2 - 14, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupila
    ctx.fillStyle = COLORS.dinoPupil;
    ctx.beginPath();
    ctx.arc(s / 2 + 10, s / 2 - 14, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Cresta en cabeza (3 triángulos)
    ctx.fillStyle = '#E65100';
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(s / 2 + 1 + i * 5, s / 2 - 16);
        ctx.lineTo(s / 2 + 4 + i * 5, s / 2 - 22);
        ctx.lineTo(s / 2 + 7 + i * 5, s / 2 - 16);
        ctx.fill();
    }

    // Lengua
    if (tongueOut) {
        ctx.fillStyle = '#E53935';
        ctx.beginPath();
        ctx.ellipse(s / 2 + 42, s / 2 - 8, 10, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(s / 2 + 16, s / 2 - 11, 28, 6);
    }

    // Animación caminar: piernas
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

// ==========================================
// Dibujar Slime
// ==========================================
function drawSlime(x, y) {
    ctx.fillStyle = COLORS.slime;
    ctx.beginPath();
    ctx.ellipse(x + TILE / 2, y + 10, 14, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.slimeDark;
    ctx.fillRect(x + 4, y + 10, 24, 16);
    // Pies
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 3, y + 24, 10, 6);
    ctx.fillRect(x + 19, y + 24, 10, 6);
    // Ojos
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x + 11, y + 9, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 21, y + 9, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(x + 13, y + 9, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 23, y + 9, 2, 0, Math.PI * 2); ctx.fill();
    // Cejas
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 7, y + 4); ctx.lineTo(x + 13, y + 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 25, y + 4); ctx.lineTo(x + 19, y + 6); ctx.stroke();
    ctx.lineWidth = 1;
}

// ==========================================
// Dibujar Tortuga 
// ==========================================
function drawTortuga(x, y, frame) {
    // Caparazón
    ctx.fillStyle = COLORS.tortuga;
    ctx.beginPath();
    ctx.ellipse(x + TILE / 2, y + 8, 12, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.tortugaDark;
    ctx.beginPath();
    ctx.ellipse(x + TILE / 2, y + 10, 10, 8, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Cuerpo
    ctx.fillStyle = '#FDD835';
    ctx.fillRect(x + 8, y + 10, 16, 14);
    // Cabeza
    ctx.fillStyle = '#FDD835';
    ctx.beginPath();
    ctx.arc(x + TILE / 2, y + 4, 7, 0, Math.PI * 2);
    ctx.fill();
    // Ojos
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x + 13, y + 2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 20, y + 2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(x + 14, y + 2, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 21, y + 2, 1.5, 0, Math.PI * 2); ctx.fill();
    // Pies
    ctx.fillStyle = '#FF8F00';
    if (frame % 2 === 0) {
        ctx.fillRect(x + 6, y + 24, 8, 6);
        ctx.fillRect(x + 18, y + 24, 8, 6);
    } else {
        ctx.fillRect(x + 4, y + 24, 8, 6);
        ctx.fillRect(x + 20, y + 24, 8, 6);
    }
}

// ==========================================
// Mapa del nivel (tilemap)
// ==========================================
// Tiles: 0=aire, 1=suelo, 2=ladrillo, 3=bloque ?, 4=tubería base, 5=tubería tope,
//        6=bandera(meta)
const LEVEL_HEIGHT = 15;
let LEVEL_WIDTH = 210;
let levelMap = [];

function clearMap(width) {
    LEVEL_WIDTH = width;
    levelMap = [];
    for (let y = 0; y < LEVEL_HEIGHT; y++) {
        levelMap[y] = [];
        for (let x = 0; x < LEVEL_WIDTH; x++) {
            levelMap[y][x] = (y >= 13) ? 1 : 0;
        }
    }
}

function addGaps(gaps) {
    gaps.forEach(([start, end]) => {
        for (let x = start; x <= end; x++) {
            if (x < LEVEL_WIDTH) { levelMap[13][x] = 0; levelMap[14][x] = 0; }
        }
    });
}

function addQuestionBlocks(positions, row) {
    row = row || 9;
    positions.forEach(x => { if (x < LEVEL_WIDTH) levelMap[row][x] = 3; });
}

function addBricks(positions) {
    positions.forEach(([x, y]) => { if (x < LEVEL_WIDTH) levelMap[y][x] = 2; });
}

function addStairs(startX, steps) {
    for (let step = 0; step < steps; step++) {
        for (let h = 0; h <= step; h++) {
            if (startX + step < LEVEL_WIDTH) levelMap[12 - h][startX + step] = 2;
        }
    }
}

function addPipes(pipes) {
    pipes.forEach(pipe => {
        const topY = 13 - pipe.height;
        if (pipe.x + 1 < LEVEL_WIDTH) {
            levelMap[topY][pipe.x] = 5;
            levelMap[topY][pipe.x + 1] = 5;
            for (let h = topY + 1; h < 13; h++) {
                levelMap[h][pipe.x] = 4;
                levelMap[h][pipe.x + 1] = 4;
            }
            // Refuerza suelo debajo y alrededor para evitar caidas al vacio
            // cuando Dino choca lateralmente con la tuberia en bordes de huecos.
            const supportStart = Math.max(0, pipe.x - 1);
            const supportEnd = Math.min(LEVEL_WIDTH - 1, pipe.x + 2);
            for (let sx = supportStart; sx <= supportEnd; sx++) {
                levelMap[13][sx] = 1;
                levelMap[14][sx] = 1;
            }
        }
    });
}

function addFlag(x) {
    if (x < LEVEL_WIDTH) {
        levelMap[5][x] = 6;
        for (let y = 6; y < 13; y++) levelMap[y][x] = 6;
    }
}

function addPlatforms(platforms) {
    platforms.forEach(([px, py, len]) => {
        for (let i = 0; i < len; i++) {
            if (px + i < LEVEL_WIDTH) levelMap[py][px + i] = 2;
        }
    });
}

// ==========================================
// Generadores de nivel
// ==========================================
function buildLevel(levelIdx) {
    const lvl = LEVELS[levelIdx];
    clearMap(lvl.width);
    switch(levelIdx) {
        case 0: buildLevel0(); break;
        case 1: buildLevel1(); break;
        case 2: buildLevel2(); break;
        case 3: buildLevel3(); break;
        case 4: buildLevel4(); break;
        case 5: buildLevel5(); break;
        case 6: buildLevel6(); break;
        case 7: buildLevel7(); break;
        case 8: buildLevel8(); break;
        case 9: buildLevel9(); break;
    }
}

// Nivel 0: Pradera Verde (original)
function buildLevel0() {
    addGaps([[68,69],[86,87],[152,153]]);
    addQuestionBlocks([16,21,22,23,78,94,106,109,112,129,170]);
    addBricks([
        [20,9],[24,9],[77,9],[79,9],[80,9],
        [91,5],[92,5],[93,5],[94,5],[95,5],[96,5],[97,5],[98,5],
        [100,9],[101,9],[102,9],[118,9],[119,9],[120,9],
        [128,9],[130,9],[129,5],[140,9],[141,9],[142,9],[143,9],
    ]);
    addStairs(190, 8);
    addPipes([
        {x:28,height:2},{x:38,height:3},{x:46,height:4},{x:57,height:2},
        {x:115,height:2},{x:160,height:3},{x:175,height:2},
    ]);
    addFlag(200);
}

// Nivel 1: Colinas Altas
function buildLevel1() {
    addGaps([[45,46],[80,82],[120,121],[155,156]]);
    addQuestionBlocks([12,30,31,55,70,90,105,135,160]);
    addBricks([
        [14,9],[15,9],[28,9],[32,9],[50,9],[51,9],[52,9],
        [65,7],[66,7],[67,7],[68,7],
        [85,9],[86,9],[87,9],[88,9],
        [100,5],[101,5],[102,5],[103,5],[104,5],
        [130,9],[131,9],[132,9],[133,9],[134,9],[136,9],
        [145,7],[146,7],[147,7],
    ]);
    addStairs(180, 9);
    addPipes([
        {x:20,height:2},{x:40,height:3},{x:60,height:2},{x:95,height:4},
        {x:115,height:2},{x:140,height:3},
    ]);
    addFlag(192);
}

// Nivel 2: Cueva Oscura
function buildLevel2() {
    addGaps([[35,36],[70,72],[110,111]]);
    addQuestionBlocks([10,25,45,60,75,85,100,125,145]);
    addBricks([
        [8,9],[9,9],[10,9],[11,9],[12,9],
        [22,9],[26,9],[40,7],[41,7],[42,7],[43,7],[44,7],[45,7],
        [55,9],[56,9],[57,9],[58,9],[59,9],[60,9],
        [78,5],[79,5],[80,5],[81,5],
        [90,9],[91,9],[92,9],[93,9],[94,9],
        [105,7],[106,7],[107,7],[108,7],[109,7],
        [120,9],[121,9],[122,9],[123,9],
        [135,5],[136,5],[137,5],[138,5],[139,5],[140,5],
    ]);
    addStairs(165, 7);
    addPipes([{x:18,height:2},{x:50,height:3},{x:88,height:2},{x:130,height:3}]);
    addFlag(174);
}

// Nivel 3: Subterráneo
function buildLevel3() {
    addGaps([[30,32],[60,62],[95,96],[130,131]]);
    addQuestionBlocks([15,35,50,65,80,100,115,140,155,165]);
    addBricks([
        [12,9],[13,9],[14,9],[16,9],
        [28,7],[29,7],[34,7],[35,7],[36,7],
        [48,5],[49,5],[50,5],[51,5],[52,5],
        [68,9],[69,9],[70,9],
        [82,7],[83,7],[84,7],[85,7],
        [100,5],[101,5],[102,5],
        [110,9],[111,9],[112,9],[113,9],[114,9],[116,9],
        [138,7],[139,7],[140,7],[141,7],[142,7],
        [150,5],[151,5],[152,5],[153,5],
    ]);
    addPlatforms([[40,10,5],[75,8,4],[105,6,6],[145,8,3]]);
    addStairs(175, 8);
    addPipes([{x:22,height:3},{x:55,height:2},{x:90,height:4},{x:125,height:2},{x:160,height:3}]);
    addFlag(185);
}

// Nivel 4: Cielo de Nubes — muchas plataformas flotantes
function buildLevel4() {
    // Menos suelo, más plataformas (pero no tanto para que sea más fácil)
    for (let x = 10; x < 170; x++) {
        if (Math.random() < 0.35) { levelMap[13][x] = 0; levelMap[14][x] = 0; }
    }
    addPlatforms([
        [5,11,4],[12,10,5],[20,9,3],[26,11,4],[32,8,5],[40,10,3],
        [46,7,4],[53,11,5],[60,9,3],[66,10,4],[72,7,5],[80,11,3],
        [86,8,4],[93,10,5],[100,6,4],[107,9,3],[113,11,4],
        [120,8,5],[128,10,3],[134,7,4],[140,11,5],[147,9,3],[153,10,4],
        [160,8,3],
    ]);
    addQuestionBlocks([14,34,54,74,102,122,142,162]);
    addBricks([
        [22,6],[23,6],[48,4],[49,4],[50,4],
        [88,5],[89,5],[90,5],[125,5],[126,5],
    ]);
    addFlag(172);
}

// Nivel 5: Desierto Caliente
function buildLevel5() {
    addGaps([[40,42],[75,77],[115,117],[155,157]]);
    addQuestionBlocks([18,35,55,70,90,110,130,150,170,185]);
    addBricks([
        [15,9],[16,9],[17,9],[19,9],
        [32,7],[33,7],[34,7],[36,7],
        [50,9],[51,9],[52,9],[53,9],[54,9],
        [65,5],[66,5],[67,5],[68,5],[69,5],
        [85,9],[86,9],[87,9],[88,9],[89,9],[91,9],
        [105,7],[106,7],[107,7],[108,7],[109,7],[111,7],
        [125,9],[126,9],[127,9],[128,9],[129,9],[131,9],
        [145,5],[146,5],[147,5],[148,5],[149,5],
        [165,9],[166,9],[167,9],[168,9],[169,9],[171,9],
    ]);
    addStairs(185, 8);
    addPipes([{x:25,height:2},{x:60,height:3},{x:95,height:2},{x:135,height:4},{x:175,height:2}]);
    addFlag(195);
}

// Nivel 6: Bosque Profundo
function buildLevel6() {
    addGaps([[50,51],[90,92],[140,141]]);
    addQuestionBlocks([12,28,42,58,72,88,102,118,132,148,165,180]);
    addBricks([
        [10,9],[11,9],[13,9],[25,7],[26,7],[27,7],[29,7],
        [38,5],[39,5],[40,5],[41,5],[43,5],
        [55,9],[56,9],[57,9],[59,9],
        [68,7],[69,7],[70,7],[71,7],[73,7],
        [82,5],[83,5],[84,5],[85,5],[86,5],[87,5],
        [98,9],[99,9],[100,9],[101,9],[103,9],
        [112,7],[113,7],[114,7],[115,7],[116,7],[117,7],[119,7],
        [128,5],[129,5],[130,5],[131,5],[133,5],
        [145,9],[146,9],[147,9],[149,9],
        [158,7],[159,7],[160,7],[161,7],[162,7],
        [172,5],[173,5],[174,5],[175,5],
    ]);
    addPlatforms([[35,10,4],[65,8,3],[95,10,4],[125,8,3],[155,10,4]]);
    addStairs(185, 8);
    addPipes([{x:20,height:3},{x:45,height:2},{x:78,height:4},{x:110,height:3},{x:150,height:2},{x:170,height:3}]);
    addFlag(195);
}

// Nivel 7: Noche Helada
function buildLevel7() {
    addGaps([[35,37],[65,67],[100,102],[140,142]]);
    addQuestionBlocks([15,30,48,62,78,95,112,128,145,160,175]);
    addBricks([
        [12,9],[13,9],[14,9],[16,9],
        [28,7],[29,7],[31,7],
        [42,5],[43,5],[44,5],[45,5],[46,5],[47,5],[49,5],
        [58,9],[59,9],[60,9],[61,9],[63,9],
        [72,7],[73,7],[74,7],[75,7],[76,7],[77,7],[79,7],
        [88,5],[89,5],[90,5],[91,5],[92,5],[93,5],[94,5],[96,5],
        [108,9],[109,9],[110,9],[111,9],[113,9],
        [122,7],[123,7],[124,7],[125,7],[126,7],[127,7],[129,7],
        [135,5],[136,5],[137,5],[138,5],[139,5],
        [150,9],[151,9],[152,9],[153,9],[154,9],
        [165,7],[166,7],[167,7],[168,7],
    ]);
    addStairs(178, 7);
    addPipes([{x:22,height:2},{x:52,height:3},{x:82,height:2},{x:120,height:3},{x:155,height:4}]);
    addFlag(186);
}

// Nivel 8: Volcán Ardiente
function buildLevel8() {
    addGaps([[25,27],[50,52],[80,82],[115,117],[150,152]]);
    addQuestionBlocks([12,32,45,65,78,98,112,132,148,165,180]);
    addBricks([
        [10,9],[11,9],[13,9],
        [30,7],[31,7],[33,7],
        [40,5],[41,5],[42,5],[43,5],[44,5],[46,5],
        [58,9],[59,9],[60,9],[61,9],[62,9],[63,9],[64,9],[66,9],
        [72,7],[73,7],[74,7],[75,7],[76,7],[77,7],[79,7],
        [90,5],[91,5],[92,5],[93,5],[94,5],[95,5],[96,5],[97,5],[99,5],
        [108,9],[109,9],[110,9],[111,9],[113,9],
        [125,7],[126,7],[127,7],[128,7],[129,7],[130,7],[131,7],[133,7],
        [142,5],[143,5],[144,5],[145,5],[146,5],[147,5],[149,5],
        [158,9],[159,9],[160,9],[161,9],[162,9],[163,9],[164,9],[166,9],
        [172,7],[173,7],[174,7],[175,7],
    ]);
    addStairs(185, 9);
    addPipes([{x:18,height:3},{x:38,height:2},{x:68,height:4},{x:105,height:3},{x:138,height:2},{x:168,height:4}]);
    addFlag(196);
}

// Nivel 9: Castillo Final — el más difícil
function buildLevel9() {
    addGaps([[20,22],[45,47],[70,72],[100,103],[130,132],[160,162],[185,187]]);
    addQuestionBlocks([10,28,42,58,68,85,98,118,128,145,155,172,195,205]);
    addBricks([
        [8,9],[9,9],[11,9],
        [25,7],[26,7],[27,7],[29,7],
        [35,5],[36,5],[37,5],[38,5],[39,5],[40,5],[41,5],[43,5],
        [52,9],[53,9],[54,9],[55,9],[56,9],[57,9],[59,9],
        [62,7],[63,7],[64,7],[65,7],[66,7],[67,7],[69,7],
        [78,5],[79,5],[80,5],[81,5],[82,5],[83,5],[84,5],[86,5],
        [92,9],[93,9],[94,9],[95,9],[96,9],[97,9],[99,9],
        [110,7],[111,7],[112,7],[113,7],[114,7],[115,7],[116,7],[117,7],[119,7],
        [122,5],[123,5],[124,5],[125,5],[126,5],[127,5],[129,5],
        [138,9],[139,9],[140,9],[141,9],[142,9],[143,9],[144,9],[146,9],
        [150,7],[151,7],[152,7],[153,7],[154,7],[156,7],
        [168,9],[169,9],[170,9],[171,9],[173,9],
        [178,7],[179,7],[180,7],[181,7],[182,7],[183,7],[184,7],
        [192,5],[193,5],[194,5],[196,5],
    ]);
    addPlatforms([[30,10,3],[60,8,3],[90,10,3],[120,8,3],[150,10,3],[180,8,3]]);
    addStairs(205, 8);
    addPipes([{x:15,height:3},{x:38,height:2},{x:65,height:4},{x:88,height:3},{x:120,height:2},{x:148,height:4},{x:175,height:3},{x:198,height:2}]);
    addFlag(214);
}

// ==========================================
// Entidades
// ==========================================
let dino, enemies, coins, particles, questionBoxes;

function initEntities(levelIdx) {
    dino = {
        x: 3 * TILE, y: 11 * TILE,
        w: TILE, h: TILE,
        vx: 0, vy: 0,
        dir: 1,
        onGround: false,
        jumpCount: 0,
        walkFrame: 0,
        walkTimer: 0,
        tongue: false,
        tongueTimer: 0,
        invincible: 0,
    };

    // Generar enemigos según nivel
    enemies = generateEnemies(levelIdx);

    coins = [];
    questionBoxes = new Set();

    // Escanear el mapa buscando bloques ?
    for (let y = 0; y < LEVEL_HEIGHT; y++) {
        for (let x = 0; x < LEVEL_WIDTH; x++) {
            if (levelMap[y][x] === 3) questionBoxes.add(`${y},${x}`);
        }
    }

    // Monedas flotantes generadas proceduralmente
    const coinSpacing = 15 + Math.floor(Math.random() * 5);
    for (let i = coinSpacing; i < LEVEL_WIDTH - 15; i += coinSpacing + Math.floor(Math.random() * 10)) {
        const cy = 6 + Math.floor(Math.random() * 4);
        // Solo poner si hay aire
        if (levelMap[cy] && levelMap[cy][i] === 0 && levelMap[cy][i+1] === 0 && levelMap[cy][i+2] === 0) {
            coins.push({ x: i * TILE + 8, y: cy * TILE + 8, w: 16, h: 16, collected: false });
            coins.push({ x: (i+1) * TILE + 8, y: cy * TILE + 8, w: 16, h: 16, collected: false });
            coins.push({ x: (i+2) * TILE + 8, y: cy * TILE + 8, w: 16, h: 16, collected: false });
        }
    }

    particles = [];
}

function generateEnemies(levelIdx) {
    const lvl = LEVELS[levelIdx];
    const result = [];
    const baseCount = 4 + levelIdx * 1; // menos enemigos — más fácil
    const spacing = Math.floor((lvl.width - 30) / baseCount);

    for (let i = 0; i < baseCount; i++) {
        const x = 15 + i * spacing + Math.floor(Math.random() * (spacing / 2));
        if (x >= lvl.width - 10) continue;
        // Verificar que hay suelo
        if (levelMap[13] && levelMap[13][x] === 0) continue;

        const isTortuga = Math.random() < 0.2 + levelIdx * 0.02;
        result.push({
            type: isTortuga ? 'tortuga' : 'slime',
            x: x * TILE,
            y: (isTortuga ? 11 : 12) * TILE,
            vx: -0.6 - (levelIdx * 0.05),
            alive: true,
        });
    }
    return result;
}

// ==========================================
// Colisión tile
// ==========================================
function getTile(px, py) {
    const tx = Math.floor(px / TILE);
    const ty = Math.floor(py / TILE);
    if (tx < 0 || tx >= LEVEL_WIDTH || ty < 0 || ty >= LEVEL_HEIGHT) return 0;
    return levelMap[ty][tx];
}

function isSolid(tile) {
    return tile === 1 || tile === 2 || tile === 3 || tile === 4 || tile === 5;
}

// ==========================================
// Física y movimiento de Dino
// ==========================================
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
    const right = dino.x + dino.w - margin;
    const top = dino.y;
    const bottom = dino.y + dino.h;

    dino.onGround = false;

    // Piso
    if (isSolid(getTile(left, bottom)) || isSolid(getTile(right, bottom))) {
        dino.y = Math.floor(bottom / TILE) * TILE - dino.h;
        dino.vy = 0;
        dino.onGround = true;
        dino.jumpCount = 0;
    }

    // Techo
    if (isSolid(getTile(left, top)) || isSolid(getTile(right, top))) {
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
                // Soltar moneda
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

// ==========================================
// Enemigos
// ==========================================
function updateEnemies() {
    enemies.forEach(e => {
        if (!e.alive) return;

        // Solo mover si está cerca del jugador
        if (Math.abs(e.x - dino.x) > 600) return;

        e.x += e.vx;

        // Colisión con tiles para dar vuelta
        const nextX = e.vx > 0 ? e.x + TILE : e.x;
        const feetY = e.type === 'tortuga' ? e.y + TILE : e.y + TILE;
        if (isSolid(getTile(nextX, feetY - 4))) {
            e.vx *= -1;
        }
        // Caer si no hay suelo
        if (!isSolid(getTile(e.x + TILE / 2, feetY + 2))) {
            // Don't reverse at edges, let them patrol (optional: uncomment to make them patrol)
            e.vx *= -1;
        }

        // Colisión con Dino — tocar un enemigo siempre hace daño
        if (dino.invincible <= 0) {
            const dx = (dino.x + dino.w / 2) - (e.x + TILE / 2);
            const dy = (dino.y + dino.h / 2) - (e.y + TILE / 2);
            if (Math.abs(dx) < TILE * 0.7 && Math.abs(dy) < TILE * 0.7) {
                loseLife(`Colisión con ${e.type}`);
            }
        }

        // Lengua de Dino
        if (dino.tongue && dino.tongueTimer > 0) {
            const tongueX = dino.dir === 1 ? dino.x + TILE : dino.x - 48;
            const tongueW = 64;
            if (tongueX < e.x + TILE && tongueX + tongueW > e.x &&
                dino.y - 8 < e.y + TILE && dino.y + 16 > e.y) {
                e.alive = false;
                score += 30;
                playSound('stomp');
                particles.push({ x: e.x, y: e.y, life: 15, type: 'poof' });
                updateHUD();
            }
        }
    });
}

// ==========================================
// Monedas
// ==========================================
function updateCoins() {
    coins.forEach(c => {
        if (c.collected) return;
        if (Math.abs(dino.x - c.x) < 24 && Math.abs(dino.y - c.y) < 24) {
            c.collected = true;
            score += 10;
            playSound('coin');
            updateHUD();
        }
    });
}

// ==========================================
// Partículas
// ==========================================
function updateParticles() {
    particles.forEach(p => {
        p.life--;
        if (p.type === 'coin') {
            p.y += p.vy;
            p.vy += 0.3;
        } else if (p.type === 'brick') {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.4;
        }
    });
    particles = particles.filter(p => p.life > 0);
}

// ==========================================
// Cámara
// ==========================================
function updateCamera() {
    const target = dino.x - canvas.width / 3;
    camera.x = Math.max(0, Math.min(target, LEVEL_WIDTH * TILE - canvas.width));
}

// ==========================================
// Meta / Bandera
// ==========================================
function checkWin() {
    const tx = Math.floor((dino.x + dino.w / 2) / TILE);
    // Buscar la bandera en el mapa
    for (let y = 5; y <= 12; y++) {
        if (tx >= 0 && tx < LEVEL_WIDTH && levelMap[y][tx] === 6) {
            if (currentLevel === 9) {
                // Último nivel — ganaste todo
                gameState = 'win';
                document.getElementById('winScore').textContent = `Monedas: ${score} | Nivel Final completado`;
                document.getElementById('winScreen').style.display = 'block';
            } else {
                // Desbloquear siguiente nivel
                currentLevel++;
                if (currentLevel >= unlockedLevels) {
                    unlockedLevels = currentLevel + 1;
                    try { localStorage.setItem('dinoUnlocked', unlockedLevels); } catch(e) {}
                }
                // Ir a selección de nivel
                gameState = 'levelselect';
                showLevelSelect();
            }
            return;
        }
    }
}

// ==========================================
// Vidas
// ==========================================
function loseLife(reason = 'desconocido') {
    if (dino.invincible > 0) return;
    if (DEBUG) {
        debugDeathMessage = `Dino perdio una vida. Razon: ${reason}`;
        debugDeathTimer = 180;
    }
    lives--;
    playSound('die');
    updateHUD();
    if (lives <= 0) {
        gameState = 'gameover';
        document.getElementById('finalScore').textContent = `Monedas: ${score} | Mundo: ${LEVELS[currentLevel].world}`;
        document.getElementById('gameOverScreen').style.display = 'block';
    } else {
        // Reiniciar posición en el nivel actual
        dino.x = 3 * TILE;
        dino.y = 11 * TILE;
        dino.vx = 0;
        dino.vy = 0;
        dino.jumpCount = 0;
        dino.invincible = 180;
        camera.x = 0;
    }
}

// ==========================================
// HUD
// ==========================================
function updateHUD() {
    document.getElementById('scoreDisplay').textContent = `Monedas: ${score}`;
    document.getElementById('livesDisplay').textContent = `Vidas: ${lives}`;
}

// ==========================================
// Sonidos simples con AudioContext
// ==========================================
let audioCtx = null;
function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playSound(type) {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.1;

        switch (type) {
            case 'jump':
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.2);
                break;
            case 'coin':
                osc.type = 'square';
                osc.frequency.setValueAtTime(988, ctx.currentTime);
                osc.frequency.setValueAtTime(1319, ctx.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.15);
                break;
            case 'stomp':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.15);
                break;
            case 'break':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.25);
                break;
            case 'die':
                osc.type = 'square';
                osc.frequency.setValueAtTime(500, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.6);
                break;
        }
    } catch (e) { /* silently ignore audio errors */ }
}

// ==========================================
// RENDERING
// ==========================================
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lvl = LEVELS[currentLevel];

    // Cielo con tema del nivel
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, lvl.skyTop);
    gradient.addColorStop(1, lvl.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Efecto especial para lava
    if (lvl.theme === 'lava') {
        ctx.fillStyle = 'rgba(255,100,0,0.1)';
        ctx.fillRect(0, canvas.height - 64, canvas.width, 64);
    }

    ctx.save();
    ctx.translate(-camera.x, 0);

    // Decoraciones de fondo
    drawBackground();

    // Tiles
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

    // Monedas
    coins.forEach(c => {
        if (c.collected) return;
        drawCoin(c.x, c.y);
    });

    // Enemigos
    enemies.forEach(e => {
        if (!e.alive) return;
        if (e.type === 'slime') drawSlime(e.x, e.y);
        else drawTortuga(e.x, e.y, animFrame);
    });

    // Partículas
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

    // Dino
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

// ---- Tiles de dibujo ----
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
    // Líneas de ladrillo
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
    // Signo ?
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
    ctx.strokeRect(x - 2, y, TILE * 2 + 4, TILE);
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
    // Asta
    ctx.fillStyle = COLORS.flagPole;
    ctx.fillRect(x + 14, y, 4, TILE);
    // Bandera en el tope
    if (y === 5 * TILE) {
        ctx.fillStyle = COLORS.flag;
        ctx.beginPath();
        ctx.moveTo(x + 14, y);
        ctx.lineTo(x - 14, y + 16);
        ctx.lineTo(x + 14, y + 32);
        ctx.fill();
        // Esfera
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

// ---- Fondo / decoración ----
function drawBackground() {
    const lvl = LEVELS[currentLevel];
    const theme = lvl.theme;

    // Nubes (no en underground/cave/lava/castle)
    if (theme !== 'underground' && theme !== 'lava' && theme !== 'castle') {
        const clouds = [
            [200, 50, 1.2], [600, 70, 0.8], [1200, 40, 1.0],
            [1800, 80, 1.3], [2400, 50, 0.9], [3200, 60, 1.1],
            [4000, 45, 1.0], [4800, 75, 0.8], [5600, 55, 1.2],
        ];
        clouds.forEach(([cx, cy, scale]) => {
            drawCloud(cx, cy, scale);
        });
    }

    // Colinas (solo en grass, forest, desert)
    if (theme === 'grass' || theme === 'forest' || theme === 'desert') {
        const hillColor = theme === 'desert' ? '#D2B48C' : theme === 'forest' ? '#1B5E20' : COLORS.hill;
        const hillDark = theme === 'desert' ? '#C8A882' : theme === 'forest' ? '#0D3310' : COLORS.hillDark;
        const hills = [
            [100, 13 * TILE, 120, 60], [800, 13 * TILE, 180, 90],
            [1800, 13 * TILE, 140, 70], [3000, 13 * TILE, 160, 80],
            [4200, 13 * TILE, 120, 60], [5400, 13 * TILE, 180, 90],
        ];
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

    // Arbustos (solo grass, forest)
    if (theme === 'grass' || theme === 'forest') {
        const bushes = [
            [300, 13 * TILE], [1000, 13 * TILE], [1600, 13 * TILE],
            [2500, 13 * TILE], [3500, 13 * TILE], [4500, 13 * TILE],
            [5500, 13 * TILE],
        ];
        bushes.forEach(([bx, by]) => {
            drawBush(bx, by);
        });
    }

    // Estrellas en niveles nocturnos/underground
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

    // Lava en niveles volcánicos
    if (theme === 'lava') {
        for (let x = 0; x < LEVEL_WIDTH * TILE; x += 64) {
            ctx.fillStyle = `rgba(255,${60 + Math.sin(frameCount * 0.05 + x * 0.01) * 40},0,0.4)`;
            ctx.fillRect(x, 13 * TILE + 20, 64, 44);
        }
    }

    // Copos de nieve en hielo
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

// ==========================================
// GAME LOOP
// ==========================================
function gameLoop() {
    if (gameState === 'levelselect') {
        renderLevelSelectBg();
        requestAnimationFrame(gameLoop);
        return;
    }
    if (gameState !== 'playing') {
        requestAnimationFrame(gameLoop);
        return;
    }

    frameCount++;
    if (frameCount % 10 === 0) animFrame++;

    updateDino();
    updateEnemies();
    updateCoins();
    updateParticles();
    updateCamera();
    checkWin();
    render();

    requestAnimationFrame(gameLoop);
}

// ==========================================
// Iniciar juego
// ==========================================
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('winScreen').style.display = 'none';

    // Cargar progreso
    try {
        const saved = localStorage.getItem('dinoUnlocked');
        if (saved) unlockedLevels = Math.max(unlockedLevels, parseInt(saved));
    } catch(e) {}

    score = 0;
    lives = 3;
    updateHUD();

    gameState = 'levelselect';
    showLevelSelect();
}

function showLevelSelect() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('winScreen').style.display = 'none';
    document.getElementById('levelSelectScreen').style.display = 'block';
    gameState = 'levelselect';

    const grid = document.getElementById('levelGrid');
    grid.innerHTML = '';
    LEVELS.forEach((lvl, i) => {
        const btn = document.createElement('button');
        btn.className = 'level-btn' + (i < unlockedLevels ? ' unlocked' : ' locked');
        if (i === currentLevel) btn.className += ' current';
        btn.innerHTML = `<span class="lvl-num">${lvl.world}</span><span class="lvl-name">${lvl.name}</span>`;
        if (i < unlockedLevels) {
            btn.onclick = () => startLevel(i);
        } else {
            btn.innerHTML += '<span class="lock-icon">🔒</span>';
        }
        grid.appendChild(btn);
    });

    // Dibujar fondo estático
    renderLevelSelectBg();
}

function renderLevelSelectBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estrellas decorativas
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 60; i++) {
        const sx = (i * 137 + 50) % canvas.width;
        const sy = (i * 89 + 30) % canvas.height;
        ctx.globalAlpha = 0.3 + (i % 5) * 0.15;
        ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1;
}

function startLevel(levelIdx) {
    currentLevel = levelIdx;
    document.getElementById('levelSelectScreen').style.display = 'none';

    camera.x = 0;
    frameCount = 0;
    animFrame = 0;

    buildLevel(levelIdx);
    initEntities(levelIdx);
    updateHUD();
    document.getElementById('levelDisplay').textContent = `Mundo ${LEVELS[levelIdx].world}`;

    gameState = 'playing';
}

// Arrancar loop de rendering
requestAnimationFrame(gameLoop);

function backToMenu() {
    document.getElementById('levelSelectScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
    gameState = 'menu';
}

function goToLevelSelect() {
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('winScreen').style.display = 'none';
    score = 0;
    lives = 3;
    updateHUD();
    gameState = 'levelselect';
    showLevelSelect();
}
