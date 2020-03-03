//const db = require('./db')



module.exports =  ({ database }) => {

	return {

		/*
			  Retrieves all accounts ordered by username.
			  Possible errors: databaseError
			  Success value: The fetched accounts in an array.
		*/
		getAllAccounts() {
			
			const query = "SELECT * FROM accounts ORDER BY username"
			const values = []

			return new Promise((resolve, reject) => {
				database.query(query, values
					).then(accounts => {
						resolve(accounts)
                }).catch(error => {
					reject(error)
				})
            })

		},

		/*
			Retrieves the account with the given username.
			Possible errors: databaseError
			Success value: The fetched account, or null if no account has that username.
		*/
		getAccountByUsername(username) {


			const query = "SELECT * FROM accounts WHERE username = ? LIMIT 1"
			const values = [username]
			
			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(accounts => {
					if (accounts.length > 0) {
						console.log("Matching accounts: ", accounts)
						resolve(accounts[0])
					} else {
						console.log("error!")
						throw new Error("account does not exist")
					} 
                }).catch(error => {
					console.log(error)
					reject(error)
				})
			})

		},

		/*
			Creates a new account.
			account: {username: "The username", password: "The password"}
			Possible errors: databaseError, usernameTaken
			Success value: The id of the new account.
		*/
		createAccount(account) {

			const query = "INSERT INTO accounts (username, password) VALUES (?, ?)"
			const values = [account.username, account.password]

			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(results => {
					resolve(results.insertId)
				}).catch(error => {
					//TODO: look for unique username violation
					reject(error)
				})
			})

		}
		
	}
}