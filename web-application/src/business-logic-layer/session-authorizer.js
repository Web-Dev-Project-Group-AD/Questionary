
exports.authorizeUser = function(userType) {
    return (userType != null) 
}

exports.authorizeAdmin = function(session) {
    return (userType && userType == admin)
}