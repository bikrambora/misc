module.exports = [
    {
        name: 'pkgmanager',
        config: {
            default: 'npm',
            type: t => t ? t.toString().toLowerCase() : '',
            desc: 'Determines which package manager the project uses'
        }
    }
];