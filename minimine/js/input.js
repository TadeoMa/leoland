/**
 * MINIMINE - Input Manager
 * Handles keyboard, mouse, and touch input.
 */

const Input = {
    keys: {},
    mouse: { x: 0, y: 0, left: false, right: false },
    touch: { left: false, right: false, jump: false, down: false, attack: false },
    canvas: null,

    init(canvas) {
        this.canvas = canvas;
        this._setupKeyboard();
        this._setupMouse();
        this._setupTouch();
    },

    _setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Prevent default for game keys
            if (['w', 'a', 's', 'd', 'e', 'i', ' '].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }

            // Menu toggles
            if (e.key.toLowerCase() === 'e') Game.toggleShop();
            if (e.key.toLowerCase() === 'i') Game.toggleInventory();
            if (e.key === 'Escape') Game.togglePause();

            // Hotbar numbers
            if (e.key >= '1' && e.key <= '9') {
                Inventory.selectSlot(parseInt(e.key) - 1);
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    },

    _setupMouse() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (e.button === 0) this.mouse.left = true;
            if (e.button === 2) this.mouse.right = true;
        });

        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.left = false;
            if (e.button === 2) this.mouse.right = false;
        });

        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    },

    _setupTouch() {
        const btnMap = {
            'btn-left': 'left',
            'btn-right': 'right',
            'btn-jump': 'jump',
            'btn-down': 'down',
            'btn-attack': 'attack',
        };

        Object.entries(btnMap).forEach(([id, action]) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touch[action] = true;
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touch[action] = false;
            });
            btn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.touch[action] = false;
            });
        });

        // Shop and inventory mobile buttons
        const btnShop = document.getElementById('btn-shop');
        const btnInv = document.getElementById('btn-inventory');
        if (btnShop) btnShop.addEventListener('touchstart', (e) => { e.preventDefault(); Game.toggleShop(); });
        if (btnInv) btnInv.addEventListener('touchstart', (e) => { e.preventDefault(); Game.toggleInventory(); });
    },

    isLeft() {
        return this.keys['a'] || this.touch.left;
    },

    isRight() {
        return this.keys['d'] || this.touch.right;
    },

    isJump() {
        return this.keys['w'] || this.keys[' '] || this.touch.jump;
    },

    isDown() {
        return this.keys['s'] || this.touch.down;
    },

    isAttack() {
        return this.mouse.left || this.touch.attack;
    },

    isSecondary() {
        return this.mouse.right;
    },

    getMouseWorldPos(camera) {
        return {
            x: this.mouse.x + camera.x,
            y: this.mouse.y + camera.y,
        };
    },
};
