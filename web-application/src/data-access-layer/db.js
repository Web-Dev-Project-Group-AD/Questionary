const mysql = require('mysql')

module.exports = function ({ }) {

	return {

		connection: mysql.createConnection({
			host: 'database',
			user: 'root',
			password: 'theRootPassword',
			database: 'webAppDatabase'
		})
	}

}