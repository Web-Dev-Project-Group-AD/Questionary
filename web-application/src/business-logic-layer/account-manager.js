
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

			if (0 < errors.length) {
				callback(errors, null)
				return
			}

			accountRepository.createAccount(account, callback)

		},

		getAccountByUsername: function (username, callback) {
			accountRepository.getAccountByUsername(username, callback)
		}
	}
	// Continue to list all other functions in account manager here.
}