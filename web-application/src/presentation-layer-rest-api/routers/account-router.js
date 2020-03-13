const express = require('express')
const jwt = require('jsonwebtoken')

const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_USERNAME = "Username is already taken."
const ERROR_MSG_CREATE_UNIQUE_EMAIL = "Email is already taken."

module.exports = ({ AccountManager, generateToken }) => {

    const router = express.Router()
    //const generateToken = generateToken

    //const correctEmail = "susannekunz@gmail.com"
    //const correctPassword = "password"
    const serverSecret = "175342C7638E1D173B45FCC2EC97E"

    /*router.get("/sign-up", (request, response) => {

        const { username, email, password, passwordRepeated } = request.body
        const account = { username, email, password, passwordRepeated }

        console.log("get_signUp_account", account)

        //response.render("contact.hbs")
        // response.status(200).json({ error: "No Profile Found" })
        // const example = request.body.example
        if (!account) {
            console.log("response: ", "No account given")

            response.status(400).json(account)
            return
        } else {
            response.status(200).json(account)
            return
        }
        //response.status(200).json("accounts-sign-up.hbs")
        //next()
        //response.render("accounts-sign-up.hbs")
        //'d2220207-05e8-472a-9138-e9dcb2963f06'
    })*/

    router.post("/sign-up", (request, response) => {

        try {

            //const authorizationHeader = request.get('authorization')
            //const accessToken = authorizationHeader.substr("Bearer ".length)

            // TODO: Better to use jwt.verify asynchronously.
            //const payload = jwt.verify(accessToken, serverSecret)

            // Use payload to implement authorization...

        } catch (e) {
            response.status(401).end()
            return
        }

        const { username, email, password, passwordRepeated } = request.body
        const account = { username, email, password, passwordRepeated }

        AccountManager.createAccount(account
        ).then(createdAccount => {

            const isAdmin = false
            const userId = account
            console.log("restapi_signup_id_mail: ", account, isAdmin)

            const token = generateToken.createToken(account, isAdmin)
            console.log("token123: ", token)
            console.log(username, " signed in123")
            response.setHeader('Location', '/sign-up/' + userId)
            response.status(201).json(token).end()
            // return

        }).catch(validationErrors => {

            console.log("validationErrors: ", validationErrors)
            if (validationErrors) {
                response.status(400).json(validationErrors)
                return
            } else {
                response.status(500).json(error).end()
                //return
            }
        })

    })




    // Implemented per OAuth 2.0 (Resource Owner Password Credentials Grant):
    // OpenID Connect also implemented (ID token).
    // POST /accounts/sign-in
    // Content-Type: application/x-www-form-urlencoded
    // Body: grant_type=password&email=?&password=?
    router.post('/sign-in', function (request, response) {

        const { email, password } = request.body
        console.log("request.body.email_signIn: ", request.body.email)

        const account = { email, password }
        console.log("sign_in_mail_pw: ", email, password)

        const grantType = request.body.grant_type
        console.log("grantType_signIn: ", grantType)

        /*const accessToken = jwt.sign(payload, serverSecret)
    
        const idToken = jwt.sign({
            'sub': account.id,
            'preferred_username': account.username
        }, 'aasdfsghfgkhhkj')*/

        AccountManager.signInAccount(account
        ).then((returnedAccount) => {

            console.log("restapi_signup_id_mail: ", returnedAccount.id, returnedAccount.isAdmin)

            const isAdmin = returnedAccount.isAdmin
            const userId = returnedAccount.id
            const username = returnedAccount.username

            console.log("signed in_account_isAdmin: ", isAdmin)
            console.log("signed in_account_username: ", username)
            console.log("signed in_returnedAccount_account_email: ", returnedAccount.email)

            if (grantType != "password") {
                response.status(400).json({
                    'status': '400',
                    'error': "unsupported_grant_type"
                })
                return
            }

            /*if (0 < errors.length) {
                if (errors.includes('databaseError')) {
                    response.status(500).json({
                        'status': '500',
                        'message': errors
                    })
                } else {
                    response.status(400).json({
                        'status': '400',
                        'error': 'invalid_client',
                        'message': errors
                    })
                }
            }*/

            console.log("before payload")
            // TODO: Put user authorization info in the access token.
            const payload = { sub: returnedAccount.id }
            // TODO: Better to use jwt.sign asynchronously.

            const claims = {
                sub: returnedAccount.id,
                email: returnedAccount.email,
                admin: returnedAccount.isAdmin,
            }

            const accessToken = jwt.sign(claims, serverSecret)

            // TODO: Put user info in the id token.
            // Try to use the standard claims:
            // https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
            const idToken = jwt.sign(
                {
                    sub: returnedAccount.id,
                    email: returnedAccount.email
                },
                serverSecret
            )

            //const idToken = generateToken.createToken(returnedAccount, isAdmin)
            console.log("id_token: ", idToken)
            console.log("accessToken: ", accessToken)

            console.log(localStorage.accessToken)

            localStorage.accessToken = accessToken

            response.setHeader('Location', '/sign-in/' + userId)

            response.status(200).json({
                access_token: accessToken,
                id_token: idToken,
                //expires_in: 3600,
            })

            console.log(mail, " signed in hier is great")

            return

            // }
            /*else {
                 response.status(400).json({ error: "invalid_grant" })
                 return
             }*/




        }).catch((errorMessage) => {

            console.log("signIn_errorMessages: ", errorMessage)
            if (errorMessage == ERROR_MSG_DATABASE_GENERAL) {

                //console.log("errormessage_login", errorMessage)
                response.status(400).json(errorMessage)
                //response.status(400).json({ error: errorMessage })
                return
                // response.render("error.hbs")
            } else {
                //console.log("errormessage_login and username:", errorMessage, username)
                response.status(500).json(error)

                // response.status(500).json({ error: "errormessage_login" + errorMessage, email })
                return
                // response.render("accounts-sign-in.hbs", { errorMessage, email })
            }
        })


        /*accountManager.loginAccount(account, function (errors, account) {
     
            if (grantType != 'password') {
                response.status(400).json({
                    'status': '400',
                    'error': 'unsupported_grant_type',
                })
            }
            if (0 < errors.length) {
                if (errors.includes('databaseError')) {
                    response.status(500).json({
                        'status': '500',
                        'message': errors
                    })
                } else {
                    response.status(400).json({
                        'status': '400',
                        'error': 'invalid_client',
                        'message': errors
                    })
                }
            }
            else {
     
                const userId = account.id
                console.log(createdAccount)
     
                const isAdmin = false
                const token = generateToken.createToken(createdAccount, isAdmin)
                console.log("token: ", token)
     
                response.setHeader('Location', '/sign-up/' + userId)
                response.status(201).json(token)
     
                console.log(username, " signed in")
     
                const payload = { id: account.id }s
                const accessToken = jwt.sign(payload, serverSecret)
     
                const idToken = jwt.sign({
                    'sub': account.id,
                    'preferred_username': account.mail
                }, 'aasdfsghfgkhhkj')
     
                response.status(200).json({
                    'access_token': accessToken,
                    'id_token': idToken
                })
     
            }*/

        return
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