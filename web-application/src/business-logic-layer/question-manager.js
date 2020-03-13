
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
				}).then(questionId => {
					resolve(questionId)
				}).catch(errors => {
					reject(errors)
				})
			})
		},

		getAllCategories() {
			return new Promise((resolve, reject) => {
			QuestionRepository.getAllCategories(
				).then(categories => {
					resolve(categories)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getQuestionById(id) {
			var question = null
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionsByIds(id
				).then(fetchedQuestion => {
					if (!fetchedQuestion.isAnswered) {
						return resolve(fetchedQuestion)
					} else {
						question = fetchedQuestion
						return getAnswersByQuestionIds(id)
					}
				}).then(answers => {
					question.answers = answers
					resolve([question])
				}).catch(error => {
					reject(error)
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

		getAllQuestionsWithAnswers() {
			return new Promise((resolve, reject) => {
				var questions = []
				QuestionRepository.getQuestionsByAnswerStatus(true
				).then(fetchedQuestions => {
					questions = fetchedQuestions
					return QuestionRepository.getAllAnswers()
				}).then(fetchedAnswers => {
					const questionsAndAnswers = []
					
					for (question of questions) {
						const answers = []
						for (answer of fetchedAnswers) {
							if (question.id == answer.questionId) {
								answers.push(answer)
							}
						}
						question.answers = answers
						questionsAndAnswers.push(question)
					}
					resolve(questionsAndAnswers)
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

		getQuestionsByCategory(category, isAnswered) {
			return new Promise((resolve, reject) => {
				var questions = []
				QuestionRepository.getQuestionsByCategory(category, isAnswered
				).then(fetchedQuestions => {
					questions = fetchedQuestions
					if (!isAnswered) {
						return resolve(questions)
					} else {
						const questionIds = []
						for (question of questions) {
							questionIds.push(question.id)
						}
						return QuestionRepository.getAnswersByQuestionIds(questionIds)					
					}
				}).then(fetchedAnswers => {
					const questionsAndAnswers = []
					for (question of questions) {
						const answers = []
						for (answer of fetchedAnswers) {
							if (answer.questionId == question.id) {
								answers.push(answer)
							}
							question.answers = answers
						}
						questionsAndAnswers.push(question)
					}
					resolve(questionsAndAnswers)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getQuestionsByAnswerAuthor(author) {
			return new Promise((resolve, reject) => {
				var allAnswers = []
				QuestionRepository.getAnswersByAuthor(author
				).then(fetchedAnswers => {
					const questionIds = []
					for (answer of fetchedAnswers) {
						questionIds.push(answer.questionId)
					}
					allAnswers = fetchedAnswers
					return QuestionRepository.getQuestionsByIds(questionIds)
				}).then(questions => {
					const questionsAndAnswers = []
					for (question of questions) {
						const answers = []
						for (answer of allAnswers) {
							if (answer.questionId == question.id) {
								answers.push(answer)
							}
						}
						question.answers = answers
						questionsAndAnswers.push(question)
					}
					resolve(questionsAndAnswers)
				}).catch(error => {
					reject(error)
				})
			})
		},

		updateQuestion(questionUpdate) {
			return new Promise((resolve, reject) => {
				const validationErrors = QuestionValidator.getErrorsUpdateQuestion(questionUpdate)
				if (validationErrors.length > 0) {
					return reject(validationErrors)
				}
				QuestionRepository.updateQuestion(questionUpdate
				).then(returnId => {
					resolve(returnId)
				}).catch(errors => {
					reject(errors)
				})
			})
		},

        deleteQuestionById(author, id) {
			return new Promise((resolve, reject) => {
				QuestionRepository.deleteQuestionById(author, id
				).then(() => {
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},

		createAnswer(answer) {
			return new Promise((resolve, reject) => {
				const validationErrors = QuestionValidator.getErrorsNewAnswer(answer)
				if (validationErrors.length > 0) {
					return reject(validationErrors)
				}
				QuestionRepository.questionUpdateAnswerStatus(answer.questionId, true
				).then(() => {
					return QuestionRepository.createAnswer(answer)
				}).then(answerId => {
					resolve(answerId)
				}).catch(errors => {
					reject(errors)
				})
			})
		},

		updateAnswer(answerUpdate) {
			return new Promise((resolve, reject) => {
				const validationErrors = QuestionValidator.getErrorsUpdateAnswer(answerUpdate)
				if (validationErrors.length > 0) {
					return reject(validationErrors)
				}
				QuestionRepository.updateAnswer(answerUpdate
				).then(returnId => {
					resolve(returnId)
				}).catch(errors => {
					reject(errors)
				})
			})
		},

		deleteAnswerById(author, id) {
			return new Promise((resolve, reject) => {
				QuestionRepository.deleteAnswerById(author, id
				).then(() => {
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		}

	}
}