const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/examples/default',
    handler: (request, reply) => {
        request.log([request.method, request.path, 'info'], 'Just logging around');
        reply(request.payload);
    },
    config: {
        description: 'default route use with logging',
        validate: {
            payload: {
                response: Joi.string().min(2).max(8).description('pong that back')
            }
        }
    }
};
