const Generators = require('yeoman-generator');
const Path = require('path');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const gitConfig = require('git-config');
const randomString = require('randomstring');
const yosay = require('yosay');
const chalk = require('chalk');

module.exports = Generators.Base.extend({
    constructor: function() {
        Generators.Base.apply(this, arguments);

        this.argument('appName', {
            type: String,
            desc: 'Application name. Ex my-cool-app',
            required: true
        });
    },
    init() {
        this.pkg = this.fs.readJSON(Path.join(__dirname, '../package.json'));
    },
    git() {
        const done = this.async();
        this.gitConfig = {};

        gitConfig((err, config) => {
            if(err) {
                return done();
            }

            this.gitConfig = config;
            done();
        });
    },
    hello() {
        this.log(yosay(
            `Welcome to the ${chalk.red('Hapi Plus')} generator!`
        ));
    },
    askFor() {
        const prompts = [{
            name: 'description',
            message: 'Description'
        }, {
            name: 'author',
            message: 'Author',
            default: this.gitConfig && this.gitConfig.user && (`${this.gitConfig.user.name} <${this.gitConfig.user.email}>`)
        }, {
            name: 'features',
            message: 'Database plugins to be added',
            type: 'checkbox',
            choices: [
                {
                    name: 'postgre',
                    checked: true
                },
                {name: 'mysql'},
                {name: 'mongo'}
            ]
        }, {
            name: 'addPgConfig',
            type: 'confirm',
            default: true,
            message: 'Add PostgreSQL login to config.js?',
            when: answers => answers.features.indexOf('postgre') > -1
        }, {
            name: 'pgHost',
            default: 'localhost',
            message: 'PG host',
            when: answers => answers.addPgConfig
        }, {
            name: 'pgPort',
            default: '5432',
            message: 'PG port',
            when: answers => answers.addPgConfig
        }, {
            name: 'pgUser',
            default: 'root',
            message: 'PG user',
            when: answers => answers.addPgConfig
        }, {
            name: 'pgPwd',
            type: 'password',
            message: 'PG password',
            when: answers => answers.addPgConfig
        }, {
            name: 'pgDb',
            message: 'PG database',
            default: answers => answers.pgUser,
            when: answers => answers.addPgConfig
        }, {
            name: 'addMysqlConfig',
            type: 'confirm',
            default: true,
            message: 'Add MySql login to config.js?',
            when: answers => answers.features.indexOf('mysql') > -1
        }, {
            name: 'mysqlHost',
            default: 'localhost',
            message: 'MySql host',
            when: answers => answers.addMysqlConfig
        }, {
            name: 'mysqlPort',
            default: 3306,
            message: 'MySql port',
            when: answers => answers.addMysqlConfig
        }, {
            name: 'mysqlUser',
            default: 'root',
            message: 'MySql user',
            when: answers => answers.addMysqlConfig
        }, {
            name: 'mysqlPwd',
            type: 'password',
            message: 'MySql password',
            when: answers => answers.addMysqlConfig
        }, {
            name: 'addMongoConfig',
            type: 'confirm',
            default: true,
            message: 'Add Mongo to config.js?',
            when: answers => answers.features.indexOf('mongo') > -1
        }, {
            name: 'mongoUrl',
            message: 'Mongo URL',
            default: 'mongodb://localhost:27017',
            when: answers => answers.addMongoConfig
        }, {
            name: 'auth',
            type: 'confirm',
            default: true,
            message: 'Add auth with JWT?'
        }, {
            name: 'docker',
            type: 'confirm',
            default: true,
            message: 'Use Docker?'
        }, {
            name: 'dockerPort',
            message: 'Host port mapped to access Docker container',
            default: '9000',
            when: answers => answers.docker
        }, {
            name: 'routes',
            message: 'Add routes',
            type: 'checkbox',
            choices: answers => {
                let routeAddChoices = [
                    {name: 'welcome at GET /'}
                ];
                if(answers.postgre || answers.mysql || answers.mongo) {
                    routeAddChoices.push({name: 'examples for Postgre, MySql and Mongo plugin usage'});
                }
                if(answers.auth) {
                    routeAddChoices.push({name: 'users POST login, POST register, GET me'});
                }
                return routeAddChoices;
            }
        }];

        return this.prompt(prompts).then((answers) => {
            
            this.description = answers.description;
            this.author = answers.author;

            this.config.postgre = this.config.mysql = this.config.mongo = false;

            this.postgre = answers.features.indexOf('postgre') > -1;
            if(answers.addPgConfig) {
                this.config.postgre = {
                    host: answers.pgHost,
                    port: answers.pgPort,
                    user: answers.pgUser,
                    password: answers.pgPwd,
                    database: answers.pgDb
                };
            }

            this.mysql = answers.features.indexOf('mysql') > -1;
            if(answers.addMysqlConfig) {
                this.config.mysql = {
                    host: answers.mysqlHost,
                    port: answers.mysqlPort,
                    user: answers.mysqlUser,
                    password: answers.mysqlPwd
                };
            }
            this.mongo = answers.features.indexOf('mongo') > -1;
            if(answers.addMongoConfig) {
                this.config.mongo = {
                    url: answers.mongoUrl
                };
            }

            this.auth = answers.auth;
            this.docker = answers.docker;
            this.dockerPort = answers.dockerPort;
            this.authKey = randomString.generate();

            this.routes = {};

            // set selected routes keys true
            _.each(answers.routes, el => {
                let routeKey = el.split(' ')[0]; // use first word in string as key
                this.routes[routeKey] = true;
            });
        });
    },
    app() {

        mkdirp.sync(this.appName);

        this.copy('_gitignore', Path.join(this.appName, '.gitignore')); 
        this.copy('index.js', Path.join(this.appName, 'index.js'));
        this.copy('.eslintrc', Path.join(this.appName, '.eslintrc'));
        this.template('_package.json', Path.join(this.appName, 'package.json'));
        this.template('_README.md', Path.join(this.appName, 'README.md'));
        this.template('config.js', Path.join(this.appName, 'config.js'));

        if(this.docker) {
            this.copy('.dockerignore', Path.join(this.appName, '.dockerignore'));
            this.template('Dockerfile', Path.join(this.appName, 'Dockerfile'));
            this.template('docker-compose.yml', Path.join(this.appName, 'docker-compose.yml'));
        }

        // copy /lib folder
        mkdirp.sync(Path.join(this.appName, 'lib'));
        this.directory(Path.join('lib', 'policies'), Path.join(this.appName, 'lib', 'policies'));
        this.template(Path.join('lib', 'loadPlugins.js'), Path.join(this.appName, 'lib', 'loadPlugins.js'));
        if(this.auth) {
            this.copy(Path.join('lib' ,'validateJWt.js'), Path.join(this.appName, 'lib', 'validateJWt.js'));
        }

        // copy /routes folder
        mkdirp.sync(Path.join(this.appName, 'routes'));
        if(this.routes.examples) {
            this.directory(Path.join('routes' ,'examples'), Path.join(this.appName, 'routes', 'examples'));
        }
        if(this.routes.users) {
            this.directory(Path.join('routes' ,'users'), Path.join(this.appName, 'routes', 'users'));
        }
        if(this.routes.welcome) {
            this.copy(Path.join('routes' ,'get.js'), Path.join(this.appName, 'routes', 'get.js'));
        }
    }
});
