


module.exports = ({ QuestionValidator, QuestionRepository }) => {

	var self = {

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
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionsByIds(id
				).then(question => {
					resolve(question)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getQuestionAnswered(questionId) {
			var question = null
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionsByIds(questionId
				).then(fetchedQuestion => {
					if (!fetchedQuestion.isAnswered) {
						return resolve(fetchedQuestion)
					} else {
						question = fetchedQuestion
						return QuestionRepository.getAnswersByQuestionIds(questionId)
					}
				}).then(answers => {
					question.answers = answers
					resolve([question])
				}).catch(error => {
					reject(error)
				})
			})
		},

		getQuestionWithSingleAnswer(questionId, answerId) {
			var question = null
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionById(questionId
				).then(fetchedQuestion => {
					question = fetchedQuestion
					return QuestionRepository.getAnswerById(answerId)
				}).then(answer => {
					question.answer = answer
					resolve(question)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getAll() {
			return new Promise((resolve, reject) => {
				var questions = []
				self.getAllAnswered(
				).then(fetchedQuestions => {
					questions = fetchedQuestions
					return self.getAllUnanswered()
				}).then(fetchedQuestions => {
					questions.push.apply(questions, fetchedQuestions)
					resolve(questions)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getAllUnanswered() {
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionsByAnswerStatus(false
				).then(questions => {
					resolve(questions)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getAllAnswered() {
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

		getAnsweredByCategory(category) {
			return new Promise((resolve, reject) => {
				var questions = []
				QuestionRepository.getQuestionsByCategory(category, isAnswered = true
				).then(fetchedQuestions => {
					questions = fetchedQuestions
					const questionIds = []
					for (question of questions) {
						questionIds.push(question.id)
					}
					return QuestionRepository.getAnswersByQuestionIds(questionIds)					
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

		getUnansweredByCategory(category) {
			return new Promise((resolve, reject) => {
				QuestionRepository.getQuestionsByCategory(category, isAnswered = false
				).then(fetchedQuestions => {
					resolve(fetchedQuestions)
				}).catch(error => {
					reject(error)
				})
			})
		},

		getAllByCategory(category) {
			var questions = []
			return new Promise((resolve, reject) => {
				self.getAnsweredByCategory(category
				).then(fetchedQuestions => {
					questions = fetchedQuestions
					return self.getUnansweredByCategory(category)
				}).then(fetchedQuestions => {
					questions.push.apply(questions, fetchedQuestions)
					resolve(questions)
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

		removeAuthor(author) {
			return new Promise((resolve, reject) => {
				QuestionRepository.updateAnswerAuthor(author, "Deleted user"
				).then(() => {
					return QuestionRepository.updateQuestionAuthor(author, "Deleted user")
				}).then(() => {
					resolve()
				}).catch(error => {
					reject(error)
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

	return self
}