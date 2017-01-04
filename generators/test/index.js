const Generators = require('yeoman-generator');
const Path = require('path');
const Felicity = require('felicity');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const recursive = require('recursive-readdir-sync');
const stringifyObject = require('stringify-object');
const yosay = require('yosay');
const chalk = require('chalk');

const defaultTestRc = {
    url: 'http://0.0.0.0:3000',
    login: {
        route: '/users/login',
        username: 'username',
        password: 'password'
    },
    ignore: []
};

module.exports = Generators.Base.extend({
    constructor: function() {
        Generators.Base.apply(this, arguments);
    },
    testLocations() {
        let packageJson = this.fs.readJSON(Path.join(process.cwd(), 'package.json'));
        if(!packageJson || !packageJson.dependencies || !packageJson.dependencies.hapi) {
            this.log(`${chalk.red('Tests should be generated inside root of Hapi API where package.json is')}`);
            process.exit(1);
        }

        try {
            this.files = recursive(Path.join(process.cwd(), 'routes'));
        } catch(err) {
            console.log(err);
            this.log(`${chalk.red('Could not find /routes, cant generate tests')}`);
            process.exit(1);
        }
    },
    getRunConfig() {
        this.runConfig = defaultTestRc;
        try {
            this.runConfig = require(Path.join(process.cwd(), '.yohapiplustestrc'));
        } catch(e) {console.log(e);}
    },
    getRoutesFromFiles() {
        this.routes = [];
        _.each(this.files, (el) => {
            try {
                let routeHandler = require(el);
                if(routeHandler.path) {
                    let method = routeHandler.method || 'GET';
                    let newRoute = {
                        name: `${chalk.green(method)} ${routeHandler.path}`,
                        nameNoColor: `${method} ${routeHandler.path}`,
                        handler: routeHandler,
                        value: this.routes.length,
                        filename: el
                    };

                    if(!_.includes(this.runConfig.ignore, newRoute.nameNoColor)) {
                        this.routes.push(newRoute);
                    }
                }
            } catch(err) {}
        });
    },
    countRoutes() {
        if(!this.routes.length) {
            this.log(`${chalk.red('Could not find any Hapi routes in /routes')}`);
            process.exit(1);
        }
    },
    hello() {
        this.log(yosay(
            `${chalk.red('Hapi Plus')} Tests generator!`
        ));
    },
    askFor() {
        const prompts = [{
            name: 'routeIndexes',
            message: 'Endpoints to generate tests for',
            type: 'checkbox',
            choices: this.routes
        }];

        return this.prompt(prompts).then((answers) => {
            this.routeIndexes = answers.routeIndexes;
        });
    },
    prepareRoutes() {

        _.each(this.routeIndexes, (idx) => {
            let route = this.routes[idx];

            route.random = {
                payload: {},
                params: {},
                query: {}
            };

            if(route.handler.config && route.handler.config.validate) {
                _.each(route.handler.config.validate, (paramList, method) => {
                    _.each(paramList, (joiSchema, key) => {
                        const FelicityConstructor = Felicity.entityFor(joiSchema);
                        const felicityInstance = new FelicityConstructor();
                        route.random[method][key] = felicityInstance.example();
                    });
                });
            }

            _.each(route.random, (value, key) => {
                route.random[key] = stringifyObject(value, {indent: '    '});
            });

            this.routes[idx] = route;
        });
    },
    writeTestFiles() {

        _.each(this.routeIndexes, (idx) => {
            let route = this.routes[idx];
            let templateData = {
                runConfig: this.runConfig,
                route
            };

            if(route.handler.method === 'POST') {
                this.template('testPost.js', getTestFilename(route.filename), templateData);
            } else if(route.handler.method === 'PUT') {
                this.template('testPut.js', getTestFilename(route.filename), templateData);
            } else if(route.handler.method === 'DELETE') {
                this.template('testDelete.js', getTestFilename(route.filename), templateData);
            } else {
                this.template('testGet.js', getTestFilename(route.filename), templateData);
            }

            // add generated tests to ignore
            this.runConfig.ignore.push(route.nameNoColor);
        });

        // write runConfig back to file system with updated ignore list
        this.template('_yohapiplustestrc', '.yohapiplustestrc', {runConfig: stringifyObject(this.runConfig)});
    }
});

function getTestFilename(routeFilename) {
    routeFilename = routeFilename.replace('routes', 'test');
    routeFilename = routeFilename.replace(/(.*)\/(.*\.js)$/, '$1/test_$2');

    return routeFilename;
}
