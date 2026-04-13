// ==========================================
// DEFINICIONES DE NIVELES Y BUILDERS
// ==========================================

const LEVELS = [
    { name: 'Pradera Verde', world: '1-1', width: 210, skyTop: '#5C94FC', skyBottom: '#87CEEB', groundColor: '#C84C0C', groundTop: '#00A800', theme: 'grass' },
    { name: 'Colinas Altas', world: '1-2', width: 200, skyTop: '#4A84EC', skyBottom: '#77BEDA', groundColor: '#C84C0C', groundTop: '#00A800', theme: 'grass' },
    { name: 'Cueva Oscura', world: '2-1', width: 180, skyTop: '#1a1a2e', skyBottom: '#16213e', groundColor: '#555', groundTop: '#777', theme: 'underground' },
    { name: 'Subterráneo', world: '2-2', width: 190, skyTop: '#0f0f23', skyBottom: '#1a1a3e', groundColor: '#444', groundTop: '#666', theme: 'underground' },
    { name: 'Cielo de Nubes', world: '3-1', width: 180, skyTop: '#87CEEB', skyBottom: '#E0F7FA', groundColor: '#ddd', groundTop: '#fff', theme: 'sky' },
    { name: 'Desierto Caliente', world: '3-2', width: 200, skyTop: '#FF8F00', skyBottom: '#FFE082', groundColor: '#D2B48C', groundTop: '#F5DEB3', theme: 'desert' },
    { name: 'Bosque Profundo', world: '4-1', width: 200, skyTop: '#2E7D32', skyBottom: '#81C784', groundColor: '#5D4037', groundTop: '#4CAF50', theme: 'forest' },
    { name: 'Noche Helada', world: '4-2', width: 190, skyTop: '#1A237E', skyBottom: '#3F51B5', groundColor: '#B0BEC5', groundTop: '#ECEFF1', theme: 'ice' },
    { name: 'Volcán Ardiente', world: '5-1', width: 200, skyTop: '#B71C1C', skyBottom: '#E53935', groundColor: '#4E342E', groundTop: '#FF6F00', theme: 'lava' },
    { name: 'Castillo Final', world: '5-2', width: 220, skyTop: '#212121', skyBottom: '#424242', groundColor: '#555', groundTop: '#888', theme: 'castle' },
];

// ---- Mapa del nivel (tilemap) ----
// Tiles: 0=aire, 1=suelo, 2=ladrillo, 3=bloque ?, 4=tubería base, 5=tubería tope, 6=bandera(meta)
function clearMap(width) {
    LEVEL_WIDTH = width;
    levelMap = [];
    const hasGround = !(DEBUG && DEBUG_OPTIONS.disableGround);
    for (let y = 0; y < LEVEL_HEIGHT; y++) {
        levelMap[y] = [];
        for (let x = 0; x < LEVEL_WIDTH; x++) {
            levelMap[y][x] = (hasGround && y >= 13) ? 1 : 0;
        }
    }
}

function addGaps(gaps) {
    if (DEBUG && DEBUG_OPTIONS.disableGaps) return;
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
    if (DEBUG && DEBUG_OPTIONS.disablePipes) return;
    pipes.forEach(pipe => {
        const topY = 13 - pipe.height;
        if (pipe.x + 1 < LEVEL_WIDTH) {
            levelMap[topY][pipe.x] = 5;
            levelMap[topY][pipe.x + 1] = 5;
            for (let h = topY + 1; h < 13; h++) {
                levelMap[h][pipe.x] = 4;
                levelMap[h][pipe.x + 1] = 4;
            }
            const supportStart = Math.max(0, pipe.x - 2);
            const supportEnd = Math.min(LEVEL_WIDTH - 1, pipe.x + 3);
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

// ---- Generadores de nivel ----
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

function buildLevel0() { addGaps([[68,69],[86,87],[152,153]]); addQuestionBlocks([16,21,22,23,78,94,106,109,112,129,170]); addBricks([[20,9],[24,9],[77,9],[79,9],[80,9],[91,5],[92,5],[93,5],[94,5],[95,5],[96,5],[97,5],[98,5],[100,9],[101,9],[102,9],[118,9],[119,9],[120,9],[128,9],[130,9],[129,5],[140,9],[141,9],[142,9],[143,9]]); addStairs(190, 8); addPipes([{x:28,height:2},{x:38,height:3},{x:46,height:4},{x:57,height:2},{x:115,height:2},{x:160,height:3},{x:175,height:2}]); addFlag(200); }

function buildLevel1() { addGaps([[45,46],[80,82],[120,121],[155,156]]); addQuestionBlocks([12,30,31,55,70,90,105,135,160]); addBricks([[14,9],[15,9],[28,9],[32,9],[50,9],[51,9],[52,9],[65,7],[66,7],[67,7],[68,7],[85,9],[86,9],[87,9],[88,9],[100,5],[101,5],[102,5],[103,5],[104,5],[130,9],[131,9],[132,9],[133,9],[134,9],[136,9],[145,7],[146,7],[147,7]]); addStairs(180, 9); addPipes([{x:20,height:2},{x:40,height:3},{x:60,height:2},{x:95,height:4},{x:115,height:2},{x:140,height:3}]); addFlag(192); }

function buildLevel2() { addGaps([[35,36],[70,72],[110,111]]); addQuestionBlocks([10,25,45,60,75,85,100,125,145]); addBricks([[8,9],[9,9],[10,9],[11,9],[12,9],[22,9],[26,9],[40,7],[41,7],[42,7],[43,7],[44,7],[45,7],[55,9],[56,9],[57,9],[58,9],[59,9],[60,9],[78,5],[79,5],[80,5],[81,5],[90,9],[91,9],[92,9],[93,9],[94,9],[105,7],[106,7],[107,7],[108,7],[109,7],[120,9],[121,9],[122,9],[123,9],[135,5],[136,5],[137,5],[138,5],[139,5],[140,5]]); addStairs(165, 7); addPipes([{x:18,height:2},{x:50,height:3},{x:88,height:2},{x:130,height:3}]); addFlag(174); }

function buildLevel3() { addGaps([[30,32],[60,62],[95,96],[130,131]]); addQuestionBlocks([15,35,50,65,80,100,115,140,155,165]); addBricks([[12,9],[13,9],[14,9],[16,9],[28,7],[29,7],[34,7],[35,7],[36,7],[48,5],[49,5],[50,5],[51,5],[52,5],[68,9],[69,9],[70,9],[82,7],[83,7],[84,7],[85,7],[100,5],[101,5],[102,5],[110,9],[111,9],[112,9],[113,9],[114,9],[116,9],[138,7],[139,7],[140,7],[141,7],[142,7],[150,5],[151,5],[152,5],[153,5]]); addPlatforms([[40,10,5],[75,8,4],[105,6,6],[145,8,3]]); addStairs(175, 8); addPipes([{x:22,height:3},{x:55,height:2},{x:90,height:4},{x:125,height:2},{x:160,height:3}]); addFlag(185); }

function buildLevel4() { for (let x = 10; x < 170; x++) { if (Math.random() < 0.35) { levelMap[13][x] = 0; levelMap[14][x] = 0; } } addPlatforms([[5,11,4],[12,10,5],[20,9,3],[26,11,4],[32,8,5],[40,10,3],[46,7,4],[53,11,5],[60,9,3],[66,10,4],[72,7,5],[80,11,3],[86,8,4],[93,10,5],[100,6,4],[107,9,3],[113,11,4],[120,8,5],[128,10,3],[134,7,4],[140,11,5],[147,9,3],[153,10,4],[160,8,3]]); addQuestionBlocks([14,34,54,74,102,122,142,162]); addBricks([[22,6],[23,6],[48,4],[49,4],[50,4],[88,5],[89,5],[90,5],[125,5],[126,5]]); addFlag(172); }

function buildLevel5() { addGaps([[40,42],[75,77],[115,117],[155,157]]); addQuestionBlocks([18,35,55,70,90,110,130,150,170,185]); addBricks([[15,9],[16,9],[17,9],[19,9],[32,7],[33,7],[34,7],[36,7],[50,9],[51,9],[52,9],[53,9],[54,9],[65,5],[66,5],[67,5],[68,5],[69,5],[85,9],[86,9],[87,9],[88,9],[89,9],[91,9],[105,7],[106,7],[107,7],[108,7],[109,7],[111,7],[125,9],[126,9],[127,9],[128,9],[129,9],[131,9],[145,5],[146,5],[147,5],[148,5],[149,5],[165,9],[166,9],[167,9],[168,9],[169,9],[171,9]]); addStairs(185, 8); addPipes([{x:25,height:2},{x:60,height:3},{x:95,height:2},{x:135,height:4},{x:175,height:2}]); addFlag(195); }

function buildLevel6() { addGaps([[50,51],[90,92],[140,141]]); addQuestionBlocks([12,28,42,58,72,88,102,118,132,148,165,180]); addBricks([[10,9],[11,9],[13,9],[25,7],[26,7],[27,7],[29,7],[38,5],[39,5],[40,5],[41,5],[43,5],[55,9],[56,9],[57,9],[59,9],[68,7],[69,7],[70,7],[71,7],[73,7],[82,5],[83,5],[84,5],[85,5],[86,5],[87,5],[98,9],[99,9],[100,9],[101,9],[103,9],[112,7],[113,7],[114,7],[115,7],[116,7],[117,7],[119,7],[128,5],[129,5],[130,5],[131,5],[133,5],[145,9],[146,9],[147,9],[149,9],[158,7],[159,7],[160,7],[161,7],[162,7],[172,5],[173,5],[174,5],[175,5]]); addPlatforms([[35,10,4],[65,8,3],[95,10,4],[125,8,3],[155,10,4]]); addStairs(185, 8); addPipes([{x:20,height:3},{x:45,height:2},{x:78,height:4},{x:110,height:3},{x:150,height:2},{x:170,height:3}]); addFlag(195); }

function buildLevel7() { addGaps([[35,37],[65,67],[100,102],[140,142]]); addQuestionBlocks([15,30,48,62,78,95,112,128,145,160,175]); addBricks([[12,9],[13,9],[14,9],[16,9],[28,7],[29,7],[31,7],[42,5],[43,5],[44,5],[45,5],[46,5],[47,5],[49,5],[58,9],[59,9],[60,9],[61,9],[63,9],[72,7],[73,7],[74,7],[75,7],[76,7],[77,7],[79,7],[88,5],[89,5],[90,5],[91,5],[92,5],[93,5],[94,5],[96,5],[108,9],[109,9],[110,9],[111,9],[113,9],[122,7],[123,7],[124,7],[125,7],[126,7],[127,7],[129,7],[135,5],[136,5],[137,5],[138,5],[139,5],[150,9],[151,9],[152,9],[153,9],[154,9],[165,7],[166,7],[167,7],[168,7]]); addStairs(178, 7); addPipes([{x:22,height:2},{x:52,height:3},{x:82,height:2},{x:120,height:3},{x:155,height:4}]); addFlag(186); }

function buildLevel8() { addGaps([[25,27],[50,52],[80,82],[115,117],[150,152]]); addQuestionBlocks([12,32,45,65,78,98,112,132,148,165,180]); addBricks([[10,9],[11,9],[13,9],[30,7],[31,7],[33,7],[40,5],[41,5],[42,5],[43,5],[44,5],[46,5],[58,9],[59,9],[60,9],[61,9],[62,9],[63,9],[64,9],[66,9],[72,7],[73,7],[74,7],[75,7],[76,7],[77,7],[79,7],[90,5],[91,5],[92,5],[93,5],[94,5],[95,5],[96,5],[97,5],[99,5],[108,9],[109,9],[110,9],[111,9],[113,9],[125,7],[126,7],[127,7],[128,7],[129,7],[130,7],[131,7],[133,7],[142,5],[143,5],[144,5],[145,5],[146,5],[147,5],[149,5],[158,9],[159,9],[160,9],[161,9],[162,9],[163,9],[164,9],[166,9],[172,7],[173,7],[174,7],[175,7]]); addStairs(185, 9); addPipes([{x:18,height:3},{x:38,height:2},{x:68,height:4},{x:105,height:3},{x:138,height:2},{x:168,height:4}]); addFlag(196); }

function buildLevel9() { addGaps([[20,22],[45,47],[70,72],[100,103],[130,132],[160,162],[185,187]]); addQuestionBlocks([10,28,42,58,68,85,98,118,128,145,155,172,195,205]); addBricks([[8,9],[9,9],[11,9],[25,7],[26,7],[27,7],[29,7],[35,5],[36,5],[37,5],[38,5],[39,5],[40,5],[41,5],[43,5],[52,9],[53,9],[54,9],[55,9],[56,9],[57,9],[59,9],[62,7],[63,7],[64,7],[65,7],[66,7],[67,7],[69,7],[78,5],[79,5],[80,5],[81,5],[82,5],[83,5],[84,5],[86,5],[92,9],[93,9],[94,9],[95,9],[96,9],[97,9],[99,9],[110,7],[111,7],[112,7],[113,7],[114,7],[115,7],[116,7],[117,7],[119,7],[122,5],[123,5],[124,5],[125,5],[126,5],[127,5],[129,5],[138,9],[139,9],[140,9],[141,9],[142,9],[143,9],[144,9],[146,9],[150,7],[151,7],[152,7],[153,7],[154,7],[156,7],[168,9],[169,9],[170,9],[171,9],[173,9],[178,7],[179,7],[180,7],[181,7],[182,7],[183,7],[184,7],[192,5],[193,5],[194,5],[196,5]]); addPlatforms([[30,10,3],[60,8,3],[90,10,3],[120,8,3],[150,10,3],[180,8,3]]); addStairs(205, 8); addPipes([{x:15,height:3},{x:38,height:2},{x:65,height:4},{x:88,height:3},{x:120,height:2},{x:148,height:4},{x:175,height:3},{x:198,height:2}]); addFlag(214); }
