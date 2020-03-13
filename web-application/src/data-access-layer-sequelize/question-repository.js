
module.exports = ({ QuestionCategoryModel, QuestionModel, AnswerModel }) => {

    return {

        createQuestionCategory(category) {
            return new Promise((resolve, reject) => {
                QuestionCategoryModel.findOrCreate({
                    where: {
                        name: category
                    },
                    defaults: {
                        name: category
                    }
                }).then(result => {
                    resolve(result.id)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAllCategories() {
            return new Promise((resolve, reject) => {
                QuestionCategoryModel.findAll({
                    raw: true,
                }).then(categories => {
                    resolve(categories)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        createQuestion(question) {
            return new Promise((resolve, reject) => {
                QuestionModel.create({
                    author: question.author,
                    category: question.category,
                    title: question.title,
                    description: question.description,
                }).then(result => {
                    resolve(result.id)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getQuestionById(id) {
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    raw: true,
                    where: { id: id }
                }).then(question => {
                    resolve(question)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getQuestionsByAuthor(author) {
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    raw: true,
                    where: {
                        author: author
                    }
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
                    raw: true,
                    where: {
                        category: category,
                        isAnswered: isAnswered
                    }
                }).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getQuestionsByAnswerStatus(isAnswered) {           
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    raw: true,
                    where: {
                        isAnswered: isAnswered,
                    }
                }).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        updateQuestion(questionUpdate) {
            return new Promise((resolve, reject) => {
                QuestionModel.update({
                    title: questionUpdate.title,
                    description: questionUpdate.description
                }, {
                    where: {
                        author: questionUpdate.author,
                        id: questionUpdate.id 
                    }
                }).then(result => {
                    resolve(result.id)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        questionUpdateAnswerStatus(id, isAnswered) {
            return new Promise((resolve, reject) => {
                QuestionModel.update({
                    isAnswered: isAnswered
                }, {
                    where: { id: id }
                }).then(result => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        deleteQuestionById(author, id) {
            return new Promise((resolve, reject) => {
                QuestionModel.destroy({
                    where: { 
                        author: author,
                        id: id 
                    }
                }).then(() => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        createAnswer(answer) {
            return new Promise((resolve, reject) => {
                AnswerModel.create({
                    author: answer.author,
                    questionId: answer.questionId,
                    content: answer.content
                }).then(result => {
                    resolve(result.id)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAnswersByAnswerAuthor(author) {
            return new Promise((resolve, reject) => {
                AnswerModel.findAll({
                    raw: true,
                    where: { author: author },
                }).then(answers => {
                    resolve(answers)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAnswersByQuestionIds(ids) {
            return new Promise((resolve, reject) => {
                AnswerModel.findAll({
                    raw: true,
                    where: { questionId: ids }
                }).then(answers => {
                    resolve(answers)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAllAnswers() {
            return new Promise((resolve, reject) => {
                AnswerModel.findAll({
                    raw: true
                }).then(answers => {
                    resolve(answers)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        
        updateAnswer(answerUpdate) {
            return new Promise((resolve, reject) => {
                AnswerModel.update({
                    content: answerUpdate.content,
                }, {
                    where: {
                        author: answerUpdate.author,
                        id: answerUpdate.id 
                    }
                }).then(result => {
                    resolve(result.id)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        deleteAnswerById(author, id) {
            return new Promise((resolve, reject) => {
                AnswerModel.destroy({
                    where: { 
                        author: author,
                        id: id 
                    }
                }).then(() => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        }
        
    }

}
