const csurf = require("csurf")

module.exports = ({ }) => {

    const csrfProtection = csurf({ cookie: true })

    //csrf({ cookie: true, ignoreMethods: ['POST'] })

    return csrfProtection
} 
