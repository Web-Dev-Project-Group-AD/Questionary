
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

		createAccount: function (account, callback) {
			// Validate the account.
			const errors = accountValidator.getErrorsNewAccount(account)

			if (errors.length > 0) {
				callback(errors)
			} else {
				bcrypt.hash(account.password, saltRounds, function (error, hash) {
					// if (error) {
					// 	console.log(error)
					// 	callback(error, null)

					account.password = hash
					accountRepository.createAccount(account, callback)
					callback([])
				})
			}
		},


		getAccountByUsername: function (username, callback) {
			accountRepository.getAccountByUsername(username, callback)
		},

		// Continue to list all other functions in account manager here.

		signInAccount: function (account, callback) {
			accountRepository.getAccountByUsername(account.username, function (error, repositoryAccount) {
				if (error.length > 0) {
					// TODO: handle error
					// TODO: Look for usernameUnique violation.
					callback(error)
				} else {
					bcrypt.compare(account.password, repositoryAccount.password, function (error, isValidPassword) {
						if (error != null) {
							callback(error)
						} else if (!isValidPassword) {
							error = new Error("wrongPassword")
							callback(error)
						} else {
							callback(null)
						}
					})
				}
			})
		},

		getValidationConstraints: function () {
			const validationConstraints = accountValidator.getValidationConstraints()
			return validationConstraints
		}
	}
}