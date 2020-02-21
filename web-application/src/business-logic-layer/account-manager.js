
const bcrypt = require('bcrypt') //TODO: move dependency?
const saltRounds = 10


module.exports = function ({ accountRepository, accountValidator }) {
	// Name all the dependencies in the curly brackets. 

	return {
		getAllAccounts: function (callback) {
			accountRepository.getAllAccounts(function (errors, accounts) {
				callback(errors, accounts)
			})
		},

		createAccount(account) {
			// Validate the account.
			console.log(account)
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

		getAccountByUsername: function (username, callback) {
			accountRepository.getAccountByUsername(username, callback)
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