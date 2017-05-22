const idleMonitor = require('./idle');

class Consumer2 {
    constructor() {
        idleMonitor.addListener(this.onBeat);
    }

    onBeat(timestamp) {
        console.log(`From consumer 2 ${timestamp}`);
    }
}

module.exports = Consumer2;