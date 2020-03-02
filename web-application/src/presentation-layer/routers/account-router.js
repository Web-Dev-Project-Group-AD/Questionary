const express = require('express')


module.exports = function ({ AccountManager }) {

    const router = express.Router()

    router.get("/sign-up", function (request, response) {
        response.render("accounts-sign-up.hbs")
    })

    router.post("/sign-up", function (request, response) {

        const { username, email, password, passwordRepeated } = request.body
        console.log("username: ", username)
        console.log("email: ", email)

        
        const account = { username, email, password, passwordRepeated }

        AccountManager.createAccount(account
        ).then(createdAccount => {
            // TODO: handle the created account?
            const userId = createdAccount.id
            const signedIn = true
            const isAdmin = false 
            // TODO: check if user is admin
            //const isAdmin = (user.userType == 'admin' ? true : false)
            const userStatus = { signedIn, isAdmin, username, userId }
            request.session.userStatus = userStatus
            console.log(username, " signed in")
            response.render("home.hbs")

        }).catch(validationErrors => {
            // TODO: More complex error handling
            console.log(validationErrors)
            

            account.password = ""
            account.passwordRepeated = ""
            response.render("accounts-sign-up.hbs", {validationErrors, username, email} )

        }).catch(error => {
            response.render("error.hbs")
        })
    })

    router.get("/sign-in", function (request, response) {

        response.render("accounts-sign-in.hbs")

    })

    router.post("/sign-in", function (request, response) {

        const { email, password } = request.body
        const account = { email, password }

        AccountManager.signInAccount(account
        ).then((returnedAccount) => {
            const signedIn = true
            const isAdmin = false // TODO: check if user is admin
            //const isAdmin = (user.userType == 'admin' ? true : false)
            const userStatus = { signedIn, isAdmin, username }
            request.session.userStatus = userStatus
            console.log(username, " signed in")
            response.render("home.hbs")
        }).catch((errors) => {
            // TODO: More complex error handling
            console.log(errors)
            const errorMessage = "Wrong Email or Password."
            response.render("accounts-sign-in.hbs", { errorMessage, email })
        })
    })

    router.get("/", function (request, response) {

        //const loggedInAccounts = request.session.account

        AccountManager.getAllAccounts(
        ).then(accounts => {
            const model = { accounts: accounts }
            response.render("accounts-list-all.hbs", model)
        }).catch(error => {
            console.log(error)
            response.render("error.hbs")
        })
    })

    router.get('/:username', function (request, response) {

        const username = request.params.username

        AccountManager.getAccountByUsername(username
            ).then(account => {
                const model = { account: account }
                response.render("accounts-show-one.hbs", model)
            }).catch(error => {
                console.log(error)
                response.render("error.hbs")
            })
    })

    return router

}