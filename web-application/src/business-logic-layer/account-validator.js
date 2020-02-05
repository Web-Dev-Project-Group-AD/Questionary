const MIN_USERNAME_LENGTH = 8
const MAX_USERNAME_LENGTH = 20
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 20

exports.getErrorsNewAccount = function (account) {

	const errors = []

	// Validate username.
	if (!account.hasOwnProperty("username")) {
		errors.push("usernameMissing")
	} else if (account.username.length < MIN_USERNAME_LENGTH) {
		errors.push("usernameTooShort")
	} else if (MAX_USERNAME_LENGTH < account.username.length) {
		errors.push("usernameTooLong")
	} else if (account.password != account.passwordRepeated) {
		errors.push("passwordsDontMatch")
	} else if (account.password.length < MIN_PASSWORD_LENGTH) {
		errors.push("passwordTooShort")
	} else if (MIN_PASSWORD_LENGTH < account.password.length) {
		errors.push("passwordTooLong")
	}
	return errors

}