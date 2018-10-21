generator-hapi-plus
===================
> Hapi 16 (Node + Javascript + ES6) REST API generator

Deprecated
==========
This generator generates Hapi 16 boilerplate and there are **no plans to update**. If you start a new Hapi project use version 17+.

Quickstart
==========
    npm install -g yo generator-hapi-plus
    yo hapi-plus <APP-NAME>
    cd <APP-NAME>
    npm install
    npm start

Features
========

 * Docker with Dockerfile and Docker Compose instructions `docker-compose build && docker-compose up -d`
 * PostgreSql plugin with PG Promise
 * MySql plugin
 * MongoDb plugin
 * Authentication with JWT
 * WebSockets
 * Logging `/logs`
 * Automatic documentation with Swagger `http://0.0.0.0:3000/documentation`
 * Routes structure and examples `/routes`
 * Code style extending Airbnb guide and linting `npm run lint`
