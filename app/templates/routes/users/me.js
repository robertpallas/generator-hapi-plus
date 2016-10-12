module.exports = {
    path: '/users/me',
    method: 'GET',
    handler(request, reply) {
        reply(request.auth.credentials);
    },
    config: {
        auth: 'jwt',
        description: 'Get current user details'
    }
};
