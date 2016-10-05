const path = require('path');

const Inert = require('inert');
const Vision = require('vision');
const JWT = require('hapi-auth-jwt2');
const Good = require('good');
const HapiPlusRoutes = require('hapi-plus-routes');
const Pg = require('hapi-pg-promise');
const MrHorse = require('mrhorse');
const HapiSwagger = require('hapi-swagger');
const HapiIo = require('hapi-io');

const validateFunc = require('./validateJwt.js');
const Pack = require('../package.json');
const config = require('../config.js');

const plugins = [Inert, Vision];

const logSqueezeArgs = [{
	log: '*',
	response: '*',
	request: '*',
	'request-internal': '*'
}];

plugins.push({
	register: Good,
	options: {
		reporters: {
			console: [{
				module: 'good-squeeze',
				name: 'Squeeze',
				args: logSqueezeArgs
			}, {
				module: 'good-console',
				args: [{
					format: 'HH:mm:ss DD.MM.YYYY'
				}]
			}, 'stdout'],
			file: [{
				module: 'good-squeeze',
				name: 'Squeeze',
				args: logSqueezeArgs
			}, {
				module: 'good-squeeze',
				name: 'SafeJson'
			}, {
				module: 'rotating-file-stream',
				args: [
					'log',
					{
						interval: '1d',
						compress: 'gzip',
						path: './logs'
					}
				]
			}]
		}
	}
});

plugins.push({
	register: Pg,
	options: {
		cn: config.db
	}
});

plugins.push({
	register: MrHorse,
	options: {
		policyDirectory: path.join(__dirname, 'policies'),
		defaultApplyPoint: 'onPreHandler'
	}
});

plugins.push({
	register: HapiPlusRoutes,
	options: {
		routes: './routes/**/*.js'
	}
});

plugins.push({
	register: HapiIo,
	options: {
		auth: 'jwt'
	}
});

plugins.push({
	register: HapiSwagger,
	options: {
		documentationPage: process.env.DB_ENV !== 'live', // swagger is added to all non-live environments
		info: {
			title: 'API Documentation',
			version: Pack.version
		},
		jsonEditor: true
	}
});

module.exports = server => new Promise((resolve, reject) => {
	server.register(JWT, (jwtRegErr) => {
		if(jwtRegErr) {
			reject(jwtRegErr);
		} else {
			server.auth.strategy('jwt', 'jwt', true, {
				key: config.authKey,
				verifyOptions: {
					algorithms: ['HS256']
				},
				validateFunc
			});

			server.register(plugins, (err) => {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			});
		}
	});
});
