module.exports = {
    path: '/examples/promise',
    handler: () => {
        return Promise.resolve({
            promise: true
        });
    },
    config: {
        description: 'simple promise returned, handler with 0 params'
    }
};
