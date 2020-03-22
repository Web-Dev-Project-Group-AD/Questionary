const express = require('express')
const jwt = require('jsonwebtoken')

const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_USERNAME = "Username is already taken."
const ERROR_MSG_CREATE_UNIQUE_EMAIL = "Email is already taken."



function authorizeRequest(request, response, next) {

    const authorizationHeader = request.get('authorization')
    const accessToken = authorizationHeader.substr("Bearer ".length)

    try {
        jwt.verify(accessToken, serverSecret)
        next()

    } catch (error) {
        if (error.name == "TokenExpiredError") {
            response.status(401).json({
                'status': '401',
                'error': 'invalid_token',
                'message': 'JWT expired'
            })
        } else {
            response.status(401).json({
                'status': '401',
                'error': 'invalid_token',
                'message': 'JWT is malformed or invalid'
            })
        }
        return
    }
}





module.exports = ({ AccountManager, generateToken }) => {

    const router = express.Router()

    const serverSecret = "175342C7638E1D173B45FCC2EC97E"

    router.post("/sign-up", (request, response) => {

        const { username, email, password, passwordRepeated } = request.body
        const account = { username, email, password, passwordRepeated }

        AccountManager.createAccount(account
        ).then(returnedId => {

            // const token = generateToken.createToken(account, isAdmin)
            //console.log("token123: ", token)

            const claims = {
                sub: returnedId,
                email: account.email,
                username: account.username,
                admin: false,
            }
            console.log(username, " signed in123")

            const accessToken = jwt.sign(claims, serverSecret)
            const idToken = jwt.sign(
                {
                    sub: returnedId,
                    email: account.email
                },
                serverSecret
            )

            console.log("id_token: ", idToken)
            console.log("accessToken: ", accessToken)

            response.setHeader("Location", "/sign-up/")
            response.status(200).json({
                access_token: accessToken,
                id_token: idToken,
            })

            return

            // console.log(username, " signed in123")
            // response.setHeader('Location', '/sign-up/' + userId)
            // response.status(201).json().end()
            // response.status(201).json(token).end()
            // return

        }).catch(validationErrors => {

            console.log("validationErrors: ", validationErrors)
            if (validationErrors) {
                response.status(400).json(validationErrors)
                return
            } else {
                response.status(500).json(error).end()
                return
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
        const account = { email, password }
        const grantType = request.body.grant_type


        AccountManager.signInAccount(account
        ).then((returnedAccount) => {

            if (grantType != "password") {
                response.status(400).json({
                    'status': '400',
                    'error': "unsupported_grant_type"
                })
                return
            }

            const claims = {
                sub: returnedAccount.id,
                email: returnedAccount.email,
                username: returnedAccount.username,
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

            console.log("id_token: ", idToken)
            console.log("accessToken: ", accessToken)

            //const authorizationHeader = request.get('authorization')
            //accessToken = authorizationHeader.substr("Bearer ".length)

            //console.log("accessToken_afterauthHeade: ", authorizationHeader)

            response.setHeader('Location', '/sign-in/')
            response.status(200).json({
                access_token: accessToken,
                id_token: idToken,
            })

            return

        }).catch((errorMessage) => {

            console.log("signIn_errorMessages: ", errorMessage)
            if (errorMessage == ERROR_MSG_DATABASE_GENERAL) {
                response.status(400).json(errorMessage)
                return
            } else {
                response.status(500).json(errorMessage)
                return
            }
        })
        return
    })

    router.get("/all", /*SessionAuthorizer.authorizeAdmin,*/(request, response) => {

        //const userStatus = request.session.userStatus

        const authorizationHeader = request.get('authorization')
        const accessToken = authorizationHeader.substr("Bearer ".length)

        console.log("authorizationHeader", authorizationHeader)
        console.log("getAllAccounts_accessToken", accessToken)

        AccountManager.getAllAccounts(
        ).then(accounts => {

            response.setHeader('Location', '/all')
            response.status(200).json({ accounts })


            //response.render("accounts-list-all.hbs", { accounts })
        }).catch(error => {
            console.log(error)
            //response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    return router

}