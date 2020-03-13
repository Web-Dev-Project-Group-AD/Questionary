
const USERNAME_MIN_LENGTH = 4
const USERNAME_MAX_LENGTH = 20
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 20

function getErrorsPassword(password, passwordRepeated) {
	const errors = []

	if (!password) {
		errors.push("Password is missing.")
	} else if (!passwordRepeated) {
		errors.push("Repeated password is missing.")
	} else if (password != passwordRepeated) {
		errors.push("Passwords don't match.")
	} else if (password.length < PASSWORD_MIN_LENGTH) {
		errors.push("Password is too short.")
	} else if (PASSWORD_MAX_LENGTH < password.length) {
		errors.push("Password is too long.")
	}
	return errors
}

function getErrorsUsername(username) {
	const errors = []

	if (!username) {
		errors.push("Username is missing.")
	} else if (username.length < USERNAME_MIN_LENGTH) {
		errors.push("Username is too short.")
	} else if (USERNAME_MAX_LENGTH < username.length) {
		errors.push("Username is too long.")
	}
	return errors
}

function getErrorsEmail(email) {
	const errors = []

	if (!email) {
		errors.push("Email is missing.")
	} else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
		errors.push("Email is invalid.")
	}
	return errors
}

module.exports = () => {

	return {

		getErrorsNewAccount(account) {
			const errors = []

			errors.push.apply(errors, getErrorsUsername(account.username))
			errors.push.apply(errors, getErrorsEmail(account.email))
			errors.push.apply(errors, getErrorsPassword(account.password, account.passwordRepeated))

			return errors
		},

		getErrorsUpdatePassword(account) {
			const errors = []
			if (!account.oldPassword) {
				errors.push("Old password is missing.")
			}
			errors.push.apply(errors, getErrorsPassword(account.password, account.passwordRepeated))

			return errors
		}
	}
}