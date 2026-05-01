// 🐍 Snake Neón - El juego más guay
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del juego
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// Estado del juego
let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop = null;
let gameSpeed = 120;
let particles = [];
let foodHue = 0;
let snakeHue = 0;

// Elementos del DOM
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const finalScoreEl = document.getElementById('finalScore');
const gameOverEl = document.getElementById('gameOver');
const startScreenEl = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// Inicializar récord
highscoreEl.textContent = highScore;

// Clase Partícula para efectos
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 8 + 4;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.life = 1;
        this.decay = Math.random() * 0.03 + 0.02;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.96;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Crear explosión de partículas
function createParticles(x, y, count = 15) {
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff6600'];
    for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color));
    }
}

// Inicializar serpiente
function initSnake() {
    snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
}

// Generar comida
function spawnFood() {
    let validPosition = false;
    while (!validPosition) {
        food.x = Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE));
        food.y = Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE));
        validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
    foodHue = Math.random() * 360;
}

// Dibujar fondo con grid
function drawBackground() {
    // Gradiente de fondo
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(1, '#1a0a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Grid sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
        ctx.stroke();
    }
}

// Dibujar serpiente con efecto neón
function drawSnake() {
    snake.forEach((segment, index) => {
        const x = segment.x * GRID_SIZE;
        const y = segment.y * GRID_SIZE;
        const size = GRID_SIZE - 2;
        
        // Color gradiente a lo largo de la serpiente
        const hue = (snakeHue + index * 15) % 360;
        const saturation = 100;
        const lightness = index === 0 ? 60 : 50;
        
        ctx.save();
        
        // Sombra/brillo neón
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Cuerpo
        const gradient = ctx.createRadialGradient(
            x + size/2, y + size/2, 0,
            x + size/2, y + size/2, size
        );
        gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness + 20}%)`);
        gradient.addColorStop(1, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, size, size, index === 0 ? 8 : 5);
        ctx.fill();
        
        // Ojos en la cabeza
        if (index === 0) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff';
            
            let eyeX1, eyeY1, eyeX2, eyeY2;
            const eyeSize = 4;
            const eyeOffset = 5;
            
            if (direction.x === 1) { // Derecha
                eyeX1 = x + size - eyeOffset;
                eyeY1 = y + eyeOffset;
                eyeX2 = x + size - eyeOffset;
                eyeY2 = y + size - eyeOffset;
            } else if (direction.x === -1) { // Izquierda
                eyeX1 = x + eyeOffset;
                eyeY1 = y + eyeOffset;
                eyeX2 = x + eyeOffset;
                eyeY2 = y + size - eyeOffset;
            } else if (direction.y === -1) { // Arriba
                eyeX1 = x + eyeOffset;
                eyeY1 = y + eyeOffset;
                eyeX2 = x + size - eyeOffset;
                eyeY2 = y + eyeOffset;
            } else { // Abajo
                eyeX1 = x + eyeOffset;
                eyeY1 = y + size - eyeOffset;
                eyeX2 = x + size - eyeOffset;
                eyeY2 = y + size - eyeOffset;
            }
            
            ctx.beginPath();
            ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
            ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupilas
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(eyeX1, eyeY1, 2, 0, Math.PI * 2);
            ctx.arc(eyeX2, eyeY2, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    });
}

// Dibujar comida con efecto pulsante
function drawFood() {
    const x = food.x * GRID_SIZE + GRID_SIZE / 2;
    const y = food.y * GRID_SIZE + GRID_SIZE / 2;
    const time = Date.now() / 200;
    const pulseSize = GRID_SIZE / 2 - 2 + Math.sin(time) * 3;
    
    ctx.save();
    
    // Brillo exterior
    ctx.shadowBlur = 30;
    ctx.shadowColor = `hsl(${foodHue}, 100%, 50%)`;
    
    // Círculo exterior
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseSize);
    gradient.addColorStop(0, `hsl(${foodHue}, 100%, 70%)`);
    gradient.addColorStop(0.5, `hsl(${foodHue}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${(foodHue + 30) % 360}, 100%, 40%)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Centro brillante
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, pulseSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Actualizar partículas
function updateParticles() {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
}

// Mover serpiente
function moveSnake() {
    direction = { ...nextDirection };
    
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    
    // Teletransporte en los bordes
    if (head.x < 0) head.x = CANVAS_SIZE / GRID_SIZE - 1;
    if (head.x >= CANVAS_SIZE / GRID_SIZE) head.x = 0;
    if (head.y < 0) head.y = CANVAS_SIZE / GRID_SIZE - 1;
    if (head.y >= CANVAS_SIZE / GRID_SIZE) head.y = 0;
    
    // Colisión con sí misma
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // Comer comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        
        // Partículas de celebración
        const foodCenterX = food.x * GRID_SIZE + GRID_SIZE / 2;
        const foodCenterY = food.y * GRID_SIZE + GRID_SIZE / 2;
        createParticles(foodCenterX, foodCenterY, 20);
        
        // Aumentar velocidad
        if (gameSpeed > 60) {
            gameSpeed -= 2;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameUpdate, gameSpeed);
        }
        
        spawnFood();
    } else {
        snake.pop();
    }
}

// Actualización principal del juego
function gameUpdate() {
    snakeHue = (snakeHue + 1) % 360;
    
    drawBackground();
    updateParticles();
    moveSnake();
    drawFood();
    drawSnake();
}

// Game Over
function gameOver() {
    clearInterval(gameLoop);
    gameLoop = null;
    
    // Explosión en la cabeza
    const headX = snake[0].x * GRID_SIZE + GRID_SIZE / 2;
    const headY = snake[0].y * GRID_SIZE + GRID_SIZE / 2;
    createParticles(headX, headY, 30);
    
    // Actualizar récord
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highscoreEl.textContent = highScore;
    }
    
    finalScoreEl.textContent = score;
    
    // Animación final
    let frames = 0;
    const deathAnimation = setInterval(() => {
        drawBackground();
        updateParticles();
        drawFood();
        drawSnake();
        frames++;
        if (frames > 30) {
            clearInterval(deathAnimation);
            gameOverEl.classList.remove('hidden');
        }
    }, 30);
}

// Iniciar juego
function startGame() {
    score = 0;
    gameSpeed = 120;
    particles = [];
    scoreEl.textContent = '0';
    
    initSnake();
    spawnFood();
    
    startScreenEl.classList.add('hidden');
    gameOverEl.classList.add('hidden');
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameUpdate, gameSpeed);
}

// Controles de teclado
document.addEventListener('keydown', (e) => {
    if (startScreenEl.classList.contains('hidden') === false) {
        if (e.key === ' ' || e.key === 'Enter') {
            startGame();
        }
        return;
    }
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            break;
    }
    
    e.preventDefault();
});

// Controles móviles
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        switch(dir) {
            case 'up':
                if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
                break;
            case 'down':
                if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
                break;
            case 'left':
                if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
                break;
            case 'right':
                if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
                break;
        }
    });
});

// Botones
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Dibujar estado inicial
drawBackground();
console.log('🐍 Snake Neón cargado! Pulsa EMPEZAR para jugar.');
