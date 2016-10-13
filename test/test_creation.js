const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

describe('hapi-plus:app', function() {
    const appName = 'test-app-name';

    describe('with all files', function() {

        const promptAnswers = {
            description: 'Desc text of test generated',
            author: 'Test Donkey',
            features: [ 'postgre', 'mysql', 'mongo' ],
            addPgConfig: true,
            pgHost: 'localhost',
            pgPort: '5432',
            pgUser: 'root',
            pgPwd: 'secretSauce',
            pgDb: 'root',
            addMysqlConfig: true,
            mysqlHost: 'localhost',
            mysqlPort: 3306,
            mysqlUser: 'root',
            mysqlPwd: 'secretSauce',
            addMongoConfig: true,
            mongoUrl: 'mongodb://localhost:27017',
            docker: true,
            dockerPort: '9009',
            routes: [
                'users POST login, POST register, GET me',
                'examples for Postgre, MySql and Mongo plugin usage',
                'welcome at GET /'
            ]
        };

        before(function() {
            return helpers.run(path.join( __dirname, '../app'))
                .withArguments([appName])
                .withPrompts(promptAnswers)
                .toPromise()
                .then(() => {
                    process.chdir(appName); // cd into directory with the test app
                })
                .catch(err => console.log);
        });

        it('generates the files', function() {
            const expectedFiles = [
                'Dockerfile',
                'README.md',
                'config.js',
                'docker-compose.yml',
                'index.js',
                'package.json',
                'lib/loadPlugins.js',
                'lib/validateJwt.js',
                'lib/policies/errorResponse.js',
                'lib/policies/logRequest.js',
                'routes/get.js',
                'routes/examples/mongoExample.js',
                'routes/examples/mySqlExample.js',
                'routes/examples/postgreExample.js',
                'routes/users/login.js',
                'routes/users/me.js',
                'routes/users/register.js'
            ];

            assert.file(expectedFiles);
        });

        it('has required fields from answers in generated files', function() {
            assert.fileContent('docker-compose.yml', new RegExp(promptAnswers.dockerPort + ':3000'));
            assert.fileContent('package.json', /hapi-pg-promise/);
            assert.fileContent('package.json', /hapi-plugin-mysql/);
            assert.fileContent('package.json', /hapi-mongodb/);
            assert.fileContent('package.json', new RegExp(appName));
            assert.fileContent('README.md', new RegExp(appName));
            assert.fileContent('docker-compose.yml', new RegExp(appName));
            assert.fileContent('Dockerfile', new RegExp(promptAnswers.author));
            assert.fileContent('package.json', new RegExp(promptAnswers.author));
        });
    });

    describe('with minimal files', function() {

        const promptAnswers = {
            description: 'Desc text of test generated',
            author: 'Test Donkey',
            features: [],
            docker: false,
            routes: []
        };

        before(function() {
            return helpers.run(path.join( __dirname, '../app'))
                .withArguments([appName])
                .withPrompts(promptAnswers)
                .toPromise()
                .then(() => {
                    process.chdir(appName); // cd into directory with the test app
                })
                .catch(err => console.log);
        });

        it('generates without the files', function() {
            const expectedFilesNotToExist = [
                'Dockerfile',
                'docker-compose.yml',
                'routes/get.js',
                'routes/examples/mongoExample.js',
                'routes/examples/mySqlExample.js',
                'routes/examples/postgreExample.js',
                'routes/users/login.js',
                'routes/users/me.js',
                'routes/users/register.js'
            ];

            assert.noFile(expectedFilesNotToExist);
        });

        it('does not have DB plugin related file contents', function() {
            assert.noFileContent('package.json', /hapi-pg-promise/);
            assert.noFileContent('package.json', /hapi-plugin-mysql/);
            assert.noFileContent('package.json', /hapi-mongodb/);
            assert.noFileContent('lib/loadPlugins.js', /hapi-pg-promise/);
            assert.noFileContent('lib/loadPlugins.js', /hapi-plugin-mysql/);
            assert.noFileContent('lib/loadPlugins.js', /hapi-mongodb/);
        });
    });
});