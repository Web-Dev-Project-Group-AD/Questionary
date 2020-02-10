const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('./account-validator')

const bcrypt = require('bcrypt') //TODO: move dependency?
const saltRounds = 10

exports.getAllAccounts = function (callback) {
	accountRepository.getAllAccounts(callback)
}

exports.createAccount = function (account, callback) {

	const pw = '$2b$10$7hj/ahyohgdp8RZJ41Xk4uRSrlrFgWf5YG4GeXLWqKReCkefPfolG'
	console.log(pw.length)


	// Validate the account.
	const errors = accountValidator.getErrorsNewAccount(account)

	if (errors.length > 0) {
		console.log("accountValidator error not null")
		callback(errors, null)
	} else {
		console.log("password:", account.password)
		bcrypt.genSalt(saltRounds, function (error, salt) {
			if (error) {
				console.log(error)
			} else {
				bcrypt.hash(account.password, salt, function (error, hash) {
					// if (error) {
					// 	console.log(error)
					// 	callback(error, null)

					account.password = hash
					console.log(hash)
					accountRepository.createAccount(account, callback)

				})
			}
		})

	}
}

exports.getAccountByUsername = function (username, callback) {
	accountRepository.getAccountByUsername(username, callback)
}

exports.signInAccount = function (account, callback) {
	accountRepository.getAccountByUsername(account.username, function (error, repositoryAccount) {
		if (error = ! null) {
			console.log("signInAccount error not null")
			// TODO: handle error
			// TODO: Look for usernameUnique violation.
			callback(error, null)
		} else {
			bcrypt.compare(account.password, repositoryAccount.password, function (error, isValidPassword) {
				if (error = ! null) {
					console.log("bcrypt.compare error not null")
					callback(error)
				} else if (!isValidPassword) {
					console.log("error wrong password")
					error = new Error("wrongPassword")
					callback(error)
				}
			});
		}
	})
}

exports.signOutUser = function () {
	// TODO
}