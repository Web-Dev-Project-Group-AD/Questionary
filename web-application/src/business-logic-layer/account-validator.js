
const USERNAME_MIN_LENGTH = 4
const USERNAME_MAX_LENGTH = 20
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 20


module.exports = () => {

	return {

		getErrorsNewAccount(account) {
			const errors = []

			if (!account.hasOwnProperty("username")) {
				errors.push("usernameMissing")
			} else if (account.username.length < USERNAME_MIN_LENGTH) {
				errors.push("usernameTooShort")
			} else if (USERNAME_MAX_LENGTH < account.username.length) {
				errors.push("usernameTooLong")
			}

			if (!account.hasOwnProperty("email")) {
				errors.push("emailMissing")
			} else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(account.email))) {
				errors.push("emailInvalid")
			}

			if (!account.hasOwnProperty("password")) {
				errors.push("passwordMissing")
			} else if (!account.hasOwnProperty("passwordRepeated")) {
				errors.push("repeatPasswordMissing")
			} else if (account.password != account.passwordRepeated) {
				errors.push("passwordsDontMatch")
			} else if (account.password.length < PASSWORD_MIN_LENGTH) {
				errors.push("passwordTooShort")
			} else if (PASSWORD_MAX_LENGTH < account.password.length) {
				errors.push("passwordTooLong")
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