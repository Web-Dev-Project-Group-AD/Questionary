
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
                    console.log(result.lastid)
                    resolve(result.lastid)
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
                    resolve(result.lastid)
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

        createAnswer(answer) {
            return new Promise((resolve, reject) => {
                AnswerModel.create({
                    author: answer.username,
                    questionId: answer.questionId,
                    answer: answer.content
                }).then(result => {
                    resolve(result.lastid)
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

        getQuestionById(id) {
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    raw: true,
                    where: { id: id }
                }).then(questions => {
                    resolve(questions[0])
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAnswersByQuestionIds(questionIds) {
            return new Promise((resolve, reject) => {
                AnswerModel.findAll({
                    raw: true,
                    where: { questionId: questionIds }
                }).then(answers => {
                    resolve(answers)
                }).catch(error => {
                    reject(error)
                })
            })
        }

        

    }

}
