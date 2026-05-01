/**
 * MINIMINE - Utility Functions
 */

const Utils = {
    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    rectCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    },

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && 'ontouchstart' in window);
    },

    worldToBlock(pixelX, pixelY) {
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        return {
            x: Math.floor(pixelX / bs),
            y: Math.floor(pixelY / bs),
        };
    },

    blockToWorld(blockX, blockY) {
        const bs = CONFIG.WORLD.BLOCK_SIZE;
        return {
            x: blockX * bs,
            y: blockY * bs,
        };
    },

    timestamp() {
        return performance.now();
    },
};
