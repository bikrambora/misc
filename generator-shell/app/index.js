const Generator = require('yeoman-generator');

class AppGenerator extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    async prompting() {
        this.prompts = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your component name',
                default: 'shell-component'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Your component description',
                default: 'awesome piece of react'
            },
            {
                type: 'input',
                name: 'repository',
                message: 'Your component repository'
            },
            {
                type: 'checkbox',
                name: 'deps',
                message: 'Select extra dependencies',
                choices: [ 'redux', 'ohw-svg' ]
            }
        ]);
    }

    writing() {
        this.fs.copy(
            this.templatePath('scaffold/+(**|.*)'),
            this.destinationPath(`${this.prompts.name}/`),
            { dot: true }
        );
        this.fs.copyTpl(
            this.templatePath('package.ejs'),
            this.destinationPath(`${this.prompts.name}/package.json`),
            {
                prompts: this.prompts
            }
        );
    }

    install() {
        this.npmInstall(null, null, null, { cwd: `./${this.prompts.name}/` });
    }
}

module.exports = AppGenerator;
