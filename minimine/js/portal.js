/**
 * MINIMINE - Portal & Boss System
 */

const Portal = {
    isOpen: false,
    bossDefeated: false,
    bossActive: false,
    portalScreenShown: false,

    init() {
        this.isOpen = false;
        this.bossDefeated = false;
        this.bossActive = false;
        this.portalScreenShown = false;
    },

    checkKills() {
        if (this.isOpen || this.bossDefeated) return;

        if (Player.killCount >= CONFIG.PORTAL.KILLS_TO_OPEN) {
            this.openPortal();
        }
    },

    openPortal() {
        this.isOpen = true;
        this.portalScreenShown = false;
        World.openPortal();
        Game.showPortalNotification();
    },

    enterPortal() {
        if (!this.isOpen || this.bossActive) return;
        this.bossActive = true;
        this.portalScreenShown = false;
        Enemies.spawnBoss();
        AudioManager.playMusic(CONFIG.AUDIO.MUSIC_BOSS);
    },

    onBossDefeated() {
        this.bossDefeated = true;
        this.bossActive = false;
        Player.money += CONFIG.PORTAL.BOSS_REWARD_MONEY;
        World.portalPosition = null;
        // Victory!
        Game.showVictory();
    },

    update() {
        // Check if player is near the portal
        if (this.isOpen && !this.bossActive && !this.portalScreenShown && World.portalPosition) {
            const portalRect = {
                x: World.portalPosition.x,
                y: World.portalPosition.y,
                width: World.portalPosition.width,
                height: World.portalPosition.height
            };
            const playerRect = Player.getRect();
            
            // Check collision with expanded detection area
            const expanded = {
                x: portalRect.x - 100,
                y: portalRect.y - 100,
                width: portalRect.width + 200,
                height: portalRect.height + 200
            };
            
            if (Utils.rectCollision(playerRect, expanded)) {
                this.portalScreenShown = true;
                Game.showPortalScreen();
            }
        }

        if (this.bossActive) {
            // Check if boss is dead
            const boss = Enemies.list.find(e => e.isBoss);
            if (!boss) {
                this.onBossDefeated();
            }
        }
    },

    toSaveData() {
        return {
            isOpen: this.isOpen,
            bossDefeated: this.bossDefeated,
            killCount: Player.killCount,
        };
    },

    fromSaveData(data) {
        this.isOpen = data.isOpen || false;
        this.bossDefeated = data.bossDefeated || false;
        if (data.killCount !== undefined) Player.killCount = data.killCount;
    },
};
