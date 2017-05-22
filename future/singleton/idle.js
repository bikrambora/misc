class IdleMonitor {
    constructor() {
        this.listeners = [];
        this.timestamp = Date.now();
        this.onBeat = this.onBeat.bind(this);
        setInterval(this.onBeat, 3000);
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    removeListener(listener) {
        const idx = this.listeners.indexOf(listener);
        if(idx === -1) return;
        this.listeners.splice(idx, 1);
    }

    onBeat() {
        if (this.listeners.length < 1) return;

        this.listeners.forEach(listener => {
            listener(this.timestamp);
        });
    }
}

module.exports = new IdleMonitor();