
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
			})
		},

		getAllUnansweredQuestions() {
			return new Promise((resolve, reject) => {
				QuestionRepository.getAllUnansweredQuestions(
				).then(questions => {
					resolve(questions)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getAllAnsweredQuestions() {
			return new Promise((resolve, reject) => {
				QuestionRepository.getAllAnsweredQuestions(
				).then(questions => {
					resolve(questions)
				}).catch(error => {
				reject(error)
				})
			})
		},
				/*
				).then(fetchedQuestions => {

					questions = fetchedQuestions
					return QuestionRepository.getAllAnswers()
				}).then(answers => {
					const questionList = [{ question, answer }]
					for (question of questions) {
						const answerList = []
						for (answer of answers) {
							if (question.id == answer.questionId) {
								answerList.push(answer)
							}
						}
						questionList.push({ question, answerList })
					}
					resolve(questionList)
				}).catch(error => {
					reject(error)
				})
			})
		},
*/
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

		getQuestionsByAuthor(author) {
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionsByAuthor(author
				).then(questions => {
					resolve(questions)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getQuestionsByAnswerAuthor(author) {
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionsByAnswerAuthor(author
				).then(questions => {
					resolve(questions)
				}).catch(error => {
					reject(error)
				})
			})
		},

/*
				var answerList = []
				QuestionRepository.getAnswersByAuthor(author
				).then(answers => {
					const questionIds = []
					for (answer of answers) {
						questionIds.push(answer.questionId)
					}
					answerList = answers
					return QuestionRepository.getQuestionsByIdList(questionIds)
				}).then(questions => {
					const answeredQuestions = []
					for (question of questions) {
						for (answer of answerList) {
							if (answer.questionId == question.id) {
								answeredQuestions.push({ question, answer })
							}
						}
					}
					resolve(answeredQuestions)
				}).catch(error => {
					reject(error)
				})
			})

		},
		*/

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

		}

	}

}
