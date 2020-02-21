const express = require('express')


module.exports = function ({ accountManager }) {
    // Name all the dependencies in the curly brackets. 
    //TODO it could be more dependecies 

    const router = express.Router()

    router.get("/sign-up", function (request, response) {
        response.render("accounts-sign-up.hbs")
    })


    router.post("/sign-up", function (request, response) {

        const { username, password, passwordRepeated } = request.body
        const account = { username, password, passwordRepeated }

        accountManager.createAccount(account).then(createdAccount => {
            // TODO: handle the created account?
            console.log("FIRST")
            console.log(account)
            account.password = account.passwordRepeated
            account.passwordRepeated = ""

            accountManager.signInAccount(account).then((returnedAccount) => {
                // TODO: handle the returned account?
                console.log("SECOND")

                const signedIn = true
                const isAdmin = false // TODO: check if user is admin
                //const isAdmin = (user.userType == 'admin' ? true : false)
                const userStatus = { signedIn, isAdmin, username }
                request.session.userStatus = userStatus
                console.log(username, " signed in")
                response.render("home.hbs")
            })
        }).catch((errors) => {
            // TODO: More complex error handling
            console.log(errors)
            response.render("error.hbs")
        })
    })

    router.get("/sign-in", function (request, response) {

        response.render("accounts-sign-in.hbs")

    })

    router.post("/sign-in", function (request, response) {

        const account = { username, password }

        accountManager.signInAccount(account, function (error) {
            if (error != null) {
                // TODO: Handle errors
                response.render("error.hbs")
            } else {
                const signedIn = true
                const isAdmin = false
                //const isAdmin = (user.userType == 'admin' ? true : false)
                const userStatus = { signedIn, isAdmin, username }
                request.session.userStatus = userStatus
                console.log(username, " signed in")

                response.render("home.hbs")
            }
        })

    })



    router.get("/", function (request, response) {

        //const loggedInAccounts = request.session.account

        accountManager.getAllAccounts(function (errors, accounts) {
            console.log(errors, accounts)
            const model = {
                errors: errors,
                accounts: accounts
            }
            response.render("accounts-list-all.hbs", model)
        })

    })

    router.get('/:username', function (request, response) {

        const username = request.params.username

        accountManager.getAccountByUsername(username, function (errors, account) {
            const model = {
                errors: errors,
                account: account
            }
            response.render("accounts-show-one.hbs", model)
        })

    })

    return router

}