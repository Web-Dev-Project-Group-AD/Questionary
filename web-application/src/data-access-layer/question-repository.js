const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_QUESTION = "Question already exists."

module.exports = ({ database }) => {

    return {

        createQuestionCategory(category) {

            const query = "INSERT IGNORE INTO questionCategories (name) VALUES (?)"
            const values = [category]
            
            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(results => {
                    resolve(results.insertId)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAllCategories() {

            const query = "SELECT name FROM questionCategories"
            const values = []
            
            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(fetchedCategories => {
                    var categories = fetchedCategories.map(row => {
                        return row.name
                    })
                    resolve(categories)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        createQuestion(question) {

            const query = `INSERT INTO questions 
                            (author, category, title, description) 
                            VALUES (?, ?, ?, ?)`
			const values = [
                question.author, 
                question.category, 
                question.title, 
                question.description
            ]

			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(result => {
					resolve(result.insertId)
				}).catch(error => {
                    const errors = []
                    if (error.sqlMessage.includes("Duplicate entry")) {
                        errors.push(ERROR_MSG_CREATE_UNIQUE_QUESTION) 
                    } else {
                        errors.push(ERROR_MSG_DATABASE_GENERAL)
                    }
					reject(errors)
				})
			})
        },
        
        getQuestionById(id) {

            const query = "SELECT * FROM questions WHERE id = ?"
            const values = [id]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(question => {
                    resolve(question)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getQuestionsByIds(ids) {

            const query = "SELECT * FROM questions WHERE id IN (?)"
            const values = [ids.toString()]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getQuestionsByAuthor(author) {

            const query = "SELECT * FROM questions WHERE author = ?"
            const values = [author]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getQuestionsByCategory(category, isAnswered) {

            const query = "SELECT * FROM questions WHERE category = ? AND isAnswered = ?"
            const values = [category, isAnswered]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAllQuestions() {

            const query = "SELECT * FROM questions"
            const values = []

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getQuestionsByAnswerStatus(isAnswered) {

            const query = "SELECT * FROM questions WHERE isAnswered = ?"
            const values = [isAnswered]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getCategoriesByAnswerStatus(isAnswered) {

            const query = "SELECT category FROM questions WHERE isAnswered = ?"
            const values = [isAnswered]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(fetchedCategories => {
                    var categories = fetchedCategories.map(row => {
                        return row.category
                    })
                    resolve(categories)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        updateQuestion(questionUpdate) {

            const query =   `UPDATE questions SET title = ?, description = ? 
                            WHERE author = ? AND id = ?`
            const values = [
                questionUpdate.title,
                questionUpdate.description,
                questionUpdate.author,
                questionUpdate.id
            ]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(result => {
                    resolve(result.insertId)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        questionUpdateAnswerStatus(id, isAnswered) {

            const query = "UPDATE questions SET isAnswered = ? WHERE id = ?"
            const values = [isAnswered, id]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(result => {
                    resolve(result.insertId)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        deleteQuestionById(author, id) {

            const query = "DELETE FROM questions WHERE author = ? AND id = ?"
            const values = [author, id]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(() => {
                    resolve()
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        createAnswer(answer) {
            
            const query = `INSERT INTO answers 
                        (author, questionId, content) VALUES (?, ?, ?)`
            const values = [
                answer.author, 
                answer.questionId,
                answer.content
            ]

			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(results => {
					resolve(results.insertId)
				}).catch(error => {
					reject(error)
				})
			})
        },


        getAnswerById(id) {
            const query = "SELECT * FROM answers WHERE id = ? LIMIT 1"
            const values = [id]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(answers => {
                    resolve(answers[0])
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAnswersByAuthor(author) {
            const query = "SELECT * FROM answers WHERE author = ?"
            const values = [author]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(answers => {
                    resolve(answers)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAnswersByQuestionIds(ids) {
            const query = "SELECT * FROM answers WHERE id IN (?)"
            const values = [ids.toString()]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(answers => {
                    resolve(answers)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAllAnswers() {
            const query = "SELECT * FROM answers"
            const values = []

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(answers => {
                    resolve(answers)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        updateAnswer(answerUpdate) {
            const query = `UPDATE answers SET content = ? 
                            WHERE author = ? AND id = ?`
            const values = [
                answerUpdate.content,
                answerUpdate.author,
                answerUpdate.id
            ]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(result => {
                    resolve(result.insertId)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        deleteAnswerById(author, id) {
            const query = "DELETE FROM answers WHERE author = ? AND id = ?"
            const values = [author, id]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(() => {
                    resolve()
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        updateQuestionAuthor(author, newAuthor) {
            const query = `UPDATE questions SET author = ? 
                            WHERE author = ?`
            const values = [newAuthor, author]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(result => {
                    resolve(result.insertId)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        updateAnswerAuthor(author, newAuthor) {
            const query = `UPDATE answers SET author = ? 
                            WHERE author = ?`
            const values = [newAuthor, author]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(result => {
                    resolve(result.insertId)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        countAnswersByQuestionId(questionId) {
            const query = "SELECT COUNT * FROM answers WHERE questionId = ?"
            const values = [questionId]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(result => {
                    resolve(result.insertId)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        }
    }
}