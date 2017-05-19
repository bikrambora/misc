const config = require('./config');
const writer = require('./writer');
const Generator = require('yeoman-generator');

class AppGenerator extends Generator {
    constructor(args, opts) {
        super(args, opts);

        config.arguments.forEach(arg => this.argument(arg.name, arg.config));
        config.options.forEach(opt => this.option(opt.name, opt.config));
    }

    async prompting() {
        this.prompts = await this.prompt(config.prompts);
    }

    writing() {
        writer(this);
    }

    install() {
        switch(this.options['pkgmanager']) {
            case 'npm': this.npmInstall(null, null, null, { cwd: `./${this.prompts.name}/` });
            case 'yarn': this.yarnInstall(null, null, null, { cwd: `./${this.prompts.name}/` });
        }
    }
}

module.exports = AppGenerator;
