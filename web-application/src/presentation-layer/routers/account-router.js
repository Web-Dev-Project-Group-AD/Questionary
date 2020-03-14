const express = require("express")

const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_USERNAME = "Username is already taken."
const ERROR_MSG_CREATE_UNIQUE_EMAIL = "Email is already taken."

module.exports = ({ AccountManager, GoogleAuthManager, SessionAuthorizer, SessionRedirector }) => {

    const router = express.Router()

    router.get("/sign-up", SessionRedirector.redirectUser, (request, response) => {
        response.render("accounts-sign-up.hbs")
    })

    router.post("/sign-up", SessionRedirector.redirectUser, (request, response) => {

        const { username, email, password, passwordRepeated } = request.body
        const account = { username, email, password, passwordRepeated }

        AccountManager.createAccount(account
        ).then(accountId => {

            const userId = accountId
            const signedIn = true
            const isAdmin = false
            const userStatus = { signedIn, isAdmin, username, userId }
            request.session.userStatus = userStatus

            console.log(username, " signed in")
            response.redirect("/")
        }).catch(validationErrors => {

            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                response.render("accounts-sign-up.hbs", { validationErrors, username, email })
            }
        })
    })

    router.get("/sign-in", SessionRedirector.redirectUser, (request, response) => {
        response.render("accounts-sign-in.hbs")
    })

    router.get("/sign-in/google", (request, response) => {
        response.redirect(GoogleAuthManager.getGoogleUrl())
    })

    router.get("/oauth2callback", (request, response, next) => {
        const code = request.query.code
        var account = {}

        GoogleAuthManager.getGoogleAccountByCode(code
        ).then(googleAccount => {
            account = googleAccount
            return AccountManager.getAccountByEmail(account.email)
        }).then(returnedAccount => {
            if (returnedAccount) {
                return returnedAccount.id
            } else {
                return AccountManager.createThirdPartyAccount(account)
            }
         }).then(userId => {

            const userStatus = { 
                isAdmin: false, 
                username: account.username, 
                userId 
            }

            request.session.userStatus = userStatus
            console.log(userStatus.username, " signed in")
            response.redirect("/")
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.post("/sign-in", SessionRedirector.redirectUser, (request, response) => {

        const { email, password } = request.body
        const account = { email, password }

        AccountManager.signInAccount(account
        ).then(returnedAccount => {

            const isAdmin = returnedAccount.isAdmin
            const userId = returnedAccount.id
            const username = returnedAccount.username
            const userStatus = { isAdmin, username, userId }
            request.session.userStatus = userStatus

            console.log(username, " signed in")
            response.redirect("/")
        }).catch((errorMessage) => {
            console.log(errorMessage)
            if (errorMessage == ERROR_MSG_DATABASE_GENERAL) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                response.render("accounts-sign-in.hbs", { errorMessage, email })
            }
        })
    })

    router.get("/sign-out", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus

        response.render("accounts-sign-out.hbs", { userStatus })
    })

    router.post("/sign-out", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus

        request.session.destroy(error => {
            if (error) {
                console.log(error)
                return response.status(500).render("statuscode-500.hbs", { userStatus })
            }
            response.clearCookie("signIn")
            response.redirect("/accounts/sign-in")
        })
    })

    router.get("/all", /*SessionAuthorizer.authorizeAdmin,*/ (request, response) => {
        
        const userStatus = request.session.userStatus

        AccountManager.getAllAccounts(
        ).then(accounts => {

            console.log(accounts)
           
            response.render("accounts-list-all.hbs", { accounts, userStatus })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-name/:username", (request, response) => {

        const userStatus = request.session.userStatus
        const username = request.params.username

        AccountManager.getAccountByUsername(username
        ).then(account => {
            response.render("accounts-show-one.hbs", { account, userStatus })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/edit", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus

        response.render("accounts-edit.hbs", { userStatus })
    })

    router.post("/edit-password", SessionAuthorizer.authorizeUser, (request, response) => {
        
        const userStatus = request.session.userStatus
        const username = userStatus.username
        const account = {
            id: userStatus.userId,
            username: username,
            oldPassword: request.body.oldPassword,
            password: request.body.password,
            passwordRepeated: request.body.passwordRepeated
        }
        AccountManager.updatePassword(account
        ).then(accountId => {
            console.log("Password updated successfully.")
            return response.redirect("/accounts/by-name/" + username)
        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                response.render("accounts-edit.hbs", { validationErrors, userStatus })
            }
        })
    })

    router.get("/delete", SessionAuthorizer.authorizeUser, (request, response) => {
        const userStatus = request.session.userStatus

        response.render("accounts-delete.hbs", { userStatus })
    })

    router.post("/delete", SessionAuthorizer.authorizeUser, (request, response) => {
        const id = request.session.userStatus.userId


        AccountManager.deleteAccountById(id
        ).then(() => {
            return request.session.destroy()
        }).then(() => {
            response.clearCookie("signIn").redirect("/accounts/sign-in")
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    return router

}