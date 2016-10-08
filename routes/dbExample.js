const Boom = require('boom');

module.exports = {
	path: '/db',
	handler: (request, reply) => {
		request.db.query('select now()').then(reply).catch((err) => {
			request.log(['error'], err);
			reply(Boom.badImplementation('No time'));
		});
	}
};
