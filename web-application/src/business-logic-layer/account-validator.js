
const USERNAME_MIN_LENGTH = 4
const USERNAME_MAX_LENGTH = 20
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 20


module.exports = () => {

	return {

		getErrorsNewAccount(account) {
			const errors = []

			if (!account.hasOwnProperty("username")) {
				errors.push("Username is missing.")
			} else if (account.username.length < USERNAME_MIN_LENGTH) {
				errors.push("Username is too short.")
			} else if (USERNAME_MAX_LENGTH < account.username.length) {
				errors.push("Username is too long.")
			}

			if (!account.hasOwnProperty("email")) {
				errors.push("Email is missing.")
			} else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(account.email))) {
				errors.push("Email is invalid.")
			}

			if (!account.hasOwnProperty("password")) {
				errors.push("Password is missing.")
			} else if (!account.hasOwnProperty("passwordRepeated")) {
				errors.push("Repeated password is missing.")
			} else if (account.password != account.passwordRepeated) {
				errors.push("Passwords don't match.")
			} else if (account.password.length < PASSWORD_MIN_LENGTH) {
				errors.push("Password is too short.")
			} else if (PASSWORD_MAX_LENGTH < account.password.length) {
				errors.push("Password is too long.")
			}

			return errors
		},

		getValidationConstraints() {

			const validationConstraints = {
				USERNAME_MIN_LENGTH: USERNAME_MIN_LENGTH,
				USERNAME_MAX_LENGTH: USERNAME_MAX_LENGTH,
				PASSWORD_MIN_LENGTH: PASSWORD_MIN_LENGTH,
				PASSWORD_MAX_LENGTH: PASSWORD_MAX_LENGTH
			}

			return validationConstraints
		}

	}

}