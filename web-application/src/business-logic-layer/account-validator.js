const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 10

exports.getErrorsNewAccount = function(account){
	
	const errors = []
	
	// Validate username.
	if(!account.hasOwnProperty("username")){
		errors.push("usernameMissing")
	}else if(account.username.length < MIN_USERNAME_LENGTH){
		errors.push("usernameTooShort")
	}else if(MAX_USERNAME_LENGTH < account.username.length){
		errors.push("usernameTooLong")
	}
	
	return errors
	
}