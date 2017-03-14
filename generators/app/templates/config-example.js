module.exports = {
    authKey: 'superSecretStuffYouWillSwitchToSomethingRandomlyGenerated',<% if(config.postgre) { %>
    postgreSql: {
        host: 'pg host',
        port: 5432,
        user: 'pg user',
        password: 'pg password',
        database: 'pg database'
    },<% } if(config.mysql) { %>
    mySql: {
        host: 'mysql host',
        port: 3306,
        user: 'mysql user',
        password: 'mysql password',
        database: 'mysql database'
    }, <% } if(config.mongo) { %>
    mongo: 'mongo url' <% } %>
};
