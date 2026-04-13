// === STAR CAT INVADERS ===
// Un juego estilo Space Invaders con temática de gatos espaciales

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas
canvas.width = 800;
canvas.height = 600;

// Estado del juego
let gameState = 'start'; // start, playing, gameOver, win
let score = 0;
let lives = 3;
let level = 1;

// Teclas presionadas
const keys = {
    left: false,
    right: false,
    space: false
};

// === CLASES DEL JUEGO ===

// Jugador (Nave gato)
class Player {
    constructor() {
        this.width = 60;
        this.height = 50;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.speed = 7;
        this.bullets = [];
        this.canShoot = true;
        this.shootCooldown = 250;
    }

    draw() {
        // Cuerpo de la nave (forma de gato)
        ctx.save();
        
        // Nave principal
        ctx.fillStyle = '#ff69b4';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        // Brillo
        ctx.fillStyle = '#ffb6c1';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + 10);
        ctx.lineTo(this.x + this.width - 15, this.y + this.height - 10);
        ctx.lineTo(this.x + 15, this.y + this.height - 10);
        ctx.closePath();
        ctx.fill();
        
        // Orejas de gato
        ctx.fillStyle = '#ff69b4';
        // Oreja izquierda
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 15);
        ctx.lineTo(this.x - 5, this.y - 10);
        ctx.lineTo(this.x + 20, this.y + 10);
        ctx.closePath();
        ctx.fill();
        
        // Oreja derecha
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 10, this.y + 15);
        ctx.lineTo(this.x + this.width + 5, this.y - 10);
        ctx.lineTo(this.x + this.width - 20, this.y + 10);
        ctx.closePath();
        ctx.fill();
        
        // Ojos
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 10, this.y + 25, 6, 0, Math.PI * 2);
        ctx.arc(this.x + this.width / 2 + 10, this.y + 25, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilas
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 10, this.y + 25, 3, 0, Math.PI * 2);
        ctx.arc(this.x + this.width / 2 + 10, this.y + 25, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Propulsores
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffa500';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(this.x + 15, this.y + this.height);
        ctx.lineTo(this.x + 25, this.y + this.height + 15 + Math.random() * 5);
        ctx.lineTo(this.x + 35, this.y + this.height);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 35, this.y + this.height);
        ctx.lineTo(this.x + this.width - 25, this.y + this.height + 15 + Math.random() * 5);
        ctx.lineTo(this.x + this.width - 15, this.y + this.height);
        ctx.fill();
        
        ctx.restore();
    }

    update() {
        if (keys.left && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys.right && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
        if (keys.space && this.canShoot) {
            this.shoot();
        }

        // Actualizar balas
        this.bullets = this.bullets.filter(bullet => bullet.y > 0);
        this.bullets.forEach(bullet => bullet.update());
    }

    shoot() {
        this.bullets.push(new Bullet(this.x + this.width / 2 - 3, this.y, -10, '#ffd700'));
        this.canShoot = false;
        setTimeout(() => this.canShoot = true, this.shootCooldown);
    }
}

// Bala
class Bullet {
    constructor(x, y, speed, color) {
        this.x = x;
        this.y = y;
        this.width = 6;
        this.height = 15;
        this.speed = speed;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }

    update() {
        this.y += this.speed;
    }
}

// Enemigo (Alien gato malvado)
class Enemy {
    constructor(x, y, type = 1) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 35;
        this.type = type;
        this.colors = ['#9b59b6', '#e74c3c', '#27ae60'];
        this.color = this.colors[type - 1];
        this.points = type * 10;
    }

    draw() {
        ctx.save();
        
        // Cuerpo del alien gato
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y + 10, this.width, this.height - 10, 8);
        ctx.fill();
        
        // Orejas
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 12);
        ctx.lineTo(this.x + 10, this.y);
        ctx.lineTo(this.x + 15, this.y + 12);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 15, this.y + 12);
        ctx.lineTo(this.x + this.width - 10, this.y);
        ctx.lineTo(this.x + this.width - 5, this.y + 12);
        ctx.closePath();
        ctx.fill();
        
        // Ojos malvados
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 20, 5, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - 12, this.y + 20, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilas de gato (verticales)
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 10, this.y + 17, 4, 8);
        ctx.fillRect(this.x + this.width - 14, this.y + 17, 4, 8);
        
        // Boca malvada
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 15, this.y + 28);
        ctx.lineTo(this.x + 20, this.y + 32);
        ctx.lineTo(this.x + 25, this.y + 28);
        ctx.stroke();
        
        ctx.restore();
    }
}

// Sistema de enemigos
class EnemyManager {
    constructor() {
        this.enemies = [];
        this.bullets = [];
        this.direction = 1;
        this.speed = 1 + (level * 0.3);
        this.dropDistance = 20;
        this.shootChance = 0.002 + (level * 0.001);
        this.init();
    }

    init() {
        this.enemies = [];
        const rows = 4;
        const cols = 8;
        const startX = 80;
        const startY = 60;
        const spacingX = 60;
        const spacingY = 50;

        for (let row = 0; row < rows; row++) {
            const type = row < 1 ? 3 : (row < 2 ? 2 : 1);
            for (let col = 0; col < cols; col++) {
                this.enemies.push(new Enemy(
                    startX + col * spacingX,
                    startY + row * spacingY,
                    type
                ));
            }
        }
    }

    update() {
        // Mover enemigos
        let shouldDrop = false;
        
        this.enemies.forEach(enemy => {
            enemy.x += this.speed * this.direction;
            
            if (enemy.x <= 10 || enemy.x + enemy.width >= canvas.width - 10) {
                shouldDrop = true;
            }
        });

        if (shouldDrop) {
            this.direction *= -1;
            this.enemies.forEach(enemy => {
                enemy.y += this.dropDistance;
            });
        }

        // Disparar aleatoriamente
        if (this.enemies.length > 0 && Math.random() < this.shootChance) {
            const shooter = this.enemies[Math.floor(Math.random() * this.enemies.length)];
            this.bullets.push(new Bullet(
                shooter.x + shooter.width / 2 - 3,
                shooter.y + shooter.height,
                5,
                '#e74c3c'
            ));
        }

        // Actualizar balas enemigas
        this.bullets = this.bullets.filter(bullet => bullet.y < canvas.height);
        this.bullets.forEach(bullet => bullet.update());
    }

    draw() {
        this.enemies.forEach(enemy => enemy.draw());
        this.bullets.forEach(bullet => bullet.draw());
    }
}

// Sistema de partículas para explosiones
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// === VARIABLES GLOBALES DEL JUEGO ===
let player;
let enemyManager;
let particles = [];
let stars = [];

// Crear estrellas de fondo
function createStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.2,
            brightness: Math.random()
        });
    }
}

// Dibujar fondo estrellado
function drawStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
        
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + star.brightness * 0.7})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Crear explosión
function createExplosion(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// === COLISIONES ===
function checkCollisions() {
    // Balas del jugador vs enemigos
    player.bullets.forEach((bullet, bulletIndex) => {
        enemyManager.enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                
                // Eliminar bala y enemigo
                player.bullets.splice(bulletIndex, 1);
                enemyManager.enemies.splice(enemyIndex, 1);
                
                // Efectos
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
                score += enemy.points;
                updateUI();
            }
        });
    });

    // Balas enemigas vs jugador
    enemyManager.bullets.forEach((bullet, bulletIndex) => {
        if (bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y) {
            
            enemyManager.bullets.splice(bulletIndex, 1);
            createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ff69b4');
            lives--;
            updateUI();
            
            if (lives <= 0) {
                gameOver();
            }
        }
    });

    // Enemigos llegan abajo
    enemyManager.enemies.forEach(enemy => {
        if (enemy.y + enemy.height >= player.y) {
            gameOver();
        }
    });

    // Victoria
    if (enemyManager.enemies.length === 0) {
        winLevel();
    }
}

// === ESTADOS DEL JUEGO ===
function startGame() {
    gameState = 'playing';
    score = 0;
    lives = 3;
    level = 1;
    player = new Player();
    enemyManager = new EnemyManager();
    particles = [];
    createStars();
    updateUI();
    
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('winScreen').classList.add('hidden');
    
    gameLoop();
}

function gameOver() {
    gameState = 'gameOver';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

function winLevel() {
    gameState = 'win';
    document.getElementById('winScore').textContent = score;
    document.getElementById('winScreen').classList.remove('hidden');
}

function nextLevel() {
    level++;
    player = new Player();
    enemyManager = new EnemyManager();
    particles = [];
    gameState = 'playing';
    
    document.getElementById('winScreen').classList.add('hidden');
    
    gameLoop();
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
}

// === GAME LOOP ===
function gameLoop() {
    if (gameState !== 'playing') return;

    // Limpiar canvas
    ctx.fillStyle = 'rgba(10, 10, 26, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar estrellas
    drawStars();

    // Actualizar y dibujar partículas
    particles = particles.filter(p => p.life > 0);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Actualizar y dibujar jugador
    player.update();
    player.draw();
    player.bullets.forEach(bullet => bullet.draw());

    // Actualizar y dibujar enemigos
    enemyManager.update();
    enemyManager.draw();

    // Verificar colisiones
    checkCollisions();

    requestAnimationFrame(gameLoop);
}

// === EVENTOS ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    if (e.key === ' ') {
        e.preventDefault();
        keys.space = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    if (e.key === ' ') keys.space = false;
});

// Botones
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('nextLevelBtn').addEventListener('click', nextLevel);

// Inicializar estrellas de fondo
createStars();

// Animación inicial del fondo
function initialAnimation() {
    ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars();
    if (gameState === 'start') {
        requestAnimationFrame(initialAnimation);
    }
}
initialAnimation();
