

const QUESTION_MIN_LENGTH = 6
const QUESTION_MAX_LENGTH = 60
const QUESTION_DESCRIPTION_MAX_LENGTH = 255
const ANSWER_MIN_LENGTH = 8
const ANSWER_MAX_LENGTH = 5000




module.exports = () => {

    return {

        getErrorsNewQuestion(questionObject) {

            const errors = []

            if (!account.hasOwnProperty("question")) {
                errors.push("questionMissing")
            } else if (questionObject.question.length < QUESTION_MIN_LENGTH) {
                errors.push("questionTooShort")
            } else if (QUESTION_MAX_LENGTH < questionObject.username.length) {
                errors.push("questionTooLong")
            }

            if (account.hasOwnProperty("description") &&
                QUESTION_DESCRIPTION_MAX_LENGTH < questionObject.description.length) {
                errors.push("descriptionTooLong")
            }

            return errors
        },

        getErrorsNewAnswer(answerObject) {

            const errors = []

            if (!answerObject.hasOwnProperty("answer")) {
                errors.push("answerMissing")
            } else if (answerObject.answer.length < ANSWER_MIN_LENGTH) {
                errors.push("answerTooShort")
            } else if (ANSWER_MAX_LENGTH < answerObject.answer.length) {
                errors.push("answerTooLong")
            }

            return errors
        }

    }
    
}