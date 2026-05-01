/**
 * MINIMINE - Portal & Boss System
 */

const Portal = {
    isOpen: false,
    bossDefeated: false,
    bossActive: false,

    init() {
        this.isOpen = false;
        this.bossDefeated = false;
        this.bossActive = false;
    },

    checkKills() {
        if (this.isOpen || this.bossDefeated) return;

        if (Player.killCount >= CONFIG.PORTAL.KILLS_TO_OPEN) {
            this.openPortal();
        }
    },

    openPortal() {
        this.isOpen = true;
        World.openPortal();
        Game.showPortalNotification();
    },

    enterPortal() {
        if (!this.isOpen || this.bossActive) return;
        this.bossActive = true;
        Enemies.spawnBoss();
        AudioManager.playMusic(CONFIG.AUDIO.MUSIC_BOSS);
    },

    onBossDefeated() {
        this.bossDefeated = true;
        this.bossActive = false;
        Player.valentia += CONFIG.PORTAL.BOSS_REWARD_VALENTIA;
        World.portalPosition = null;
        // Victory!
        Game.showVictory();
    },

    update() {
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
