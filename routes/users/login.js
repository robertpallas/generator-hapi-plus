const Joi = require('joi');
const Boom = require('boom');
const JWT = require('jsonwebtoken');

const config = require('../../config.js');

const TOKEN_TTL = '30m';

module.exports = {
	path: '/users/login',
	method: 'POST',
	handler(request, reply) {
		if(request.payload.password === 'letMeIn') {
			const options = {
				expiresIn: TOKEN_TTL
			};
			const session = {
				id: 1,
				role: 'semi-admin',
				username: request.payload.username
			};
			const token = JWT.sign(session, config.authKey, options);

			const res = {
				token,
				username: request.payload.username
			};

			reply(res)
				.header('Authorization', token);
		} else {
			reply(Boom.unauthorized('Wrong password'));
		}
	},
	config: {
		description: 'Login',
		validate: {
			payload: {
				password: Joi.string().min(6).max(80).allow(null),
				username: Joi.string().required().lowercase()
			}
		}
	}
};
