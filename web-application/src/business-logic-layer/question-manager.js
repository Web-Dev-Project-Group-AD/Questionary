
module.exports = function ({ QuestionValidator, QuestionRepository }) {

	return {

		createQuestion(questionObject) {
			const errors = QuestionValidator.getErrorsNewQuestion(questionObject)

			if (errors.length > 0) {
				Promise.reject(errors)
			} else {
				return new Promise((resolve, reject) => {
					QuestionRepository.createQuestion(questionObject
					).then(createdQuestionObject => {
						resolve(createdQuestionObject)
					}).catch(errors => {
						reject(errors)
					})
				})
			}
		},

		createAnswer(answerObject) {
			const errors = QuestionValidator.getErrorsNewAnswer(answerObject)

			if (errors.length > 0) {
				Promise.reject(errors)
			} else {
				return new Promise((resolve, reject) => {
					QuestionRepository.createAnswer(answerObject
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
