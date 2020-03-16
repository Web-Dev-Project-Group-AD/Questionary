const express = require("express")

const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_USERNAME = "Username is already taken."
const ERROR_MSG_CREATE_UNIQUE_EMAIL = "Email is already taken."

module.exports = ({ 
    AccountManager, 
    GoogleAuthManager, 
    SessionAuthorizer, 
    SessionRedirector,
    csrfProtection
}) => {

    const router = express.Router()

    router.get("/sign-up", csrfProtection, SessionRedirector.redirectUser, (request, response) => {

        response.render("accounts-sign-up.hbs", { csrfToken: request.csrfToken() })
    })

    router.post("/sign-up", csrfProtection, SessionRedirector.redirectUser, (request, response) => {

        const account = { 
            username: request.body.username,
            email: request.body.email, 
            password: request.body.password, 
            passwordRepeated: request.body.passwordRepeated
        }

        AccountManager.createAccount(account
        ).then(accountId => {

            const userStatus = { 
                signedIn: true, 
                isAdmin: false, 
                userId: accountId,
                username: account.username,
                isThirdParty: false
            }
            request.session.userStatus = userStatus

            console.log(account.username, " signed in")
            response.redirect("/")
        }).catch(validationErrors => {

            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                response.render("accounts-sign-up.hbs", 
                { validationErrors, username, email, csrfToken: request.csrfToken() })
            }
        })
    })

    router.get("/sign-in", csrfProtection, SessionRedirector.redirectUser, (request, response) => {

        response.render("accounts-sign-in.hbs", { csrfToken: request.csrfToken() })
    })

    router.get("/sign-in/google", SessionRedirector.redirectUser, (request, response) => {

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
                userId: userId,
                isThirdParty: true
            }
            request.session.userStatus = userStatus
            console.log(userStatus.username, " signed in")
            response.redirect("/questions/answered")
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.post("/sign-in", 
    csrfProtection, SessionRedirector.redirectUser, (request, response) => {

        const account = { 
            email: request.body.email,
            password: request.body.password
        }
        AccountManager.signInAccount(account
        ).then(returnedAccount => {

            const userStatus = { 
                isAdmin: returnedAccount.isAdmin, 
                username: returnedAccount.username, 
                userId: returnedAccount.id,
                isThirdParty: false
            }
            request.session.userStatus = userStatus
            console.log(userStatus.username, " signed in")
            response.redirect("/questions/answered")
        }).catch((errorMessage) => {
            console.log(errorMessage)
            if (errorMessage == ERROR_MSG_DATABASE_GENERAL) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                response.render("accounts-sign-in.hbs", 
                { errorMessage, email, csrfToken: request.csrfToken() })
            }
        })
    })

    router.get("/sign-out", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus

        response.render("accounts-sign-out.hbs", 
        { userStatus, csrfToken: request.csrfToken() })
    })

    router.post("/sign-out", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

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
            response.render("accounts-list-all.hbs", { accounts, userStatus })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-name/:accountName", (request, response) => {

        const userStatus = request.session.userStatus
        const accountName = request.params.accountName

        AccountManager.getAccountByUsername(accountName
        ).then(account => {
            response.render("accounts-show-one.hbs", { account, userStatus })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/edit", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus

        response.render("accounts-edit.hbs", 
        { userStatus, csrfToken: request.csrfToken() })
    })

    router.post("/edit-password", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {
        
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
                response.render("accounts-edit.hbs", 
                { validationErrors, userStatus, csrfToken: request.csrfToken() })
            }
        })
    })

    router.get("/delete", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {
        const userStatus = request.session.userStatus

        response.render("accounts-delete.hbs", { userStatus, csrfToken: request.csrfToken() })
    })

    router.post("/delete", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus

        AccountManager.deleteAccountById(userStatus.userId
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