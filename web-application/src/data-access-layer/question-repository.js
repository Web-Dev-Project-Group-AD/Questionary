module.exports = () => {

    return {

        getQuestionsByAnsweredStatus(isAnswered) {

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
            const values = [category]

            return new Promise((resolve, reject) => {
                database.query(query, values
                ).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAnswersById(idType, id) {

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
        },

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
            
            const query = `INSERT INTO accounts (username, password) VALUES (?, ?)`
			const values = [account.username, account.password]

			return new Promise((resolve, reject) => {
				database.query(query, values
				).then(results => {
					resolve(results.insertId)
				}).catch(error => {
					reject(error)
				})
			})

        }

    }
}