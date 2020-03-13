document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form")
    form.addEventListener("submit", validateRegisterForm)

    function validateRegisterForm(event) {

        const ANSWER_CONTENT_MIN_LENGTH = 8
        const ANSWER_CONTENT_MAX_LENGTH = 5000

        const content = document.getElementById("answerContent").value
        const errorMessages = []
        const errorList = document.getElementById("errorMessages")

        while (errorList.firstChild) {
            errorList.removeChild(errorList.firstChild)
        }

        if (ANSWER_CONTENT_MIN_LENGTH > content.length) {
            errorMessages.push("Answer needs to be atleast " + ANSWER_CONTENT_MIN_LENGTH + " characters long.")
        } else if (content.length > ANSWER_CONTENT_MAX_LENGTH) {
            errorMessages.push("Answertion can not be longer than " + ANSWER_CONTENT_MAX_LENGTH + " characters.")
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