
exports.authorizeUser = function(user) {
    return (user.userType != null) 
}
 
exports.authorizeAdmin = function(user) {
    return (user.userType && user.userType == admin)
}