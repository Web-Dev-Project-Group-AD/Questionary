//const db = require('./db')



module.exports = function ({ database }) {

	return {

		/*
			  Retrieves all accounts ordered by username.
			  Possible errors: databaseError
			  Success value: The fetched accounts in an array.
		*/
		getAllAccounts() {

			
			const query = `SELECT * FROM accounts ORDER BY username`
			const values = []

			return new Promise((resolve, reject) => {
				database.query(query, values
					).then(accounts => {
						resolve(accounts)
                }).catch(error => {
					reject(error)
				})
            })

			/* Old function

			database.connection.query(query, values, function (error, accounts) {
				if (error) {
					callback(['databaseError'], null)
				} else {
					callback([], accounts)
				}
			})
			*/

		},

		/*
			Retrieves the account with the given username.
			Possible errors: databaseError
			Success value: The fetched account, or null if no account has that username.
		*/
		getAccountByUsername(username) {


			const query = `SELECT * FROM accounts WHERE username = ? LIMIT 1`
			const values = [username]
			
			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(accounts => {
						resolve(accounts[0])
                }).catch(error => {
					reject(error)
				})
			})
			

			/* Old function

			database.connection.query(query, values, function (error, accounts) {
				if (error) {
					callback(['databaseError'], null)
				} else {
					callback([], accounts[0])
				}
			})
			*/

		},

		/*
			Creates a new account.
			account: {username: "The username", password: "The password"}
			Possible errors: databaseError, usernameTaken
			Success value: The id of the new account.
		*/
		createAccount(account) {

			const query = `INSERT INTO accounts (username, password) VALUES (?, ?)`
			const values = [account.username, account.password]
			console.log("whatup")
			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(results => {
					console.log("success")
					resolve(results.insertId)
				}).catch(error => {
					console.log("oh no")

					reject("error")
				})
			})
			
			/* Old function

			database.connection.query(query, values, function (error, results) {
				if (error != null) {
					// Look for usernameUnique violation.
					callback(['databaseError'], null)
				} else {
					callback([], results.insertId)
				}
			})
			*/
		}
		
	}
}