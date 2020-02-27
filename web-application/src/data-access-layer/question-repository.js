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

        }

        createAnswer(answerObject) {
            
        }

    }
}