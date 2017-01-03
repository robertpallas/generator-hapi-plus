module.exports = {
    path: '/',
    handler: (request, reply) => {
        reply({
            welcome: 'Yes, there is an API here that talks JSON :-)'
        });
    }
};
