const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('./account-validator')


exports.getAllAccounts = function (callback) {
	accountRepository.getAllAccounts(callback)
}

exports.createAccount = function (account, callback) {

	// Validate the account.
	const errors = accountValidator.getErrorsNewAccount(account)

	if (0 < errors.length) {
		callback(errors, null)
		return
	}

	accountRepository.createAccount(account, callback)

}

exports.getAccountByUsername = function (username, callback) {
	accountRepository.getAccountByUsername(username, callback)

}

exports.attemptAccountSignIn = function (inputAccount, callback) {
	console.log(inputAccount)
	accountRepository.getAccountByUsername(inputAccount.username, function (error, databaseAccount) {
		console.log(databaseAccount)
		console.log(error)
		if (error) {
			// TODO: handle error
			// TODO: Look for usernameUnique violation.
			callback(error, null)
		} else {
			console.log("hej")
			return accountValidator.checkMatchingPasswords(databaseAccount.password, inputAccount.password)
		}
	})
}

exports.signOutUser = function () {
	// TODO
}