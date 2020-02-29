
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

        getQuestionsByAnswerStatus(isAnswered) {
			return new Promise((resolve, reject) => {
				questionRepository.getQuestionsByAnswerStatus(isAnswered
				).then(questions => {
					resolve(questions)
				}).catch(error => {
					reject(error)
				})
			})
		},
		
		getQuestionsByCategory(category, isAnswered) {
			return new Promise((resolve, reject) => {
				questionRepository.getQuestionsByCategory(category, isAnswered
				).then(questions => {
					resolve(questions)
				}).catch(error => {
					reject(error)
				})
			})
		},

        getAnswersByIdType(idType, id) {
			return new Promise((resolve, reject) => {
				questionRepository.getAnswersByIdType(idType, id
				).then(answers => {
					resolve(answers)
				}).catch(error => {
					reject(error)
				})
			})
		}
		
	}

}
