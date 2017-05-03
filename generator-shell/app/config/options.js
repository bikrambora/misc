module.exports = [
    {
        name: 'skipinstall',
        config: {
            default: false,
            type: v => v === 'true'
        }
    }
];