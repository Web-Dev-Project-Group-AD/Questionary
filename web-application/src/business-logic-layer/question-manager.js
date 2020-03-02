
module.exports = function ({ QuestionValidator, QuestionRepository }) {

	return {

		createQuestion(questionObject) {


			return new Promise((resolve, reject) => {

				const validationErrors = QuestionValidator.getErrorsNewQuestion(questionObject)
				if (validationErrors.length > 0) {
					throw validationErrors
				}
				QuestionRepository.createQuestion(questionObject
				).then(createdQuestionObject => {
					resolve(createdQuestionObject)
				}).catch(validationErrors => {
					reject(validationErrors)
				}).catch(error => {
					reject(error)
				})
			})
		},

		createAnswer(answerObject) {
			return new Promise((resolve, reject) => {
				const validationErrors = QuestionValidator.getErrorsNewAnswer(answerObject)
				if (validationErrors.length > 0) {
					throw validationErrors
				}
				QuestionRepository.createAnswer(answerObject
				).then(createdAnswerObject => {
					resolve(createdAnswerObject)
				}).catch(validationErrors => {
					reject(validationErrors)
				}).catch(error => {
					reject(error)
				})
			})

		},

		getQuestionsByAnswerStatus(isAnswered) {
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionsByAnswerStatus(isAnswered
				).then(questions => {
					resolve(questions)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getQuestionsByCategory(category, isAnswered) {
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionsByCategory(category, isAnswered
				).then(questions => {
					resolve(questions)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getAnswersByIdType(idType, id) {
			return new Promise((resolve, reject) => {
				QuestionRepository.getAnswersByIdType(idType, id
				).then(answers => {
					resolve(answers)
				}).catch(error => {
					reject(error)
				})
			})
		}

	}

}
