
const bcrypt = require('bcrypt') //TODO: move dependency?
const saltRounds = 10

const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_SIGN_UP_INPUT = "Incorrect email or password."


module.exports = ({ AccountRepository, AccountValidator }) => {

	return {
		
		createAccount(account) {
			return new Promise((resolve, reject) => {
				const errors = AccountValidator.getErrorsNewAccount(account)
				if (errors.length > 0) {
					throw errors
				}
				bcrypt.hash(account.password, saltRounds
				).then(hashedPassword => {
					account.password = hashedPassword
					return AccountRepository.createAccount(account)
				}).then(createdAccount => {
					resolve(createdAccount)
				}).catch(errors => {
					reject(errors)
				})
			})
		},

		getAccountByUsername(username) {
			return new Promise((resolve, reject) => {
				AccountRepository.getAccountByUsername(username
				).then(account => {
					resolve(account)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getAllAccounts() {
			return new Promise((resolve, reject) => {
				AccountRepository.getAllAccounts(
				).then(accounts => {
					resolve(accounts)
				}).catch(error => {
					reject(error)
				})
			})
		},

		signInAccount(account) {
			return new Promise((resolve, reject) => {
				var resultAccount = {}
				if (!account.email || !account.password) {
					throw ERROR_MSG_SIGN_UP_INPUT
				}
				AccountRepository.getAccountByEmail(account.email
				).then(returnedAccount => {
					if (!returnedAccount) {
						throw ERROR_MSG_SIGN_UP_INPUT
					} else {
						resultAccount = returnedAccount
						return bcrypt.compare(account.password, returnedAccount.password)
					}
				}).then(isValidPassword => {
					if (!isValidPassword) {
						throw ERROR_MSG_SIGN_UP_INPUT
					} else {
						resolve(resultAccount)
					}
				}).catch(error => {
					reject(error)
				})
			})
		},

		updatePassword(account) {
			return new Promise((resolve, reject) => {
				const errors = AccountValidator.getErrorsUpdatePassword(account)
				if (errors.length > 0) {
					throw errors
				}
				AccountRepository.getAccountByUsername(account.username
				).then(returnedAccount => {
					return bcrypt.compare(account.oldPassword, returnedAccount.password)
				}).then(isValidPassword => {
					if (!isValidPassword) {
						throw "Incorrect password."
					} else {
						return bcrypt.hash(account.password, saltRounds)
					}
				}).then(hashedPassword => {
					return AccountRepository.updatePassword(account.id, hashedPassword)
				}).then(returnedId => {
					resolve(returnedId)
				}).catch(error => {
					reject(error)
				})
			})
		},


		deleteAccountById(id) {
			
		}
	}

}