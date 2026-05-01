/**
 * MINIMINE - Day/Night Cycle
 */

const DayNight = {
    time: 0,          // Current time in ms
    isDay: true,
    cycle: 'day',     // 'day' or 'night'
    alpha: 0,         // Darkness overlay alpha (0 = day, 0.6 = night)

    init() {
        this.time = 0;
        this.isDay = true;
        this.cycle = 'day';
        this.alpha = 0;
    },

    update(dt) {
        this.time += dt;

        const dayDuration = CONFIG.DAY_NIGHT.DAY_DURATION;
        const nightDuration = CONFIG.DAY_NIGHT.NIGHT_DURATION;
        const totalCycle = dayDuration + nightDuration;

        const cycleTime = this.time % totalCycle;

        if (cycleTime < dayDuration) {
            this.cycle = 'day';
            this.isDay = true;
            // Fade at edges
            const progress = cycleTime / dayDuration;
            if (progress < 0.1) {
                this.alpha = Utils.lerp(0.6, 0, progress / 0.1);
            } else if (progress > 0.9) {
                this.alpha = Utils.lerp(0, 0.6, (progress - 0.9) / 0.1);
            } else {
                this.alpha = 0;
            }
        } else {
            this.cycle = 'night';
            this.isDay = false;
            this.alpha = 0.6;
        }
    },

    isNight() {
        return !this.isDay;
    },

    getOverlayColor() {
        return `rgba(10, 10, 40, ${this.alpha})`;
    },

    getSkyColor() {
        if (this.isDay) {
            return '#87CEEB';
        }
        return '#0C1445';
    },

    toSaveData() {
        return { time: this.time };
    },

    fromSaveData(data) {
        this.time = data.time || 0;
    },
};
