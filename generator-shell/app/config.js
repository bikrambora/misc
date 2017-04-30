const dependencies = require('./dependencies');

module.exports = {
    prompts: [
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
            name: 'version',
            message: 'Your component version',
            default: '0.1.0'
        },
        {
            type: 'input',
            name: 'repository',
            message: 'Your component repository',
            // assuming it's a git repository
            filter: (value) => value && value !== '' && !value.endsWith('.git') ? `${value}.git` : value
        },
        {
            type: 'checkbox',
            name: 'deps',
            message: 'Select runtime dependencies',
            choices: [
                { name: 'redux', value: { "redux" : "*" } }
            ],
            // merge all selected options into an object
            filter: (value) => value.reduce((acc, val) => Object.assign({}, acc, val), dependencies.runtime)
        },
        {
            type: 'checkbox',
            name: 'devDeps',
            message: 'Select development dependencies',
            choices: [
                { name: 'babel', value: { "babel" : "*" } }
            ],
            // merge all selected options into an object
            filter: (value) => value.reduce((acc, val) => Object.assign({}, acc, val), dependencies.development)
        }
    ]
};