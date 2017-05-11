const config = require('./config');
const Generator = require('yeoman-generator');

const createScaffold = (app) => {
    app.fs.copy(
        app.templatePath('scaffold/**/+(**|.*)'),
        app.destinationPath(`${app.prompts.name}/`),
        { dot: true }
    );
}

const processPackageJSON = (app) => {
    app.fs.copyTpl(
        app.templatePath('package.ejs'),
        app.destinationPath(`${app.prompts.name}/package.json`),
        { prompts: app.prompts }
    );
}

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
        createScaffold(this);
        processPackageJSON(this);
    }

    install() {
        if(!this.options['skipinstall']) this.npmInstall(null, null, null, { cwd: `./${this.prompts.name}/` });
    }
}

module.exports = AppGenerator;
