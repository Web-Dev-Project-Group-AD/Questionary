const express = require('express')
const jwt = require('jsonwebtoken')

const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_USERNAME = "Username is already taken."
const ERROR_MSG_CREATE_UNIQUE_EMAIL = "Email is already taken."

module.exports = ({ AccountManager, generateToken }) => {

    const router = express.Router()

    const serverSecret = "175342C7638E1D173B45FCC2EC97E"

    router.post("/sign-up", (request, response) => {

        const { username, email, password, passwordRepeated } = request.body
        const account = { username, email, password, passwordRepeated }

        AccountManager.createAccount(account
        ).then(createdAccount => {

            const isAdmin = false
            const userId = account
            console.log("restapi_signup_id_mail: ", account, isAdmin)

           // const token = generateToken.createToken(account, isAdmin)
            //console.log("token123: ", token)
            console.log(username, " signed in123")
            response.setHeader('Location', '/sign-up/' + userId)
            response.status(201).json().end()
           // response.status(201).json(token).end()
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

        /*const authorizationHeader = request.get('authorization')
        const accessToken = authorizationHeader.substr("Bearer ".length)

        console.log("authorizationHeader", authorizationHeader)
        console.log("signUp_accessToken", accessToken)*/


        const { email, password } = request.body
        console.log("request.body.email_signIn: ", request.body.email)

        const account = { email, password }
        console.log("sign_in_mail_pw: ", email, password)

        const grantType = request.body.grant_type
        console.log("grantType_signIn: ", grantType)

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

            console.log("id_token: ", idToken)
            console.log("accessToken: ", accessToken)

            //const authorizationHeader = request.get('authorization')
            //accessToken = authorizationHeader.substr("Bearer ".length)

            //console.log("accessToken_afterauthHeade: ", authorizationHeader)

            response.setHeader('Location', '/sign-in/' + userId)
            response.status(200).json({
                access_token: accessToken,
                id_token: idToken,
            })

            console.log(email, " signed in hier is great")
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
    return router

}