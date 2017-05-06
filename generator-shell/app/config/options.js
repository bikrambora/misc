module.exports = [
    {
        name: 'skipinstall',
        config: {
            default: false,
            type: v => v.toLowerCase() === 'true'
        }
    }
];