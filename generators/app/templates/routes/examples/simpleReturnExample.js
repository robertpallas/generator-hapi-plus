const Joi = require('joi');
const Boom = require('boom');

module.exports = {
    method: 'POST',    
    path: '/examples/simple',
    handler: (request) => {
        let simpleReturn;

        if(request.payload.error) {
            simpleReturn = Boom.internal();
        } else {
            simpleReturn = {
                request: false,
                reply: false,
                works: true
            };
        }

        return simpleReturn;
    },
    config: {
        description: 'simple object returned, handler with 0 params',
        validate: {
            payload: {
                error: Joi.boolean()
            }
        }
    }
};
