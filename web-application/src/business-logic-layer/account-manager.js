
const bcrypt = require('bcrypt') //TODO: move dependency?
const saltRounds = 10


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
					const validationErrors = AccountValidator.getErrorsNewAccount(account)
					if (validationErrors.length > 0) {
						throw validationErrors
					}
					bcrypt.hash(account.password, saltRounds
					).then(hash => {
						account.password = hash
						return AccountRepository.createAccount(account)
					}).then(createdAccount => {
						resolve(createdAccount)
					}).catch(validationErrors => {
						reject(validationErrors)
					}).catch(error => {
						reject(error)
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

			if (!account.username.length > 0 || !account.password.length > 0) {
				const errors = [new Error("error")]
				Promise.reject(errors)
			} else {
				return new Promise((resolve, reject) => {
					AccountRepository.getAccountByUsername(account.username
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
			const validationConstraints = AccountValidator.getValidationConstraints()
			return validationConstraints
		}

	}

}