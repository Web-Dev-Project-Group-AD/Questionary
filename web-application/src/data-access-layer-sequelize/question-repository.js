const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_QUESTION = "Question already exists."
const SEQUELIZE_ERROR_UNIQUE_QUESTION = "title must be unique"



module.exports = ({ QuestionCategoryModel, QuestionModel, AnswerModel }) => {

    return {

        createQuestionCategory(category) {
            return new Promise((resolve, reject) => {
                QuestionCategoryModel.findOrCreate({
                    where: { name: category },
                    defaults: { name: category }
                }).then(result => {
                    resolve(result.id)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAllCategories() {
            return new Promise((resolve, reject) => {
                QuestionCategoryModel.findAll({
                    raw: true,
                    attributes: ["name"]
                }).then(categories => {
                    resolve(categories)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
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
                }).catch(errorList => {
                    const errors = []
                    for (error of errorList.errors) {
                        if (error.message == SEQUELIZE_ERROR_UNIQUE_QUESTION) {
                            errors.push(ERROR_MSG_CREATE_UNIQUE_QUESTION) 
                        } else {
                            errors.push(ERROR_MSG_DATABASE_GENERAL)
                        }
                    }
                    reject(errors)
                })
            })
        },

        getQuestionById(id) {
            return new Promise((resolve, reject) => {
                QuestionModel.findOne({
                    raw: true,
                    where: { id: id }
                }).then(question => {
                    resolve(question)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getQuestionsByIds(ids) {
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    raw: true,
                    where: { id: ids }
                }).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getQuestionsByAuthor(author) {
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    raw: true,
                    where: { author: author }
                }).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
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
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAllQuestions() {
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    raw: true
                }).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getQuestionsByAnswerStatus(isAnswered) {           
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    raw: true,
                    where: { isAnswered: isAnswered }
                }).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getCategoriesByAnswerStatus(isAnswered) {
            return new Promise((resolve, reject) => {
                QuestionModel.findAll({
                    raw: true,
                    where: { isAnswered: isAnswered },
                    attributes: ["category"]
                }).then(fetchedCategories => {
                    var categories = fetchedCategories.map(category => {
                        return category.category
                    })
                    resolve([...new Set(categories)])
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
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
                }).catch(errorList => {
                    const errors = []
                    for (error of errorList.errors) {
                        if (err.message == SEQUELIZE_ERROR_UNIQUE_QUESTION) {
                            errors.push(ERROR_MSG_CREATE_UNIQUE_QUESTION) 
                        } else {
                            errors.push(ERROR_MSG_DATABASE_GENERAL)
                        }
                    }
                    reject(errors)
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
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
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
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
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
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAnswerById(id) {
            return new Promise((resolve, reject) => {
                AnswerModel.findOne({
                    raw: true,
                    where: { id: id },
                }).then(answer => {
                    resolve(answer)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAnswersByAuthor(author) {
            return new Promise((resolve, reject) => {
                AnswerModel.findAll({
                    raw: true,
                    where: { author: author },
                }).then(answers => {
                    resolve(answers)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
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
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
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
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
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
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
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
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        updateQuestionAuthor(author, newAuthor) {
            return new Promise((resolve, reject) => {
                QuestionModel.update({ 
                    author: newAuthor 
                }, {
                    where: { author: author }
                }).then(result => {
                    resolve()
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        updateAnswerAuthor(author, newAuthor) {
            return new Promise((resolve, reject) => {
                AnswerModel.update({ 
                    author: newAuthor 
                }, {
                    where: { author: author }
                }).then(result => {
                    resolve()
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        countAnswersByQuestionId(questionId) {
            return new Promise((resolve, reject) => {
                AnswerModel.count({  
                    where: { questionId: questionId }
                }).then(answerCount => {
                    resolve(answerCount)
                }).catch(error => {
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        }
    }
}
