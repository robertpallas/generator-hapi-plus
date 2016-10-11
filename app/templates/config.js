module.exports = {
	authKey: '<%= authKey %>',<% if(config.postgre) { %>
	postgreSql: {
		host: '<%= config.postgre.host %>',
		port: <%= config.postgre.port %>,
		username: '<%= config.postgre.user %>',
		password: '<%= config.postgre.password %>',
		database: '<%= config.postgre.database %>'
	},<% } if(config.mysql) { %>
	mySql: {
		host: '<%= config.mysql.host %>',
		port: <%= config.mysql.host %>,
		user: '<%= config.mysql.host %>',
		password: <%= config.mysql.host %>'
	}, <% } if(config.mongo) { %>
	mongo: '<%= config.mongo.url %>' <% } %>
};
