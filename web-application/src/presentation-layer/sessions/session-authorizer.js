module.exports = () => {

    return {

        authorizeUser: (request, response, next) => {
            if (request.session.userStatus) {
                next()
            } else {
                response.redirect("/accounts/sign-in")
            }
        },

        authorizeAdmin: (request, response, next) => {
            if (request.session.userStatus && request.session.userStatus.isAdmin) {
                next()
            } else {
                const userStatus = request.session.userStatus
                response.status(401).render("statuscode-401.hbs", { userStatus })
            }
        }
    }

}