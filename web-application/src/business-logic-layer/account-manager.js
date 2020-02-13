const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('./account-validator')

const bcrypt = require('bcrypt') //TODO: move dependency?
const saltRounds = 10

exports.getAllAccounts = function (callback) {
	accountRepository.getAllAccounts(callback)
}

exports.createAccount = function (account, callback) {

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
}

exports.getAccountByUsername = function (username, callback) {
	accountRepository.getAccountByUsername(username, callback)
}

exports.signInAccount = function (account, callback) {
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
			});
		}
	})
}

exports.getValidationConstraints = function () {
	const validationConstraints = accountValidator.getValidationConstraints()
	return validationConstraints
}