/**
 * MINIMINE - Sprite System
 * Draws pixel-art style sprites for all tools, weapons, and items on canvas.
 * Each sprite is pre-rendered to an offscreen canvas for performance.
 */

const Sprites = {
    cache: {},
    spriteSheets: {},
    size: 48,

    init() {
        this.cache = {};
        this.spriteSheets = {};
        this._generateAll();
        this._loadSpriteSheets();
    },

    _generateAll() {
        // === TOOLS ===
        this._createSprite('axe', (ctx, s) => {
            // Handle
            ctx.fillStyle = '#8B5E3C';
            ctx.fillRect(s * 0.2, s * 0.3, s * 0.12, s * 0.6);
            // Blade
            ctx.fillStyle = '#AAA';
            ctx.beginPath();
            ctx.moveTo(s * 0.15, s * 0.15);
            ctx.lineTo(s * 0.55, s * 0.1);
            ctx.lineTo(s * 0.55, s * 0.45);
            ctx.lineTo(s * 0.25, s * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#888';
            ctx.fillRect(s * 0.15, s * 0.28, s * 0.4, s * 0.06);
        });

        this._createSprite('shovel', (ctx, s) => {
            // Handle
            ctx.fillStyle = '#8B5E3C';
            ctx.fillRect(s * 0.44, s * 0.25, s * 0.12, s * 0.65);
            // Blade (rounded shovel head)
            ctx.fillStyle = '#777';
            ctx.beginPath();
            ctx.ellipse(s * 0.5, s * 0.15, s * 0.22, s * 0.15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#999';
            ctx.beginPath();
            ctx.ellipse(s * 0.5, s * 0.13, s * 0.16, s * 0.09, 0, 0, Math.PI);
            ctx.fill();
            // Grip
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(s * 0.4, s * 0.85, s * 0.2, s * 0.1);
        });

        this._createSprite('pickaxe', (ctx, s) => {
            // Handle
            ctx.fillStyle = '#8B5E3C';
            ctx.save();
            ctx.translate(s * 0.5, s * 0.5);
            ctx.rotate(-0.7);
            ctx.fillRect(-s * 0.06, -s * 0.05, s * 0.12, s * 0.55);
            ctx.restore();
            // Head
            ctx.fillStyle = '#666';
            ctx.save();
            ctx.translate(s * 0.5, s * 0.3);
            ctx.rotate(-0.7);
            ctx.fillRect(-s * 0.35, -s * 0.06, s * 0.7, s * 0.12);
            // Tips
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.moveTo(-s * 0.35, -s * 0.06);
            ctx.lineTo(-s * 0.42, s * 0.04);
            ctx.lineTo(-s * 0.35, s * 0.06);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(s * 0.35, -s * 0.06);
            ctx.lineTo(s * 0.42, s * 0.04);
            ctx.lineTo(s * 0.35, s * 0.06);
            ctx.fill();
            ctx.restore();
        });

        this._createSprite('sword', (ctx, s) => {
            // Blade
            ctx.fillStyle = '#C0C0C0';
            ctx.save();
            ctx.translate(s * 0.5, s * 0.5);
            ctx.rotate(-0.5);
            ctx.fillRect(-s * 0.04, -s * 0.4, s * 0.08, s * 0.5);
            // Tip
            ctx.beginPath();
            ctx.moveTo(-s * 0.04, -s * 0.4);
            ctx.lineTo(0, -s * 0.48);
            ctx.lineTo(s * 0.04, -s * 0.4);
            ctx.fill();
            // Edge shine
            ctx.fillStyle = '#E8E8E8';
            ctx.fillRect(-s * 0.01, -s * 0.38, s * 0.02, s * 0.45);
            // Guard
            ctx.fillStyle = '#DAA520';
            ctx.fillRect(-s * 0.15, s * 0.08, s * 0.3, s * 0.06);
            // Handle
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(-s * 0.04, s * 0.12, s * 0.08, s * 0.25);
            // Pommel
            ctx.fillStyle = '#DAA520';
            ctx.beginPath();
            ctx.arc(0, s * 0.4, s * 0.05, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        this._createSprite('hammer', (ctx, s) => {
            // Handle
            ctx.fillStyle = '#8B5E3C';
            ctx.fillRect(s * 0.44, s * 0.35, s * 0.12, s * 0.6);
            // Head
            ctx.fillStyle = '#555';
            ctx.fillRect(s * 0.2, s * 0.15, s * 0.6, s * 0.25);
            // Highlight
            ctx.fillStyle = '#777';
            ctx.fillRect(s * 0.22, s * 0.17, s * 0.56, s * 0.06);
        });

        this._createSprite('bow', (ctx, s) => {
            // Bow curve
            ctx.strokeStyle = '#8B5E3C';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(s * 0.55, s * 0.5, s * 0.32, -Math.PI * 0.7, Math.PI * 0.7);
            ctx.stroke();
            // String
            ctx.strokeStyle = '#DDD';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(s * 0.35, s * 0.12);
            ctx.lineTo(s * 0.35, s * 0.88);
            ctx.stroke();
            // Arrow
            ctx.fillStyle = '#8B5E3C';
            ctx.fillRect(s * 0.15, s * 0.48, s * 0.5, s * 0.04);
            // Arrowhead
            ctx.fillStyle = '#AAA';
            ctx.beginPath();
            ctx.moveTo(s * 0.15, s * 0.45);
            ctx.lineTo(s * 0.08, s * 0.5);
            ctx.lineTo(s * 0.15, s * 0.55);
            ctx.closePath();
            ctx.fill();
            // Fletching
            ctx.fillStyle = '#C0392B';
            ctx.beginPath();
            ctx.moveTo(s * 0.6, s * 0.45);
            ctx.lineTo(s * 0.68, s * 0.5);
            ctx.lineTo(s * 0.6, s * 0.55);
            ctx.fill();
        });

        this._createSprite('trident', (ctx, s) => {
            // Shaft
            ctx.fillStyle = '#1ABC9C';
            ctx.fillRect(s * 0.46, s * 0.25, s * 0.08, s * 0.7);
            // Prongs
            ctx.fillStyle = '#16A085';
            // Center prong
            ctx.fillRect(s * 0.46, s * 0.05, s * 0.08, s * 0.25);
            ctx.beginPath();
            ctx.moveTo(s * 0.46, s * 0.05);
            ctx.lineTo(s * 0.5, 0);
            ctx.lineTo(s * 0.54, s * 0.05);
            ctx.fill();
            // Left prong
            ctx.fillRect(s * 0.3, s * 0.12, s * 0.07, s * 0.2);
            ctx.beginPath();
            ctx.moveTo(s * 0.3, s * 0.12);
            ctx.lineTo(s * 0.335, s * 0.04);
            ctx.lineTo(s * 0.37, s * 0.12);
            ctx.fill();
            // Right prong
            ctx.fillRect(s * 0.63, s * 0.12, s * 0.07, s * 0.2);
            ctx.beginPath();
            ctx.moveTo(s * 0.63, s * 0.12);
            ctx.lineTo(s * 0.665, s * 0.04);
            ctx.lineTo(s * 0.7, s * 0.12);
            ctx.fill();
            // Cross guard
            ctx.fillRect(s * 0.3, s * 0.28, s * 0.4, s * 0.05);
            // Electric glow
            ctx.fillStyle = 'rgba(52, 152, 219, 0.4)';
            ctx.beginPath();
            ctx.arc(s * 0.5, s * 0.15, s * 0.25, 0, Math.PI * 2);
            ctx.fill();
        });

        this._createSprite('wings', (ctx, s) => {
            // Left wing
            ctx.fillStyle = '#E8DAEF';
            ctx.beginPath();
            ctx.ellipse(s * 0.25, s * 0.45, s * 0.22, s * 0.35, -0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#D2B4DE';
            ctx.beginPath();
            ctx.ellipse(s * 0.22, s * 0.4, s * 0.14, s * 0.25, -0.3, 0, Math.PI * 2);
            ctx.fill();
            // Right wing
            ctx.fillStyle = '#E8DAEF';
            ctx.beginPath();
            ctx.ellipse(s * 0.75, s * 0.45, s * 0.22, s * 0.35, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#D2B4DE';
            ctx.beginPath();
            ctx.ellipse(s * 0.78, s * 0.4, s * 0.14, s * 0.25, 0.3, 0, Math.PI * 2);
            ctx.fill();
            // Feather lines
            ctx.strokeStyle = '#BB8FCE';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                const y = s * 0.3 + i * s * 0.1;
                ctx.beginPath();
                ctx.moveTo(s * 0.1, y);
                ctx.quadraticCurveTo(s * 0.25, y - 5, s * 0.4, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(s * 0.6, y);
                ctx.quadraticCurveTo(s * 0.75, y - 5, s * 0.9, y);
                ctx.stroke();
            }
        });

        this._createSprite('golden_wings', (ctx, s) => {
            // Left wing
            ctx.fillStyle = '#F9E79F';
            ctx.beginPath();
            ctx.ellipse(s * 0.25, s * 0.45, s * 0.22, s * 0.35, -0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#F1C40F';
            ctx.beginPath();
            ctx.ellipse(s * 0.22, s * 0.4, s * 0.14, s * 0.25, -0.3, 0, Math.PI * 2);
            ctx.fill();
            // Right wing
            ctx.fillStyle = '#F9E79F';
            ctx.beginPath();
            ctx.ellipse(s * 0.75, s * 0.45, s * 0.22, s * 0.35, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#F1C40F';
            ctx.beginPath();
            ctx.ellipse(s * 0.78, s * 0.4, s * 0.14, s * 0.25, 0.3, 0, Math.PI * 2);
            ctx.fill();
            // Sparkles
            ctx.fillStyle = '#FFF';
            for (let i = 0; i < 5; i++) {
                const sx = s * 0.15 + Math.random() * s * 0.7;
                const sy = s * 0.2 + Math.random() * s * 0.5;
                ctx.beginPath();
                ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // === ENCHANTED WEAPONS ===
        this._createSprite('enchanted_sword', (ctx, s) => {
            // Same as sword but with glow
            ctx.shadowColor = '#9B59B6';
            ctx.shadowBlur = 8;
            // Blade
            ctx.fillStyle = '#A569BD';
            ctx.save();
            ctx.translate(s * 0.5, s * 0.5);
            ctx.rotate(-0.5);
            ctx.fillRect(-s * 0.05, -s * 0.4, s * 0.1, s * 0.5);
            ctx.beginPath();
            ctx.moveTo(-s * 0.05, -s * 0.4);
            ctx.lineTo(0, -s * 0.5);
            ctx.lineTo(s * 0.05, -s * 0.4);
            ctx.fill();
            ctx.fillStyle = '#D2B4DE';
            ctx.fillRect(-s * 0.015, -s * 0.38, s * 0.03, s * 0.45);
            ctx.fillStyle = '#DAA520';
            ctx.fillRect(-s * 0.15, s * 0.08, s * 0.3, s * 0.06);
            ctx.fillStyle = '#4A235A';
            ctx.fillRect(-s * 0.04, s * 0.12, s * 0.08, s * 0.25);
            ctx.restore();
            ctx.shadowBlur = 0;
        });

        this._createSprite('enchanted_bow', (ctx, s) => {
            ctx.shadowColor = '#E74C3C';
            ctx.shadowBlur = 6;
            // Bow
            ctx.strokeStyle = '#C0392B';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(s * 0.55, s * 0.5, s * 0.32, -Math.PI * 0.7, Math.PI * 0.7);
            ctx.stroke();
            ctx.strokeStyle = '#F5B041';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(s * 0.35, s * 0.12);
            ctx.lineTo(s * 0.35, s * 0.88);
            ctx.stroke();
            // Fire arrow
            ctx.fillStyle = '#E74C3C';
            ctx.fillRect(s * 0.15, s * 0.48, s * 0.5, s * 0.04);
            ctx.fillStyle = '#F39C12';
            ctx.beginPath();
            ctx.moveTo(s * 0.08, s * 0.5);
            ctx.lineTo(s * 0.15, s * 0.43);
            ctx.lineTo(s * 0.15, s * 0.57);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        this._createSprite('enchanted_trident', (ctx, s) => {
            ctx.shadowColor = '#3498DB';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#2980B9';
            ctx.fillRect(s * 0.46, s * 0.25, s * 0.08, s * 0.7);
            ctx.fillStyle = '#1ABC9C';
            ctx.fillRect(s * 0.46, s * 0.05, s * 0.08, s * 0.25);
            ctx.beginPath();
            ctx.moveTo(s * 0.46, s * 0.05);
            ctx.lineTo(s * 0.5, 0);
            ctx.lineTo(s * 0.54, s * 0.05);
            ctx.fill();
            ctx.fillRect(s * 0.3, s * 0.12, s * 0.07, s * 0.2);
            ctx.beginPath();
            ctx.moveTo(s * 0.3, s * 0.12);
            ctx.lineTo(s * 0.335, s * 0.02);
            ctx.lineTo(s * 0.37, s * 0.12);
            ctx.fill();
            ctx.fillRect(s * 0.63, s * 0.12, s * 0.07, s * 0.2);
            ctx.beginPath();
            ctx.moveTo(s * 0.63, s * 0.12);
            ctx.lineTo(s * 0.665, s * 0.02);
            ctx.lineTo(s * 0.7, s * 0.12);
            ctx.fill();
            ctx.fillRect(s * 0.3, s * 0.28, s * 0.4, s * 0.05);
            // Lightning bolts
            ctx.strokeStyle = '#F1C40F';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(s * 0.3, s * 0.5);
            ctx.lineTo(s * 0.2, s * 0.6);
            ctx.lineTo(s * 0.35, s * 0.6);
            ctx.lineTo(s * 0.25, s * 0.75);
            ctx.stroke();
            ctx.shadowBlur = 0;
        });

        // === RESOURCES ===
        this._createSprite('wood', (ctx, s) => {
            ctx.fillStyle = '#6D4C2A';
            ctx.fillRect(s * 0.2, s * 0.15, s * 0.6, s * 0.7);
            ctx.fillStyle = '#8B6914';
            ctx.fillRect(s * 0.25, s * 0.2, s * 0.5, s * 0.6);
            // Rings
            ctx.strokeStyle = '#5D3A1A';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(s * 0.5, s * 0.5, s * 0.12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(s * 0.5, s * 0.5, s * 0.2, 0, Math.PI * 2);
            ctx.stroke();
        });

        this._createSprite('stone', (ctx, s) => {
            ctx.fillStyle = '#7F8C8D';
            ctx.beginPath();
            ctx.moveTo(s * 0.2, s * 0.7);
            ctx.lineTo(s * 0.1, s * 0.4);
            ctx.lineTo(s * 0.3, s * 0.2);
            ctx.lineTo(s * 0.7, s * 0.15);
            ctx.lineTo(s * 0.85, s * 0.4);
            ctx.lineTo(s * 0.8, s * 0.75);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#95A5A6';
            ctx.fillRect(s * 0.35, s * 0.35, s * 0.15, s * 0.1);
        });

        this._createSprite('iron', (ctx, s) => {
            ctx.fillStyle = '#7F8C8D';
            ctx.beginPath();
            ctx.moveTo(s * 0.2, s * 0.7);
            ctx.lineTo(s * 0.1, s * 0.4);
            ctx.lineTo(s * 0.3, s * 0.2);
            ctx.lineTo(s * 0.7, s * 0.15);
            ctx.lineTo(s * 0.85, s * 0.4);
            ctx.lineTo(s * 0.8, s * 0.75);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#D4AC6E';
            ctx.beginPath();
            ctx.arc(s * 0.4, s * 0.4, s * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(s * 0.6, s * 0.55, s * 0.08, 0, Math.PI * 2);
            ctx.fill();
        });

        this._createSprite('gold', (ctx, s) => {
            ctx.fillStyle = '#7F8C8D';
            ctx.beginPath();
            ctx.moveTo(s * 0.2, s * 0.7);
            ctx.lineTo(s * 0.1, s * 0.4);
            ctx.lineTo(s * 0.3, s * 0.2);
            ctx.lineTo(s * 0.7, s * 0.15);
            ctx.lineTo(s * 0.85, s * 0.4);
            ctx.lineTo(s * 0.8, s * 0.75);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#F1C40F';
            ctx.beginPath();
            ctx.arc(s * 0.45, s * 0.45, s * 0.13, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#F9E79F';
            ctx.beginPath();
            ctx.arc(s * 0.42, s * 0.4, s * 0.05, 0, Math.PI * 2);
            ctx.fill();
        });

        this._createSprite('diamond', (ctx, s) => {
            ctx.fillStyle = '#5DADE2';
            ctx.beginPath();
            ctx.moveTo(s * 0.5, s * 0.1);
            ctx.lineTo(s * 0.8, s * 0.4);
            ctx.lineTo(s * 0.65, s * 0.85);
            ctx.lineTo(s * 0.35, s * 0.85);
            ctx.lineTo(s * 0.2, s * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#85C1E9';
            ctx.beginPath();
            ctx.moveTo(s * 0.5, s * 0.1);
            ctx.lineTo(s * 0.65, s * 0.4);
            ctx.lineTo(s * 0.5, s * 0.7);
            ctx.lineTo(s * 0.35, s * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#AED6F1';
            ctx.beginPath();
            ctx.arc(s * 0.45, s * 0.35, s * 0.06, 0, Math.PI * 2);
            ctx.fill();
        });

        this._createSprite('emerald', (ctx, s) => {
            ctx.fillStyle = '#27AE60';
            ctx.beginPath();
            ctx.moveTo(s * 0.5, s * 0.1);
            ctx.lineTo(s * 0.78, s * 0.35);
            ctx.lineTo(s * 0.78, s * 0.65);
            ctx.lineTo(s * 0.5, s * 0.9);
            ctx.lineTo(s * 0.22, s * 0.65);
            ctx.lineTo(s * 0.22, s * 0.35);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#2ECC71';
            ctx.beginPath();
            ctx.moveTo(s * 0.5, s * 0.2);
            ctx.lineTo(s * 0.65, s * 0.4);
            ctx.lineTo(s * 0.5, s * 0.75);
            ctx.lineTo(s * 0.35, s * 0.4);
            ctx.closePath();
            ctx.fill();
        });

        this._createSprite('sand', (ctx, s) => {
            ctx.fillStyle = '#F4D03F';
            ctx.beginPath();
            ctx.arc(s * 0.5, s * 0.55, s * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#F7DC6F';
            ctx.beginPath();
            ctx.arc(s * 0.4, s * 0.45, s * 0.08, 0, Math.PI * 2);
            ctx.fill();
        });

        this._createSprite('dirt', (ctx, s) => {
            ctx.fillStyle = '#8B5E3C';
            ctx.beginPath();
            ctx.arc(s * 0.5, s * 0.55, s * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#6D4C2A';
            ctx.beginPath();
            ctx.arc(s * 0.4, s * 0.5, s * 0.06, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(s * 0.6, s * 0.6, s * 0.05, 0, Math.PI * 2);
            ctx.fill();
        });

        // === POTIONS ===
        this._createSprite('health_potion', (ctx, s) => {
            // Bottle
            ctx.fillStyle = '#E74C3C';
            ctx.fillRect(s * 0.3, s * 0.35, s * 0.4, s * 0.5);
            ctx.beginPath();
            ctx.arc(s * 0.5, s * 0.35, s * 0.2, Math.PI, 0);
            ctx.fill();
            // Neck
            ctx.fillStyle = '#922B21';
            ctx.fillRect(s * 0.42, s * 0.12, s * 0.16, s * 0.18);
            // Cork
            ctx.fillStyle = '#8B5E3C';
            ctx.fillRect(s * 0.4, s * 0.08, s * 0.2, s * 0.08);
            // Heart symbol
            ctx.fillStyle = '#FFF';
            ctx.font = `${s * 0.25}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('♥', s * 0.5, s * 0.65);
            ctx.textAlign = 'left';
        });

        this._createSprite('shield_potion', (ctx, s) => {
            // Bottle
            ctx.fillStyle = '#3498DB';
            ctx.fillRect(s * 0.3, s * 0.35, s * 0.4, s * 0.5);
            ctx.beginPath();
            ctx.arc(s * 0.5, s * 0.35, s * 0.2, Math.PI, 0);
            ctx.fill();
            // Neck
            ctx.fillStyle = '#1B4F72';
            ctx.fillRect(s * 0.42, s * 0.12, s * 0.16, s * 0.18);
            // Cork
            ctx.fillStyle = '#8B5E3C';
            ctx.fillRect(s * 0.4, s * 0.08, s * 0.2, s * 0.08);
            // Shield symbol
            ctx.fillStyle = '#FFF';
            ctx.font = `${s * 0.25}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('🛡', s * 0.5, s * 0.65);
            ctx.textAlign = 'left';
        });

        // === HOUSE ===
        this._createSprite('house', (ctx, s) => {
            // Walls
            ctx.fillStyle = '#8B5E3C';
            ctx.fillRect(s * 0.15, s * 0.4, s * 0.7, s * 0.55);
            // Roof
            ctx.fillStyle = '#C0392B';
            ctx.beginPath();
            ctx.moveTo(s * 0.1, s * 0.4);
            ctx.lineTo(s * 0.5, s * 0.1);
            ctx.lineTo(s * 0.9, s * 0.4);
            ctx.closePath();
            ctx.fill();
            // Door
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(s * 0.4, s * 0.6, s * 0.2, s * 0.35);
            // Window
            ctx.fillStyle = '#F1C40F';
            ctx.fillRect(s * 0.22, s * 0.5, s * 0.14, s * 0.14);
            ctx.fillRect(s * 0.64, s * 0.5, s * 0.14, s * 0.14);
        });

        // === PLAYER ===
        this._createSprite('player', (ctx, s) => {
            // Body
            ctx.fillStyle = '#3498DB';
            ctx.fillRect(s * 0.25, s * 0.35, s * 0.5, s * 0.45);
            // Head
            ctx.fillStyle = '#F5CBA7';
            ctx.fillRect(s * 0.3, s * 0.1, s * 0.4, s * 0.3);
            // Hair
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(s * 0.28, s * 0.08, s * 0.44, s * 0.1);
            // Eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(s * 0.55, s * 0.2, s * 0.08, s * 0.08);
            // Legs
            ctx.fillStyle = '#2C3E50';
            ctx.fillRect(s * 0.3, s * 0.78, s * 0.15, s * 0.2);
            ctx.fillRect(s * 0.55, s * 0.78, s * 0.15, s * 0.2);
        });

        this._createSprite('player_left', (ctx, s) => {
            ctx.fillStyle = '#3498DB';
            ctx.fillRect(s * 0.25, s * 0.35, s * 0.5, s * 0.45);
            ctx.fillStyle = '#F5CBA7';
            ctx.fillRect(s * 0.3, s * 0.1, s * 0.4, s * 0.3);
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(s * 0.28, s * 0.08, s * 0.44, s * 0.1);
            ctx.fillStyle = '#000';
            ctx.fillRect(s * 0.37, s * 0.2, s * 0.08, s * 0.08);
            ctx.fillStyle = '#2C3E50';
            ctx.fillRect(s * 0.3, s * 0.78, s * 0.15, s * 0.2);
            ctx.fillRect(s * 0.55, s * 0.78, s * 0.15, s * 0.2);
        });

        // === ENEMIES ===
        this._createSprite('zombie', (ctx, s) => {
            ctx.fillStyle = '#27AE60';
            ctx.fillRect(s * 0.25, s * 0.3, s * 0.5, s * 0.5);
            ctx.fillStyle = '#1E8449';
            ctx.fillRect(s * 0.3, s * 0.1, s * 0.4, s * 0.25);
            ctx.fillStyle = '#E74C3C';
            ctx.fillRect(s * 0.55, s * 0.17, s * 0.08, s * 0.06);
            ctx.fillRect(s * 0.4, s * 0.17, s * 0.08, s * 0.06);
            ctx.fillStyle = '#1B4F28';
            ctx.fillRect(s * 0.28, s * 0.78, s * 0.15, s * 0.2);
            ctx.fillRect(s * 0.57, s * 0.78, s * 0.15, s * 0.2);
        });

        this._createSprite('skeleton', (ctx, s) => {
            ctx.fillStyle = '#ECF0F1';
            ctx.fillRect(s * 0.3, s * 0.3, s * 0.4, s * 0.45);
            ctx.fillStyle = '#BDC3C7';
            ctx.fillRect(s * 0.32, s * 0.1, s * 0.36, s * 0.24);
            ctx.fillStyle = '#2C3E50';
            ctx.fillRect(s * 0.4, s * 0.17, s * 0.07, s * 0.07);
            ctx.fillRect(s * 0.55, s * 0.17, s * 0.07, s * 0.07);
            ctx.fillRect(s * 0.42, s * 0.27, s * 0.16, s * 0.04);
            ctx.fillStyle = '#BDC3C7';
            ctx.fillRect(s * 0.35, s * 0.75, s * 0.1, s * 0.22);
            ctx.fillRect(s * 0.55, s * 0.75, s * 0.1, s * 0.22);
        });

        this._createSprite('sand_monster', (ctx, s) => {
            ctx.fillStyle = '#D4AC0D';
            ctx.beginPath();
            ctx.arc(s * 0.5, s * 0.55, s * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#9A7D0A';
            ctx.beginPath();
            ctx.arc(s * 0.5, s * 0.5, s * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#E74C3C';
            ctx.fillRect(s * 0.38, s * 0.42, s * 0.08, s * 0.08);
            ctx.fillRect(s * 0.55, s * 0.42, s * 0.08, s * 0.08);
        });

        this._createSprite('cave_spider', (ctx, s) => {
            ctx.fillStyle = '#6C3483';
            ctx.beginPath();
            ctx.ellipse(s * 0.5, s * 0.5, s * 0.3, s * 0.18, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#4A235A';
            ctx.beginPath();
            ctx.arc(s * 0.25, s * 0.5, s * 0.1, 0, Math.PI * 2);
            ctx.fill();
            // Legs
            ctx.strokeStyle = '#6C3483';
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                const x = s * 0.3 + i * s * 0.12;
                ctx.beginPath();
                ctx.moveTo(x, s * 0.5);
                ctx.lineTo(x - s * 0.1, s * 0.8);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, s * 0.5);
                ctx.lineTo(x + s * 0.1, s * 0.2);
                ctx.stroke();
            }
            ctx.fillStyle = '#E74C3C';
            ctx.fillRect(s * 0.2, s * 0.45, s * 0.04, s * 0.04);
            ctx.fillRect(s * 0.28, s * 0.45, s * 0.04, s * 0.04);
        });

        this._createSprite('mountain_golem', (ctx, s) => {
            ctx.fillStyle = '#5D6D7E';
            ctx.fillRect(s * 0.2, s * 0.2, s * 0.6, s * 0.65);
            ctx.fillStyle = '#4D5656';
            ctx.fillRect(s * 0.25, s * 0.05, s * 0.5, s * 0.2);
            ctx.fillStyle = '#F39C12';
            ctx.fillRect(s * 0.35, s * 0.1, s * 0.08, s * 0.08);
            ctx.fillRect(s * 0.57, s * 0.1, s * 0.08, s * 0.08);
            // Arms
            ctx.fillStyle = '#566573';
            ctx.fillRect(s * 0.05, s * 0.3, s * 0.18, s * 0.45);
            ctx.fillRect(s * 0.77, s * 0.3, s * 0.18, s * 0.45);
            // Legs
            ctx.fillRect(s * 0.25, s * 0.82, s * 0.2, s * 0.18);
            ctx.fillRect(s * 0.55, s * 0.82, s * 0.2, s * 0.18);
        });

        this._createSprite('boss', (ctx, s) => {
            // Dark aura
            ctx.fillStyle = 'rgba(142, 68, 173, 0.3)';
            ctx.beginPath();
            ctx.arc(s * 0.5, s * 0.5, s * 0.48, 0, Math.PI * 2);
            ctx.fill();
            // Body
            ctx.fillStyle = '#8E44AD';
            ctx.fillRect(s * 0.2, s * 0.25, s * 0.6, s * 0.55);
            // Head with horns
            ctx.fillStyle = '#6C3483';
            ctx.fillRect(s * 0.28, s * 0.08, s * 0.44, s * 0.22);
            ctx.fillStyle = '#4A235A';
            ctx.beginPath();
            ctx.moveTo(s * 0.28, s * 0.08);
            ctx.lineTo(s * 0.2, 0);
            ctx.lineTo(s * 0.35, s * 0.08);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(s * 0.72, s * 0.08);
            ctx.lineTo(s * 0.8, 0);
            ctx.lineTo(s * 0.65, s * 0.08);
            ctx.fill();
            // Eyes
            ctx.fillStyle = '#E74C3C';
            ctx.fillRect(s * 0.35, s * 0.14, s * 0.1, s * 0.08);
            ctx.fillRect(s * 0.55, s * 0.14, s * 0.1, s * 0.08);
            // Crown
            ctx.fillStyle = '#F1C40F';
            ctx.font = `${s * 0.2}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('👑', s * 0.5, s * 0.08);
            ctx.textAlign = 'left';
        });

        // === VILLAGER ===
        this._createSprite('villager', (ctx, s) => {
            // Robe
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(s * 0.28, s * 0.35, s * 0.44, s * 0.55);
            // Head
            ctx.fillStyle = '#F5CBA7';
            ctx.fillRect(s * 0.33, s * 0.1, s * 0.34, s * 0.28);
            // Nose
            ctx.fillStyle = '#D4A373';
            ctx.fillRect(s * 0.47, s * 0.22, s * 0.1, s * 0.1);
            // Hood
            ctx.fillStyle = '#6D3A0A';
            ctx.fillRect(s * 0.3, s * 0.08, s * 0.4, s * 0.1);
            // Eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(s * 0.38, s * 0.18, s * 0.05, s * 0.05);
            ctx.fillRect(s * 0.57, s * 0.18, s * 0.05, s * 0.05);
        });
    },

    _createSprite(name, drawFn) {
        const canvas = document.createElement('canvas');
        canvas.width = this.size;
        canvas.height = this.size;
        const ctx = canvas.getContext('2d');
        drawFn(ctx, this.size);
        this.cache[name] = canvas;
    },

    get(name) {
        return this.cache[name] || null;
    },

    draw(ctx, name, x, y, width, height) {
        const sprite = this.cache[name];
        if (sprite) {
            ctx.drawImage(sprite, x, y, width || this.size, height || this.size);
        }
    },

    // Draw sprite to a specific canvas context for UI (larger size)
    drawUI(ctx, name, x, y, size) {
        const sprite = this.cache[name];
        if (sprite) {
            ctx.drawImage(sprite, x, y, size, size);
        }
    },

    // === SPRITE SHEET SYSTEM ===

    /**
     * Loads all sprite sheets defined in CONFIG.ENEMIES.TYPES.
     * Any enemy type with a `spriteSheet` property will be loaded automatically.
     */
    _loadSpriteSheets() {
        const types = CONFIG.ENEMIES.TYPES;
        for (const [id, def] of Object.entries(types)) {
            if (def.spriteSheet) {
                this.loadSpriteSheet(id, def.spriteSheet);
            }
        }
    },

    /**
     * Loads a single sprite sheet.
     * @param {string} name - Unique identifier (matches enemy id or entity id).
     * @param {object} opts - { src, frameWidth, frameHeight, columns, rows, animations }.
     *   animations is an object like { idle: [0], attack: [1, 2] }
     */
    loadSpriteSheet(name, opts) {
        const img = new Image();
        img.src = opts.src;
        const entry = {
            image: img,
            loaded: false,
            frameWidth: opts.frameWidth,
            frameHeight: opts.frameHeight,
            columns: opts.columns,
            rows: opts.rows,
            animations: opts.animations || { idle: [0] },
        };
        img.onload = () => { entry.loaded = true; };
        this.spriteSheets[name] = entry;
    },

    /**
     * Returns sprite sheet metadata, or null if not registered.
     */
    getSpriteSheet(name) {
        return this.spriteSheets[name] || null;
    },

    /**
     * Draws a specific frame from a sprite sheet.
     * @returns {boolean} true if drawn successfully, false otherwise.
     */
    drawSpriteSheetFrame(ctx, name, frameIndex, x, y, width, height, flipX) {
        const sheet = this.spriteSheets[name];
        if (!sheet || !sheet.loaded) return false;

        const col = frameIndex % sheet.columns;
        const row = Math.floor(frameIndex / sheet.columns);
        const sx = col * sheet.frameWidth;
        const sy = row * sheet.frameHeight;

        ctx.save();
        if (flipX) {
            ctx.translate(x + width, y);
            ctx.scale(-1, 1);
            ctx.drawImage(sheet.image, sx, sy, sheet.frameWidth, sheet.frameHeight, 0, 0, width, height);
        } else {
            ctx.drawImage(sheet.image, sx, sy, sheet.frameWidth, sheet.frameHeight, x, y, width, height);
        }
        ctx.restore();
        return true;
    },

    /**
     * Determines the correct frame index for an enemy based on its state.
     * Uses attackCooldown to decide between idle and attack animations.
     */
    getEnemyFrame(enemy) {
        const sheet = this.spriteSheets[enemy.id];
        if (!sheet) return 0;

        const anims = sheet.animations;
        if (enemy.attackCooldown > 0 && anims.attack && anims.attack.length > 0) {
            const attackFrames = anims.attack;
            const progress = 1 - (enemy.attackCooldown / 1000);
            const idx = Math.min(Math.floor(progress * attackFrames.length), attackFrames.length - 1);
            return attackFrames[idx];
        }

        const idleFrames = anims.idle || [0];
        return idleFrames[0];
    },
};
