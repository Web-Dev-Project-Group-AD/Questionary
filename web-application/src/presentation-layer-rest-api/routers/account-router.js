const express = require('express')

const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_USERNAME = "Username is already taken."
const ERROR_MSG_CREATE_UNIQUE_EMAIL = "Email is already taken."

module.exports = ({ AccountManager, generateToken }) => {

    const router = express.Router()
    //const generateToken = generateToken

    router.get("/sign-up", (request, response, next) => {
        //response.render("contact.hbs")
        // response.status(200).json({ error: "No Profile Found" })
        const example = request.body.example
        if (!example) {
            console.log("response: ", "No Example given")

            response.status(400).json("No Example given")
        } else {
            response.status(200).json("Example is here")
        }
        //response.status(200).json("accounts-sign-up.hbs")
        //next()
        //response.render("accounts-sign-up.hbs")
        //'d2220207-05e8-472a-9138-e9dcb2963f06'
    })

    router.post("/sign-up", (request, response) => {

        //const authorizationHeader = request.get('authorization')
        //const accessToken = authorizationHeader.substr("Bearer ".length)


        const { username, email, password, passwordRepeated } = request.body
        const account = { username, email, password, passwordRepeated }

        AccountManager.createAccount(account
        ).then(createdAccount => {

            const userId = createdAccount.id
            console.log(createdAccount)
            const isAdmin = false
            //const userStatus = { signedIn, isAdmin, username, userId }
            //request.session.userStatus = userStatus
            const token = generateToken.createToken(createdAccount, isAdmin)
            console.log("token123: ", token)
            response.setHeader('Location', '/sign-up/' + userId)
            response.status(201).json(token)

            console.log(username, " signed in123")
            //response.render("home.hbs")
            return

        }).catch(validationErrors => {

            console.log("validationErrors: ", validationErrors)
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


    const correctUsername = "kunzsusanne@gmx.com"
    const correctPassword = "password"
    const serverSecret = "175342C7638E1D173B45FCC2EC97E"


    // Implemented per OAuth 2.0 (Resource Owner Password Credentials Grant):
    // OpenID Connect also implemented (ID token).
    // POST /accounts/log-in
    // Content-Type: application/x-www-form-urlencoded
    // Body: grant_type=password&username=?&password=?
    router.post('/sign-in', function (request, response) {

        const { email, password } = request.body
        const account = { email, password }
        console.log("account_sign_in_mail_pw: ", email, password)

        const grantType = request.body.grant_type
        console.log("grantType_signIn: ", grantType)

        /*const accessToken = jwt.sign(payload, serverSecret)

        const idToken = jwt.sign({
            'sub': account.id,
            'preferred_username': account.username
        }, 'aasdfsghfgkhhkj')*/

        AccountManager.signInAccount(account
        ).then((returnedAccount) => {

            const isAdmin = false
            const userId = returnedAccount.id

            console.log(returnedAccount.username, returnedAccount.email, " signed in_returnedAccount")

            /*if (grantType != 'password') {
                response.status(400).json({
                    'status': '400',
                    'error': 'unsupported_grant_type',
                })
            }*/

            if (grantType != "hallo123456") {
                //if (grantType != 'password') {
                response.status(400).json({
                    'status': '400',
                    'error': "unsupported_grant_type"
                })
                return
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

            /*response.setHeader('Location', '/accounts/' + userId)
            //response.status(201).json(accessToken)

            console.log(username, " signed in")

            response.status(200).json({
                'access_token': accessToken,
                'id_token': idToken
            })
*/

            if (username == correctUsername && password == correctPassword) {
                console.log("if email and password right here.")

                // TODO: Put user authorization info in the access token.
                const payload = { id: returnedAccount.id }
                // TODO: Better to use jwt.sign asynchronously.
                const accessToken = jwt.sign(payload, serverSecret)

                // TODO: Put user info in the id token.
                // Try to use the standard claims:
                // https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
                const idToken = jwt.sign(
                    { sub: returnedAccount.id, username: returnedAccount.email },
                    "lkjlkjlkjljlk"
                )

                //const idToken = generateToken.createToken(returnedAccount, isAdmin)
                console.log("id_token: ", idToken)
                console.log("access_token: ", access_token)

                localStorage.accessToken = access_token

                response.setHeader('Location', '/sign-up/' + userId)

                response.status(200).json({
                    access_token: accessToken,
                    id_token: idToken
                })

                return

            } else {
                response.status(400).json({ error: "invalid_grant" })
                return
            }


        }).catch((errorMessage) => {

            console.log(errorMessage)
            if (errorMessage == ERROR_MSG_DATABASE_GENERAL) {

                //console.log("errormessage_login", errorMessage)
                response.status(400).json({ error: errorMessage })
                return
                // response.render("error.hbs")
            } else {
                //console.log("errormessage_login and username:", errorMessage, username)
                response.status(400).json({ error: "errormessage_login" + errorMessage, email })
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