const Boom = require('boom');

module.exports = {
	path: '/examples/postgresql',
	handler: (request, reply) => {
		if(!request.db) {
			reply(Boom.notImplemented('PostgreSql not added'));
		} else {
			request.db.query('select now()').then(reply).catch((err) => {
				request.log(['error'], err);
				reply(Boom.badImplementation('No time'));
			});
		}
	}
};
