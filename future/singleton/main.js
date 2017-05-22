const c1 = require('./consumer1');
const c2 = require('./consumer2');

setTimeout(() => new c2(), 5000);

console.log('magic about to happen');