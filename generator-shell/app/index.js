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
                type: 'checkbox',
                name: 'deps',
                message: 'Select extra dependencies',
                choices: [ 'redux', 'ohw-svg' ]
            }
        ]);
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('package.ejs'),
            this.destinationPath('package.json'),
            {
                prompts: this.prompts
            }
        );
    }

    install() {
        this.installDependencies(
            {
                npm: true,
                bower: false,
                yarn: false
            }
        );
    }
}

module.exports = AppGenerator;
