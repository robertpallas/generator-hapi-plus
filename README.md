generator-hapi-plus
===================
> Hapi (Node + Javascript + ES6) REST API generator

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
