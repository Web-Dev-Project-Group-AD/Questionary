const express = require('express')

const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_USERNAME = "Username is already taken."
const ERROR_MSG_CREATE_UNIQUE_EMAIL = "Email is already taken."

module.exports = ({ AccountManager, generateToken }) => {

    const router = express.Router()

    router.get("/sign-up", (request, response) => {
        response.render("accounts-sign-up.hbs")
    })

    router.post("/sign-up", (request, response) => {

        //const username = request.body.username
        //const email = request.body.email
        //const password = request.body.password

        const { username, email, password, passwordRepeated } = request.body
        const account = { username, email, password, passwordRepeated }

        AccountManager.createAccount(account
        ).then(createdAccount => {

            const userId = createdAccount.id
            const signedIn = true
            const isAdmin = false
            //const userStatus = { signedIn, isAdmin, username, userId }
            //request.session.userStatus = userStatus
            const token = auth.createToken(userId)
            console.log(token)
            response.setHeader('Location', '/users/' + userId)
            response.status(201).json(token)

            console.log(username, " signed in")
            response.render("home.hbs")
            return

        }).catch(validationErrors => {

            console.log(validationErrors)
            if (validationErrors) {
                response.status(400).json(validationErrors)
                //response.render("error.hbs")
                return
            } else {
                //response.render("accounts-sign-up.hbs", { validationErrors, username, email })
                response.status(500).json(error)
                return
            }
        })

        /*const missingParameters = reqhandler.checkRequestParams({ requiredBody: ['username', 'email', 'password'], request: request })
        if (missingParameters) {
            response.status(400).json(missingParameters)
            return
        }

        db.addUser(account).then(result => {
            const userId = result.insertId
            const token = auth.createToken(userId)
            response.setHeader('Location', '/users/' + userId)
            response.status(201).json(token)
            return
        }).catch(error => {
            response.status(500).json(error)
            return
        })*/
    })


     /* old Code from presentation layer 
  
     const { username, email, password, passwordRepeated } = request.body
     const account = { username, email, password, passwordRepeated }
  
     AccountManager.createAccount(account
     ).then(createdAccount => {
  
         const userId = createdAccount.id
         const signedIn = true
         const isAdmin = false
         const userStatus = { signedIn, isAdmin, username, userId }
         request.session.userStatus = userStatus
  
         console.log(username, " signed in")
         response.render("home.hbs", { userStatus })
     }).catch(validationErrors => {
  
         console.log(validationErrors)
         if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
             response.render("error.hbs")
         } else {
             response.render("accounts-sign-up.hbs", { validationErrors, username, email })
         }
     })
 })
  
  
  
 router.get("/sign-in", SessionRedirector.redirectUser, (request, response) => {
     response.render("accounts-sign-in.hbs")
 })
  
 router.post("/sign-in", SessionRedirector.redirectUser, (request, response) => {
  
     const { email, password } = request.body
     const account = { email, password }
  
     AccountManager.signInAccount(account
     ).then((returnedAccount) => {
  
         const isAdmin = returnedAccount.isAdmin
         const userId = returnedAccount.id
         const userStatus = { isAdmin, username, userId }
         request.session.userStatus = userStatus
  
         console.log(username, " signed in")
         response.render("home.hbs")
     }).catch((errorMessage) => {
  
         console.log(errorMessage)
         if (errorMessage == ERROR_MSG_DATABASE_GENERAL) {
             response.render("error.hbs")
         } else {
             response.render("accounts-sign-in.hbs", { errorMessage, email })
         }
     })
 })
  
 router.get("/sign-out", SessionAuthenticator.authenticateUser, (request, response) => {
  
     const userStatus = request.session.userStatus
  
     response.render("accounts-sign-out.hbs", { userStatus })
 })
  
 router.post("/sign-out", SessionAuthenticator.authenticateUser, (request, response) => {
  
     const userStatus = request.session.userStatus
  
     request.session.destroy(error => {
         if (error) {
             console.log(error)
             return response.render("error.hbs", { userStatus })
         }
         response.clearCookie("signIn")
         return response.render("home.hbs")
     })
  
 })
  
 router.get("/", SessionAuthenticator.authenticateAdmin, (request, response) => {
     
     const userStatus = request.session.userStatus
  
     AccountManager.getAllAccounts(
     ).then(accounts => {
  
         const model = { accounts: accounts }
  
         response.render("accounts-list-all.hbs", { model, userStatus })
     }).catch(error => {
         console.log(error)
         response.render("error.hbs", { userStatus })
     })
 })
  
 router.get("/:username", (request, response) => {
  
     const userStatus = request.session.userStatus
     const username = request.params.username
  
     AccountManager.getAccountByUsername(username
     ).then(account => {
         
         const model = { account: account }
  
         response.render("accounts-show-one.hbs", { model, userStatus })
     }).catch(error => {
         console.log(error)
         response.render("error.hbs", { userStatus })
     })
 })
  
 */

    return router

}