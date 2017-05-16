module.exports = [
    {
        name: 'skipinstall',
        config: {
            default: false,
            type: v => v && v.toString().toLowerCase() === 'true',
            desc: 'Determines whether to install dependencies once the generator is done'
        }
    },
    {
        name: 'pkgmanager',
        config: {
            default: 'npm'
        }
    }
];