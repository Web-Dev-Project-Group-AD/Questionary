
module.exports = ({ sequelize }) => {

    return {

        createQuestion(questionObject) {

           
			return new Promise((resolve, reject) => {


                ).then(results => {
					resolve(results.insertId)
				}).catch(error => {
					reject(error)
				})
			})
        },

        createAnswer(answerObject) {
            
           
			return new Promise((resolve, reject) => {

                ).then(results => {
					resolve(results.insertId)
				}).catch(error => {
					reject(error)
				})
			})
        },

        getQuestionsByAnswerStatus(isAnswered) {

           
            return new Promise((resolve, reject) => {


                ).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getQuestionsByCategory(category, isAnswered) {

            
            return new Promise((resolve, reject) => {


                ).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAnswersByIdType(idType, id) {


            return new Promise((resolve, reject) => {


                ).then(questions => {
                    resolve(questions)
                }).catch(error => {
                    reject(error)
                })
            })
        }

    }

}