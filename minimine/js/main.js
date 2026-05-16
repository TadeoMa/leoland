/**
 * MINIMINE - Main Game Loop
 * Entry point and game state management.
 */

const Game = {
    running: false,
    paused: false,
    lastTime: 0,
    camera: { x: 0, y: 0 },
    state: 'menu', // 'menu', 'playing', 'paused', 'dead'

    start() {
        const canvas = document.getElementById('game-canvas');
        Renderer.init(canvas);
        Input.init(canvas);
        Sprites.init();
        UI.init();
        AudioManager.preloadAll();
        SaveSystem.init();

        // Show/hide load button
        if (!SaveSystem.hasSave()) {
            document.getElementById('load-game-btn').style.opacity = '0.4';
        }
    },

    newGame() {
        this.state = 'playing';
        UI.hideStartScreen();

        // Initialize all systems
        World.generate();
        Player.reset();
        Player.init();
        Inventory.init();
        Enemies.init();
        Combat.init();
        DayNight.init();
        Portal.init();

        this.running = true;
        this.paused = false;
        this.lastTime = performance.now();
        this._loop();
    },

    loadGame() {
        if (!SaveSystem.hasSave()) return;

        this.state = 'playing';
        UI.hideStartScreen();

        // Load saved data
        Enemies.init();
        Combat.init();
        
        if (!SaveSystem.load()) {
            // If load fails, start new game
            this.newGame();
            return;
        }

        this.running = true;
        this.paused = false;
        this.lastTime = performance.now();
        this._loop();
    },

    _loop() {
        if (!this.running) return;

        const now = performance.now();
        const dt = Math.min(now - this.lastTime, 50); // Cap dt to prevent spiral
        this.lastTime = now;

        if (!this.paused && this.state === 'playing') {
            this._update(dt);
        }

        this._render();
        requestAnimationFrame(() => this._loop());
    },

    _update(dt) {
        Player.update(dt);
        Enemies.update(dt);
        Combat.update(dt);
        DayNight.update(dt);
        Portal.update();
        SaveSystem.update();
        this._updateCamera();
        UI.update();

        // Music management
        if (Portal.inBossArena) {
            AudioManager.playMusic('boss');
        } else if (DayNight.isNight()) {
            AudioManager.playMusic('night');
        } else {
            AudioManager.playMusic('day');
        }
    },

    _updateCamera() {
        const targetX = Player.x - Renderer.width / 2 + Player.width / 2;
        const targetY = Player.y - Renderer.height / 2 + Player.height / 2;

        this.camera.x = Utils.lerp(this.camera.x, targetX, CONFIG.CAMERA.SMOOTH);
        this.camera.y = Utils.lerp(this.camera.y, targetY, CONFIG.CAMERA.SMOOTH);

        // Clamp camera to world bounds
        const worldWidth = CONFIG.WORLD.WIDTH * CONFIG.WORLD.BLOCK_SIZE;
        const worldHeight = CONFIG.WORLD.HEIGHT * CONFIG.WORLD.BLOCK_SIZE;
        this.camera.x = Utils.clamp(this.camera.x, 0, worldWidth - Renderer.width);
        this.camera.y = Utils.clamp(this.camera.y, 0, worldHeight - Renderer.height);
    },

    _render() {
        Renderer.render(this.camera);
    },

    // === State Management ===

    togglePause() {
        if (this.state !== 'playing' && this.state !== 'paused') return;
        
        this.paused = !this.paused;
        this.state = this.paused ? 'paused' : 'playing';
        UI.togglePanel('pauseMenu');
    },

    toggleShop() {
        if (this.state !== 'playing') return;
        UI.updateShop();
        UI.togglePanel('shopPanel');
        AudioManager.play('SFX_MENU');
    },

    toggleInventory() {
        if (this.state !== 'playing') return;
        UI.updateInventory();
        UI.togglePanel('inventoryPanel');
        AudioManager.play('SFX_MENU');
    },

    showDeathScreen() {
        this.state = 'dead';
        Player.deathCount++;
        const msg = World.housePosition
            ? 'Reaparecerás en tu casa. Los objetos guardados están a salvo.'
            : 'Reaparecerás en el punto inicial. Pierdes objetos equipados.';
        UI.showDeathScreen(msg);
    },

    respawn() {
        Player.respawn();
        this.state = 'playing';
        UI.hidePanel('deathScreen');

        // Re-spawn boss if died in arena and boss is still needed
        if (Portal.inBossArena && Portal.bossActive && !Enemies.list.find(e => e.isBoss)) {
            Portal._spawnBossInArena();
        }
    },

    showPortalScreen() {
        // Show less intrusive portal entry bar
        const bar = document.getElementById('portal-screen');
        bar.classList.remove('hidden');
        // Auto-hide after 8 seconds if not interacted
        if (this._portalBarTimeout) clearTimeout(this._portalBarTimeout);
        this._portalBarTimeout = setTimeout(() => {
            bar.classList.add('hidden');
            Portal.portalScreenShown = false;
        }, 8000);
    },

    showPortalNotification() {
        // Subtle top notification that fades in/out
        const existing = document.getElementById('portal-open-notification');
        if (existing) existing.remove();

        const msg = document.createElement('div');
        msg.id = 'portal-open-notification';
        msg.innerHTML = '🌀 ¡Un portal se ha abierto en el mundo!';
        msg.className = 'game-notification portal-notification';
        document.getElementById('game-container').appendChild(msg);

        // Trigger animation
        requestAnimationFrame(() => msg.classList.add('show'));
        setTimeout(() => {
            msg.classList.remove('show');
            setTimeout(() => msg.remove(), 500);
        }, 4000);
    },

    showBossDefeatedNotification() {
        const existing = document.getElementById('boss-defeated-notification');
        if (existing) existing.remove();

        const msg = document.createElement('div');
        msg.id = 'boss-defeated-notification';
        msg.innerHTML = '🏆 ¡Jefe derrotado! Recoge el tesoro';
        msg.className = 'game-notification victory-notification';
        document.getElementById('game-container').appendChild(msg);

        requestAnimationFrame(() => msg.classList.add('show'));
        setTimeout(() => {
            msg.classList.remove('show');
            setTimeout(() => msg.remove(), 500);
        }, 5000);
    },

    showTreasureCollectedNotification() {
        const existing = document.getElementById('treasure-notification');
        if (existing) existing.remove();

        const rewards = `+${CONFIG.PORTAL.BOSS_REWARD_MONEY} 💰  +${CONFIG.PORTAL.BOSS_REWARD_DIAMONDS} 💎  +${CONFIG.PORTAL.BOSS_REWARD_EMERALDS} 🟢`;
        const msg = document.createElement('div');
        msg.id = 'treasure-notification';
        msg.innerHTML = `✨ ¡Tesoro recogido! ${rewards}<br><small>El portal de regreso está activo</small>`;
        msg.className = 'game-notification treasure-notification';
        document.getElementById('game-container').appendChild(msg);

        requestAnimationFrame(() => msg.classList.add('show'));
        setTimeout(() => {
            msg.classList.remove('show');
            setTimeout(() => msg.remove(), 500);
        }, 6000);
    },

    showVillagerDialog() {
        document.getElementById('trade-result').textContent = '';
        UI.showPanel('villagerDialog');
    },

    showVictory() {
        // Victory is now handled through the boss arena flow
        // Player collects treasure and returns via portal
        // This is kept as fallback
        this.showBossDefeatedNotification();
    },
};

// === Bootstrap ===
window.addEventListener('DOMContentLoaded', () => {
    Game.start();
});
