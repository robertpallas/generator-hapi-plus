const Generators = require('yeoman-generator');
const Path = require('path');
const Mkdirp = require('mkdirp');
const GitConfig = require('git-config');
const Random = require('randomstring');

module.exports = Generators.Base.extend({
    constructor() {
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

        GitConfig((err, config) => {
            if(err) {
                return done();
            }

            this.gitConfig = config;
            done();
        });
    },
    askFor() {
        const prompts = [{
            name: 'description',
            message: 'Description'
        }, {
            name: 'author',
            message: 'Author',
            default: this.gitConfig.user && (`${this.gitConfig.user.name} <${this.gitConfig.user.email}>`)
        }, {
            name: 'postgre',
            type: 'confirm',
            default: true,
            message: 'Add PostgreSQL with Pg-Promise?'
        }, {
            name: 'addPgConfig',
            type: 'confirm',
            default: false,
            message: 'Add PostgreSQL login to config.js?',
            when: answers => answers.postgre
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
            name: 'mysql',
            type: 'confirm',
            default: false,
            message: 'Add MySql?'
        }, {
            name: 'addMysqlConfig',
            type: 'confirm',
            default: false,
            message: 'Add MySql login to config.js?',
            when: answers => answers.mysql
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
            name: 'mongo',
            type: 'confirm',
            default: false,
            message: 'Add MongoDB?'
        }, {
            name: 'addMongoConfig',
            type: 'confirm',
            default: false,
            message: 'Add Mongo to config.js?',
            when: answers => answers.mongo
        }, {
            name: 'mongoUrl',
            message: 'Mongo URL',
            default: 'mongodb://localhost:27017',
            when: answers => answers.addMongoConfig
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
        }];

        return this.prompt(prompts).then((answers) => {
            this.description = answers.description;
            this.author = answers.author;

            this.config.postgre = this.config.mysql = this.config.mongo = false;

            this.postgre = answers.postgre;
            if(answers.addPgConfig) {
                this.config.postgre = {
                    host: answers.pgHost,
                    port: answers.pgPort,
                    user: answers.pgUser,
                    password: answers.pgPwd,
                    database: answers.pgDb
                };
            }
            this.mysql = answers.mysql;
            if(answers.addMysqlConfig) {
                this.config.mysql = {
                    host: answers.mysqlHost,
                    port: answers.mysqlgPort,
                    user: answers.mysqlUser,
                    password: answers.mysqlPwd
                };
            }
            this.mongo = answers.mongo;
            if(answers.addMongoConfig) {
                this.config.mongo = {
                    url: answers.mongoUrl
                };
            }

            this.docker = answers.docker;
            this.dockerPort = answers.dockerPort;
            this.authKey = Random.generate();
        });
    },
    app() {
        Mkdirp.sync(this.appName);

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

        this.directory('lib', Path.join(this.appName, 'routes'));
        this.directory('routes', Mkdirp.sync(Path.join(this.appName, 'lib'))); // TODO: add examples boolean

        this.template('lib/loadPlugins.js', Path.join(this.appName, 'lib/loadPlugins.js'));
    }
});
