module.exports = {
    path: '/examples/postgresqlpromise',
    handler: request => request.db.one('select now()'),
    config: {
        description: 'promise return and reject can be handled by hapi-plus-routes package'
    }
};
