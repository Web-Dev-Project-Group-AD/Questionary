document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("accountForm")
    form.addEventListener("submit", validateRegisterForm) 
    
    function validateRegisterForm(event) {
        
        const MIN_USERNAME_LENGTH = 4
        const MAX_USERNAME_LENGTH = 20
        const MIN_PASSWORD_LENGTH = 8
        const MAX_PASSWORD_LENGTH = 20

        var username = document.getElementById("username")
        var email = document.getElementById("email")

        const password1 = document.getElementById("password1").value
        const password2 = document.getElementById("password2").value

        const errorMessages = []

        const errorList = document.getElementById("errorMessages")
        while (errorList.firstChild) {
            errorList.removeChild(errorList.firstChild)
        }
        if (username && email) {
            if (MIN_USERNAME_LENGTH > username.value.length) {
                errorMessages.push("Username needs to be atleast " + MIN_USERNAME_LENGTH + " characters long.")
            } else if (username.value.length > MAX_USERNAME_LENGTH) {
                errorMessages.push("Username can not be longer than " + MAX_USERNAME_LENGTH + " characters.")
            }
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value))) {
                errorMessages.push("Invalid email address.")
            }
        }
        if (MIN_PASSWORD_LENGTH > password1.length) {
            errorMessages.push("Password needs to be atleast " + MIN_PASSWORD_LENGTH + " characters long.")
        } else if (password1.length > MAX_PASSWORD_LENGTH) {
            errorMessages.push("Password can not be longer than " + MAX_PASSWORD_LENGTH + " characters.")
        }
        if (password1 != password2) {
            errorMessages.push("Passwords dont match.")
        }
        console.log(errorMessages)
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