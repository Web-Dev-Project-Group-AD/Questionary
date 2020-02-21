
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
			console.log("signInAccount", account)

			return new Promise((resolve, reject) => {
				accountRepository.getAccountByUsername(account.username
				).then(returnedAccount => {
					bcrypt.compare(account.password, returnedAccount.password
					).then(isValidPassword => {
						if (!isValidPassword) {
							error = new Error("Wrong password.")
						} else {
							resolve(returnedAccount)
						}
					}).catch(error => {
						const errors = [error]
						reject(errors)
					})
				})
			})
		},

		getValidationConstraints: function () {
			const validationConstraints = accountValidator.getValidationConstraints()
			return validationConstraints
		}
	}
}