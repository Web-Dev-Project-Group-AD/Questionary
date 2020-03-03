
const bcrypt = require('bcrypt') //TODO: move dependency?
const saltRounds = 10

const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_SIGN_UP_INPUT = "Incorrect email or password."


module.exports = ({ AccountRepository, AccountValidator }) => {

	return {
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

		createAccount(account) {
			return new Promise((resolve, reject) => {
				const errors = AccountValidator.getErrorsNewAccount(account)
				if (errors.length > 0) {
					throw errors
				}
				bcrypt.hash(account.password, saltRounds
				).then(hash => {
					account.password = hash
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

		signInAccount(account) {
			return new Promise((resolve, reject) => {
				if (!account.username || !account.password) {
					throw ERROR_MSG_SIGN_UP_INPUT
				}
				AccountRepository.getAccountByEmail(account.email
				).then(returnedAccount => {
					if (!returnedAccount) {
						throw ERROR_MSG_SIGN_UP_INPUT
					} else {
						return bcrypt.compare(account.password, returnedAccount.password)
					}
				}).then(isValidPassword => {
					if (!isValidPassword) {
						throw ERROR_MSG_SIGN_UP_INPUT
					} else {
						resolve(returnedAccount)
					}
				}).catch(error => {
					reject(error)
				})
			})
		},

		getValidationConstraints: () => {
			const validationConstraints = AccountValidator.getValidationConstraints()
			return validationConstraints
		}

	}

}