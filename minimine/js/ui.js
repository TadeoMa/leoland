/**
 * MINIMINE - UI Manager
 * Handles all DOM-based UI updates.
 */

const UI = {
    elements: {},

    init() {
        this.elements = {
            healthFill: document.getElementById('health-fill'),
            healthText: document.getElementById('health-text'),
            shieldFill: document.getElementById('shield-fill'),
            shieldText: document.getElementById('shield-text'),
            moneyDisplay: document.getElementById('money-display'),
            diamondsDisplay: document.getElementById('diamonds-display'),
            emeraldsDisplay: document.getElementById('emeralds-display'),
            deathsDisplay: document.getElementById('deaths-display'),
            dayNightIndicator: document.getElementById('day-night-indicator'),
            equippedDisplay: document.getElementById('equipped-display'),
            hotbar: document.getElementById('hotbar'),
            inventoryPanel: document.getElementById('inventory-panel'),
            inventoryGrid: document.getElementById('inventory-grid'),
            shopPanel: document.getElementById('shop-panel'),
            shopItems: document.getElementById('shop-items'),
            pauseMenu: document.getElementById('pause-menu'),
            deathScreen: document.getElementById('death-screen'),
            deathMessage: document.getElementById('death-message'),
            portalScreen: document.getElementById('portal-screen'),
            villagerDialog: document.getElementById('villager-dialog'),
            tradeResult: document.getElementById('trade-result'),
            startScreen: document.getElementById('start-screen'),
        };

        this._setupButtons();
        this._buildHotbar();
    },

    _setupButtons() {
        // Start screen
        document.getElementById('new-game-btn').addEventListener('click', () => Game.newGame());
        document.getElementById('load-game-btn').addEventListener('click', () => Game.loadGame());

        // Pause
        document.getElementById('resume-btn').addEventListener('click', () => Game.togglePause());
        document.getElementById('save-btn').addEventListener('click', () => { SaveSystem.save(); Game.togglePause(); });
        document.getElementById('quit-btn').addEventListener('click', () => { SaveSystem.save(); location.reload(); });

        // Death
        document.getElementById('respawn-btn').addEventListener('click', () => Game.respawn());

        // Portal
        document.getElementById('enter-portal-btn').addEventListener('click', () => { Portal.enterPortal(); this.hidePanel('portalScreen'); });
        document.getElementById('ignore-portal-btn').addEventListener('click', () => this.hidePanel('portalScreen'));

        // Close buttons
        document.getElementById('close-inventory').addEventListener('click', () => Game.toggleInventory());
        document.getElementById('close-shop').addEventListener('click', () => Game.toggleShop());
        document.getElementById('close-villager').addEventListener('click', () => this.hidePanel('villagerDialog'));

        // Shop tabs
        document.querySelectorAll('.shop-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.shop-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                Shop.switchTab(btn.dataset.tab);
                this.updateShop();
            });
        });

        // Villager trade
        document.getElementById('trade-btn').addEventListener('click', () => this._doTrade());

        // Load button visibility
        if (!SaveSystem.hasSave()) {
            document.getElementById('load-game-btn').style.opacity = '0.5';
        }
    },

    _buildHotbar() {
        const hotbar = this.elements.hotbar;
        hotbar.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const slot = document.createElement('div');
            slot.className = 'hotbar-slot';
            slot.innerHTML = `<span class="slot-key">${i + 1}</span>`;
            slot.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                Inventory.selectSlot(i);
            });
            hotbar.appendChild(slot);
        }
    },

    update() {
        this._updateBars();
        this._updateResources();
        this._updateHotbar();
        this._updateDayNight();
        this._updateEquipped();
    },

    _updateBars() {
        const healthPct = (Player.health / Player.maxHealth) * 100;
        const shieldPct = (Player.shield / Player.maxShield) * 100;

        this.elements.healthFill.style.width = healthPct + '%';
        this.elements.healthText.textContent = `${Player.health}/${Player.maxHealth}`;
        this.elements.shieldFill.style.width = shieldPct + '%';
        this.elements.shieldText.textContent = `${Player.shield}/${Player.maxShield}`;
    },

    _updateResources() {
        this.elements.moneyDisplay.textContent = `💰 ${Player.money}`;
        this.elements.diamondsDisplay.textContent = `💎 ${Player.diamonds}`;
        this.elements.emeraldsDisplay.textContent = `🟢 ${Player.emeralds}`;
        this.elements.deathsDisplay.textContent = `💀 ${Player.killCount}`;
    },

    _updateHotbar() {
        const slots = this.elements.hotbar.querySelectorAll('.hotbar-slot');
        for (let i = 0; i < slots.length; i++) {
            const item = Inventory.getHotbarItem(i);
            const isActive = i === Inventory.selectedSlot;
            slots[i].className = 'hotbar-slot' + (isActive ? ' active' : '');
            
            // Show item sprite or icon
            const keySpan = `<span class="slot-key">${i + 1}</span>`;
            if (item) {
                const sprite = Sprites.get(item.id);
                if (sprite) {
                    // Use sprite canvas as image
                    const img = sprite.toDataURL();
                    slots[i].innerHTML = keySpan + `<img src="${img}" style="width:32px;height:32px;image-rendering:pixelated;" alt="${item.name}">`;
                } else {
                    slots[i].innerHTML = keySpan + `<span style="font-size:24px">${item.icon}</span>`;
                }
            } else {
                slots[i].innerHTML = keySpan;
            }
        }
    },

    _updateDayNight() {
        const indicator = this.elements.dayNightIndicator;
        if (DayNight.isNight()) {
            indicator.classList.add('night');
        } else {
            indicator.classList.remove('night');
        }
    },

    _updateEquipped() {
        const item = Inventory.getEquipped();
        if (item) {
            this.elements.equippedDisplay.textContent = `${item.icon} ${item.name}`;
        } else {
            this.elements.equippedDisplay.textContent = 'Sin equipar';
        }
    },

    updateInventory() {
        const grid = this.elements.inventoryGrid;
        grid.innerHTML = '';

        for (let i = 0; i < Inventory.maxSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            if (i < Inventory.slots.length) {
                const item = Inventory.slots[i];
                const sprite = Sprites.get(item.id);
                let iconHTML;
                if (sprite) {
                    const img = sprite.toDataURL();
                    iconHTML = `<img src="${img}" style="width:36px;height:36px;image-rendering:pixelated;" alt="${item.name}">`;
                } else {
                    iconHTML = `<span style="font-size:24px">${item.icon}</span>`;
                }
                slot.innerHTML = `
                    ${iconHTML}
                    <span class="item-name">${item.name}</span>
                    ${item.count > 1 ? `<span class="item-count">${item.count}</span>` : ''}
                `;
                slot.addEventListener('click', () => Inventory.selectSlot(i));
            }
            
            grid.appendChild(slot);
        }
    },

    updateShop() {
        const container = this.elements.shopItems;
        container.innerHTML = '';

        const items = Shop.getItems();
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'shop-item';
            const canAfford = Shop.canAfford(item);
            div.style.opacity = canAfford ? '1' : '0.5';

            const currency = Shop.currentTab === 'money' ? '💰' : '💎';
            const sprite = Sprites.get(item.id);
            let iconHTML;
            if (sprite) {
                const img = sprite.toDataURL();
                iconHTML = `<img src="${img}" style="width:40px;height:40px;image-rendering:pixelated;" alt="${item.name}">`;
            } else {
                iconHTML = item.icon;
            }
            div.innerHTML = `
                <div class="item-icon">${iconHTML}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-price">${currency} ${item.price}</div>
                <div class="item-desc">${item.description}</div>
            `;

            div.addEventListener('click', () => {
                if (Shop.purchase(item)) {
                    this.updateShop();
                }
            });

            container.appendChild(div);
        });
    },

    _doTrade() {
        if (Player.emeralds <= 0) {
            this.elements.tradeResult.textContent = 'No tienes esmeraldas.';
            return;
        }

        Player.emeralds--;
        const items = CONFIG.VILLAGER_ITEMS;
        const reward = Utils.randomChoice(items);
        
        if (reward.id === 'diamond_ore') {
            Player.diamonds++;
            this.elements.tradeResult.textContent = `¡Obtuviste: ${reward.icon} ${reward.name}!`;
        } else {
            Inventory.addItem(reward.id, 1);
            this.elements.tradeResult.textContent = `¡Obtuviste: ${reward.icon} ${reward.name}!`;
        }
    },

    showPanel(name) {
        if (this.elements[name]) {
            this.elements[name].classList.remove('hidden');
        }
    },

    hidePanel(name) {
        if (this.elements[name]) {
            this.elements[name].classList.add('hidden');
        }
    },

    togglePanel(name) {
        if (this.elements[name]) {
            this.elements[name].classList.toggle('hidden');
        }
    },

    hideStartScreen() {
        this.elements.startScreen.style.display = 'none';
    },

    showDeathScreen(message) {
        this.elements.deathMessage.textContent = message || 'Has sido derrotado...';
        this.showPanel('deathScreen');
    },
};
