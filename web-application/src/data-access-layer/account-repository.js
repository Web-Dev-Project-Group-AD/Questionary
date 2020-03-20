
const ERROR_MSG_SIGN_UP_INPUT = "Incorrect email or password."
const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_USERNAME = "Username is already taken."
const ERROR_MSG_CREATE_UNIQUE_EMAIL = "Email is already taken."


module.exports =  ({ database }) => {

	return {
	
		createAccount(account) {

			const query = "INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)"
			const values = [account.username, account.email, account.password]

			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(result => {
					resolve(result.insertId)
				}).catch(errorList => {
					console.log(errorList)
					const errors = []
					//TODO: look for unique username violation
					reject(errors)
				})
			})

		},
		
		createThirdPartyAccount(account) {

			const query = "INSERT INTO IF NOT EXISTS accounts (username, email, password) VALUES (?, ?, ?)"
			const values = [account.username, account.email, "-"]

            return new Promise((resolve, reject) => {
                database.query(query, values
					).then(result => {
						resolve(result.insertId)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL) 
                })
            })   
		},
		
		getAccountByUsername(username) {

			const query = "SELECT * FROM accounts WHERE username = ? LIMIT 1"
			const values = [username]
			
			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(accounts => {
					resolve(accounts[0])
                }).catch(error => {
					console.log(error)
					reject(ERROR_MSG_DATABASE_GENERAL)
				})
			})
		},

		getAccountByEmail(email) {

			const query = "SELECT * FROM accounts WHERE email = ? LIMIT 1"
			const values = [email]
			
			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(accounts => {
						resolve(accounts[0])
                }).catch(error => {
					console.log(error)
					reject(ERROR_MSG_DATABASE_GENERAL)
				})
			})
		},

		getAllAccounts() {
			
			const query = "SELECT * FROM accounts ORDER BY username"
			const values = []

			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(accounts => {
					resolve(accounts)
                }).catch(error => {
					console.log(error)
					reject(ERROR_MSG_DATABASE_GENERAL)
				})
            })
		},

        updatePassword(id, password) {

			const query = "UPDATE accounts SET password = ? WHERE id = ?"
			const values = [password, id]

            return new Promise((resolve, reject) => {
				database.query(query, values
                ).then(() => {
					resolve()
                }).catch(error => {
					console.log(error)
					reject(ERROR_MSG_DATABASE_GENERAL)
				})
            })
        },

        deleteAccountById(id) {

			const query = "DELETE FROM accounts WHERE id = ?"
			const values = [id]

            return new Promise((resolve, reject) => {
                database.query(query, values
				).then(() => {
					resolve()
				}).catch(error => {
					console.log(error)
					reject(ERROR_MSG_DATABASE_GENERAL)
				})

            })
        }
    }
}