
module.exports = ({ QuestionCategoryModel, QuestionModel, AnswerModel }) => {

    return {

        createQuestion(questionObject) {
			return new Promise((resolve, reject) => {
                QuestionModel.create({
                    author: questionObject.author,
                    category: questionObject.category,
                    question: questionObject.question,
                    description: questionObject.description,
                }).then(results => {
					resolve(results.insertId)
				}).catch(error => {
					reject(error)
				})
			})
        },

        createAnswer(answerObject) {
			return new Promise((resolve, reject) => {
                AnswerModel.create({
                    author: answerObject.username,
                    questionId: answerObject.questionId,
                    answer: answerObject.answer
                }).then(results => {
					resolve(results.insertId)
				}).catch(error => {
					reject(error)
				})
			})
        },

        createQuestionCategory(category) {
            return new Promise((resolve, reject) => {
                QuestionCategoryModel.create({
                    name: category
                }).then(results => {
					resolve(results.insertId)
				}).catch(error => {
					reject(error)
				})
			})
        },

        getQuestionsByAnswerStatus(isAnswered) {           
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    where: { isAnswered: isAnswered }
                }).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getQuestionsByCategory(category, isAnswered) {
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    where: { category: category,
                            isAnswered: isAnswered }
                }).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAnswersByIdType(idType, id) {
            return new Promise((resolve, reject) => {
                AnswerModel.findAll({
                    where: { idType: id }
                }).then(answers => {
                    resolve(answers)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAllAnswers() {
            return new Promise((resolve, reject) => {
                AnswerModel.findAll(      
                ).then(answers => {
                    resolve(answers)
                }).catch(error => {
                    reject(error)
                })
            })

        }

    }

}
