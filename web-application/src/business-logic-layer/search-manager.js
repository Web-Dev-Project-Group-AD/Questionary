const Fuse = require("fuse.js")

const ERROR_MSG_DATABASE_GENERAL = "Database error."

module.exports = ({ QuestionRepository, searchOptions }) => {

    return {

        searchQuestions(searchQuery) {
            return new Promise((resolve, reject) => {
                QuestionRepository.getAllQuestions(
                ).then(questions => {
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