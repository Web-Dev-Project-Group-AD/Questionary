module.exports = () => {

    return {

        redirectUser: (request, response, next) => {
            if (request.session.userStatus) {
                response.redirect("/")
            } else {
                next()
            }
        },

        redirectAdmin: (request, response, next) => {
            if (request.session.userStatus && request.session.userStatus.isAdmin) {
                response.redirect("/")
            } else {
                next()
            }
        }
    }

}