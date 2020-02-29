
const bcrypt = require('bcrypt') //TODO: move dependency?
const saltRounds = 10


module.exports = function ({ accountRepository, accountValidator }) {
	// Name all the dependencies in the curly brackets. 

	return {
		getAllAccounts() {
			return new Promise((resolve, reject) => {
				accountRepository.getAllAccounts(
				).then(accounts => {
					resolve(accounts)
				}).catch(error => {
					reject(error)
				})
			})
		},

		createAccount(account) {
			// Validate the account.
			const errors = accountValidator.getErrorsNewAccount(account)

			if (errors.length > 0) {
				Promise.reject(errors)
			} else {
				return new Promise((resolve, reject) => {
					bcrypt.hash(account.password, saltRounds
					).then(hash => {
						account.password = hash
						return accountRepository.createAccount(account)
					}).then(createdAccount => {
						resolve(createdAccount)
					}).catch(errors => {
						reject(errors)
					})
				})
			}
		},

		getAccountByUsername(username) {
			return new Promise((resolve, reject) => {
				accountRepository.getAccountByUsername(username
				).then(account => {
					resolve(account)
				}).catch(error => {
					reject(error)
				})
			})
		},

		signInAccount(account) {


			if (!account.username.length > 0 || !account.password.length > 0) {
				const errors = [new Error("error")]
				Promise.reject(errors)
			} else {
				return new Promise((resolve, reject) => {
					accountRepository.getAccountByUsername(account.username
					).then(returnedAccount => bcrypt.compare(account.password, returnedAccount.password
					)).then(isValidPassword => {
						console.log("bcrypt compare")
						if (!isValidPassword) {
							error = new Error("invalid password")
							reject(error)
						} else {
							resolve(returnedAccount)
						}
					}).catch(error => {
						console.log("signInAccount error catch")
						const errors = [error]
						reject(errors)
					})
				})
			}
		},

		getValidationConstraints: () => {
			const validationConstraints = accountValidator.getValidationConstraints()
			return validationConstraints
		}
	}
}