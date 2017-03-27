const Generator = require('yeoman-generator');

class AppGenerator extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('babel');
    }

    method1() {
        this.log('method 1 running');
    }
}

module.exports = AppGenerator;
