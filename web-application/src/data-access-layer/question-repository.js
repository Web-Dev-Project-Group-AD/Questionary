
module.exports = () => {

    return {

        createQuestion(questionObject) {

            const query = `INSERT INTO questions (question, author) VALUES (?, ?)`
			const values = [questionObject.question, questionObject.password]

			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(results => {
					resolve(results.insertId)
				}).catch(error => {
					reject(error)
				})
			})
        },

        createAnswer(answerObject) {
            
            const query = `INSERT INTO answers (username, password) VALUES (?, ?)`
			const values = [answerObject.username, answerObject.password]

			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(results => {
					resolve(results.insertId)
				}).catch(error => {
					reject(error)
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
                    reject(error)
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

        getAnswersByIdType(idType, id) {

            const query = "SELECT * FROM answers WHERE ? = ?"
            const values = [idType, id]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    reject(error)
                })
            })
        }

    }

}