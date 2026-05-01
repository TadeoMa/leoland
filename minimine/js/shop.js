/**
 * MINIMINE - Shop System
 */

const Shop = {
    currentTab: 'valentia',

    getItems() {
        if (this.currentTab === 'valentia') {
            return CONFIG.SHOP.VALENTIA_ITEMS;
        }
        return CONFIG.SHOP.DIAMOND_ITEMS;
    },

    canAfford(item) {
        if (this.currentTab === 'valentia') {
            return Player.valentia >= item.price;
        }
        return Player.diamonds >= item.price;
    },

    purchase(item) {
        if (!this.canAfford(item)) return false;

        // Deduct cost
        if (this.currentTab === 'valentia') {
            Player.valentia -= item.price;
        } else {
            Player.diamonds -= item.price;
        }

        // Apply purchase
        switch (item.id) {
            case 'house':
                this._placeHouse();
                break;
            case 'health_potion':
                Player.heal(3);
                break;
            case 'shield_potion':
                Player.healShield(3);
                break;
            case 'health_upgrade':
                Player.maxHealth += 2;
                Player.health = Player.maxHealth;
                break;
            case 'shield_upgrade':
                Player.maxShield += 2;
                Player.shield = Player.maxShield;
                break;
            case 'regen':
                Player.regenRate = 1;
                break;
            case 'wings':
                Player.hasWings = true;
                Inventory.addItem('wings', 1);
                break;
            case 'golden_wings':
                Player.hasWings = true;
                Player.wingSpeed = -5;
                Inventory.addItem('golden_wings', 1);
                break;
            default:
                // Add weapon/tool to inventory
                Inventory.addItem(item.id, 1);
                break;
        }

        AudioManager.play('SFX_PURCHASE');
        return true;
    },

    _placeHouse() {
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        const bx = Math.floor(Player.x / bs);
        const by = Math.floor(Player.y / bs) + 1;
        World.placeHouse(bx, by);
    },

    switchTab(tab) {
        this.currentTab = tab;
    },
};
