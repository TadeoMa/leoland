/**
 * MINIMINE - Inventory System
 */

const Inventory = {
    slots: [],           // Array of { id, name, icon, count, type }
    hotbar: [],          // References to slots (indices)
    selectedSlot: 0,
    maxSlots: 20,
    houseStorage: [],    // Items stored in house

    init() {
        this.slots = [];
        this.hotbar = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        this.selectedSlot = 0;
        this.houseStorage = [];

        // Starting inventory
        this.addItem('axe', 1);
        this.addItem('sword', 1);
        this.addItem('shovel', 1);
        this.addItem('pickaxe', 1);
    },

    addItem(id, count = 1) {
        // Check if item already exists (stackable resources)
        const isResource = CONFIG.BLOCKS[id] !== undefined;
        
        if (isResource) {
            const existing = this.slots.find(s => s.id === id);
            if (existing) {
                existing.count += count;
                return true;
            }
        }

        // Check for tool/weapon duplicates
        const isTool = CONFIG.TOOLS[id] || CONFIG.ENCHANTED[id];
        if (isTool) {
            const existing = this.slots.find(s => s.id === id);
            if (existing) return true; // Already have it
        }

        if (this.slots.length >= this.maxSlots) return false;

        const toolDef = CONFIG.TOOLS[id] || CONFIG.ENCHANTED[id];
        const blockDef = CONFIG.BLOCKS[id];

        let item;
        if (toolDef) {
            item = {
                id,
                name: toolDef.name,
                icon: toolDef.icon,
                count: 1,
                type: toolDef.type || 'tool',
            };
        } else if (blockDef) {
            const icons = {
                wood: '🪵', sand: '🟡', stone: '🪨', hardstone: '�ite',
                iron: '🟤', gold: '🟡', diamond: '💎', emerald: '🟢',
                dirt: '🟫', grass: '🟩',
            };
            item = {
                id,
                name: id.charAt(0).toUpperCase() + id.slice(1),
                icon: icons[id] || '📦',
                count,
                type: 'resource',
            };
        } else {
            item = { id, name: id, icon: '📦', count, type: 'item' };
        }

        this.slots.push(item);
        return true;
    },

    removeItem(id, count = 1) {
        const idx = this.slots.findIndex(s => s.id === id);
        if (idx === -1) return false;
        
        this.slots[idx].count -= count;
        if (this.slots[idx].count <= 0) {
            this.slots.splice(idx, 1);
        }
        return true;
    },

    hasItem(id) {
        return this.slots.some(s => s.id === id);
    },

    getEquipped() {
        const hotbarIndex = this.hotbar[this.selectedSlot];
        if (hotbarIndex < this.slots.length) {
            return this.slots[hotbarIndex];
        }
        return null;
    },

    selectSlot(index) {
        this.selectedSlot = Utils.clamp(index, 0, this.hotbar.length - 1);
    },

    onDeath() {
        // Lose non-stored equipped items
        // Keep items that are in house storage
        const keptIds = new Set(this.houseStorage.map(s => s.id));
        
        // Keep basic tools always
        const alwaysKeep = ['axe', 'sword', 'shovel', 'pickaxe'];
        
        this.slots = this.slots.filter(item => {
            return alwaysKeep.includes(item.id) || keptIds.has(item.id);
        });
    },

    storeInHouse(id) {
        const item = this.slots.find(s => s.id === id);
        if (item) {
            const existing = this.houseStorage.find(s => s.id === id);
            if (existing) {
                existing.count += item.count;
            } else {
                this.houseStorage.push({ ...item });
            }
        }
    },

    toSaveData() {
        return {
            slots: this.slots,
            selectedSlot: this.selectedSlot,
            houseStorage: this.houseStorage,
        };
    },

    fromSaveData(data) {
        this.slots = data.slots || [];
        this.selectedSlot = data.selectedSlot || 0;
        this.houseStorage = data.houseStorage || [];
    },
};
