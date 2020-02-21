const express = require('express')


module.exports = function ({ accountManager }) {

    const router = express.Router()

    router.get("/sign-up", function (request, response) {
        response.render("accounts-sign-up.hbs")
    })

    router.post("/sign-up", function (request, response) {

        const { username, password, passwordRepeated } = request.body
        const account = { username, password, passwordRepeated }

        accountManager.createAccount(account
        ).then(createdAccount => {
            // TODO: handle the created account?
            account.password = account.passwordRepeated
            account.passwordRepeated = ""
        }).then(accountManager.signInAccount(account
        )).then(returnedAccount => {
            // TODO: handle the returned account?s
            const signedIn = true
            const isAdmin = false 
            // TODO: check if user is admin
            //const isAdmin = (user.userType == 'admin' ? true : false)
            const userStatus = { signedIn, isAdmin, username }
            request.session.userStatus = userStatus
            console.log(username, " signed in")
            response.render("home.hbs")

        }).catch(errors => {
            // TODO: More complex error handling
            console.log(errors)
            response.render("error.hbs")
        })
    })

    router.get("/sign-in", function (request, response) {

        response.render("accounts-sign-in.hbs")

    })

    router.post("/sign-in", function (request, response) {

        const { username, password } = request.body
        const account = { username, password }

        accountManager.signInAccount(account
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
            response.render("error.hbs")
        })
    })

    router.get("/", function (request, response) {

        //const loggedInAccounts = request.session.account


        accountManager.getAllAccounts(
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

        accountManager.getAccountByUsername(username
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