
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
					}).catch(errors => {
						for (error of errors) {
							switch (error) {
								case "databaseError":
									return reject([error])
								case "usernameTaken":
									validationErrors.push("The username is taken.")
									break
								case "emailTaken":
									validationErrors.push("The email is already in use.")
									break
								default: 
									validationErrors.push(error)
									break
							}
						}
						reject(validationErrors)
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

			if (!account.username || !account.password) {
				throw ["Incorrect username or password."]
			} else {
				return new Promise((resolve, reject) => {
					AccountRepository.getAccountByUsername(account.username
					).then(returnedAccount => bcrypt.compare(account.password, returnedAccount.password
					)).then(isValidPassword => {
						if (!isValidPassword) {
							reject(error)
						} else {
							resolve(returnedAccount)
						}
					}).catch(errors => {
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