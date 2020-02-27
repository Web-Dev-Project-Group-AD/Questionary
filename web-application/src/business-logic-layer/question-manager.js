
module.exports = function ({ questionValidator }) {
	// Name all the dependencies in the curly brackets. 

	return {

		getAllQuestions() {
			return new Promise((resolve, reject) => {
				accountRepository.getAllAccounts(
				).then(accounts => {
					resolve(accounts)
				}).catch(error => {
					reject(error)
				})
			})
		},

        getQuestionByAnsweredStatus() {
			return new Promise((resolve, reject) => {
				accountRepository.getAllAccounts(
				).then(accounts => {
					resolve(accounts)
				}).catch(error => {
					reject(error)
				})
			})
        },
        
        getAnswerById() {
			return new Promise((resolve, reject) => {
				accountRepository.getAllAccounts(
				).then(accounts => {
					resolve(accounts)
				}).catch(error => {
					reject(error)
				})
			})
		},