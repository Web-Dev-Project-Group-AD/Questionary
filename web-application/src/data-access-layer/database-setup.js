const mysql = require('mysql')

const MYSQL_HOST = "192.168.99.101"
const MYSQL_USER = 'root'
const MYSQL_ROOT_PASSWORD = 'password'
const MYSQL_DATABASE = 'database'
const MYSQL_PORT = '3306'

/*
		connection: mysql.createConnection({
			host: 'database',
			user: 'root',
			password: 'theRootPassword',
			database: 'webAppDatabase'
		})
*/

class Database {

	constructor() {
		this.connection = mysql.createConnection({
			host: MYSQL_HOST, 
			user: MYSQL_USER,
			password: MYSQL_ROOT_PASSWORD,
			database: MYSQL_DATABASE,
			port: MYSQL_PORT
		})
	}
	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (error, rows) => {
				if (error) {
					return reject(error)
				} else {
					resolve(rows)
				}
			})
		})
	}
	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(error => {
				if (error) {
					return reject(error)
				} else {
					resolve()
				}
			})
		})
	}

}

module.exports = Database 