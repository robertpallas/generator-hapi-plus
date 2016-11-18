const Boom = require('boom');

module.exports = {
    path: '/examples/mongo',
    handler: (request, reply) => {
        if(!request.mongo || !request.mongo.db) {
            reply(Boom.notImplemented('Mongo not added'));
        } else {
            // get the first document or create one
            // then increment count field
            // return count field value to user

            const mongoOptions = {
                upsert: true,
                returnOriginal: false
            };

            request.mongo.db.collection('example').findOneAndUpdate({}, { $inc: { count: 1 } }, mongoOptions, (err, res) => {
                if(err) {
                    reply(Boom.badImplementation('Bad Mongo, Bad!'));
                } else {
                    reply({ count: res.value.count });
                }
            });
        }
    }
};
