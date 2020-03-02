
module.exports = function ({ QuestionValidator, QuestionRepository }) {

	return {

		createQuestion(questionObject) {
			return new Promise((resolve, reject) => {
				const validationErrors = QuestionValidator.getErrorsNewQuestion(questionObject)
				if (validationErrors.length > 0) {
					return reject(validationErrors)
				}
				QuestionRepository.createQuestionCategory(questionObject.category
				).then(() => {
					return QuestionRepository.createQuestion(questionObject)
				}).then(createdQuestionObject => {
					resolve(createdQuestionObject)
				}).catch(errors => {
					reject(errors)
				})


				// QuestionRepository.createQuestionCategory(questionObject.category
				// ).then(QuestionRepository.createQuestion(questionObject
				// ).then(createdQuestionObject => {
				// 	resolve(createdQuestionObject)
				// }).catch(validationErrors => {
				// 	reject(validationErrors)
				// }).catch(error => {
				// 	reject(error)
				// }))
			})
		},

		createAnswer(answerObject) {
			return new Promise((resolve, reject) => {
				const validationErrors = QuestionValidator.getErrorsNewAnswer(answerObject)
				if (validationErrors.length > 0) {
					return reject(validationErrors)
				}
				QuestionRepository.createAnswer(answerObject
				).then(createdAnswerObject => {
					resolve(createdAnswerObject)
				}).catch(errors => {
					reject(errors)
				})
			})

		},

		getAllUnansweredQuestions() {
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionsByAnswerStatus(false
				).then(questions => {
					resolve(questions)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getAllAnsweredQuestions() {
			return new Promise((resolve, reject) => {
				var questions = []
				QuestionRepository.getQuestionsByAnswerStatus(false
				).then(fetchedQuestions => {
					questions = fetchedQuestions
					return QuestionRepository.getAllAnswers() 
				}).then(answers => {
					const questionList = [{question, answer}]
					for (question of questions) {
						const answerList = []
						for (answer of answers) {
							if (question.id == answer.questionId) {
								answerList.push(answer)
							}
						}
						questionList.push({question, answerList})
					}
					resolve(questionList)
				}).catch(error => {
					reject(error)
				})
			}
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
		},

		

	}

}
