document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("questionForm")
    form.addEventListener("submit", validateQuestionForm)

    function validateQuestionForm(event) {

        const QUESTION_TITLE_MIN_LENGTH = 6
        const QUESTION_TITLE_MAX_LENGTH = 60
        const QUESTION_DESCRIPTION_MAX_LENGTH = 255
        const QUESTION_CATEGORY_MIN_LENGTH = 2
        const QUESTION_CATEGORY_MAX_LENGTH = 20
        
        const title = document.getElementById("questionTitle").value
        const description = document.getElementById("questionDescription").value
        const optionCategories = document.getElementById("optionCategories")
        const customCategory = document.getElementById("customCategory").value

        const errorMessages = []
        const errorList = document.getElementById("errorMessages")

        while (errorList.firstChild) {
            errorList.removeChild(errorList.firstChild)
        }			
        
        if (QUESTION_TITLE_MIN_LENGTH > title.length) {
            errorMessages.push("Question needs to be atleast " + QUESTION_TITLE_MIN_LENGTH + " characters long.")
        } else if (title.length > QUESTION_TITLE_MAX_LENGTH) {
            errorMessages.push("Question can not be longer than " + QUESTION_TITLE_MAX_LENGTH + " characters.")
        }
        
        if (description && description.length > QUESTION_DESCRIPTION_MAX_LENGTH) {
            errorMessages.push("Question can not be longer than " + QUESTION_DESCRIPTION_MAX_LENGTH + " characters.")
        }

        if (!optionCategories && !customCategory) {
            errorMessages.push("No category was provided.")
        } else if (customCategory && QUESTION_CATEGORY_MIN_LENGTH > customCategory.length) {
            errorMessages.push("Custom category needs to be atleast " + QUESTION_CATEGORY_MIN_LENGTH + " characters long.")
        } else if (customCategory && customCategory.length > QUESTION_CATEGORY_MAX_LENGTH) {
            errorMessages.push("Custom category can not be longer than " + QUESTION_CATEGORY_MAX_LENGTH + " characters.")
        }

        if (!errorMessages.length > 0) {
            return true
        } else {
            for (error of errorMessages) {
                var newError = document.createElement("LI")
                newError.innerText = error
                errorList.appendChild(newError)
            }
            event.preventDefault()
        }
        
    }

})