
module.exports = function ({ questionValidator, questionRepository }) {

	return {

		createQuestion(questionObject) {
			const errors = questionValidator.getErrorsNewQuestion(questionObject)

			if (errors.length > 0) {
				Promise.reject(errors)
			} else {
				return new Promise((resolve, reject) => {
					questionRepository.createAccount(questionObject
					).then(createdQuestionObject => {
						resolve(createdQuestionObject)
					}).catch(errors => {
						reject(errors)
					})
				})
			}

			const errors = questionValidator()
		},

		createAnswer(answerObject) {
			const errors = questionValidator.getErrorsNewAnswer(answerObject)

			if (errors.length > 0) {
				Promise.reject(errors)
			} else {
				return new Promise((resolve, reject) => {
					questionRepository.createAnswer(answerObject
					).then(createdAnswerObject => {
						resolve(createdAnswerObject)
					}).catch(errors => {
						reject(errors)
					})
				})
			}
		},

		getAllQuestions() {
			return new Promise((resolve, reject) => {
				questionRepository.getAllQuestions(
				).then(questionObject => {
					resolve(questionObject)
				}).catch(error => {
					reject(error)
				})
			})
		},

        getQuestionByAnsweredStatus() {
			return new Promise((resolve, reject) => {
				questionRepository.getQuestionByAnswerStatus(
				).then(questionObject => {
					resolve(questionObject)
				}).catch(error => {
					reject(error)
				})
			})
        },
        
        getAnswerById() {
			return new Promise((resolve, reject) => {
				questionRepository.getAnswerById(
				).then(answerObject => {
					resolve(answerObject)
				}).catch(error => {
					reject(error)
				})
			})
		}
		
	}

}