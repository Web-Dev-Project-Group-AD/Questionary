
const csurf = require("csurf")

const csrfProtection = csurf({ cookie: false })

module.exports = csrfProtection
