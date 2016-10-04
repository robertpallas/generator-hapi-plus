const Joi = require('joi');
const Boom = require('boom');

module.exports = {
	path: '/users',
	method: 'POST',
	handler(request, reply) {
		if(request.payload.password1 !== request.payload.password2) {
			reply(Boom.notAcceptable('Passwords have to match'));
		} else {
			reply(Boom.notImplemented());
		}
	},
	config: {
		description: 'Register',
		validate: {
			payload: {
				username: Joi.string().required().lowercase(),
				firstName: Joi.string().min(3).max(80),
				lastName: Joi.string().min(3).max(80),
				password1: Joi.string().min(6).max(80),
				password2: Joi.string().min(6).max(80),
				personalCode: Joi.string().min(3).max(80),
				email: Joi.string().email()
			}
		}
	}
};
