
const QUESTION_TITLE_MIN_LENGTH = 6
const QUESTION_TITLE_MAX_LENGTH = 60
const QUESTION_DESCRIPTION_MAX_LENGTH = 255
const QUESTION_CATEGORY_MIN_LENGTH = 2
const QUESTION_CATEGORY_MAX_LENGTH = 20

const ANSWER_CONTENT_MIN_LENGTH = 8
const ANSWER_CONTENT_MAX_LENGTH = 5000


function getErrorsQuestionCategory(category) {

    const errors = []

    if (!category) {
        errors.push("Category is missing.")
    } else if (category.length < QUESTION_CATEGORY_MIN_LENGTH) {
        errors.push("Category name is too short.")
    } else if (QUESTION_CATEGORY_MAX_LENGTH < category.length) {
        errors.push("Category name is too long.")
    }

    return errors
}

function getErrorsQuestionTitle(title) {

    const errors = []

    if (!title) {
        errors.push("Question is missing.")
    } else if (title.length < QUESTION_TITLE_MIN_LENGTH) {
        errors.push("Question is too short.")
    } else if (QUESTION_TITLE_MAX_LENGTH < title.length) {
        errors.push("Question is too long.")
    }

    return errors

}

function getErrorsQuestionDescription(description) {

    const errors = []

    if (description && QUESTION_DESCRIPTION_MAX_LENGTH < description.length) {
        errors.push("Description is too long.")
    }

    return errors
}

module.exports = () => {

    return {

        getErrorsNewQuestion(question) {

            const errors = []

            errors.push.apply(errors, getErrorsQuestionCategory(question.category))
            errors.push.apply(errors, getErrorsQuestionTitle(question.title))
            errors.push.apply(errors, getErrorsQuestionDescription(question.description))

            return errors
        },

        getErrorsUpdateQuestion(question) {

            const errors = []

            errors.push.apply(errors, getErrorsQuestionTitle(question.title))
            errors.push.apply(errors, getErrorsQuestionDescription(question.description))

            return errors
        },

        getErrorsNewAnswer(answer) {

            const errors = []

            if (!answer.hasOwnProperty("content")) {
                errors.push("Answer is missing.")
            } else if (answer.content.length < ANSWER_CONTENT_MIN_LENGTH) {
                errors.push("Answer is too short.")
            } else if (ANSWER_CONTENT_MAX_LENGTH < answer.content.length) {
                errors.push("Answer is too long.")
            }

            return errors
        }

    }

}