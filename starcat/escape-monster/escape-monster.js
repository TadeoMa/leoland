// Canvas y contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas
canvas.width = 800;
canvas.height = 600;

// Elementos del DOM
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const timerElement = document.getElementById('timer');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const winScreen = document.getElementById('winScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const finalScoreElement = document.getElementById('finalScore');
const winScoreElement = document.getElementById('winScore');

// Estado del juego
let gameRunning = false;
let score = 0;
let lives = 3;
let timeLeft = 60;
let timerInterval = null;
let animationId = null;

// Gato (jugador)
const cat = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    speed: 5,
    dx: 0,
    dy: 0,
    invincible: false,
    invincibleTime: 0
};

// Monstruo
const monster = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    speed: 1.2,
    baseSpeed: 1.2
};

// Tartas
let cakes = [];
const maxCakes = 2;

// Controles
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Event listeners para controles
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Botones
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

// Funciones del juego
function startGame() {
    // Ocultar pantallas
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    winScreen.classList.add('hidden');
    
    // Reiniciar estado
    score = 0;
    lives = 3;
    timeLeft = 60;
    gameRunning = true;
    
    // Reiniciar posiciones
    cat.x = canvas.width / 2;
    cat.y = canvas.height / 2;
    cat.invincible = false;
    
    monster.x = 100;
    monster.y = 100;
    monster.speed = monster.baseSpeed;
    
    // Crear tartas
    cakes = [];
    for (let i = 0; i < maxCakes; i++) {
        spawnCake();
    }
    
    // Actualizar UI
    updateUI();
    
    // Iniciar timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (gameRunning) {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            // Aumentar velocidad del monstruo con el tiempo
            monster.speed = monster.baseSpeed + (60 - timeLeft) * 0.03;
            
            if (timeLeft <= 0) {
                winGame();
            }
        }
    }, 1000);
    
    // Iniciar loop del juego
    if (animationId) cancelAnimationFrame(animationId);
    gameLoop();
}

function spawnCake() {
    const cake = {
        x: Math.random() * (canvas.width - 30) + 15,
        y: Math.random() * (canvas.height - 30) + 15,
        width: 30,
        height: 30,
        collected: false
    };
    cakes.push(cake);
}

function updateUI() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    timerElement.textContent = timeLeft;
}

function gameLoop() {
    if (!gameRunning) return;
    
    update();
    draw();
    
    animationId = requestAnimationFrame(gameLoop);
}

function update() {
    // Mover gato
    cat.dx = 0;
    cat.dy = 0;
    
    if (keys.ArrowUp) cat.dy = -cat.speed;
    if (keys.ArrowDown) cat.dy = cat.speed;
    if (keys.ArrowLeft) cat.dx = -cat.speed;
    if (keys.ArrowRight) cat.dx = cat.speed;
    
    // Normalizar diagonal
    if (cat.dx !== 0 && cat.dy !== 0) {
        cat.dx *= 0.707;
        cat.dy *= 0.707;
    }
    
    cat.x += cat.dx;
    cat.y += cat.dy;
    
    // Límites del canvas
    cat.x = Math.max(cat.width / 2, Math.min(canvas.width - cat.width / 2, cat.x));
    cat.y = Math.max(cat.height / 2, Math.min(canvas.height - cat.height / 2, cat.y));
    
    // Mover monstruo hacia el gato
    const dx = cat.x - monster.x;
    const dy = cat.y - monster.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
        monster.x += (dx / distance) * monster.speed;
        monster.y += (dy / distance) * monster.speed;
    }
    
    // Comprobar invencibilidad
    if (cat.invincible) {
        cat.invincibleTime--;
        if (cat.invincibleTime <= 0) {
            cat.invincible = false;
        }
    }
    
    // Colisión con monstruo
    if (!cat.invincible && checkCollision(cat, monster)) {
        lives--;
        updateUI();
        
        if (lives <= 0) {
            gameOver();
        } else {
            // Hacer al gato invencible temporalmente
            cat.invincible = true;
            cat.invincibleTime = 90; // 1.5 segundos a 60fps
            
            // Alejar al monstruo
            monster.x = Math.random() * canvas.width;
            monster.y = Math.random() * canvas.height;
        }
    }
    
    // Colisión con tartas
    cakes.forEach((cake, index) => {
        if (!cake.collected && checkCollision(cat, cake)) {
            cake.collected = true;
            score++;
            lives++;
            updateUI();
            
            // Crear nueva tarta
            setTimeout(() => {
                cakes.splice(index, 1);
                spawnCake();
            }, 100);
        }
    });
}

function checkCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (obj1.width + obj2.width) / 2 - 10;
    return distance < minDistance;
}

function draw() {
    // Limpiar canvas
    ctx.fillStyle = 'rgba(13, 31, 13, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar tartas
    cakes.forEach(cake => {
        if (!cake.collected) {
            drawCake(cake.x, cake.y, cake.width);
        }
    });
    
    // Dibujar gato
    drawCat(cat.x, cat.y, cat.width, cat.invincible);
    
    // Dibujar monstruo
    drawMonster(monster.x, monster.y, monster.width);
}

function drawCat(x, y, size, invincible) {
    ctx.save();
    ctx.translate(x, y);
    
    // Parpadeo si es invencible
    if (invincible && Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }
    
    // Cuerpo
    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.ellipse(0, 0, size / 2, size / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Orejas
    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.moveTo(-size / 3, -size / 4);
    ctx.lineTo(-size / 4, -size / 1.8);
    ctx.lineTo(-size / 6, -size / 4);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(size / 3, -size / 4);
    ctx.lineTo(size / 4, -size / 1.8);
    ctx.lineTo(size / 6, -size / 4);
    ctx.fill();
    
    // Interior orejas
    ctx.fillStyle = '#ffb6c1';
    ctx.beginPath();
    ctx.moveTo(-size / 3.5, -size / 3.5);
    ctx.lineTo(-size / 4, -size / 2.2);
    ctx.lineTo(-size / 5, -size / 3.5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(size / 3.5, -size / 3.5);
    ctx.lineTo(size / 4, -size / 2.2);
    ctx.lineTo(size / 5, -size / 3.5);
    ctx.fill();
    
    // Ojos
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(-size / 5, -size / 10, size / 10, size / 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size / 5, -size / 10, size / 10, size / 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Brillo ojos
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-size / 5 + 2, -size / 10 - 2, size / 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size / 5 + 2, -size / 10 - 2, size / 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Nariz
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.moveTo(0, size / 10);
    ctx.lineTo(-size / 15, size / 6);
    ctx.lineTo(size / 15, size / 6);
    ctx.fill();
    
    // Bigotes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size / 4, size / 8);
    ctx.lineTo(-size / 1.5, size / 12);
    ctx.moveTo(-size / 4, size / 5);
    ctx.lineTo(-size / 1.5, size / 4);
    ctx.moveTo(size / 4, size / 8);
    ctx.lineTo(size / 1.5, size / 12);
    ctx.moveTo(size / 4, size / 5);
    ctx.lineTo(size / 1.5, size / 4);
    ctx.stroke();
    
    ctx.restore();
}

function drawMonster(x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    
    // Sombra/aura
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 20;
    
    // Cuerpo
    ctx.fillStyle = '#2d5a2d';
    ctx.beginPath();
    ctx.ellipse(0, 0, size / 2, size / 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Manchas
    ctx.fillStyle = '#1a3d1a';
    ctx.beginPath();
    ctx.arc(-size / 5, -size / 6, size / 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size / 4, size / 8, size / 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Ojo grande central
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, -size / 10, size / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Iris
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(0, -size / 10, size / 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupila
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, -size / 10, size / 12, size / 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Brillo
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-size / 12, -size / 6, size / 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Boca con dientes
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(0, size / 4, size / 4, 0, Math.PI);
    ctx.fill();
    
    // Dientes
    ctx.fillStyle = '#fff';
    for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size / 10, size / 4);
        ctx.lineTo(i * size / 10 - size / 20, size / 4 + size / 8);
        ctx.lineTo(i * size / 10 + size / 20, size / 4 + size / 8);
        ctx.fill();
    }
    
    // Cuernos pequeños
    ctx.fillStyle = '#1a3d1a';
    ctx.beginPath();
    ctx.moveTo(-size / 3, -size / 4);
    ctx.lineTo(-size / 2.5, -size / 1.8);
    ctx.lineTo(-size / 5, -size / 3);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(size / 3, -size / 4);
    ctx.lineTo(size / 2.5, -size / 1.8);
    ctx.lineTo(size / 5, -size / 3);
    ctx.fill();
    
    ctx.restore();
}

function drawCake(x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    
    // Brillo
    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = 15;
    
    // Base de la tarta
    ctx.fillStyle = '#d2691e';
    ctx.beginPath();
    ctx.ellipse(0, size / 6, size / 2, size / 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Crema
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff5e6';
    ctx.beginPath();
    ctx.ellipse(0, 0, size / 2, size / 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Fresa encima
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(0, -size / 6, size / 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Hojita
    ctx.fillStyle = '#228b22';
    ctx.beginPath();
    ctx.ellipse(size / 10, -size / 3, size / 10, size / 20, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Puntitos de la fresa
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(-size / 15, -size / 6, size / 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size / 15, -size / 8, size / 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function gameOver() {
    gameRunning = false;
    clearInterval(timerInterval);
    cancelAnimationFrame(animationId);
    
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function winGame() {
    gameRunning = false;
    clearInterval(timerInterval);
    cancelAnimationFrame(animationId);
    
    winScoreElement.textContent = score;
    winScreen.classList.remove('hidden');
}

// Dibujar pantalla inicial
function drawInitialScreen() {
    ctx.fillStyle = '#0d1f0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar algunos elementos de muestra
    drawCat(canvas.width / 2, canvas.height / 2, 60, false);
    drawMonster(200, 200, 70);
    drawCake(600, 400, 40);
    drawCake(150, 450, 40);
    drawCake(650, 150, 40);
}

drawInitialScreen();
