const Boom = require('boom');

module.exports = {
	path: '/examples/mysql',
	handler: (request, reply) => {
		if(!request.app || !request.app.db) {
			reply(Boom.notImplemented('MySql not added'));
		} else {
			request.app.db.query('select now()', (err, res) => {
				if(err) {
					request.log(['error'], err);
					reply(Boom.badImplementation('No time'));
				} else {
					reply(res);
				}
			});
		}
	}
};
