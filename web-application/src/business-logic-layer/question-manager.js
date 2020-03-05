
module.exports = function ({ QuestionValidator, QuestionRepository }) {

	return {

		createQuestion(question) {
			return new Promise((resolve, reject) => {
				const validationErrors = QuestionValidator.getErrorsNewQuestion(question)
				if (validationErrors.length > 0) {
					return reject(validationErrors)
				}
				QuestionRepository.createQuestionCategory(question.category
				).then(() => {
					return QuestionRepository.createQuestion(question)
				}).then(createdquestion => {
					resolve(createdquestion)
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

		getAllQuestionsWithAnswers() {
			return new Promise((resolve, reject) => {
				var questions = []
				QuestionRepository.getQuestionsByAnswerStatus(true
				).then(fetchedQuestions => {
					questions = fetchedQuestions
					return QuestionRepository.getAllAnswers()
				}).then(answers => {
					const questionList = []
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

		getAnsweredQuestionsByCategory(category) {
			return new Promise((resolve, reject) => {
				var questions = []
				QuestionRepository.getQuestionsByCategory(category
				).then(fetchedQuestions => {
					const questionIds = []
					for (question of questions) {
						questionIds.push(question.id)
					}
					questions = fetchedQuestions
					return QuestionRepository.getAnswersByQuestionIds(questionIds)
				}).then(answers => {
					const questionsAndAnswers = []
					for (question of questions) {
						for (answer of answers) {
							if (answer.questionId == question.id) {
								questionsAndAnswers.push({ question, answer })
							}
						}
					}
					resolve(questionsAndAnswers)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getQuestionsByAnswerAuthor(author) {
			return new Promise((resolve, reject) => {
				var answers = []
				QuestionRepository.getAnswersByAuthor(author
				).then(fetchedAnswers => {
					const questionIds = []
					for (answer of fetchedAnswers) {
						questionIds.push(answer.questionId)
					}
					answers = fetchedAnswers
					return QuestionRepository.getAnswersByQuestionIds(questionIds)
				}).then(questions => {
					const questionsAndAnswers = []
					for (question of questions) {
						for (answer of answers) {
							if (answer.questionId == question.id) {
								questionsAndAnswers.push({ question, answer })
							}
						}
					}
					resolve(questionsAndAnswers)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getQuestionById(id) {
			var question = null
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionById(id
				).then(fetchedQuestion => {
					if (!question.isAnswered) {
						return resolve(fetchedQuestion)
					} else {
						question = fetchedQuestion
						return getAnswersByQuestionIds(id)
					}
				}).then(answer => {
					resolve({ question, answer })
				}).catch(error => {
					reject(error)
				})
			})
		}

	}
}