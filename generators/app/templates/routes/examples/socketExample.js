const Joi = require('joi');

module.exports = {
    path: '/examples/socket',
    handler: (request, reply) => {
        request.server.publish('/messages', request.query);
        reply(request.query);
    },
    config: {
        description: 'Message to client socket',
        validate: {
            query: {
                message: Joi.string(),
                to: Joi.string().required().lowercase()
            }
        }
    }
};
