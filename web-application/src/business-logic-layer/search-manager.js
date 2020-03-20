const Fuse = require("fuse.js")

const ERROR_MSG_DATABASE_GENERAL = "Database error."

module.exports = ({ QuestionManager, searchOptions }) => {

    return {

        searchQuestions(searchQuery) {
            var questions = []

            return new Promise((resolve, reject) => {
                QuestionManager.getAllQuestionsWithAnswers(
                ).then(answeredQuestions => {
                    questions = answeredQuestions
                    return QuestionManager.getAllUnansweredQuestions()
                }).then(unansweredQuestions => {
                    questions.push.apply(questions, unansweredQuestions)
                    const fuse = new Fuse(questions, searchOptions)
                    const searchResults = fuse.search(searchQuery)
                    resolve(searchResults)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        }
    }
}