module.exports = () => {

    return {

        authenticateUser: (request, response, next) => {
            if (request.session.userStatus) {
                next()
            } else {
                response.redirect("/accounts/sign-in")
            }
        },

        authenticateAdmin: (request, response, next) => {
            if (request.session.userStatus && request.session.userStatus.isAdmin) {
                next()
            } else {
                response.redirect("/401")
            }
        }
    }

}