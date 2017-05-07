module.exports = [
    {
        name: 'skipinstall',
        config: {
            default: false,
            type: v => v && v.toString().toLowerCase() === 'true'
        }
    }
];