const Hapi = require('hapi');

const loadPlugins = require('./lib/loadPlugins.js');

const server = new Hapi.Server({
    connections: {
        routes: {
            cors: true,
            timeout: {
                socket: false,
                server: false
            }
        }
    }
});

server.connection({
    host: '0.0.0.0',
    port: 3000
});

loadPlugins(server).then(() => {
    server.start((err) => {
        if(err) {
            server.log(['startup', 'error'], `Server start error ${err}`);
        } else {
            server.log(['startup'], `Server running at ${server.info.uri}`);
        }
    });
}).catch((err) => {
    server.log(['startup', 'error'], `Server start error ${err}`);
    process.exit(1);
});

