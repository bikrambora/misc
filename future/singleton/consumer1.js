const idleMonitor = require('./idle');

const onBeat = timestamp => console.log(`From consumer 1 ${timestamp}`);

idleMonitor.addListener(onBeat);

setTimeout(() => idleMonitor.removeListener(onBeat), 7000);