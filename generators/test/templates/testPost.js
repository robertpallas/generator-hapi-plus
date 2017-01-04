const request = require('supertest');
const should = require('should');

describe('<%= route.nameNoColor %>', function() {

    let url = '<%= runConfig.url %>';<% if(route.handler.config && route.handler.config.auth) { %>
    let token;

    before(function(done) {
        let login = {
            username: '<%= runConfig.login.username %>',
            password: '<%= runConfig.login.password %>'
        };

        request(url)
            .post('<%= runConfig.login.route %>')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(login)
            .end(function(err, res) {

                token = res.body.token;

                done();
            });
    });<% } %>

    it('should <%= route.nameNoColor %>', function(done) {

        let data = <%- route.random.payload %>;

        // insert new resource
        request(url)
            .post('<%= route.handler.path %>')
            .set('Content-Type', 'application/x-www-form-urlencoded')<% if(route.handler.config && route.handler.config.auth) { %>
            .set('Authorization', token)<% } %>
            .send(data)
            .end(function(err, res) {

                should(err).not.be.ok();

                res.body.id.should.be.a.Number();
                let id = res.body.id;

                // check it saved correctly
                request(url)
                    .get('<%= route.handler.path %>/' + id)<% if(route.handler.config && route.handler.config.auth) { %>
                    .set('Authorization', token)<% } %>
                    .end(function(err, res) {

                        should(err).not.be.ok();

                        // TODO: should.js assertions
                        // res.body.field.should.equal(data.field);

                        done();
                    });
            });
    });
});
