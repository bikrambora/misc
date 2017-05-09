const config = require('./config');
const Generator = require('yeoman-generator');

class AppGenerator extends Generator {
    _createScaffold() {
        this.fs.copy(
            this.templatePath('scaffold/**/+(**|.*)'),
            this.destinationPath(`${this.prompts.name}/`),
            { dot: true }
        );
    }

    _processPackageJSON() {
        this.fs.copyTpl(
            this.templatePath('package.ejs'),
            this.destinationPath(`${this.prompts.name}/package.json`),
            { prompts: this.prompts }
        );
    }

    constructor(args, opts) {
        super(args, opts);

        config.arguments.forEach(arg => this.argument(arg.name, arg.config));
        config.options.forEach(opt => this.option(opt.name, opt.config));
    }

    async prompting() {
        this.prompts = await this.prompt(config.prompts);
    }

    writing() {
        this._createScaffold();
        this._processPackageJSON();
    }

    install() {
        if(!this.options['skipinstall']) this.npmInstall(null, null, null, { cwd: `./${this.prompts.name}/` });
    }
}

module.exports = AppGenerator;
