module.exports = {
	authKey: '<%= authKey %>',<% if(config.postgre) { %>
	postgreSql: {
		host: '<%= config.postgre.host %>',
		port: <%= config.postgre.port || 5432 %>,
		username: '<%= config.postgre.user %>',
		password: '<%= config.postgre.password %>',
		database: '<%= config.postgre.database %>'
	},<% } if(config.mysql) { %>
	mySql: {
		host: '<%= config.mysql.host %>',
		port: <%= config.mysql.port || 3306 %>,
		user: '<%= config.mysql.user %>',
		password: '<%= config.mysql.password %>'
	}, <% } if(config.mongo) { %>
	mongo: '<%= config.mongo.url %>' <% } %>
};
