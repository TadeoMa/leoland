/**
 * MINIMINE - Save/Load System
 * Uses localStorage for automatic saving.
 */

const SaveSystem = {
    SAVE_KEY: 'minimine_save',
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    lastSave: 0,

    init() {
        this.lastSave = Utils.timestamp();
    },

    update() {
        const now = Utils.timestamp();
        if (now - this.lastSave > this.AUTO_SAVE_INTERVAL) {
            this.save();
            this.lastSave = now;
        }
    },

    save() {
        const data = {
            version: 1,
            timestamp: Date.now(),
            player: Player.toSaveData(),
            inventory: Inventory.toSaveData(),
            world: World.toSaveData(),
            daynight: DayNight.toSaveData(),
            portal: Portal.toSaveData(),
        };

        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Save failed:', e);
            return false;
        }
    },

    load() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return false;

            const data = JSON.parse(raw);
            if (!data || !data.version) return false;

            Player.fromSaveData(data.player);
            Inventory.fromSaveData(data.inventory);
            World.fromSaveData(data.world);
            DayNight.fromSaveData(data.daynight);
            Portal.fromSaveData(data.portal);

            return true;
        } catch (e) {
            console.warn('Load failed:', e);
            return false;
        }
    },

    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },

    deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
    },
};
