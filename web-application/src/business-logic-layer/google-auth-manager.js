const { google } = require("googleapis")
const host = "192.168.99.101"
const port = "8080"

const googleConfig = {
	clientId: "839844109281-jeeke7afrr71tgto1d6tkeg9n1lb4f33.apps.googleusercontent.com",
	clientSecret: "dhueYuUllEODwGyXb2aaZk3L",
	redirect: "http://" + host + ".xip.io:" + port + "/accounts/oauth2callback"
}

const defaultScope = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
]

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    )
}

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: defaultScope
    })
}

function getGooglePeopleApi(auth) {
    return google.people({ 
        version: "v1",
        auth 
    })
}
  
module.exports = () => {

    return {

        getGoogleUrl() {
            const auth = createConnection()
            const url = getConnectionUrl(auth)
            return url
        },

        getGoogleAccountByCode(code) {
            return new Promise ((resolve, reject) => {
                const auth = createConnection()
                var tokens = null
                auth.getToken(code
                ).then(data => {
                    tokens = data.tokens
                    auth.setCredentials(tokens)
                    const people = getGooglePeopleApi(auth)
                    return people.people.get({ 
                        resourceName: "people/me",
                        personFields: "emailAddresses,names"
                    })
                }).then(me => {
                    resolve({
                        email: me.data.emailAddresses[0].value,
                        username: me.data.names[0].displayName
                    })
                }).catch(error => {
                    reject(error)
                })

            })
            
        }
    }
}